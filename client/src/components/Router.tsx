import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './Home'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        {// <Route path="/:boxid" exact component={Box} />
        }
      </Switch>
    </BrowserRouter>
  )
}

export default Router