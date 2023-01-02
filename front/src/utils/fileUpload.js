export class FileUploader {
    animationStarted = 0;
    animationId = null;
    imagesTypes = ["jpeg", "png", "svg", "gif", "webp"];
    getTooltipData() {
        return [...this.imagesTypes].join(", .");
    }
    dragOver(event, order) {
        event.preventDefault();
        const dropZone = document.querySelector(`#dropZone${order}`);
        dropZone.classList.add("drop-zone--over");
    }
    dragLeave(event, order) {
        event.preventDefault();
        const dropZone = document.querySelector(`#dropZone${order}`);
        dropZone.classList.remove("drop-zone--over");
    }
    drop(event, object, order) {
        event.preventDefault();
        const dropZone = document.querySelector(`#dropZone${order}`);
        dropZone.classList.remove("drop-zone--over");
        const file = event.dataTransfer?.files[0];
        this.setDroppedFile(event, object, file, order);
    }
    chooseFile(order) {
        const fileInput = document.querySelector(`#fileInput${order}`);
        fileInput.click();
    }
    setDroppedFile(event, obj, file, order) {
        this.uploadFile(file, order);
        obj[order === 1 ? 'posterUrl' : 'posterUrlBig'] = file;
    }
    setFile(event, obj, order) {
        if (!event.target.files)
            return;
        const file = event.target.files[0];
        this.uploadFile(file, order);
        const key = Object.keys(obj).find((el) => el.includes("Url"));
        obj[order === 1 ? 'posterUrl' : 'posterUrlBig'] = file;
    }
    uploadFile(file, order) {
        const fileReader = new FileReader();
        const fileType = file.type;
        const fileSize = file.size;
        const dropZone = document.querySelector(`#dropZone${order}`);
        const uploadArea = document.querySelector(`#uploadArea${order}`);
        const loadingText = document.querySelector(`#loadingText${order}`);
        const previewImage = document.querySelector(`#previewImage${order}`);
        const fileDetails = document.querySelector(`#fileDetails${order}`);
        const uploadedFile = document.querySelector(`#uploadedFile${order}`);
        const uploadedFileInfo = document.querySelector(`#uploadedFileInfo${order}`);
        const uploadedFileName = document.querySelector(`.uploaded-file__name${order}`);
        if (this.fileValidate(fileType, fileSize)) {
            dropZone.classList.add(`drop-zone--Uploaded${order}`);
            loadingText.style.display = "block";
            previewImage.style.display = "none";
            uploadedFile.classList.remove(`uploaded-file--open${order}`);
            uploadedFileInfo.classList.remove(`uploaded-file__info--active${order}`);
            fileReader.addEventListener("load", () => {
                setTimeout(() => {
                    uploadArea.classList.add(`upload-area--open${order}`);
                    loadingText.style.display = "none";
                    previewImage.style.display = "block";
                    fileDetails.classList.add(`file-details--open${order}`);
                    uploadedFile.classList.add(`uploaded-file--open${order}`);
                    uploadedFileInfo.classList.add(`uploaded-file__info--active${order}`);
                }, 500);
                previewImage.setAttribute("src", fileReader.result);
                uploadedFileName.innerHTML = file.name;
                this.animationId = window.requestAnimationFrame((timestamp) => this.animateCounter(timestamp, order));
            });
            fileReader.readAsDataURL(file);
        }
        else {
            this;
        }
    }
    animateCounter(timestamp, order) {
        if (!this.animationStarted) {
            this.animationStarted = timestamp;
        }
        let counter = timestamp - this.animationStarted;
        const uploadedFileCounter = document.querySelector(`.uploaded-file__counter${order}`);
        if (counter < 2000) {
            uploadedFileCounter.innerHTML = `${Math.round(counter / 20)}%`;
            window.requestAnimationFrame((timestamp) => this.animateCounter(timestamp, order));
        }
        else {
            uploadedFileCounter.innerHTML = "100%";
            window.cancelAnimationFrame(this.animationId);
        }
    }
    fileValidate(fileType, fileSize) {
        let isImage = this.imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);
        if (isImage.length !== 0) {
            if (fileSize <= 10000000) {
                return true;
            }
            else {
                return alert("Файл не должен превышать 5Мб");
            }
        }
        else {
            return alert("Убедитесь, что используете необходимый тип данных");
        }
    }
}
