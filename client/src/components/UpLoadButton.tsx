import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Color from '../style/Color'
import Screen from '../style/Screen'

const buildFileSelector = (): HTMLInputElement => {
  const fileSelector: HTMLInputElement = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;
}

const UpLoadButton: React.FC = () => {

  const [fileSelector, setFileSelector] = useState<HTMLInputElement>()
  useEffect(() => {
    setFileSelector(buildFileSelector())
  }, [])


  const handleFileSelect = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {

    event.preventDefault();
    (fileSelector as HTMLInputElement).click()
    fileSelector?.addEventListener('change', () => {
      if (fileSelector?.files != undefined) {
        for (let i = 0; i < fileSelector.files.length; i++) {
          console.log(fileSelector.files[i].name)
          //TODO:アップロードする操作を実装
        }
        setFileSelector(buildFileSelector())//stateを初期化
      }
    }
    )
  }

  return (
    <Button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => handleFileSelect(event)}>
      <UploadIcon xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
        <path d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z' />
      </UploadIcon>
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

const UploadIcon = styled.svg`
  fill: ${Color.BACKGROUND_PRIMARY};
  width: 70%;
  height: 70%;
`

export default UpLoadButton