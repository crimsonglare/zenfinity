import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Card, CardContent, Tabs, Tab } from '@mui/material';
import * as d3 from 'd3';
import { useBatteryStore } from '../../store/useBatteryStore';

type TrendMetric = 'soh' | 'soc' | 'temperature' | 'distance' | 'speed';

function LongTermTrends() {
  const { allCycles, selectedIMEI } = useBatteryStore();
  const [selectedMetric, setSelectedMetric] = useState<TrendMetric>('soh');
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!allCycles || allCycles.length === 0 || !chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Sort cycles by cycle number
    const sortedCycles = [...allCycles].sort((a, b) => a.cycle_number - b.cycle_number);

    // Get data based on selected metric
    const getData = () => {
      switch (selectedMetric) {
        case 'soh':
          return sortedCycles.map((cycle) => ({
            cycle: cycle.cycle_number,
            value: cycle.soh_drop,
            label: 'SOH Drop (%)',
            color: '#ed4245',
          }));
        case 'soc':
          return sortedCycles.map((cycle) => ({
            cycle: cycle.cycle_number,
            value: cycle.average_soc,
            label: 'Average SOC (%)',
            color: '#5865F2',
          }));
        case 'temperature':
          return sortedCycles.map((cycle) => ({
            cycle: cycle.cycle_number,
            value: cycle.average_temperature,
            label: 'Average Temperature (°C)',
            color: '#faa61a',
          }));
        case 'distance':
          return sortedCycles.map((cycle) => ({
            cycle: cycle.cycle_number,
            value: cycle.total_distance,
            label: 'Total Distance (km)',
            color: '#3ba55d',
          }));
        case 'speed':
          return sortedCycles.map((cycle) => ({
            cycle: cycle.cycle_number,
            value: cycle.average_speed,
            label: 'Average Speed (km/h)',
            color: '#7289da',
          }));
        default:
          return [];
      }
    };

    const data = getData();

    if (data.length === 0) return;

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.cycle) as [number, number])
      .nice()
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.value) as [number, number])
      .nice()
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line<{ cycle: number; value: number }>()
      .x((d) => xScale(d.cycle))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add grid lines
    const xGrid = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickSize(-height)
      .tickFormat(() => '');

    const yGrid = d3
      .axisLeft(yScale)
      .ticks(8)
      .tickSize(-width)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(xGrid)
      .selectAll('line')
      .attr('stroke', '#2f3136')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#2f3136')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Add area under the line
    const area = d3
      .area<{ cycle: number; value: number }>()
      .x((d) => xScale(d.cycle))
      .y0(height)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', data[0].color)
      .attr('fill-opacity', 0.1)
      .attr('d', area);

    // Add the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', data[0].color)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.cycle))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', data[0].color)
      .attr('stroke', '#202225')
      .attr('stroke-width', 2)
      .on('mouseover', function (_event, d) {
        d3.select(this).attr('r', 6);

        // Show tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${xScale(d.cycle)},${yScale(d.value) - 10})`);

        tooltip
          .append('rect')
          .attr('x', -50)
          .attr('y', -30)
          .attr('width', 100)
          .attr('height', 50)
          .attr('fill', '#202225')
          .attr('stroke', data[0].color)
          .attr('rx', 4);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#dcddde')
          .attr('font-size', '11px')
          .attr('dy', -15)
          .text(`Cycle ${d.cycle}`);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', data[0].color)
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .attr('dy', 2)
          .text(`${d.value.toFixed(2)}`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 4);
        g.selectAll('.tooltip').remove();
      });

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll('text')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '11px');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(8))
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
      .text(data[0].label);

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '12px')
      .text('Cycle Number');

    // Style axes
    g.selectAll('.domain, .tick line')
      .attr('stroke', '#404249')
      .attr('stroke-width', 1);

    // Calculate and display trend statistics
    const values = data.map((d) => d.value);
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const trend = lastValue - firstValue;
    const trendPercent = firstValue !== 0 ? ((trend / firstValue) * 100).toFixed(2) : '0.00';

    // Add trend indicator
    const trendText = g
      .append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    trendText
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 140)
      .attr('height', 50)
      .attr('fill', '#202225')
      .attr('stroke', '#404249')
      .attr('rx', 4);

    trendText
      .append('text')
      .attr('x', 70)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#b9bbbe')
      .attr('font-size', '10px')
      .text('Overall Trend');

    trendText
      .append('text')
      .attr('x', 70)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', trend >= 0 ? '#3ba55d' : '#ed4245')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(`${trend >= 0 ? '+' : ''}${trend.toFixed(2)} (${trendPercent}%)`);
  }, [allCycles, selectedMetric, selectedIMEI]);

  if (!allCycles || allCycles.length === 0) {
    return (
      <Card sx={{ backgroundColor: '#202225' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Long-term Trends
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Loading cycle data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TrendMetric) => {
    setSelectedMetric(newValue);
  };

  return (
    <Card sx={{ backgroundColor: '#202225' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Long-term Trends
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedMetric}
            onChange={handleTabChange}
            aria-label="trend metrics tabs"
            sx={{
              '& .MuiTab-root': {
                color: '#b9bbbe',
                textTransform: 'none',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#5865F2',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#5865F2',
              },
            }}
          >
            <Tab label="SOH Drop" value="soh" />
            <Tab label="Average SOC" value="soc" />
            <Tab label="Temperature" value="temperature" />
            <Tab label="Distance" value="distance" />
            <Tab label="Speed" value="speed" />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
          <svg ref={chartRef}></svg>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Analyzing {allCycles.length} cycles for battery {selectedIMEI.slice(-4)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default LongTermTrends;

