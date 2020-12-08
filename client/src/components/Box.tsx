import React from 'react'
import styled from 'styled-components'
import Card from './Card'


class Box extends React.Component {

  RenderCard(entries: number): JSX.Element[] {
    const res = []
    for (let i = 0; i < entries; i++) {
      res.push(<Card />)
    }
    return res;
  }

  render(): JSX.Element {
    return (
      <BoxGrid>
        {this.RenderCard(20).map((card) => card)}
      </BoxGrid>
    )
  }

}

const BoxGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fit, 200px);
  grid-template-columns: repeat(auto-fit, 200px);
  grid-row-gap: 40px;
  grid-column-gap: 40px;
  justify-content: center;
  align-content: top;
`

export default Box

