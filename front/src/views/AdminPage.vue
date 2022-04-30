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
.add-film__input {
  width: 150px;
  height: 60px;
  border: 1px solid black;
}
</style>