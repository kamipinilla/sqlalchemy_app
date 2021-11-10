const List: React.FC = props => {
  const {
    children
  } = props

  return (
    <ul className="w-full flex flex-col divide divide-y rounded-lg shadow">
      {children}
    </ul>
  )
}

export default List