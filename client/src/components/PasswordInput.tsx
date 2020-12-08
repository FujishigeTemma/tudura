import React, { useState } from 'react'
import Modal from 'react-modal'

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
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    background: 'rgba(0, 0, 0, 0.2)'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PasswordInput: React.FC<PasswordInputProps> = ({ boxid, authenticate }: PasswordInputProps) => {

  const [ isOpen, setIsOpen ] = useState(true)

  const verifyPassword = (): void => {
    setIsOpen(false)
    authenticate()
  }

  return (
    <Modal ariaHideApp={false} isOpen={isOpen} style={modalStyle}>
      <button onClick={() => { verifyPassword() }}>Close Modal</button>
    </Modal>
  )
}

export default PasswordInput