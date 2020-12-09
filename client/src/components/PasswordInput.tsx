import React, { useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Color from '../style/Color'

interface PasswordInputProps {
  boxid: string
  authenticate: VoidFunction
}

const modalStyle: Modal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: Color.BACKGROUND_PRIMARY,
    borderRadius: '1rem'
  },
  overlay: {
    background: 'rgba(0, 0, 0, 0.2)'
  }
}

const PasswordInput: React.FC<PasswordInputProps> = ({ boxid, authenticate }: PasswordInputProps) => {

  const [isOpen, setIsOpen] = useState(true)
  const [value, setValue] = useState('')

  const verifyPassword = (event: React.FormEvent): void => {
    console.log(value)
    authenticate()
    setIsOpen(false)
    event.preventDefault()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }

  return (
    <Modal ariaHideApp={false} isOpen={isOpen} style={modalStyle}>
      <ModalForm onSubmit={verifyPassword}>
        <ModalTitle>Enter {boxid} Password </ModalTitle>
        <PasswordFrom
          type='password'
          name='password'
          placeholder='Enter password'
          onChange={handleChange}
          onSubmit={verifyPassword}
          autoFocus
        />
        <Link to='/'>
          <Cancel type='button'>cancel</Cancel>
        </Link>
        <Submit type='submit'>submit</Submit>
      </ModalForm>
    </Modal>
  )
}

const ModalForm = styled.form`
  padding: 1rem;
`

const ModalTitle = styled.div`
  font-size: 1.5rem;
  margin: 0 0 2rem;
`

const PasswordFrom = styled.input`
  display: flex;
  font-size: 1.5rem;
  padding: 0.5rem;
  margin: 0 1rem;
  border-radius: 0.5rem;
  outline: none;
  border: 2px solid ${Color.SECONDARY_SUB};
  &:focus {
    border: 2px solid ${Color.PRIMARY_SUB};
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, .25);
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #C4C4C4;
  }
`

const Submit = styled.button`
  font-size: 1.4rem;
  width: 40%;
  margin: 2rem 0 0;
  padding: 0.4rem 0.7rem;
  background-color: ${Color.PRIMARY};
  color: ${Color.BACKGROUND_PRIMARY};
  float: right;
  outline: none;
  border-style: none;
  border-radius: 0.6rem;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

const Cancel = styled.button`
  font-size: 1.4rem;
  width: 40%;
  margin: 2rem 0 0;
  padding: 0.4rem 0.7rem;
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

export default PasswordInput