import { HTMLInputElement } from "../../../interfaces/events";
interface basicObj extends Object {
  [prop: string]: any
}

export class FileUploader {
  animationStarted = 0;
  animationId: any = null;
  imagesTypes = [
    "jpeg",
    "png",
    "svg",
    "gif",
    "webp"
  ]

  getTooltipData() {
    return [...this.imagesTypes].join(', .');
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
    const dropZone = document.querySelector('#dropZone')!;
    dropZone.classList.add('drop-zone--over');
  }

  dragLeave(event: DragEvent) {
    event.preventDefault();
    const dropZone = document.querySelector('#dropZone')!;
    dropZone.classList.remove('drop-zone--over');
  }

  drop(event: DragEvent, object: Object) {
    event.preventDefault();
    const dropZone = document.querySelector('#dropZone')!;
    dropZone.classList.remove('drop-zone--over');
    const file = event.dataTransfer?.files[0] as File;
    this.setDroppedFile(event, object, file)
  }

  chooseFile() {
    const fileInput:HTMLElement = document.querySelector('#fileInput')!;
    fileInput.click();
  }

  setDroppedFile(event: DragEvent, obj: basicObj, file: File) {
    this.uploadFile(file);
    obj.posterUrl = file;
  }

  setFile(event: HTMLInputElement, obj: basicObj):void {
    const file: File = event.target.files[0];
    this.uploadFile(file);
    const key = Object.keys(obj).find(el => el.includes('Url'));
    obj.posterUrl = file;
  }

  uploadFile(file: File) {
    const fileReader = new FileReader();
    const fileType = file.type;
    const fileSize = file.size;
    const dropZone = document.querySelector('#dropZone')!;
    const uploadArea:HTMLElement = document.querySelector('#uploadArea')!;
    const loadingText:HTMLElement = document.querySelector('#loadingText')!;
    const previewImage:HTMLElement = document.querySelector('#previewImage')!;
    const fileDetails = document.querySelector('#fileDetails')!;
    const uploadedFile = document.querySelector('#uploadedFile')!;
    const uploadedFileInfo = document.querySelector('#uploadedFileInfo')!;
    const uploadedFileName = document.querySelector('.uploaded-file__name')!;

    if (this.fileValidate(fileType, fileSize)) {
      dropZone.classList.add('drop-zone--Uploaded');
      loadingText.style.display = "block";
      previewImage.style.display = 'none';
      uploadedFile.classList.remove('uploaded-file--open');
      uploadedFileInfo.classList.remove('uploaded-file__info--active');

      fileReader.addEventListener('load', () => {
        setTimeout(() => {
          uploadArea.classList.add('upload-area--open');
          loadingText.style.display = "none";
          previewImage.style.display = 'block';
          fileDetails.classList.add('file-details--open');
          uploadedFile.classList.add('uploaded-file--open');
          uploadedFileInfo.classList.add('uploaded-file__info--active');
        }, 500);

        previewImage.setAttribute('src', fileReader.result as string);
        uploadedFileName.innerHTML = file.name;

        this.animationId = window.requestAnimationFrame((timestamp) => this.animateCounter(timestamp));
      });
      fileReader.readAsDataURL(file);
    } else {
      this;
    }
  }

  animateCounter(timestamp: number) {
    if (!this.animationStarted) {
      this.animationStarted = timestamp
    }
    let counter = timestamp - this.animationStarted;
    const uploadedFileCounter = document.querySelector('.uploaded-file__counter')!;
    if (counter < 2000) {
      uploadedFileCounter.innerHTML = `${Math.round(counter / 20)}%`;
      window.requestAnimationFrame((timestamp) => this.animateCounter(timestamp));
    } else {
      uploadedFileCounter.innerHTML = '100%';
      window.cancelAnimationFrame(this.animationId);
    }
  }

  fileValidate(fileType:string, fileSize:number) {
    let isImage = this.imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);
    if (isImage.length !== 0) {
      if (fileSize <= 2000000) {
        return true;
      } else {
        return alert('Файл не должен превышать 2Мб');
      }
    } else {
      return alert('Убедитесь, что используете необходимый тип данных');
    }
  }
}