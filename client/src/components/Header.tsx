import React from 'react'
import styled from 'styled-components'
import Color from '../style/Color'
import Screen from '../style/Screen'

const Header: React.FC = () => (
  <HeaderBack>
    <HeaderMain href='/'>
      <HeaderLogo>tudura</HeaderLogo>
    </HeaderMain>
    <AddNewButton>Add New</AddNewButton>
  </HeaderBack>
)

const HeaderBack = styled.div`
  ${Screen.MOBILE} {
    //background: ${Color.PRIMARY};
    //box-shadow: 0 3px 3px 0 rgba(0, 0, 0, .25);
  }
  background: ${Color.BACKGROUND_PRIMARY};
  position: relative;
  display: flex;
  justify-content: space-between;
`

const HeaderMain = styled.a`
  text-decoration: none;
  width: fit-content;
  margin: 0.5rem max(calc(50% - 620px), 5%);
`

const HeaderLogo = styled.div`
  ${Screen.MOBILE} {
    //color: ${Color.TEXT_SECONDARY};
    font-size: 2.5rem;
  }
  color: ${Color.TEXT_PRIMARY};
  font-size: 3rem;
`

const AddNewButton = styled.button`
  font-size: 1.4rem;
  margin: 1rem max(calc(50% - 620px), 5%) 0.5rem;
  padding: 0.4rem 1rem;
  background-color: ${Color.PRIMARY};
  color: ${Color.BACKGROUND_PRIMARY};
  outline: none;
  border-style: none;
  border-radius: 0.6rem;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

export default Header