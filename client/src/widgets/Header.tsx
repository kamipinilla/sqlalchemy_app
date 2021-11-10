const Header: React.FC = props => {
  const {
    children,
  } = props

  return (
    <div className="space-y-3">
      {children}
      <hr />
    </div>
  )
}

export default Header