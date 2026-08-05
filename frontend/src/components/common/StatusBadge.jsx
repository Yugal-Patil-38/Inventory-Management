import Badge from './Badge'

const statusTones = {
  'In Stock': 'green',
  'Low Stock': 'amber',
  'Out of Stock': 'red',
}

function StatusBadge({ status }) {
  return (
    <Badge tone={statusTones[status] || 'slate'} dot>
      {status}
    </Badge>
  )
}

export default StatusBadge
