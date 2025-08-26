import os
import subprocess
import time
from datetime import datetime
import pandas as pd
import joblib

# ======== Configuration ========
interface = "wlan1"
capture_dir = "./captures"
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
merged_pcap = os.path.join(capture_dir, f"merged_capture_{timestamp}.pcap")  # Add timestamp here
tshark_csv = os.path.join(capture_dir, f"tshark_parsed_capture_{timestamp}.csv")  # Add timestamp here
preprocessed_csv = os.path.join(capture_dir, f"preprocessed_features_{timestamp}.csv")  # Add timestamp here for preprocessed features
all_predictions_csv = os.path.join(capture_dir, f"all_predictions_{timestamp}.csv")  # Save all MAC address predictions
malicious_frames_csv = os.path.join(capture_dir, f"malicious_frames_{timestamp}.csv")  # Save malicious frames
model_path = "./airsecure_classifier.joblib"  # <-- replace with your actual model path
capture_duration = 180

channels = [149]
fields = [
    # Frame control & addressing
    'wlan.fc.type', 'wlan.fc.subtype', 'wlan.fc.ds',
    'wlan.fc.frag', 'wlan.fc.retry', 'wlan.fc.pwrmgt',
    'wlan.fc.moredata', 'wlan.fc.protected',
    'wlan.sa', 'wlan.ssid', 'wlan.bssid',

    # Security and Capability
    'wlan.rsn.capabilities', 'wlan.rsn.capabilities.mfpr',
    'wlan.rsn.capabilities.mfpc', 'wlan.rsn.capabilities.peerkey',
    'wlan.wapi.capab', 'wlan.wapi.capab.preauth',
    'wlan.osen.rsn.capabilities.mfpc', 'wlan.osen.rsn.capabilities.mfpr',

    # MAC/PHY Capabilities
    'wlan.ht.capabilities', 'wlan.vht.capabilities',
    'wlan.ext_tag.he_mac_cap.twt_req_support',
    'wlan.ext_tag.he_mac_cap.twt_rsp_support',
    'wlan.ext_tag.he_phy_cap.ldpc_coding_in_payload',
    'wlan.ext_tag.he_phy_cap.stbc_rx_lt_80mhz',
    'wlan.ext_tag.he_phy_cap.stbc_tx_lt_80mhz'
]
# =================================

os.makedirs(capture_dir, exist_ok=True)

def run_cmd(cmd):
    subprocess.run(cmd, check=True)

def enable_monitor_mode(interface):
    print(f"[>] Enabling monitor mode on {interface}...")
    run_cmd(["ip", "link", "set", interface, "down"])
    run_cmd(["iw", "dev", interface, "set", "type", "monitor"])  # Set interface to monitor mode
    run_cmd(["ip", "link", "set", interface, "up"])
    print(f"[✓] {interface} is now in monitor mode.")

def set_channel(channel):
    print(f"[>] Switching to channel {channel}")
    run_cmd(["iw", "dev", interface, "set", "channel", str(channel)])

def capture_on_channel(channel):
    pcap_file = os.path.join(capture_dir, f"ch{channel}_{timestamp}.pcap")
    print(f"[>] Capturing for {capture_duration}s on channel {channel}")
    run_cmd(["tcpdump", "-i", interface, "-w", pcap_file, "-G", str(capture_duration), "-W", "1"])
    return pcap_file

def combine_pcaps(pcap_files):
    print("[*] Combining PCAPs...")
    run_cmd(["mergecap", "-w", merged_pcap] + pcap_files)
    print(f"[✓] Merged capture saved to {merged_pcap}")

def extract_features_with_tshark(pcap_file, tshark_csv):
    print("[*] Extracting features with tshark...")
    cmd = [
        "tshark", "-r", pcap_file, "-T", "fields", "-E", "header=y",
        "-E", "separator=,", "-E", "quote=d"
    ]
    for field in fields:
        cmd += ["-e", field]
    with open(tshark_csv, "w") as f:
        subprocess.run(cmd, stdout=f, check=True)
    print(f"[✓] Extracted CSV saved to {tshark_csv}")

