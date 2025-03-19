import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Updrade";
import StatsPage from "@/app/(DashboardLayout)/components/dashboard/StatsPage"


interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const sidebarWidth = "270px";

  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#eff2f7',
      borderRadius: '15px',
    },
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              ...scrollbarStyles,
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              backgroundColor: '#ffffff',
            }}
          >
            <Box
              sx={{
                width: '270px',
                transition: 'width 0.2s',
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ p: 2 }}>
                <img 
                  src="/images/logos/dark-logo.svg" 
                  alt="AirSecure" 
                  style={{ maxWidth: '100%' }} 
                />
              </Box>
              <Box>
                <SidebarItems />
                <Upgrade />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <Box px={2}>
        <Box
          sx={{
            width: '270px',
            backgroundColor: '#ffffff',
            height: '100%'
          }}
        >
          <Box sx={{ p: 2 }}>
            <img 
              src="/images/logos/dark-logo.svg" 
              alt="logo" 
              style={{ maxWidth: '100%' }} 
            />
          </Box>
          <SidebarItems />
          <Upgrade />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;


