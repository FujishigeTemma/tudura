import React from 'react'
import styled from 'styled-components'

const Card: React.FC = () => {
  return (
    <CardDefault></CardDefault>
  )
}

const CardDefault = styled.div`
  background: #C4C4C4;
  position: relative;
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