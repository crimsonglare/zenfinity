import { Card, CardContent, Typography, Alert, Box, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useBatteryStore } from '../../store/useBatteryStore';

function AlertsPanel() {
  const { currentCycleData } = useBatteryStore();

  if (!currentCycleData) {
    return null;
  }

  const { alert_details } = currentCycleData;
  const hasWarnings = alert_details.warnings && alert_details.warnings.length > 0;
  const hasProtections = alert_details.protections && alert_details.protections.length > 0;

  return (
    <Card sx={{ backgroundColor: '#202225', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Alerts & Safety
          </Typography>
          <Box>
            {hasWarnings && (
              <Chip
                label={alert_details.warnings.length}
                size="small"
                sx={{ backgroundColor: '#faa61a40', color: '#faa61a', mr: 1 }}
              />
            )}
            {hasProtections && (
              <Chip
                label={alert_details.protections.length}
                size="small"
                sx={{ backgroundColor: '#ed424540', color: '#ed4245' }}
              />
            )}
          </Box>
        </Box>

        {/* Warnings Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WarningAmberIcon sx={{ color: '#faa61a', mr: 1, fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: '#faa61a', fontWeight: 600 }}>
              Warnings ({alert_details.warnings?.length || 0})
            </Typography>
          </Box>
          {hasWarnings ? (
            alert_details.warnings.map((warning, index) => (
              <Alert
                key={index}
                severity="warning"
                sx={{
                  mb: 1,
                  backgroundColor: '#faa61a20',
                  color: '#faa61a',
                  border: '1px solid #faa61a40',
                  '& .MuiAlert-icon': {
                    color: '#faa61a',
                  },
                }}
              >
                {warning}
              </Alert>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
              No warnings
            </Typography>
          )}
        </Box>

        {/* Protections Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ShieldIcon sx={{ color: '#ed4245', mr: 1, fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: '#ed4245', fontWeight: 600 }}>
              Protections ({alert_details.protections?.length || 0})
            </Typography>
          </Box>
          {hasProtections ? (
            alert_details.protections.map((protection, index) => (
              <Alert
                key={index}
                severity="error"
                sx={{
                  mb: 1,
                  backgroundColor: '#ed424520',
                  color: '#ed4245',
                  border: '1px solid #ed424540',
                  '& .MuiAlert-icon': {
                    color: '#ed4245',
                  },
                }}
              >
                {protection}
              </Alert>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
              No protections triggered
            </Typography>
          )}
        </Box>

        {/* Status indicator */}
        {!hasWarnings && !hasProtections && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, p: 2, backgroundColor: '#3ba55d20', borderRadius: 2, border: '1px solid #3ba55d40' }}>
            <CheckCircleIcon sx={{ color: '#3ba55d', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#3ba55d', fontWeight: 600 }}>
              All systems operational
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AlertsPanel;
