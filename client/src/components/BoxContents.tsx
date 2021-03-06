import React from 'react'
import styled from 'styled-components'
import Card from './Card'
import UpLoadButton from './UpLoadButton'
import { Item } from './Box'
import Color from '../style/Color'
import Screen from '../style/Screen'

interface BoxContentsProps {
  boxid: string
  boxName: string
  items: Item[]
}

const BoxContents: React.FC<BoxContentsProps> = ({ boxid, boxName, items }: BoxContentsProps) => {
  return (
    <>
      <BoxName>{boxName}</BoxName>
      <BoxInfo>
        <BoxInfoContents>last updated: 2020/12/9</BoxInfoContents>
        <BoxInfoContents>12 items</BoxInfoContents>
        <BoxInfoContents>14/200 GB</BoxInfoContents>
      </BoxInfo>
      <BoxGrid>
        {items.map((item: Item) => (
          <Card key={item.id} boxid={boxid} item={item} />
        ))}
      </BoxGrid>
      <UpLoadButton boxid={boxid}></UpLoadButton>
    </>
  )
}

const BoxName = styled.div`
  text-align: center;
  margin :1rem 0 0;
  ${Screen.MOBILE} {
    font-size: 3rem;
  }
  font-size: 4rem;
  font-family: 'Roboto';
  font-weight:bold;
  color:${Color.TEXT_PRIMARY};
`

const BoxInfo = styled.div`
  display: flex;
  justify-content:center;
  ${Screen.MOBILE} {
    display: none;
  }
  display: none;
`

const BoxInfoContents = styled.div`
  ${Screen.MOBILE} {
    font-size: 1rem;
  }
  font-size: 1.5rem;
  font-weight:bold;
  margin :0 1rem;
  color:${Color.TEXT_PRIMARY};
  opacity: 0.67;
`

const BoxGrid = styled.div`
  display: grid;
  padding: 5rem 0;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, minmax( min(100%, 200px), 1fr));
  grid-gap: 20px;
  justify-content: center;
  align-content: top;
  ${Screen.WINDOW} {
    max-width: max(1000px, 60%);
  }
  ${Screen.MOBILE} {
    padding: 2rem 0;
    grid-template-columns: repeat(auto-fill, minmax( min(100%, 180px), 1fr));
    grid-gap: 15px;
  }
  ${Screen.PHONE} {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  }
`

export default BoxContents