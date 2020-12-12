import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Home from './Home'
import About from './About'
import Box from './Box'

const Router: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/about" exact component={About} />
      {// Route path="/:boxid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})" component={Box} /> uuidバリデーション
      }
      <Route path="/:boxid" component={Box} />
      <Redirect from="/" to="/" />
    </Switch>
  )
}

export default Router