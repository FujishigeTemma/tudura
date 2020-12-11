import React from 'react'
import styled from 'styled-components'

const aboutText = `
利用規約
まだ考えていません
`

const About: React.FC = () => {
  return (
    <AboutBody>
      <Description>{aboutText}</Description>
    </AboutBody>
  )
}

const AboutBody = styled.div`
  padding: 5rem 1rem;
`

const Description = styled.h1`
  font-size: min(2rem, 7vw);
`

export default About