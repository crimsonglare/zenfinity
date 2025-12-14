import { useEffect, useRef } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import * as d3 from 'd3';
import { useBatteryStore } from '../../store/useBatteryStore';
import MetricCard from '../common/MetricCard';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function BatteryHealth() {
  const { currentCycleData } = useBatteryStore();
  const socChartRef = useRef<SVGSVGElement>(null);
  const sohChartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!currentCycleData || !socChartRef.current || !sohChartRef.current) return;

    // Clear previous charts
    d3.select(socChartRef.current).selectAll('*').remove();
    d3.select(sohChartRef.current).selectAll('*').remove();

    // SOC Gauge Chart
    const createSOCGauge = () => {
      const width = 200;
      const height = 200;
      const radius = Math.min(width, height) / 2 - 10;

      const svg = d3
        .select(socChartRef.current)
        .attr('width', width)
        .attr('height', height);

      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      // Create arc generator for background
      const arc = d3
        .arc()
        .innerRadius(radius - 20)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(2 * Math.PI);

      // Background arc
      const backgroundArc = arc({
        startAngle: 0,
        endAngle: 2 * Math.PI,
        innerRadius: radius - 20,
        outerRadius: radius,
      } as any);
      g.append('path')
        .attr('d', backgroundArc || '')
        .attr('fill', '#2f3136')
        .attr('stroke', '#404249')
        .attr('stroke-width', 2);

      // Create arc for SOC value
      const socValue = currentCycleData.average_soc;
      const socAngle = (socValue / 100) * 2 * Math.PI - Math.PI / 2;

      const socArc = d3
        .arc()
        .innerRadius(radius - 20)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(socAngle);

      // Color based on SOC level
      const socColor =
        socValue > 80
          ? '#3ba55d'
          : socValue > 50
          ? '#faa61a'
          : socValue > 20
          ? '#f97316'
          : '#ed4245';

      const socArcPath = socArc({
        startAngle: -Math.PI / 2,
        endAngle: socAngle,
        innerRadius: radius - 20,
        outerRadius: radius,
      } as any);
      g.append('path')
        .attr('d', socArcPath || '')
        .attr('fill', socColor)
        .attr('opacity', 0.8);

      // Add SOC text
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-10')
        .attr('fill', '#dcddde')
        .attr('font-size', '32px')
        .attr('font-weight', '600')
        .text(`${socValue.toFixed(1)}%`);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '15')
        .attr('fill', '#b9bbbe')
        .attr('font-size', '14px')
        .text('Average SOC');

      // Add min/max indicators
      const minSoc = currentCycleData.min_soc;
      const maxSoc = currentCycleData.max_soc;

      // Min indicator
      const minAngle = (minSoc / 100) * 2 * Math.PI - Math.PI / 2;
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(minAngle) * (radius - 10))
        .attr('y2', Math.sin(minAngle) * (radius - 10))
        .attr('stroke', '#ed4245')
        .attr('stroke-width', 2)
        .attr('opacity', 0.6);

      // Max indicator
      const maxAngle = (maxSoc / 100) * 2 * Math.PI - Math.PI / 2;
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(maxAngle) * (radius - 10))
        .attr('y2', Math.sin(maxAngle) * (radius - 10))
        .attr('stroke', '#3ba55d')
        .attr('stroke-width', 2)
        .attr('opacity', 0.6);
    };

    // SOH Drop Visualization
    const createSOHChart = () => {
      const width = 300;
      const height = 150;
      const margin = { top: 20, right: 20, bottom: 40, left: 50 };

      const svg = d3
        .select(sohChartRef.current)
        .attr('width', width)
        .attr('height', height);

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const sohDrop = currentCycleData.soh_drop;
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // Create scale
      const maxSOH = Math.max(sohDrop * 1.5, 2); // Ensure we can see the value
      const xScale = d3.scaleLinear().domain([0, maxSOH]).range([0, chartWidth]);
      const yScale = d3.scaleBand().domain(['SOH Drop']).range([0, chartHeight]).padding(0.3);

      // Background bar
      g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', '#2f3136')
        .attr('rx', 4);

      // SOH Drop bar
      const color = sohDrop > 1 ? '#ed4245' : sohDrop > 0.5 ? '#faa61a' : '#3ba55d';
      const yPos = yScale('SOH Drop');
      const bandwidth = yScale.bandwidth();
      if (yPos !== undefined && bandwidth !== undefined) {
        g.append('rect')
          .attr('x', 0)
          .attr('y', yPos)
          .attr('width', xScale(sohDrop))
          .attr('height', bandwidth)
          .attr('fill', color)
          .attr('rx', 4)
          .attr('opacity', 0.8);

        // Value label
        g.append('text')
          .attr('x', xScale(sohDrop) + 10)
          .attr('y', yPos + bandwidth / 2)
          .attr('dy', '0.35em')
          .attr('fill', '#dcddde')
          .attr('font-size', '14px')
          .attr('font-weight', '600')
          .text(`${sohDrop.toFixed(3)}%`);
      }

      // X-axis
      const xAxis = d3.axisBottom(xScale).ticks(5);
      g.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis)
        .selectAll('text')
        .attr('fill', '#b9bbbe')
        .attr('font-size', '10px');

      g.append('text')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 35})`)
        .style('text-anchor', 'middle')
        .attr('fill', '#b9bbbe')
        .attr('font-size', '11px')
        .text('SOH Drop (%)');

      // Style axes
      g.selectAll('.domain, .tick line')
        .attr('stroke', '#404249')
        .attr('stroke-width', 1);
    };

    createSOCGauge();
    createSOHChart();
  }, [currentCycleData]);

  if (!currentCycleData) {
    return null;
  }

  const { average_soc, min_soc, max_soc, soh_drop } = currentCycleData;

  return (
    <Card sx={{ backgroundColor: '#202225' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Battery Health
        </Typography>

        <Grid container spacing={3}>
          {/* SOC Metrics */}
          <Grid item xs={12} md={4} {...({} as any)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                State of Charge (SOC)
              </Typography>
              <svg ref={socChartRef}></svg>
              <Grid container spacing={2} sx={{ mt: 2, width: '100%' }}>
                <Grid item xs={6} {...({} as any)}>
                  <MetricCard
                    title="Min SOC"
                    value={min_soc.toFixed(1)}
                    unit="%"
                    icon={<BatteryChargingFullIcon />}
                    color="#ed4245"
                  />
                </Grid>
                <Grid item xs={6} {...({} as any)}>
                  <MetricCard
                    title="Max SOC"
                    value={max_soc.toFixed(1)}
                    unit="%"
                    icon={<BatteryFullIcon />}
                    color="#3ba55d"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* SOH Visualization */}
          <Grid item xs={12} md={8} {...({} as any)}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                State of Health (SOH) Degradation
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <svg ref={sohChartRef}></svg>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} {...({} as any)}>
                  <MetricCard
                    title="SOH Drop"
                    value={soh_drop.toFixed(3)}
                    unit="%"
                    icon={<TrendingDownIcon />}
                    color={soh_drop > 1 ? '#ed4245' : soh_drop > 0.5 ? '#faa61a' : '#3ba55d'}
                    subtitle={
                      soh_drop > 1
                        ? 'High degradation'
                        : soh_drop > 0.5
                        ? 'Moderate degradation'
                        : 'Low degradation'
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} {...({} as any)}>
                  <MetricCard
                    title="SOC Range"
                    value={(max_soc - min_soc).toFixed(1)}
                    unit="%"
                    icon={<BatteryFullIcon />}
                    color="#5865F2"
                    subtitle={`${min_soc.toFixed(1)}% - ${max_soc.toFixed(1)}%`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} {...({} as any)}>
                  <MetricCard
                    title="SOC Utilization"
                    value={average_soc.toFixed(1)}
                    unit="%"
                    icon={<BatteryChargingFullIcon />}
                    color={average_soc > 50 ? '#3ba55d' : '#faa61a'}
                    subtitle="Average during cycle"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BatteryHealth;

