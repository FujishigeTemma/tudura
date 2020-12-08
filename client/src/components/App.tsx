import React from 'react'
import Router from './Router'
import Header from './Header'
import Box from './Box'

const App: React.FC = () => {
  return (
    <div className="App">
      <Header></Header>
      <Router></Router>
      <Box></Box>
    </div>
  )
}

export default App