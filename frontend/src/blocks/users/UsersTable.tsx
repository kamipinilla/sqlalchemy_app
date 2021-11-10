import { UserI, UserId } from '../../types'
import List from '../../widgets/List'
import ListItem from '../../widgets/ListItem'

interface RowProps {
  firstCol: string
  secondCol: string

  isHeader?: boolean
  onClick?: () => void
}

const Row: React.FC<RowProps> = props => {
  const {
    firstCol,
    secondCol,
    onClick,
  } = props
  
  const isHeader = props.isHeader ?? false

  return (
    <ListItem onClick={onClick} bgColor={isHeader ? 'bg-gray-200' : undefined}>
      <div className={'grid grid-cols-4 gap-4' + (isHeader ? ' font-bold' : '')}>
        <div>{firstCol}</div>
        <div className="col-span-3">{secondCol}</div>
      </div>
    </ListItem>
  )
}

interface UserRowProps {
  user: UserI
  onClick?: () => void
}

const UserRow: React.FC<UserRowProps> = props => {
  const {
    user,
    onClick
  } = props

  return (
    <Row firstCol={user.id.toString()} secondCol={user.name} onClick={onClick} />
  )
}

interface UsersTableProps {
  users: UserI[]
  onUserClick?: (userId: UserId) => void 
}

const UsersTable: React.FC<UsersTableProps> = props => {
  const {
    users,
    onUserClick,
  } = props

  const rows = users.map(user => (
    <UserRow key={user.id} user={user} onClick={onUserClick ? () => onUserClick(user.id) : undefined} />
  ))

  return (
    <div className="border-2 border-gray-200 rounded-md">
      <List>
        <Row firstCol="Id" secondCol="Name" isHeader />
        {rows}
      </List>
    </div>
  )
}

export default UsersTable