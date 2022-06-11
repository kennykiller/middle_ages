export class FileUploader {
    animationStarted = 0;
    animationId = null;
    imagesTypes = ["jpeg", "png", "svg", "gif", "webp"];
    getTooltipData() {
        return [...this.imagesTypes].join(", .");
    }
    dragOver(event) {
        event.preventDefault();
        const dropZone = document.querySelector("#dropZone");
        dropZone.classList.add("drop-zone--over");
    }
    dragLeave(event) {
        event.preventDefault();
        const dropZone = document.querySelector("#dropZone");
        dropZone.classList.remove("drop-zone--over");
    }
    drop(event, object) {
        event.preventDefault();
        const dropZone = document.querySelector("#dropZone");
        dropZone.classList.remove("drop-zone--over");
        const file = event.dataTransfer?.files[0];
        this.setDroppedFile(event, object, file);
    }
    chooseFile() {
        const fileInput = document.querySelector("#fileInput");
        fileInput.click();
    }
    setDroppedFile(event, obj, file) {
        this.uploadFile(file);
        obj.posterUrl = file;
    }
    setFile(event, obj) {
        if (!event.target.files)
            return;
        const file = event.target.files[0];
        this.uploadFile(file);
        const key = Object.keys(obj).find((el) => el.includes("Url"));
        obj.posterUrl = file;
    }
    uploadFile(file) {
        const fileReader = new FileReader();
        const fileType = file.type;
        const fileSize = file.size;
        const dropZone = document.querySelector("#dropZone");
        const uploadArea = document.querySelector("#uploadArea");
        const loadingText = document.querySelector("#loadingText");
        const previewImage = document.querySelector("#previewImage");
        const fileDetails = document.querySelector("#fileDetails");
        const uploadedFile = document.querySelector("#uploadedFile");
        const uploadedFileInfo = document.querySelector("#uploadedFileInfo");
        const uploadedFileName = document.querySelector(".uploaded-file__name");
        if (this.fileValidate(fileType, fileSize)) {
            dropZone.classList.add("drop-zone--Uploaded");
            loadingText.style.display = "block";
            previewImage.style.display = "none";
            uploadedFile.classList.remove("uploaded-file--open");
            uploadedFileInfo.classList.remove("uploaded-file__info--active");
            fileReader.addEventListener("load", () => {
                setTimeout(() => {
                    uploadArea.classList.add("upload-area--open");
                    loadingText.style.display = "none";
                    previewImage.style.display = "block";
                    fileDetails.classList.add("file-details--open");
                    uploadedFile.classList.add("uploaded-file--open");
                    uploadedFileInfo.classList.add("uploaded-file__info--active");
                }, 500);
                previewImage.setAttribute("src", fileReader.result);
                uploadedFileName.innerHTML = file.name;
                this.animationId = window.requestAnimationFrame((timestamp) => this.animateCounter(timestamp));
            });
            fileReader.readAsDataURL(file);
        }
        else {
            this;
        }
    }
    animateCounter(timestamp) {
        if (!this.animationStarted) {
            this.animationStarted = timestamp;
        }
        let counter = timestamp - this.animationStarted;
        const uploadedFileCounter = document.querySelector(".uploaded-file__counter");
        if (counter < 2000) {
            uploadedFileCounter.innerHTML = `${Math.round(counter / 20)}%`;
            window.requestAnimationFrame((timestamp) => this.animateCounter(timestamp));
        }
        else {
            uploadedFileCounter.innerHTML = "100%";
            window.cancelAnimationFrame(this.animationId);
        }
    }
    fileValidate(fileType, fileSize) {
        let isImage = this.imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);
        if (isImage.length !== 0) {
            if (fileSize <= 2000000) {
                return true;
            }
            else {
                return alert("Файл не должен превышать 2Мб");
            }
        }
        else {
            return alert("Убедитесь, что используете необходимый тип данных");
        }
    }
}
