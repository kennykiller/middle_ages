<script setup lang="ts">
import { Discount, DiscountResponse } from "@/interfaces/models";
import { SnackType } from "@/interfaces/types";
import { FileUploader } from "../../utils/fileUpload";
import { axiosInstance as axios } from "../../utils/axios";
import { reactive, ref, onMounted, computed, Ref } from "vue";
import BaseSnack from "../UI/BaseSnack.vue";

let discountFileUploader = new FileUploader();

let discount: Discount = reactive({
  name: "",
  ageRestriction: "",
  posterUrl: "",
  description: "",
  discountPercentage: 0,
});

const successText = "Фильм успешно добавлен";
const failureText = "Проблема при сохранении фильма";
const textToDisplay = computed(() =>
  mode.value === "error" ? failureText : successText
);
let mode: Ref<SnackType> = ref("error");
let snackIsVisible = ref(false);

const discountDescriptionRef = ref<HTMLElement | null>(null);

onMounted(() => {
  discountDescriptionRef.value?.focus();
});

const resize = () => {
  if (discountDescriptionRef.value) {
    discountDescriptionRef.value.style.height = "1rem";
    discountDescriptionRef.value.style.height =
      discountDescriptionRef.value.scrollHeight + "px";
  }
};

async function createDiscount() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  const formData = new FormData();
  formData.append("name", discount.name);
  formData.append("ageRestriction", discount.ageRestriction);
  formData.append("posterUrl", discount.posterUrl);
  formData.append("description", discount.description);
  formData.append("discountPercentage", String(discount.discountPercentage));
  try {
    const res: DiscountResponse = await axios.post(
      "http://localhost:3000/admin/discount",
      formData,
      {
        headers,
      }
    );
    mode.value = res.data?.createdDiscount?.id ? "success" : "error";
    snackIsVisible.value = true;
    setTimeout(() => (snackIsVisible.value = false), 4000);
  } catch (e) {
    mode.value = "error";
    snackIsVisible.value = true;
    setTimeout(() => (snackIsVisible.value = false), 4000);
    console.log(e);
  }
}
</script>

<template>
  <form class="base-form" @submit.prevent>
    <div class="base-form__row">
      <h1>Добавление акции</h1>
    </div>
    <div class="base-form__row">
      <div class="base-form__input">
        <input type="text" id="name" required v-model="discount.name" />
        <label for="name" class="">Название акции</label>
      </div>
      <div class="base-form__input">
        <input
          type="text"
          id="ageRestriction"
          required
          v-model="discount.ageRestriction"
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
                discountFileUploader.getTooltipData()
              }}</span>
            </strong>
          </p>
        </div>

        <div
          @click="discountFileUploader.chooseFile"
          @dragover="discountFileUploader.dragOver"
          @dragleave="discountFileUploader.dragLeave"
          @drop="discountFileUploader.drop($event, discount)"
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
            @change="discountFileUploader.setFile($event, discount)"
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
      <button class="save-button" @click="createDiscount">SAVE DISCOUNT</button>
    </div>
    <div class="base-form__row"></div>
    <div class="base-form__row">
      <div class="base-form__input base-form__input--description">
        <textarea
          ref="discountDescriptionRef"
          @input="resize"
          class="base-form__input--area"
          v-model="discount.description"
          placeholder="Введите описание скидки"
        ></textarea>
        <label for="description" class="">Описание скидки</label>
      </div>
      <div class="base-form__input">
        <input type="number" v-model="discount.discountPercentage" />
        <label for="endDate" class="">Процент скидки</label>
      </div>
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
}
</style>
