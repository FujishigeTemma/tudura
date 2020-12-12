import React from 'react'
import styled from 'styled-components'
import SaveFile from './Savefile'//デバッグ用
import { Item, ErrorResponse } from './Box'
import axios, { AxiosError } from 'axios'



interface ItemProps {
  boxid: string
  itemid: string
}

export interface ItemResponse {
  id: string
  name: string
}

const Card: React.FC<ItemProps> = ({ boxid, itemid }: ItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getItem = async (): Promise<Item | ErrorResponse | undefined> => (
    await axios.get<Item>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}/${itemid}`)
      .then(res => (res.data))
      .catch((err: AxiosError<ErrorResponse>) => (err.response?.data))
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteItem = async (): Promise<ItemResponse | ErrorResponse | undefined> => (
    await axios.delete<ItemResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${boxid}/${itemid}`)
      .then(res => (res.data))
      .catch((err: AxiosError<ErrorResponse>) => (err.response?.data))
  )
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