def preprocess_csv(csv_file, model=None):
    print("[*] Preprocessing features...")

    # Read CSV and fill missing values with "0"
    df = pd.read_csv(csv_file)
    df.fillna("0", inplace=True)

    # Preserve MACs and SSIDs
    macs = df['wlan.sa'] if 'wlan.sa' in df.columns else None
    ssids = df['wlan.ssid'] if 'wlan.ssid' in df.columns else None
    bssids = df['wlan.bssid'] if 'wlan.bssid' in df.columns else None

    # Convert SSID from hex to ASCII string if it exists
    if ssids is not None:
        def convert_hex_to_ascii(x):
            try:
                bytes.fromhex(x)
                return bytes.fromhex(x).decode('utf-8', errors='ignore')
            except ValueError:
                return x
        
        ssids = ssids.apply(convert_hex_to_ascii)

    categorical_fields = [
        # Frame control & addressing
        'wlan.fc.type', 'wlan.fc.subtype', 'wlan.fc.ds',
        'wlan.fc.frag', 'wlan.fc.retry', 'wlan.fc.pwrmgt',
        'wlan.fc.moredata', 'wlan.fc.protected',
        
        # Security and Capability
        'wlan.rsn.capabilities', 'wlan.rsn.capabilities.mfpr',
        'wlan.rsn.capabilities.mfpc', 'wlan.rsn.capabilities.peerkey',
        'wlan.wapi.capab', 'wlan.wapi.capab.preauth',
        'wlan.osen.rsn.capabilities.mfpc', 'wlan.osen.rsn.capabilities.mfpr',

        # MAC/PHY Capabilities
        'wlan.ht.capabilities', 'wlan.vht.capabilities',
        'wlan.ext_tag.he_mac_cap.twt_req_support',
        'wlan.ext_tag.he_mac_cap.twt_rsp_support',
        'wlan.ext_tag.he_phy_cap.ldpc_coding_in_payload',
        'wlan.ext_tag.he_phy_cap.stbc_rx_lt_80mhz',
        'wlan.ext_tag.he_phy_cap.stbc_tx_lt_80mhz'
    ]
    
    # Perform one-hot encoding for the categorical fields
    df_preprocessed = pd.get_dummies(df, columns=categorical_fields, prefix_sep='_')

    # Convert only boolean or numeric columns to integers (1 and 0)
    for col in df_preprocessed.select_dtypes(include=[bool, 'number']).columns:
        df_preprocessed[col] = df_preprocessed[col].astype(int)

    # Ensure all columns in the model are present
    if model:
        model_columns = model.feature_names_in_  # Get the column names from the model

        # Check for missing columns in the preprocessed data
        missing_columns = set(model_columns) - set(df_preprocessed.columns)

        # Add missing columns with default value 0
        for col in missing_columns:
            df_preprocessed[col] = 0

        # Reorder columns to match the order used in training
        df_preprocessed = df_preprocessed[model_columns]

    # Add MAC and SSID back
    if macs is not None:
        df_preprocessed["wlan.sa"] = macs
    if ssids is not None:
        df_preprocessed["wlan.ssid"] = ssids
    if bssids is not None:
        df_preprocessed["wlan.bssid"] = bssids

    # Save the preprocessed CSV
    df_preprocessed.to_csv(preprocessed_csv, index=False)
    print(f"[✓] Preprocessed features saved to {preprocessed_csv}")

    return df_preprocessed

def predict_malicious(df_preprocessed, model):
    print("[*] Loading model and predicting...")

    macs = df_preprocessed["wlan.sa"] if "wlan.sa" in df_preprocessed.columns else None
    ssids = df_preprocessed["wlan.ssid"] if "wlan.ssid" in df_preprocessed.columns else None
    bssids = df_preprocessed["wlan.bssid"] if "wlan.bssid" in df_preprocessed.columns else None

    features = df_preprocessed.drop(columns=["wlan.sa", "wlan.ssid", "wlan.bssid"], errors="ignore")
    predictions = model.predict(features)
    df_preprocessed["prediction"] = predictions

    if macs is not None:
        df_preprocessed["wlan.sa"] = macs
    if ssids is not None:
        df_preprocessed["wlan.ssid"] = ssids
    if bssids is not None:
        df_preprocessed["wlan.bssid"] = bssids

    columns_to_save = ["wlan.sa", "wlan.ssid", "wlan.bssid", "prediction"]
    df_preprocessed[columns_to_save].to_csv(all_predictions_csv, index=False)
    print(f"[✓] All MAC address predictions saved to {all_predictions_csv}")

    malicious = df_preprocessed[df_preprocessed["prediction"] == 1]
    print(f"[!] Found {len(malicious)} malicious frames")
    if not malicious.empty:
        print(malicious[columns_to_save])
        malicious.to_csv(malicious_frames_csv, index=False)
        print(f"[✓] Malicious frames saved to {malicious_frames_csv}")

def main():
    print("[*] Starting scan, preprocess and analysis workflow...\n")
    pcaps = []

    # Ensure wlan1 is in monitor mode before scanning
    enable_monitor_mode(interface)

    for ch in channels:
        time.sleep(2)
        try:
            set_channel(ch)
            time.sleep(1)
            pcap = capture_on_channel(ch)
            pcaps.append(pcap)
        except Exception as e:
            print(f"[!] Error on channel {ch}: {e}")

    if not pcaps:
        print("[!] No captures made.")
        return

    combine_pcaps(pcaps)
    extract_features_with_tshark(merged_pcap, tshark_csv)

    # Load the model here before passing it to the encoding function
    model = joblib.load(model_path)

    # Pass the model to the encoding function
    preprocessed_df = preprocess_csv(tshark_csv, model)
    predict_malicious(preprocessed_df, model)

    print("\n[✓] Full scan and classification complete.")

if __name__ == "__main__":
    main()
