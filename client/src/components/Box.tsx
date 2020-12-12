import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import BoxContents from './BoxContents'
import PasswordInput from './PasswordInput'
import Screen from '../style/Screen'
import { ErrorResponse, GetBoxesResponse } from '../types/Response'

export interface Item {
  id: string
  name: string
  expirationDate: Date
}

export interface BoxProps {
  items: Item[]
  updateItems: (foo: Item[]) => void
}

const BoxContext = React.createContext({} as BoxProps)

interface BoxParams {
  boxid: string
}

const Box: React.FC = () => {

  const { boxid } = useParams<BoxParams>()
  const history = useHistory()
  const [isBox, setIsBox] = useState(0) // 0 読み込み中 1 boxidが存在しない 2 boxidが存在する
  const [isAuth, setIsAuth] = useState(true) // 認証が必要かどうか
  const [boxName, setboxName] = useState('')
  const [items, setItems] = useState<Item[]>([])

  useEffect((): void => {
    setBoxInfo()
  }, [])

  const authenticate = (): void => {
    setIsAuth(false)
  }

  const updateItems = (newItems: Item[]): void => {
    setItems(newItems)
  }

  const setBoxInfo = async () => {
    const boxInfo = await getBoxes()
    if (boxInfo instanceof Error) {
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
    setboxName(boxInfo.name)
    if (boxInfo.items !== null) {
      setItems(boxInfo.items)
    }
  }

  const getBoxes = async (): Promise<GetBoxesResponse | ErrorResponse | Error> => {
    try {
      const res = await axios.get<GetBoxesResponse>(`${process.env.REACT_APP_API_SERVER}/GetBoxHandler/boxes/${boxid}`)
      return res.data
    } catch(err) {
      if (err.response as ErrorResponse) {
        return err.response
      }
      if (err instanceof Error) {
        return err
      }
      return new Error
    }
  }

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
            <BoxContext.Provider value={{items, updateItems}}>
              <BoxContents
                boxid={boxid}
                boxName={boxName}
                items={items}
              />
            </BoxContext.Provider>
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

export const useItems = (): BoxProps => (useContext(BoxContext))

export default Box