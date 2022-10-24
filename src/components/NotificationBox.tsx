import { Notification } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons'
import { FunctionComponent, ReactNode } from 'react'

interface NotificationBoxProps {
  type: 'success' | 'error'
  title: string
  content: string | undefined
  onClose: () => void
  icon?: ReactNode
}

export type NotificationOptions = 'success' | 'error' | undefined

export const NotificationBox: FunctionComponent<NotificationBoxProps> = ({
  title,
  type,
  content,
  onClose,
  icon
}) => {
  return (
    <Notification
      icon={
        icon ||
        (type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />)
      }
      color={type === 'success' ? 'teal' : 'red'}
      title={title}
      onClose={onClose}
      closeButtonProps={{ 'aria-label': 'Hide notification' }}
      sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
    >
      {content}
    </Notification>
  )
}
