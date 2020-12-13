import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { ReactComponent as IconSvg } from '../img/icon.svg'
import Color from '../style/Color'

const Home: React.FC = () => {
  return (
    <HomeBody>
      <Icon></Icon>
      <HomeText>tudura</HomeText>
      <Description>tuduraは異なるデバイス間でのファイル共有が簡単にできるサービスです。</Description>
    </HomeBody>
  )
}

const HomeBody = styled.div`
  text-align: center;
  padding: 5rem 1rem;
`

const HomeText = styled.div`
  font-family: 'Cabin Condensed', sans-serif;
  font-size: 5rem;
  margin: 0 0 5rem;
`

const Icon = styled(IconSvg)`
  width: 7rem;
  height: 7rem;
  margin: 2rem 0 0;
  .circle {
    fill: ${Color.PRIMARY_SUB};
  }
  .box {
    fill: ${Color.TEXT_SECONDARY};
  }
`

const Description = styled.div`
font-family: 'M PLUS Rounded 1c';
  font-size: min(2.4rem, 7vw);
`

export default withRouter(Home)