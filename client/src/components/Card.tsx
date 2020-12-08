import React from 'react'
import styled from 'styled-components'

const Card: React.FC = () => {
  return (
    <CardDefault></CardDefault>
  )
}

const CardDefault = styled.div`
  background: #C4C4C4;
  width:200px;
  height:200px;
`

export default Card