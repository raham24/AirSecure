# AirSecure Backend

<div align="center">
  
![AirSecure](../assets/images/dark-logo.svg)

**Machine Learning and Hardware-based Wireless Security Detection Engine**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

The AirSecure backend is a Python-based wireless security detection engine that captures and analyzes WiFi traffic to identify rogue access points and evil twin networks. Using machine learning classification, it provides real-time threat detection by monitoring wireless frames and extracting behavioral patterns indicative of malicious activity.

## Features

- **Wireless Traffic Capture**
  - Monitor mode interface configuration
  - Multi-channel packet capture with tcpdump
  - PCAP file merging and processing
  
- **Feature Extraction**
  - Comprehensive frame analysis with tshark
  - 802.11 protocol field extraction
  - Security capability assessment
  
- **Machine Learning Classification**
  - Pre-trained joblib model for threat detection
  - Real-time malicious frame identification
  - MAC address and SSID tracking
  
- **Data Processing**
  - Automated preprocessing pipeline
  - One-hot encoding for categorical features
  - CSV output for analysis and reporting

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Core** | Python 3.x |
| **Machine Learning** | scikit-learn, joblib, pandas |
| **Network Capture** | tcpdump, tshark, Wireshark tools |
| **Data Processing** | pandas, numpy |
| **System** | Linux networking tools (iw, ip) |

## Getting Started

### Prerequisites

- Linux system with wireless adapter supporting monitor mode
- Python 3.x
- Required system packages:
  ```bash
  sudo apt-get install tcpdump tshark wireshark-common iw
  ```
- Python dependencies:
  ```bash
  pip install pandas joblib scikit-learn
  ```

### Configuration

Edit the configuration section in `main.py`:

```python
# ======== Configuration ========
interface = "wlan1"              # Your wireless interface
capture_dir = "./captures"       # Output directory
model_path = "./airsecure_classifier.joblib"  # ML model path
capture_duration = 180          # Seconds per channel
channels = [149]                # Channels to monitor
```

### Usage

1. Ensure your wireless interface supports monitor mode
2. Run the detection engine:
   ```bash
   sudo python main.py
   ```
3. The system will:
   - Enable monitor mode on the specified interface
   - Capture traffic on configured channels
   - Extract features and classify threats
   - Generate reports in the captures directory

### Output Files

The system generates timestamped output files:

- `merged_capture_YYYYMMDD_HHMMSS.pcap` - Combined packet capture
- `tshark_parsed_capture_YYYYMMDD_HHMMSS.csv` - Extracted features
- `preprocessed_features_YYYYMMDD_HHMMSS.csv` - Processed ML features
- `all_predictions_YYYYMMDD_HHMMSS.csv` - All classification results
- `malicious_frames_YYYYMMDD_HHMMSS.csv` - Detected threats

## Feature Extraction

The system extracts comprehensive 802.11 frame features including:

### Frame Control & Addressing
- Frame type, subtype, and control flags
- Source addresses (MAC), SSIDs, and BSSIDs
- Fragmentation, retry, and power management flags

### Security Capabilities
- RSN (Robust Security Network) capabilities
- Management Frame Protection (MFP) settings
- WAPI security capabilities
- OSEN security parameters

### MAC/PHY Capabilities
- HT (High Throughput) and VHT (Very High Throughput) capabilities
- HE (High Efficiency) MAC and PHY parameters
- TWT (Target Wake Time) support indicators
- LDPC coding and STBC capabilities

## Model Requirements

The system expects a pre-trained scikit-learn model saved as `airsecure_classifier.joblib`. The model should be trained on the same feature set defined in the `fields` configuration array.

## Security Considerations

- Requires root privileges for monitor mode configuration
- Monitor mode may interfere with normal wireless connectivity
- Ensure compliance with local wireless monitoring regulations
- Consider impact on wireless network performance during capture

## Troubleshooting

### Common Issues

1. **Interface not found**: Verify wireless interface name with `iwconfig`
2. **Monitor mode failed**: Check if interface supports monitor mode
3. **Permission denied**: Ensure running with sudo privileges
4. **Model not found**: Verify model path and file existence
5. **Channel switching failed**: Some adapters may not support all channels

### Dependencies

Ensure all system tools are installed:
```bash
# Check tool availability
which tcpdump tshark iw ip
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Wireshark](https://www.wireshark.org/) - Network protocol analyzer
- [scikit-learn](https://scikit-learn.org/) - Machine learning library
- [pandas](https://pandas.pydata.org/) - Data analysis and manipulation tool