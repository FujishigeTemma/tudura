import React from 'react'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import Color from '../style/Color'
import Router from './Router'
import Header from './Header'

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Page>
          <Header></Header>
          <PageBody>
            <Router></Router>
          </PageBody>
        </Page>
      </BrowserRouter>
    </div>
  )
}

const Page = styled.div`
  display: grid;
  min-height: 100vh;
  width: 100%;
  grid-template-rows: auto 1fr;
`

const PageBody = styled.div`
  background-color: ${Color.BACKGROUND_PRIMARY};
`

export default App