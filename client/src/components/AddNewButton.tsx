import React, { useState } from 'react'
import styled from 'styled-components'
import Color from '../style/Color'
import AddNewBox from './AddNewBox'

const AddNewButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true)

  const closeModal = (): void => {
    setIsOpen(false)
  }
  const openModal = (): void => {
    setIsOpen(true)
  }

  return (
    <div>
      <Button onClick={openModal}>
        Add New
      </Button>
      <AddNewBox isOpen={isOpen} close={closeModal}></AddNewBox>
    </div>

  )
}


const Button = styled.button`
  font-size: 1.4rem;
  width: 8rem;
  height:3rem;
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

export default AddNewButton