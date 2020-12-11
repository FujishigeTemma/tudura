import React from 'react'
import styled from 'styled-components'
import Color from '../style/Color'
import Screen from '../style/Screen'
import { ReactComponent as IconSvg } from '../img/icon.svg'
import AddNewButton from './AddNewButton'

const Header: React.FC = () => (
  <HeaderBack>
    <HeaderMain href='/'>
      <LogoIcon></LogoIcon>
      <LogoText>tudura</LogoText>
    </HeaderMain>
    <Button>
      <AddNewButton >Add New</AddNewButton>
    </Button>
  </HeaderBack>
)

const HeaderBack = styled.div`
  ${Screen.MOBILE} {
    //background: ${Color.PRIMARY};
    //box-shadow: 0 3px 3px 0 rgba(0, 0, 0, .25);
  }
  background: ${Color.BACKGROUND_PRIMARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`

const HeaderMain = styled.a`
  text-decoration: none;
  width: fit-content;
  display: flex;
  margin: 0 max(calc(50% - 620px), 5%);
  align-items: center;
`

const LogoIcon = styled(IconSvg)`
  ${Screen.MOBILE} {
    width: 2.5em;
    height: 2.5em;
  }
  width: 3em;
  height: 3em;
  margin: 0 0.5em 0 0;
  .circle {
    fill: ${Color.PRIMARY_SUB};
  }
  .box {
    fill: ${Color.TEXT_SECONDARY};
  }
  ${Screen.PHONE} {
    display: none;
  }
`

const Button = styled.div`
  margin: 1rem max(calc(50% - 620px), 5%) 0.5rem;
  padding: 0.4rem 1rem;
  `
const LogoText = styled.div`
  font-size: 3rem;
  font-family: 'Cabin Condensed', sans-serif;
  ${Screen.MOBILE} {
    //color: ${Color.TEXT_SECONDARY};
    font-size: 2.5rem;
  }
  color: ${Color.TEXT_PRIMARY};
`


export default Header