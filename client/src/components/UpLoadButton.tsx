import React from 'react'
import styled from 'styled-components'
import Color from '../style/Color'

const UpLoadButton: React.FC = () => {
  return (
    <Button>
      <UploadIcon xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
        <path d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z'/>
      </UploadIcon>
    </Button>
  )
}

const Button = styled.button`
  right: 3rem;
  bottom: 3rem;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  border: none;
  outline: none;
  position: fixed;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .25);
  background-color: ${Color.PRIMARY};
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`

const UploadIcon = styled.svg`
  fill: ${Color.BACKGROUND_PRIMARY};
  width: 4rem;
  height: 4rem;
`

export default UpLoadButton