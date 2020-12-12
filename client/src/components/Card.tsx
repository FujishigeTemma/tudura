import React from 'react'
import axios, { AxiosError } from 'axios'
import styled from 'styled-components'
import SaveFile from './Savefile'//デバッグ用
import { Item } from './Box'
import { ErrorResponse, ItemResponse } from '../types/Response'

interface ItemProps {
  boxid: string
  itemid: string
}

const Card: React.FC<ItemProps> = ({ boxid, itemid }: ItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getItem = async (): Promise<Item | ErrorResponse | Error> => {
    try {
      const res = await axios.get<Item>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}/${itemid}`)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteItem = async (): Promise<ItemResponse | ErrorResponse | Error> => {
    try {
      const res = await axios.delete<ItemResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}/${itemid}`)
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

  const saveDownloadFile = () => {
    SaveFile(new File(["Hello,World!"], "template.txt"))
  }

  return (
    <CardDefault onClick={() => saveDownloadFile()}></CardDefault>
  )
}

const CardDefault = styled.button`
  background: #C4C4C4;
  position: relative;
  border: none;
  outline: none;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  ::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default Card