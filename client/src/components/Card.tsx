import React from 'react'
import styled from 'styled-components'
import SaveFile from './Savefile'//デバッグ用

const Card: React.FC = () => {

  const saveDownloadFile = () => {
    SaveFile(new File(["Hello,World!"], "template.txt"))
  }

  return (
    <CardDefault onClick={() => saveDownloadFile()}></CardDefault>
  )
}

const CardDefault = styled.button`
  background: #C4C4C4;
  position: relative;
  border: none;
  outline: none;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  ::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
  }

`

export default Card