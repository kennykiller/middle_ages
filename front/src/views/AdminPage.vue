<script setup lang="ts">
import axios from "axios";
import { reactive, onBeforeMount, onMounted } from "vue";
// import { setFile, fileUploader } from "../utils/fileUpload";
import { FileUploader } from "../utils/fileUpload";
import { HTMLInputElement } from "../../../interfaces/events";
import { Film, Genre } from "../../../interfaces/models";

let film: Film = reactive({
  name: "",
  ageRestriction: "",
  posterUrl: "",
  startDate: "",
  description: '',
  genres: [],
  endDate: "",
});
let genres: { value: Genre[] } = reactive({ value: [] })
let fileUploader = new FileUploader();



onBeforeMount(async () => {
  genres.value = await getGenres();
});

async function createFilm() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  const formData = new FormData();
  formData.append("name", film.name);
  formData.append("ageRestriction", film.ageRestriction);
  formData.append("posterUrl", film.posterUrl);
  formData.append("description", film.description);
  formData.append("startDate", film.startDate);
  formData.append("endDate", film.endDate);
  formData.append("genres", JSON.stringify(film.genres));
  try {
    const res = await axios.post("http://localhost:3000/admin/film", formData, {
      headers,
    });
  } catch (e) {
    console.log(e);
  }
}

async function getGenres(): Promise<Genre[] | []> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get("http://localhost:3000/admin/genres", {
      headers,
    });
    return response?.data ? reactive(response.data.genres) : reactive([]);
  } catch (e) {
    console.log(e);
    return [];
  }
}
</script>

<template>
  <form class="base-form" @submit.prevent>
    <div class="base-form__row">
      <div class="base-form__input">
        <input type="text" id="name" required v-model="film.name" class="add-film__input"/>
        <label for="name" class="">Название фильма</label
        >
      </div>
      <div class="base-form__input">
        <input type="text" id="ageRestriction" required v-model="film.ageRestriction"  class="add-film__input"/>
        <label for="ageRestriction" class="">Возрастное ограничение</label
        >
      </div>
    </div>
    <div class="base-form__row">
      <div id="uploadArea" class="upload-area">
        
        <div class="upload-area__header">
          <h1 class="upload-area__title">Загрузите Ваш файл</h1>
          <p class="upload-area__paragraph">
            Файл должен быть изображением
            <br>
            <strong class="upload-area__tooltip">
              Следующих форматов
              <span class="upload-area__tooltip-data">{{ fileUploader.getTooltipData() }}</span>
            </strong>
          </p>
        </div>

        <div 
          @click="fileUploader.chooseFile"
          @dragover="fileUploader.dragOver"
          @dragleave="fileUploader.dragLeave"
          @drop="fileUploader.drop($event, film)"
          id="dropZone"
          class="upload-area__drop-zone drop-zone">
          <p class="drop-zone__paragraph">Перетащите свое изображение или щелкните для выбора</p>
          <span id="loadingText" class="drop-zone__loading-text">Пожалуйста, подождите</span>
          <img src="" alt="Preview Image" id="previewImage" class="drop-zone__preview-image" draggable="false">
          <input
            @change="fileUploader.setFile($event as HTMLInputElement, film)"
            type="file"
            id="fileInput"
            class="drop-zone__file-input"
            accept="image/*">
        </div>

        <div id="fileDetails" class="upload-area__file-details file-details">
          <h3 class="file-details__title">Загруженный файл</h3>

          <div id="uploadedFile" class="uploaded-file">
            <div id="uploadedFileInfo" class="uploaded-file__info">
              <span class="uploaded-file__name">Proejct 1</span>
              <span class="uploaded-file__counter">0%</span>
            </div>
          </div>
        </div>
      </div>

      <select multiple v-model="film.genres">
        <option v-for="genre in genres.value" :key="genre.name" :value="genre">
          {{ genre.name }}
        </option>
      </select>
    </div>
    <div class="base-form__row">
      <div class="">
        <label for="startDate" class="">Дата начала проката</label
        ><input
          type="date"
          class="add-film__input"
          min="2022-01-01"
          max="2050-12-31"
          id="startDate"
          v-model="film.startDate"
        />
      </div>
      <div class="">
        <label for="endDate" class="">Дата окончания проката</label
        ><input
          type="date"
          min="2022-01-01"
          class="add-film__input"
          max="2050-12-31"
          id="endDate"
          v-model="film.endDate"
        />
      </div>
    </div>
    <div class="base-form__row">
      <div class="">
        <label for="description" class="">Описание фильма</label
        ><textarea
          id="description"
          v-model="film.description"
          placeholder="Введите описание фильма"
        ></textarea>
      </div>
    </div>
    <button @click="createFilm">SAVE FILM</button>
  </form>
</template>

