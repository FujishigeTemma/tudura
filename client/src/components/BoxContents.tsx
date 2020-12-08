import React from 'react'
import styled from 'styled-components'
import Card from './Card'
import UpLoadButton from './UpLoadButton'

interface BoxContentsProps {
  boxid: string
}

const BoxContents: React.FC<BoxContentsProps> = ({ boxid }: BoxContentsProps) => {

  const renderCard = (): string[] => {
    const res: string[] = []
    for (let i = 0; i < 100; i++) {
      res.push('test')
    }
    return res
  }

  return (
    <>
      <BoxName>BoxName {boxid}</BoxName>
      <BoxGrid>
        {renderCard().map((n: string) => (
          <Card key={n} />
        ))}
      </BoxGrid>
      <UpLoadButton></UpLoadButton>
    </>
  )
}


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

export default BoxContents