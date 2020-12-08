import React from 'react'
import styled from 'styled-components'

class Card extends React.Component {
  render(): JSX.Element {
    return (
      <CardCSS></CardCSS>
    )
  }
}

const CardCSS = styled.div`
  background: #C4C4C4;
  width:200px;
  height:200px;
`

export default Card


