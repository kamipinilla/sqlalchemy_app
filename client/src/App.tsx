import { Route, Switch } from 'react-router-dom'
import Users from './blocks/users/Users'
import Skills from './blocks/skills/Skills'
import User from './blocks/user/User'

function App() {
  return (
    <div className="flex justify-center bg-white">
      <div className="w-full max-w-screen-sm mx-6 my-12">
        <Switch>
          <Route exact path={['/users', '/']}>
            <Users />
          </Route>
          <Route exact path="/users/:userId">
            <User />
          </Route>
          <Route exact path="/skills">
            <Skills />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default App
