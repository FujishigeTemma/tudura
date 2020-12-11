import React from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import styled from 'styled-components'
import Color from '../style/Color'

// interface boxInputProps {
//   name: string
//   password: string
// }



//TODO:名前変える
const NewBoxModal: React.FC = () => {
  return (
    <Modal ariaHideApp={false} isOpen={true} style={ModalStyle}>
      <ModalForm>
        <ModalTitle>Create New Box </ModalTitle>
        <BoxName>
          <ParamTitle>Name</ParamTitle>
          <BoxNameInputForm
            type='text'
            name='name'
            placeholder='Enter BoxName'
            autoFocus
          />
        </BoxName>
        <PasswordForm>
          <ParamTitle>Password</ParamTitle>
          <PasswordCheckBox></PasswordCheckBox>
        </PasswordForm>
        <PasswordInputForm
          type='password'
          name='password'
          placeholder='Enter password'
          autoFocus
        />
        <Link to='/'>
          <Cancel type='button'>cancel</Cancel>
        </Link>
        <Create type='submit'>submit</Create>
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
  font-size: min(3.2vw, 1rem);
  padding: 2em 3em;
`


const ModalTitle = styled.div`
  font-size: 2em;
  margin: 0 -1em 2em;
`

const ParamTitle = styled.div`
  line-height:1.5em;
  margin: 0 1em 0 0;
  font-size: 1.5em;
`

const BoxName = styled.div`
  display: flex;
  justify-content: center;
  margin:0 0 1rem 0;
`
const BoxNameInputForm = styled.input`
  display: flex;
  width : 19.7rem;
  font-size: 1.5em;
  padding: 0.3em;
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
  display: flex;
  float: center;
  margin:  0 0 1em 0;
`

const PasswordInputForm = styled.input`
  display: flex;
  width: 26rem;
  height:1.5rem;
  font-size: 1.5em;
  padding: 0.5em;
  margin: 0 0;
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
const PasswordCheckBox = styled.input.attrs({ type: 'checkbox' })`
  margin: 1em 0 0 0 ;
  transform:scale(2.0);
  flex-wrap:wrap
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

export default NewBoxModal