import React from 'react'
import styled from 'styled-components'
import Color from '../style/Color'

const Header: React.FC = () => (
  <HeaderBack>
    <HeaderMain href = '/'>
      <HeaderLogo>tudura</HeaderLogo>
    </HeaderMain>
  </HeaderBack>
)

const HeaderBack = styled.div`
  background: ${Color.PRIMARY};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .25);
  position:relative;
`

const HeaderMain = styled.a`
  text-decoration: none;
  display: flex;
  width: fit-content;
  margin: 0.5em auto;
`

const HeaderLogo = styled.div`
  color: ${Color.TEXT_SECONDARY};
  font-size: 3em;
`

export default Header