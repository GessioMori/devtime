import { ResponsivePie } from '@nivo/pie';
import { FunctionComponent } from 'react';

interface PieChartProps {
  data: {
    id: string;
    label: string;
    value: number;
  }[];
  tooltipName: string;
  tooltipValue: string;
}

export const PieChart: FunctionComponent<PieChartProps> = ({
  data,
  tooltipName,
  tooltipValue
}) => {
  return (
    <ResponsivePie
      data={data}
      colors={{ scheme: 'set3' }}
      margin={{ top: 40, right: 0, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      enableArcLinkLabels={false}
      sortByValue={true}
      legends={[
        {
          anchor: 'left',
          direction: 'column',
          justify: false,
          itemsSpacing: 10,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#ffffff',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'square',
          translateX: -80
        }
      ]}
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
            <span style={{ fontWeight: 'normal' }}>{e.datum.data.label}</span>
          </span>
          <span style={{ fontWeight: 'bold' }}>
            {tooltipValue}:{' '}
            <span style={{ fontWeight: 'normal' }}>{e.datum.data.value}</span>
          </span>
        </div>
      )}
    />
  );
};
