import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import SaveFile from './Savefile'//デバッグ用
import { Item } from './Box'
import Color from '../style/Color'
import { ErrorResponse, PostItemResponse } from '../types/Response'

interface ItemProps {
  boxid: string
  item: Item
}

const Card: React.FC<ItemProps> = ({ boxid, item }: ItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getItem = async (): Promise<Item | ErrorResponse | Error> => {
    try {
      const res = await axios.get<Item>(`${process.env.REACT_APP_API_SERVER}/GetItemHandler/boxes/${boxid}/${item.id}`)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteItem = async (): Promise<PostItemResponse | ErrorResponse | Error> => {
    try {
      const res = await axios.delete<PostItemResponse>(`${process.env.REACT_APP_API_SERVER_D}/boxes/${boxid}/${item.id}`)
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

  const saveDownloadFile = () => {
    SaveFile(new File(["Hello,World!"], "template.txt"))
  }

  return (
    <CardDefault onClick={() => saveDownloadFile()}>
      <Thumbnail></Thumbnail>
      <CardName>
        <FileName>{item.name}</FileName>
      </CardName>
    </CardDefault>
  )
}

const Thumbnail = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 20%;
  border-bottom: 2px solid ${Color.PRIMARY_SUB};
`

const CardName = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 80%;
  left: 0;
  right: 0;
  bottom: 0;
`

const FileName = styled.div`
  font-size: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardDefault = styled.button`
  border-radius: 5%;
  position: relative;
  border: solid 2px ${Color.PRIMARY_SUB};
  box-shadow: 0.5px 2px 4px 0 rgba(94, 108, 191, 0.4);
  outline: none;
  box-sizing: content-box;
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