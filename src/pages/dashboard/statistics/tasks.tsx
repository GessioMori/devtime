import { PieChart } from '@/components/statistics/pieChart'
import { Container } from '@mantine/core'

const data = [
  {
    id: 'elixir',
    label: 'elixir',
    value: 434
  },
  {
    id: 'erlang',
    label: 'erlang',
    value: 437
  },
  {
    id: 'go',
    label: 'go',
    value: 356
  },
  {
    id: 'c',
    label: 'c',
    value: 479
  },
  {
    id: 'lisp',
    label: 'lisp',
    value: 408
  }
]

const TasksStatisticsPage = () => {
  return (
    <Container sx={{ height: '50vh' }}>
      <PieChart
        data={data}
        tooltipName="Project name"
        tooltipValue="Total tasks"
      />
    </Container>
  )
}

export default TasksStatisticsPage
