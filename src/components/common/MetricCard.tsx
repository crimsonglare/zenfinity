import { ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
}

function MetricCard({ title, value, unit, icon, color = 'primary.main', subtitle }: MetricCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: '#202225',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1.5}>
          {icon && (
            <Box mr={1.5} sx={{ color, display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          )}
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            {title}
          </Typography>
        </Box>

        <Typography
          variant="h4"
          component="div"
          sx={{
            color,
            fontWeight: 600,
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {value}
          {unit && (
            <Typography
              component="span"
              variant="h6"
              color="text.secondary"
              sx={{ ml: 1, fontWeight: 400 }}
            >
              {unit}
            </Typography>
          )}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCard;
