import React from 'react'
import styled from 'styled-components'
import Card from './Card'

const Box: React.FC = () => {

  const renderCard = (): string[] => {
    const res: string[] = []
    for (let i = 0; i < 20; i++) {
      res.push('test')
    }
    return res
  }

  return (
    <BoxGrid>
      {renderCard().map((n: string) => (
        <Card key={n} />
      ))}
    </BoxGrid>
  )
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