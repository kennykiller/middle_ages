<script setup lang="ts">
import { FileUploader } from "@/utils/fileUpload";
import { SnackType } from "../../../../interfaces/types";
import { Film, Genre, FilmResponse } from "../../../../interfaces/models";
import axios from "axios";
import { reactive, onBeforeMount, ref, onMounted, Ref, computed } from "vue";
import BaseSnack from "../UI/BaseSnack.vue";

const filmFileUploader = new FileUploader();

const successText = "Фильм успешно добавлен";
const failureText = "Проблема при сохранении фильма";
const textToDisplay = computed(() =>
  mode.value === "error" ? failureText : successText
);
let mode: Ref<SnackType> = ref("error");
let snackIsVisible = ref(false);

let film: Film = reactive({
  name: "",
  ageRestriction: "",
  posterUrl: "",
  startDate: "",
  description: "",
  filmDuration: "",
  basePrice: 500,
  genres: [],
  endDate: "",
});
let genres: { value: Genre[] } = reactive({ value: [] });

onBeforeMount(async () => {
  genres.value = await getGenres();
});

const descriptionRef = ref<HTMLElement | null>(null);

async function createFilm() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  const formData = new FormData();
  formData.append("name", film.name);
  formData.append("ageRestriction", film.ageRestriction);
  formData.append("posterUrl", film.posterUrl);
  formData.append("basePrice", String(film.basePrice));
  formData.append("description", film.description);
  formData.append("filmDuration", film.filmDuration);
  formData.append("startDate", film.startDate);
  formData.append("endDate", film.endDate);
  formData.append("genres", JSON.stringify(film.genres));
  try {
    const res: FilmResponse = await axios.post(
      "http://localhost:3000/admin/film",
      formData,
      {
        headers,
      }
    );
    mode.value = res.data?.createdFilm?.id ? "success" : "error";
    snackIsVisible.value = true;
    setTimeout(() => (snackIsVisible.value = false), 4000);
  } catch (e) {
    mode.value = "error";
    snackIsVisible.value = true;
    setTimeout(() => (snackIsVisible.value = false), 4000);
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
onMounted(() => {
  descriptionRef.value?.focus();
});

const resize = () => {
  if (descriptionRef.value) {
    descriptionRef.value.style.height = "1rem";
    descriptionRef.value.style.height =
      descriptionRef.value.scrollHeight + "px";
  }
};
</script>
<template>
  <form class="base-form" @submit.prevent>
    <div class="base-form__row">
      <h1>Добавление фильма</h1>
    </div>
    <div class="base-form__row">
      <div class="base-form__input">
        <input type="text" id="name" required v-model="film.name" />
        <label for="name" class="">Название фильма</label>
      </div>
      <div class="base-form__input">
        <input
          type="text"
          id="ageRestriction"
          required
          v-model="film.ageRestriction"
        />
        <label for="ageRestriction" class="">Возрастное ограничение</label>
      </div>
    </div>
    <div class="base-form__row">
      <div id="uploadArea" class="upload-area">
        <div class="upload-area__header">
          <h1 class="upload-area__title">Загрузите Ваш файл</h1>
          <p class="upload-area__paragraph">
            Файл должен быть изображением
            <br />
            <strong class="upload-area__tooltip">
              Следующих форматов
              <span class="upload-area__tooltip-data">{{
                filmFileUploader.getTooltipData()
              }}</span>
            </strong>
          </p>
        </div>

        <div
          @click="filmFileUploader.chooseFile"
          @dragover="filmFileUploader.dragOver"
          @dragleave="filmFileUploader.dragLeave"
          @drop="filmFileUploader.drop($event, film)"
          id="dropZone"
          class="upload-area__drop-zone drop-zone"
        >
          <p class="drop-zone__paragraph">
            Перетащите свое изображение или щелкните для выбора
          </p>
          <span id="loadingText" class="drop-zone__loading-text"
            >Пожалуйста, подождите</span
          >
          <img
            src=""
            alt="Preview Image"
            id="previewImage"
            class="drop-zone__preview-image"
            draggable="false"
          />
          <input
            @change="filmFileUploader.setFile($event, film)"
            type="file"
            id="fileInput"
            class="drop-zone__file-input"
            accept="image/*"
          />
        </div>

        <div id="fileDetails" class="upload-area__file-details file-details">
          <h3 class="file-details__title">Загруженный файл</h3>

          <div id="uploadedFile" class="uploaded-file">
            <div id="uploadedFileInfo" class="uploaded-file__info">
              <span class="uploaded-file__name">Project 1</span>
              <span class="uploaded-file__counter">0%</span>
            </div>
          </div>
        </div>
      </div>

      <select class="select-genres" multiple v-model="film.genres">
        <option v-for="genre in genres.value" :key="genre.name" :value="genre">
          {{ genre.name }}
        </option>
      </select>
    </div>
    <div class="base-form__row">
      <div class="base-form__input base-form__input--date">
        <input
          type="date"
          min="2022-01-01"
          max="2050-12-31"
          id="startDate"
          v-model="film.startDate"
        />
        <label for="startDate" class="">Дата начала проката</label>
      </div>
      <div class="base-form__input base-form__input--date">
        <input
          type="date"
          min="2022-01-01"
          max="2050-12-31"
          id="endDate"
          v-model="film.endDate"
        />
        <label for="endDate" class="">Дата окончания проката</label>
      </div>
    </div>
    <div class="base-form__row">
      <div class="base-form__input">
        <input type="text" id="basePrice" required v-model="film.basePrice" />
        <label for="basePrice" class="">Базовая стоимость</label>
      </div>
      <div class="base-form__input">
        <input type="text" id="duration" required v-model="film.filmDuration" />
        <label for="duration" class=""
          >Продолжительность фильма, формат: чч:мм:сс</label
        >
      </div>
    </div>
    <div class="base-form__row">
      <div class="base-form__input base-form__input--description">
        <textarea
          id="description"
          ref="descriptionRef"
          @input="resize"
          class="base-form__input--area"
          v-model="film.description"
          placeholder="Введите описание фильма"
        ></textarea>
        <label for="description" class="">Описание фильма</label>
      </div>
      <button class="save-button" @click="createFilm">SAVE FILM</button>
    </div>
    <BaseSnack
      v-if="snackIsVisible"
      :text="textToDisplay"
      :mode="mode"
    ></BaseSnack>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/date-input.scss";
@import "@/assets/styles/file-uploader.scss";
@import "@/assets/styles/base-form.scss";
@import "@/assets/styles/base-button.scss";
form {
  position: relative;
}
.select-genres {
  border-radius: 1.25rem;
  padding: 1rem;
  border: 1px solid #ced4da;
  box-shadow: 0 4px 7px #88b8fe;
  &:focus {
    box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
  }
  &:focus-visible {
    outline: none;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: transparent;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 20px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #88b8fe;
  }

  option {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    &:focus,
    &:checked {
      background-color: rgba(#88b8fe, 0.25);
      color: #000;
      border-radius: 1.25rem;
    }
    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
    }
  }
}

.base-form__input {
  &--description {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  &--date {
    & input {
      height: 100% !important;
    }
  }
  &--area {
    box-shadow: 0 4px 15px #88b8fe;
    min-height: 5rem;
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: transparent;
      border-radius: 4px;
    }

    &::-webkit-scrollbar {
      width: 5px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #88b8fe;
    }
  }
}
.save-button {
  height: 2rem;
  width: 10rem;
  margin: 0 auto;
}
.base-form__row {
  &:first-child {
    grid-template-columns: 1fr;
    justify-items: center;
    h1 {
      font-size: 2rem;
    }
  }
  &:last-child {
    align-items: center;
  }
}
</style>
