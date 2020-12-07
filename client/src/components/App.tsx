import React from 'react'
import Router from './Router'
import Header from './Header'

const App: React.FC = () => {
    return (
      <div className="App">
        <Header></Header>
        <Router></Router>
      </div>
    )
}

export default App