import { saveAs } from 'file-saver'


//暇はひとまずfileを引数にとっているが、APIができ次第それに合ったものに改定する予定
const SaveFile = (file: File): void => {
    const blob = new Blob([file], { type: file.type })
    saveAs(blob, file.name)
}

export default SaveFile
