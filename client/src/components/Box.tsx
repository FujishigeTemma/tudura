import React, { useState, useEffect } from 'react'
import axios, { AxiosError }  from 'axios'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import BoxContents from './BoxContents'
import PasswordInput from './PasswordInput'
import Screen from '../style/Screen'

interface BoxParams {
  boxid: string
}

interface ErrorResponse {
  title: string
  status: number
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
  const history = useHistory()
  const [ isBox, setIsBox ] = useState(0) // 0 読み込み中 1 boxidが存在しない 2 boxidが存在する
  const [ isAuth, setIsAuth ] = useState(true) // 認証が必要かどうか


  useEffect((): void => {
    setBoxInfo()
  }, [])

  const authenticate = (): void => {
    setIsAuth(false)
  }

  const setBoxInfo = async () => {
    const boxInfo = await getBoxes()
    if (boxInfo === undefined) {
      history.push('/')
      return
    }
    if ('status' in boxInfo) {
      if (boxInfo.status === 401) {
        setIsBox(2)
        setIsAuth(true)
        return
      }
      if (boxInfo.status === 404) {
        setIsBox(1)
        setIsAuth(false)
        return
      }
      setIsBox(1)
      return
    }
    setIsBox(2)
    setIsAuth(false)
  }

  const getBoxes = async (): Promise<GetBoxesResponse | ErrorResponse | undefined> => (
    await axios.get<GetBoxesResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}`)
      .then(res => ( res.data ))
      .catch((err: AxiosError<ErrorResponse>) => ( err.response?.data ))
  )

  return (
    <BoxBody>
      {isBox === 1 && (
        <NotFound>404 Not Found</NotFound>
      )}
      {isBox === 2 && (
        <>
          {isAuth && (
            <PasswordInput 
              boxid={boxid}
              isAuth={isAuth}
              authenticate={authenticate}
            />
          )}
          {!isAuth && (
            <BoxContents boxid={boxid}/>
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