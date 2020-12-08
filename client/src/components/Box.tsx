import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import BoxContents from './BoxContents'

interface BoxParams {
  boxid: string
}

const Box: React.FC = () => {

  const { boxid } = useParams<BoxParams>()
  const [ isBox, setIsBox ] = useState(false) // 存在するboxidかどうか
  const [ isAuth, setIsAuth ] = useState(false) // パスワード認証が必要かどうか

  useEffect((): void => {
    setIsAuth(true)
    if (boxid === 'a') {
      setIsBox(true)
    }
  }, [])

  return (
    <BoxBody>
      {!isBox && (
        <NotFound>404 Not Found</NotFound>
      )}
      {isBox && (
        <>
          {!isAuth && (
            <></>
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