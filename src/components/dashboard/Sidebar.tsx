import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import { useBatteryStore, AUTHORIZED_IMEIS } from '../../store/useBatteryStore';

interface SidebarProps {
  drawerWidth: number;
}

function Sidebar({ drawerWidth }: SidebarProps) {
  const { selectedIMEI, setSelectedIMEI } = useBatteryStore();

  // Format IMEI for display (show last 4 digits for readability)
  const formatIMEI = (imei: string) => {
    const last4 = imei.slice(-4);
    return `Battery #${last4}`;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#2f3136',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        {/* Logo/Header Section */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BatteryChargingFullIcon sx={{ color: '#5865F2', fontSize: 32 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#dcddde',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            Zenfinity
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#202225' }} />

        {/* Batteries Section */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#8e9297',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              px: 1,
            }}
          >
            Batteries
          </Typography>

          <Box sx={{ mt: 1 }}>
            {AUTHORIZED_IMEIS.map((imei) => (
              <Button
                key={imei}
                fullWidth
                onClick={() => setSelectedIMEI(imei)}
                sx={{
                  justifyContent: 'flex-start',
                  color: selectedIMEI === imei ? '#fff' : '#8e9297',
                  backgroundColor: selectedIMEI === imei ? '#404249' : 'transparent',
                  px: 2,
                  py: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: selectedIMEI === imei ? '#404249' : '#36373d',
                    color: '#dcddde',
                  },
                  '&:before': {
                    content: '"# "',
                    color: selectedIMEI === imei ? '#dcddde' : '#8e9297',
                    fontWeight: 700,
                    mr: 0.5,
                  },
                }}
              >
                {formatIMEI(imei)}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#202225', my: 2 }} />

        {/* Battery Info Section */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#8e9297',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              px: 1,
            }}
          >
            Current IMEI
          </Typography>
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              backgroundColor: '#202225',
              borderRadius: 1,
              border: '1px solid #404249',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#8e9297',
                fontSize: '0.7rem',
                display: 'block',
                mb: 0.5,
              }}
            >
              Selected Battery
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#dcddde',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              {selectedIMEI}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
