import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import BoxContents from './BoxContents'
import PasswordInput from './PasswordInput'
import Screen from '../style/Screen'

interface BoxParams {
  boxid: string
}

interface Item {
  id: string
  name: string
  expirationDate: Date
}

interface GetBoxesResponse {
  id: string
  name: string
  passwordRequired: boolean
  items: Item[]
  updatedAt: Date
}

const Box: React.FC = () => {

  const { boxid } = useParams<BoxParams>()
  const [ isBox, setIsBox ] = useState(true) // 存在するboxidかどうか
  const [ isAuth, setIsAuth ] = useState(false) // 認証されているかどうか

  useEffect((): void => {
    setBoxInfo()
  }, [])

  const authenticate = (): void => {
    setIsAuth(true)
  }

  const setBoxInfo = async () => {
    const boxInfo = await getBoxes()
    if (boxInfo === null) {
      setIsBox(false)
      return
    }
    if (boxInfo.passwordRequired === false) {
      setIsAuth(true)
    }
  }

  const getBoxes = async (): Promise<GetBoxesResponse | null> => {
    try {
      const res = await axios.get<GetBoxesResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}`)
      return res.data
    } catch(err) {
      console.log('error')
      return null
    }
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
  ${Screen.MOBILE} {
    padding: 1rem 5%;
  }
  padding: 2rem 4rem;
`

export default Box