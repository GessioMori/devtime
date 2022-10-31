import { Container } from '@mantine/core';
import { ResponsiveBar } from '@nivo/bar';
import { FunctionComponent } from 'react';

interface BarChartProps {
  data: {
    values: Record<string, string>[];
    keys: string[];
  };
  tooltipName: string;
  tooltipDesc: string;
}

export const BarChart: FunctionComponent<BarChartProps> = ({
  data,
  tooltipName,
  tooltipDesc
}) => {
  return (
    <Container
      sx={{
        height: '80vh',
        maxHeight: '20rem'
      }}
      p={0}
    >
      <ResponsiveBar
        data={window.innerWidth < 750 ? data.values.reverse() : data.values}
        keys={data.keys}
        indexBy={'month'}
        enableLabel={false}
        margin={{
          top: 10,
          right: 10,
          bottom: 30,
          left: window.innerWidth < 750 ? 60 : 50
        }}
        padding={0.3}
        layout={window.innerWidth < 750 ? 'horizontal' : 'vertical'}
        colors={{ scheme: 'set3' }}
        axisBottom={{
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40
        }}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: '#c1c2c5',
                strokeOpacity: '0.7'
              }
            }
          },
          grid: {
            line: {
              stroke: '#c1c2c5',
              strokeOpacity: '0.1'
            }
          },
          textColor: '#f0f0f0'
        }}
        tooltip={(e) => (
          <div
            style={{
              padding: '0.2rem 0.5rem',
              backgroundColor: '#101113',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>
              {tooltipName}:{' '}
              <span style={{ fontWeight: 'normal' }}>{e.label}</span>
            </span>
            <span style={{ fontWeight: 'bold' }}>
              {tooltipDesc}:{' '}
              <span style={{ fontWeight: 'normal' }}>{e.formattedValue}</span>
            </span>
          </div>
        )}
      />
    </Container>
  );
};
