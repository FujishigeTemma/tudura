import React, { useState } from 'react'
import { useHistory, withRouter, RouteComponentProps } from 'react-router-dom'
import Modal from 'react-modal'
import styled from 'styled-components'
import axios from 'axios'
import Color from '../style/Color'
import Screen from '../style/Screen'
import { PostBoxesResponse, ErrorResponse } from '../types/Response'


interface BoxProps extends RouteComponentProps {
  isOpen: boolean
  close: VoidFunction
}

const AddNewBox: React.FC<BoxProps> = ({ isOpen, close }: BoxProps) => {
  const history = useHistory()
  const [boxName, setBoxName] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [boxPassword, setBoxPassword] = useState('')
  const [boxNameError, setBoxNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const postBoxes = async (): Promise<PostBoxesResponse | ErrorResponse | Error> => {
    try {
      const res = await axios.post<PostBoxesResponse>(`${process.env.REACT_APP_API_SERVER}/PostBoxHandler/boxes`, {
        "name": boxName,
        "password": boxPassword
      })
      return res.data
    } catch (err) {
      if (err.response as ErrorResponse) {
        setPasswordError(err.response.data)
        return err.response
      }
      if (err instanceof Error) {
        return err
      }
      return new Error
    }
  }

  const closeModal = (event: React.FormEvent): void => {
    close()
    setBoxName('')
    setBoxPassword('')
    setBoxNameError('')
    setPasswordError('')
    setIsLocked(false)
    event.preventDefault()
  }
  const createBox = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log(boxName)
    if (boxName === '') {
      setBoxNameError('Empty name is not allowed!')
      event.preventDefault()
    }
    else {
      const boxInfo = await postBoxes()
      console.log(boxInfo)
      if (boxInfo instanceof Error || 'status' in boxInfo) {
        //TODO:いい感じに通知を出す
        return
      }
      closeModal(event)
      history.push(`/${boxInfo.id}`)
    }
  }

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setBoxName(event.target.value)
  }
  const handleChangeLocked = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsLocked(event.target.checked)
    if (event.target.checked === false) {
      setBoxPassword('')
    }
  }
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setBoxPassword(event.target.value)
  }


  return (
    <Modal ariaHideApp={false} isOpen={isOpen} style={ModalStyle}>
      <ModalForm onSubmit={createBox}>
        <ModalTitle>Create New Box </ModalTitle>
        <BoxName>
          <ParamTitle>Name</ParamTitle>
          <InputForm>
            <BoxNameInputForm
              type='text'
              placeholder='Enter BoxName'
              onChange={handleChangeName}
              autoFocus
            />
            <NotSatisfied>{boxNameError}</NotSatisfied>
          </InputForm>
        </BoxName>

        <PasswordForm>
          <ParamTitle>Password</ParamTitle>
          <PasswordCheckBox
            type='checkbox'
            onChange={handleChangeLocked}
          ></PasswordCheckBox>
        </PasswordForm>
        <PasswordInputForm
          type='password'
          placeholder='Enter password'
          disabled={!isLocked}
          onChange={handleChangePassword}
          value={boxPassword}
        />
        <NotSatisfied>{passwordError}</NotSatisfied>
        <Create type='submit'>create</Create>
        <Cancel type='button' onClick={closeModal}>cancel</Cancel>
      </ModalForm>
    </Modal>
  )
}

const ModalStyle: Modal.Styles = {
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
  font-size: min(2.7vw, 1rem);
  padding: 1em 2em;
`

const BoxName = styled.div`
  display: flex;
  justify-content: center;
`

const ModalTitle = styled.div`
  font-size: 2em;
  margin: 0 -0.7em 2em;
`

const ParamTitle = styled.div`
  line-height: 1.5em;
  margin: 0 1em 0 0;
  font-size: 1.5em;
`

const BoxNameInputForm = styled.input`
  display: flex;
  font-size: 1.5em;
  padding: 0.3em;
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

const PasswordForm = styled.div`
  display: flex;
  align-items: center;
  margin:  0 0 1em 0;
`

const PasswordInputForm = styled.input`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  font-size: 1.5em;
  padding: 0.3em 0 0.3em 0.3em;
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
const PasswordCheckBox = styled.input`
  ${Screen.PHONE} {
    transform: scale(1.3);
  }
  transform: scale(1.8);
`

const NotSatisfied = styled.div`
  height: 1.5em;
  font-size: 1em;
  color: ${Color.WARNING};
`
const InputForm = styled.div`
  display: block;
  margin: 0 0 0 1.2em;
`
const Create = styled.button`
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

export default withRouter(AddNewBox)