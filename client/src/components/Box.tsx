import React from 'react'
import styled from 'styled-components'
import Card from './Card'

const Box: React.FC = () => {

  const renderCard = (): string[] => {
    const res: string[] = []
    for (let i = 0; i < 100; i++) {
      res.push('test')
    }
    return res
  }

  return (
    <BoxBody>
      <BoxName>BoxName</BoxName>
      <BoxGrid>
        {renderCard().map((n: string) => (
          <Card key={n} />
        ))}
      </BoxGrid>
    </BoxBody>
  )
}


const BoxBody = styled.div`
  padding: 2rem 4rem;
`

const BoxName = styled.div`
  font-size: 2rem;
`

const BoxGrid = styled.div`
  display: grid;
  margin: 1.5rem auto;
  grid-template-rows: repeat(auto-fit, 10rem);
  grid-template-columns: repeat(auto-fit, 10rem);
  grid-row-gap: 2rem;
  grid-column-gap: 2rem;
  justify-content: center;
  align-content: top;
`

export default Box