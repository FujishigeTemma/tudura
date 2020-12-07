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
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, .25);
`

const HeaderMain = styled.a`
  text-decoration: none;
  display: flex;
  width: fit-content;
  margin: auto;
  padding: 1em;
`

const HeaderLogo = styled.div`
  color: ${Color.TEXT_SECONDARY};
  font-size: 3em;
`

export default Header