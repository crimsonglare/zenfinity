import { useEffect, useRef } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Card, CardContent } from '@mui/material';
import * as d3 from 'd3';
import { useBatteryStore } from '../../store/useBatteryStore';
import { TemperatureSamplingRate } from '../../types/battery.types';

function TemperatureDistribution() {
  const { currentCycleData, temperatureSamplingRate, setTemperatureSamplingRate } = useBatteryStore();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!currentCycleData || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Get the appropriate temperature distribution based on sampling rate
    const getTemperatureData = () => {
      switch (temperatureSamplingRate) {
        case 5:
          return currentCycleData.temperature_dist_5deg;
        case 10:
          return currentCycleData.temperature_dist_10deg;
        case 15:
          return currentCycleData.temperature_dist_15deg;
        case 20:
          return currentCycleData.temperature_dist_20deg;
        default:
          return currentCycleData.temperature_dist_5deg;
      }
    };

    const tempData = getTemperatureData();

    // Convert object to array and sort by temperature range
    const data = Object.entries(tempData)
      .map(([range, value]) => ({
        range,
        value: value as number,
      }))
      .sort((a, b) => {
        // Extract the lower bound of the range for sorting
        const aMin = parseInt(a.range.split('-')[0]);
        const bMin = parseInt(b.range.split('-')[0]);
        return aMin - bMin;
      });

    if (data.length === 0) {
      return;
    }

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.range))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([height, 0]);

    // Create color scale based on temperature ranges
    const getColor = (range: string): string => {
      const mid = parseInt(range.split('-')[0]) + temperatureSamplingRate / 2;
      if (mid < 0) return '#3b82f6'; // Very cold - blue
      if (mid < 10) return '#60a5fa'; // Cold - light blue
      if (mid < 20) return '#34d399'; // Cool - green
      if (mid < 30) return '#fbbf24'; // Warm - yellow
      if (mid < 40) return '#f97316'; // Hot - orange
      return '#ef4444'; // Very hot - red
    };

    // Draw bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.range) || 0)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.value))
      .attr('fill', (d) => getColor(d.range))
      .attr('rx', 4)
      .attr('opacity', 0.8)
      .on('mouseover', function (_event, d) {
        d3.select(this).attr('opacity', 1);
        // Show tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${(xScale(d.range) || 0) + xScale.bandwidth() / 2},${yScale(d.value) - 10})`);

        tooltip
          .append('rect')
          .attr('x', -40)
          .attr('y', -20)
          .attr('width', 80)
          .attr('height', 30)
          .attr('fill', '#202225')
          .attr('stroke', '#5865F2')
          .attr('rx', 4);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#dcddde')
          .attr('font-size', '12px')
          .attr('dy', -5)
          .text(`${d.value.toFixed(1)} min`);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#b9bbbe')
          .attr('font-size', '10px')
          .attr('dy', 8)
          .text(`${d.range}°C`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8);
        g.selectAll('.tooltip').remove();
      });

    // Add value labels on top of bars
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => (xScale(d.range) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#dcddde')
      .attr('font-size', '10px')
      .text((d) => (d.value > 0 ? d.value.toFixed(1) : ''));

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '11px')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '11px');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '12px')
      .text('Time (minutes)');

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '12px')
      .text(`Temperature Range (°C)`);

    // Style axes
    g.selectAll('.domain, .tick line')
      .attr('stroke', '#404249')
      .attr('stroke-width', 1);
  }, [currentCycleData, temperatureSamplingRate]);

  if (!currentCycleData) {
    return null;
  }

  const handleSamplingRateChange = (_event: React.MouseEvent<HTMLElement>, newRate: TemperatureSamplingRate | null) => {
    if (newRate !== null) {
      setTemperatureSamplingRate(newRate);
    }
  };

  return (
    <Card sx={{ backgroundColor: '#202225' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Temperature Distribution
          </Typography>
          <ToggleButtonGroup
            value={temperatureSamplingRate}
            exclusive
            onChange={handleSamplingRateChange}
            aria-label="temperature sampling rate"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: '#b9bbbe',
                borderColor: '#404249',
                '&.Mui-selected': {
                  backgroundColor: '#5865F2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#4752c4',
                  },
                },
                '&:hover': {
                  backgroundColor: '#36373d',
                },
              },
            }}
          >
            <ToggleButton value={5} aria-label="5 degrees">
              5°C
            </ToggleButton>
            <ToggleButton value={10} aria-label="10 degrees">
              10°C
            </ToggleButton>
            <ToggleButton value={15} aria-label="15 degrees">
              15°C
            </ToggleButton>
            <ToggleButton value={20} aria-label="20 degrees">
              20°C
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
          <svg ref={svgRef}></svg>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Average Temperature: {currentCycleData.average_temperature.toFixed(1)}°C
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TemperatureDistribution;

