import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import BoxContents from './BoxContents'
import PasswordInput from './PasswordInput'

interface BoxParams {
  boxid: string
}

const Box: React.FC = () => {

  const { boxid } = useParams<BoxParams>()
  const [ isBox, setIsBox ] = useState(true) // 存在するboxidかどうか
  const [ isAuth, setIsAuth ] = useState(false) // パスワード認証が必要かどうか

  useEffect((): void => {
    setIsAuth(false)
    if (boxid !== 'a') {
      setIsBox(false)
    }
  }, [])

  const authenticate = (): void => {
    setIsAuth(true)
  }

  return (
    <BoxBody>
      {!isBox && (
        <NotFound>404 Not Found</NotFound>
      )}
      {isBox && (
        <>
          {!isAuth && (
            <PasswordInput boxid={boxid} authenticate={authenticate}></PasswordInput>
          )}
          {isAuth && (
            <BoxContents boxid={boxid}></BoxContents>
          )}
        </>
      )}
    </BoxBody>
  )
}

const NotFound = styled.div`
  text-align: center;
  font-size: 4rem;
`

const BoxBody = styled.div`
  padding: 2rem 4rem;
`

export default Box