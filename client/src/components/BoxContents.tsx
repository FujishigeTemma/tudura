import React from 'react'
import styled from 'styled-components'
import Card from './Card'
import UpLoadButton from './UpLoadButton'
import Color from '../style/Color'

interface BoxContentsProps {
  boxid: string
}

const BoxContents: React.FC<BoxContentsProps> = ({ boxid }: BoxContentsProps) => {

  const renderCard = (): string[] => {
    const res: string[] = []
    for (let i = 0; i < 100; i++) {
      res.push(`test ${i}`)
    }
    return res
  }

  return (
    <>
      <BoxName>BoxName {boxid}</BoxName>
      <BoxInfo>
        <BoxInfoContents>last updated: 2020/12/9</BoxInfoContents>
        <BoxInfoContents>12 items</BoxInfoContents>
        <BoxInfoContents>14/200 GB</BoxInfoContents>
      </BoxInfo>
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
  text-align: center;
  margin :1rem 0 0;
  font-size: 4rem;
  font-family: 'Roboto';
  font-weight:bold;
  color:${Color.TEXT_PRIMARY};
`

const BoxInfo = styled.div`
  display: flex;
  justify-content:center;
`
const BoxInfoContents = styled.div`
  font-size:1.5rem;
  font-weight:bold;
  margin :0 1rem;
  color:${Color.TEXT_PRIMARY};
  opacity: 0.67;
`

const BoxGrid = styled.div`
  display: grid;
  padding: 5rem 20%;
  min-width: 400px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 2rem;
  justify-content: center;
  align-content: top;
`

export default BoxContents