import React from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import styled from 'styled-components'
import Color from '../style/Color'

// interface boxInputProps {
//   name: string
//   password: string
// }


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

//TODO:名前変える
const NewBoxModal: React.FC = () => {
  return (
    <Modal ariaHideApp={false} isOpen={true} style={ModalStyle}>
      <ModalForm>
        <ModalTitle>Create New Box </ModalTitle>
        <BoxName>
          <ParamTitle>Name</ParamTitle>
          <BoxNameForm
            type='text'
            name='name'
            placeholder='Enter BoxName'
            autoFocus
          />
        </BoxName>
        <PasswordForm>
          <ParamTitle>Password</ParamTitle>
          <PasswordCheckBox></PasswordCheckBox>
          <PasswordInputForm
            type='password'
            name='password'
            placeholder='Enter password'
            autoFocus
          />
        </PasswordForm>
        <Link to='/'>
          <Cancel type='button'>cancel</Cancel>
        </Link>
        <Create type='submit'>submit</Create>
      </ModalForm>
    </Modal>
  )

}




const ModalForm = styled.form`
  font-size: min(3.2vw, 1rem);
  padding: 7em 3em;
`


const ModalTitle = styled.div`
  font-size: 1.5em;
  margin: 0 0 2em;
`

const ParamTitle = styled.div`
  font-size: 1.5em;
`

const BoxName = styled.div`
  display:flex;
  justify-content:center;
`
const BoxNameForm = styled.input`
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

const PasswordForm = styled.div`
  dixplay:flex;
  float :center;
`

const PasswordInputForm = styled.input`
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
const PasswordCheckBox = styled.input.attrs({ type: 'checkbox' })``

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

export default NewBoxModal