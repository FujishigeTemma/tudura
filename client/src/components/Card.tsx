import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Item } from './Box'
import Color from '../style/Color'
import { ErrorResponse, PostItemResponse } from '../types/Response'
import * as SvgIcons from '../img/SvgIcons'

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
    } catch (err) {
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
    } catch (err) {
      if (err.response as ErrorResponse) {
        return err.response
      }
      if (err instanceof Error) {
        return err
      }
      return new Error
    }
  }

  const getURL = (): string => `https://asia-northeast1-tudura.cloudfunctions.net/DownloadItemHandler/boxes/${boxid}/d/${item.id}`
  const IconImage = (): JSX.Element => {
    const fileType = item.name.split('.')
    switch (fileType[fileType.length - 1].toLowerCase()) {
      case 'css':
        return <SvgIcons.CSS />
      case 'doc':
        return <SvgIcons.DOC />
      case 'docx':
        return <SvgIcons.DOC />
      case 'gif':
        return <SvgIcons.GIF />
      case 'html':
        return <SvgIcons.HTML />
      case 'png':
        return <SvgIcons.IMAGE />
      case 'jpeg':
        return <SvgIcons.IMAGE />
      case 'jpg':
        return <SvgIcons.IMAGE />
      case 'svg':
        return <SvgIcons.IMAGE />
      case 'eps':
        return <SvgIcons.IMAGE />
      case 'js':
        return <SvgIcons.JS />
      case 'json':
        return <SvgIcons.JSON />
      case 'md':
        return <SvgIcons.MD />
      case 'pdf':
        return <SvgIcons.PDF />
      case 'txt':
        return <SvgIcons.TXT />
      case 'zip':
        return <SvgIcons.ZIP />
      default:
        return <SvgIcons.BLANK />
    }
  }
  return (
    <CardDefault href={getURL()} download={item.name}>
      <Thumbnail>
        <FileIcon>{IconImage()}</FileIcon>
      </Thumbnail>
      <CardName>
        <FileName>{item.name}</FileName>
      </CardName>
    </CardDefault>
  )
}

const Thumbnail = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 20%;
  border-bottom: 2px solid ${Color.PRIMARY_SUB};
`

const FileIcon = styled.div`
  transform: scale(5);
  margin: 1.5em 0 0 0;
  opacity: 0.8;
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
  color: ${Color.TEXT_PRIMARY};
`

const CardDefault = styled.a`
  text-decoration: none;
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