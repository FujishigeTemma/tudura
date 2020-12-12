import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Color from '../style/Color'
import Screen from '../style/Screen'
import { useItems, Item } from './Box'
import { ReactComponent as UploadIconSvg } from '../img/upload_icon.svg'
import { ErrorResponse, PostItemResponse } from '../types/Response'

interface PostItemRequest {
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

  const { items, updateItems } = useItems()
  const [fileSelector, setFileSelector] = useState<HTMLInputElement>()

  useEffect(() => {
    setFileSelector(buildFileSelector())
  }, [])

  const postItem = async (item: PostItemRequest, file: File): Promise<PostItemResponse | ErrorResponse | Error> => {
    try {
      const formData = new FormData()
      formData.append('json', JSON.stringify(item))
      formData.append('file', file)
      const header = {
        'headers': {
          'content-type': 'multipart/form-data'
        }
      }
      const res = await axios.post<PostItemResponse>(`${process.env.REACT_APP_API_SERVER}/PostItemHandler/boxes/${boxid}`, formData, header)
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

  const uploadItem = async (item: PostItemRequest, file: File): Promise<void> => {
    const response = await postItem(item, file)
    if (response instanceof Error || 'status' in response) {
      return
    }
    const newItems = items.concat({ id: response.id, name: response.name, expirationDate: response.expiresAt } as Item)
    updateItems(newItems)
  }

  const handleFileSelect = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.preventDefault();
    (fileSelector as HTMLInputElement).click()
    fileSelector?.addEventListener('change', () => {
      if (fileSelector?.files != undefined) {
        // 複数ファイル同時アップロード バックエンド待ち
        /* for (let i = 0; i < fileSelector.files.length; i++) {
          console.log(fileSelector.files[i].name)
          const request: PostItemRequest = {
            name: fileSelector.files[i].name,
            duration: null
          }
          postItem(request)
        } */
        const request: PostItemRequest = {
          name: fileSelector.files[0].name,
          duration: null
        }
        uploadItem(request, fileSelector.files[0])
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