<style lang="scss" scoped>
.base-form {
  width: 70%;
  border-radius: 4px;
  padding: 10px;
  display: grid;
  row-gap: 20px;
  box-shadow: 0 4px 7px #88b8fe;
  &__row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .base-form__input {
      margin: 1rem 0;
      position: relative;
      label {
        position: absolute;
        pointer-events: none;
        left: 12px;
        top: 0;
        line-height: 3rem;
        transition: 0.3s;
        color: #6b757c;
      }
      input {
        font-size: 1rem;
        height: 3rem;
        width: 100%;
        padding: 0 0.75rem;
        padding-top: 1rem;
        border: 1px solid #ced4da;
        outline: none;
        border-radius: 3px;
        box-shadow: none;
        transition: box-shadow 0.3s;

        &:focus {
          border-color: #88b8fe;
          box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
        }
        &:focus ~ label,
        &:not(:focus):valid ~ label {
          top: -0.7rem;
          font-size: 0.7rem;
        }
      }
    }
  }
}
.add-film__input {
  width: 150px;
  height: 60px;
  border: 1px solid black;
}

.upload-area {
  width: 100%;
  max-width: 25rem;
  background-color: (white);
  box-shadow: 0 10px 60px rgb(218, 229, 255);
  border: 2px solid rgb(171, 202, 255);
  border-radius: 24px;
  padding: 2rem 1.875rem 5rem 1.875rem;
  margin: 0.625rem;
  text-align: center;
}

.upload-area__title {
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 0.3125rem;
}

.upload-area__paragraph {
  font-size: 0.9375rem;
  color: rgb(196, 195, 196);
  margin-top: 0;
}

.upload-area__tooltip {
  position: relative;
  color: rgb(171, 202, 255);
  cursor: pointer;
  transition: color 300ms ease-in-out;
}

.upload-area__tooltip:hover {
  color: rgb(63, 134, 255);
}

.upload-area__tooltip-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -125%);
  min-width: max-content;
  background-color: white;
  color: rgb(63, 134, 255);
  border: 1px solid rgb(171, 202, 255);
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  opacity: 0;
  visibility: hidden;
  transition: none 300ms ease-in-out;
  transition-property: opacity, visibility;
}

.upload-area__tooltip:hover .upload-area__tooltip-data {
  opacity: 1;
  visibility: visible;
}

.upload-area__drop-zone {
  position: relative;
  height: 11.25rem; /* 180px */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px dashed rgb(171, 202, 255);
  border-radius: 15px;
  margin-top: 2.1875rem;
  cursor: pointer;
  transition: border-color 300ms ease-in-out;
}

.upload-area__drop-zone:hover {
  border-color: rgb(63, 134, 255);
}

.drop-zone__paragraph {
  font-size: 0.9375rem;
  color: rgb(196, 195, 196);
  margin: 0;
  margin-top: 0.625rem;
  transition: opacity 300ms ease-in-out;
}

.drop-zone:hover .drop-zone__paragraph {
  opacity: 0.7;
}

.drop-zone__loading-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  color: rgb(171, 202, 255);
  z-index: 10;
}

.drop-zone__preview-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.3125rem;
  border-radius: 10px;
  display: none;
  z-index: 1000;
  transition: opacity 300ms ease-in-out;
}

.drop-zone:hover .drop-zone__preview-image {
  opacity: 0.8;
}

.drop-zone__file-input {
  display: none;
}

.drop-zone--over {
  border-color: rgb(63, 134, 255);
}

.drop-zone--over .drop-zone__paragraph {
  opacity: 0.7;
}

.drop-zone--Uploaded .drop-zone__paragraph {
  display: none;
}

.upload-area__file-details {
  height: 0;
  visibility: hidden;
  opacity: 0;
  text-align: left;
  transition: none 500ms ease-in-out;
  transition-property: opacity, visibility;
  transition-delay: 500ms;
}

.file-details--open {
  height: auto;
  visibility: visible;
  opacity: 1;
}

.file-details__title {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgb(196, 195, 196);
}

.uploaded-file {
  display: flex;
  align-items: center;
  padding: 0.625rem 0;
  visibility: hidden;
  opacity: 0;
  transition: none 500ms ease-in-out;
  transition-property: visibility, opacity;
}

.uploaded-file--open {
  visibility: visible;
  opacity: 1;
}

.uploaded-file__info {
  position: relative;
  top: -0.3125rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.uploaded-file__info::before,
.uploaded-file__info::after {
  content: '';
  position: absolute;
  bottom: -0.9375rem;
  width: 0;
  height: 0.5rem;
  background-color: #ebf2ff;
  border-radius: 0.625rem;
}

.uploaded-file__info::before {
  width: 100%;
}

.uploaded-file__info::after {
  width: 100%;
  background-color: rgb(63, 134, 255);
}

.uploaded-file__info--active::after {
  animation: progressMove 1s ease-in-out;
  animation-delay: 300ms;
}

@keyframes progressMove {
  from {
    width: 0%;
    background-color: transparent;
  }

  to {
    width: 100%;
    background-color: rgb(63, 134, 255);
  }
}

.uploaded-file__name {
  width: 100%;
  max-width: 6.25rem; /* 100px */
  display: inline-block;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.uploaded-file__counter {
  font-size: 1rem;
  color: rgb(196, 195, 196);
}
</style>