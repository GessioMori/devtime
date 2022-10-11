import { Notification } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons'
import { FunctionComponent } from 'react'

interface NotificationBoxProps {
  type: 'success' | 'error'
  title: string
  content: string | undefined
  onClose: () => void
}

export const NotificationBox: FunctionComponent<NotificationBoxProps> = ({
  title,
  type,
  content,
  onClose
}) => {
  return (
    <Notification
      icon={type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
      color={type === 'success' ? 'teal' : 'red'}
      title={title}
      onClose={onClose}
    >
      {content}
    </Notification>
  )
}
