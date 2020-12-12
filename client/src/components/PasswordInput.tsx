import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import Modal from 'react-modal'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Color from '../style/Color'
import { ErrorResponse, PostBoxesAuthResponse } from '../types/Response'

interface PasswordInputProps {
  boxid: string
  isAuth: boolean
  authenticate: VoidFunction
}


const PasswordInput: React.FC<PasswordInputProps> = ({ boxid, isAuth, authenticate }: PasswordInputProps) => {

  const [value, setValue] = useState('')

  const verifyPassword = async (event: React.FormEvent): Promise<void> => {
    console.log(value)
    event.preventDefault()
    const resAuth = await authBoxes(value)
    if (resAuth instanceof Error || 'status' in resAuth || !resAuth.result) {
      return
    }
    authenticate()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }
  
  const authBoxes = async (password: string): Promise<PostBoxesAuthResponse | ErrorResponse | Error> => {
    try {
      const res = await axios.post<PostBoxesAuthResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}/auth`, {password: password})
      return res.data
    } catch(err) {
      if (err.response as AxiosError<ErrorResponse>) {
        return err.response.data
      }
      if (err instanceof Error) {
        return err
      }
      return new Error
    }
  }

  return (
    <Modal ariaHideApp={false} isOpen={isAuth} style={modalStyle}>
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

const ModalForm = styled.form`
  font-size: min(3.2vw, 1rem);
  padding: 1em;
`

const ModalTitle = styled.div`
  font-size: 1.5em;
  margin: 0 0 2em;
`

const PasswordFrom = styled.input`
  display: flex;
  font-size: 1.5em;
  padding: 0.5em;
  margin: 0 1em;
  border-radius: 0.5em;
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
  font-size: 1.4em;
  width: 40%;
  margin: 2em 0 0;
  padding: 0.4em 0.7em;
  background-color: ${Color.PRIMARY};
  color: ${Color.BACKGROUND_PRIMARY};
  float: right;
  outline: none;
  border-style: none;
  border-radius: 0.6em;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

const Cancel = styled.button`
  font-size: 1.4em;
  width: 40%;
  margin: 2em 0 0;
  padding: 0.4em 0.7em;
  background-color: ${Color.PRIMARY};
  color: ${Color.BACKGROUND_PRIMARY};
  outline: none;
  border-style: none;
  border-radius: 0.6em;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

export default PasswordInput