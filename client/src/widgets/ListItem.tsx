import { twString } from '../types'

interface Props {
  onClick?: () => void
  bgColor?: twString
}

const ListItem: React.FC<Props> = props => {
  const {
    onClick,
    children,
  } = props
  
  const bgColor = props.bgColor ?? 'bg-white'

  function getListItemClass(): twString {
    let listItemClass = `px-6 py-4 ${bgColor}`
    if (onClick) {
      listItemClass += ' cursor-pointer hover:bg-gray-100'
    }
    return listItemClass
  }

  return (
    <li className={getListItemClass()} onClick={onClick}>
      {children}
    </li>
  )
}

export default ListItem