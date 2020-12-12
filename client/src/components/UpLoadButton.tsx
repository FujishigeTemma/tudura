import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Color from '../style/Color'
import Screen from '../style/Screen'
import { ReactComponent as UploadIconSvg } from '../img/upload_icon.svg'
import { ErrorResponse, ItemResponse } from '../types/Response'

interface PostItemReqest {
  name: string
  duration: number | null
}

interface UploadProps {
  boxid: string
}

const buildFileSelector = (): HTMLInputElement => {
  const fileSelector: HTMLInputElement = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;
}


const UpLoadButton: React.FC<UploadProps> = ({ boxid }: UploadProps) => {

  const [fileSelector, setFileSelector] = useState<HTMLInputElement>()
  useEffect(() => {
    setFileSelector(buildFileSelector())
  }, [])

  const postItem = async (item: PostItemReqest, file: File): Promise<ItemResponse | ErrorResponse | Error> => {
    try {
      const formData = new FormData()
      formData.append('json', JSON.stringify(item))
      formData.append('file', file)
      const header = {
        'headers': {
          'content-type': 'multipart/form-data'
        }
      }
      const res = await axios.post<ItemResponse>(`${process.env.REACT_APP_API_SERVER}/PostItemHandler/boxes/${boxid}`, formData, header)
      console.log(res.data)
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

  const handleFileSelect = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.preventDefault();
    (fileSelector as HTMLInputElement).click()
    fileSelector?.addEventListener('change', () => {
      if (fileSelector?.files != undefined) {
        /* for (let i = 0; i < fileSelector.files.length; i++) {
          console.log(fileSelector.files[i].name)
          const reqest: PostItemReqest = {
            name: fileSelector.files[i].name,
            duration: null
          }
          postItem(reqest)
        } */
        const reqest: PostItemReqest = {
          name: fileSelector.files[0].name,
          duration: null
        }
        postItem(reqest, fileSelector.files[0])
        setFileSelector(buildFileSelector()) //stateを初期化
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