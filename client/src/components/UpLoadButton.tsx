import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Color from '../style/Color'
import Screen from '../style/Screen'
import { ReactComponent as UploadIconSvg } from '../img/upload_icon.svg'
import axios, { AxiosError } from 'axios'
import { Item, ErrorResponse } from './Box'

interface postItemReqest {
  name: string
  duration: number | null
}

interface itemResponse {
  id: string
  name: string
}

interface itemProps {
  boxid: string
  itemid: string
}

const buildFileSelector = (): HTMLInputElement => {
  const fileSelector: HTMLInputElement = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;
}


const UpLoadButton: React.FC<itemProps> = (props) => {

  const [fileSelector, setFileSelector] = useState<HTMLInputElement>()
  useEffect(() => {
    setFileSelector(buildFileSelector())
  }, [])

  const postItem = async (item: postItemReqest): Promise<itemResponse | ErrorResponse | undefined> => (
    await axios.post<itemResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${props.boxid}`, item)
      .then(res => (res.data))
      .catch((err: AxiosError<ErrorResponse>) => (err.response?.data))
  )

  const getItem = async (): Promise<Item | ErrorResponse | undefined> => (
    await axios.get<Item>(`${process.env.REACT_APP_API_SERVER}/boxes/${props.boxid}/${props.itemid}`)
      .then(res => (res.data))
      .catch((err: AxiosError<ErrorResponse>) => (err.response?.data))
  )

  const deleteItem = async (): Promise<itemResponse | ErrorResponse | undefined> => (
    await axios.delete<itemResponse>(`${process.env.REACT_APP_API_SERVER}/boxes/${props.boxid}/${props.itemid}`)
      .then(res => (res.data))
      .catch((err: AxiosError<ErrorResponse>) => (err.response?.data))
  )


  const handleFileSelect = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {

    event.preventDefault();
    (fileSelector as HTMLInputElement).click()
    fileSelector?.addEventListener('change', () => {
      if (fileSelector?.files != undefined) {
        for (let i = 0; i < fileSelector.files.length; i++) {
          console.log(fileSelector.files[i].name)
          const reqest: postItemReqest = {
            name: fileSelector.files[i].name,
            duration: null
          }
          postItem(reqest)
        }
        setFileSelector(buildFileSelector())//stateを初期化
      }
    }
    )
  }

  return (
    <Button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => handleFileSelect(event)}>
      <UploadIcon></UploadIcon>
    </Button>
  )
}

const Button = styled.button`
  right: 10%;
  bottom: 2rem;
  ${Screen.MOBILE} {
    width: 5rem;
    height: 5rem;
  }
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  border: none;
  outline: none;
  position: fixed;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .25);
  background-color: ${Color.PRIMARY};
  overflow: hidden;
  transition: all 0.25s ease;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

const UploadIcon = styled(UploadIconSvg)`
  fill: ${Color.PRIMARY};
  stroke: ${Color.BACKGROUND_PRIMARY};
  width: 70%;
  height: 70%;
`

export default UpLoadButton