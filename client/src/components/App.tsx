import React from 'react'
import styled from 'styled-components'
import Color from '../style/Color'
import Router from './Router'
import Header from './Header'

const App: React.FC = () => {
  return (
    <div className="App">
      <Page>
        <Header></Header>
        <PageBody>
          <Router></Router>
        </PageBody>
      </Page>
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