<script setup lang="ts">
import { FileUploader } from "@/utils/fileUpload";
import { Film } from "@/interfaces/models";

interface Props {
  film: Film;
  order: 1 | 2;
}
const fileUploader = new FileUploader();

const props = defineProps<Props>()

</script>

<template>
  <div :id="'uploadArea' + order" :class="'upload-area' + order">
    <div :class="'upload-area__header' + order">
      <h1 :class="'upload-area__title' + order">Загрузите Ваш файл</h1>
      <p :class="'upload-area__paragraph' + order">
        Файл должен быть изображением
        <br />
        <strong :class="'upload-area__tooltip' + order">
          Следующих форматов
          <span :class="'upload-area__tooltip-data' + order">{{
            fileUploader.getTooltipData()
          }}</span>
        </strong>
      </p>
    </div>

    <div
      @click="fileUploader.chooseFile(order)"
      @dragover="fileUploader.dragOver($event, order)"
      @dragleave="fileUploader.dragLeave($event, order)"
      @drop="fileUploader.drop($event, film, order)"
      :id="'dropZone' + order"
      :class="`upload-area__drop-zone${order} drop-zone${order}`"
    >
      <p :class="'drop-zone__paragraph' + order">
        Перетащите свое изображение или щелкните для выбора
      </p>
      <span :id="'loadingText' + order" :class="'drop-zone__loading-text' + order"
        >Пожалуйста, подождите</span
      >
      <img
        src=""
        alt="Preview Image"
        :id="'previewImage' + order"
        :class="'drop-zone__preview-image' + order"
        draggable="false"
      />
      <input
        @change="fileUploader.setFile($event, film, order)"
        type="file"
        :id="'fileInput' + order"
        :class="'drop-zone__file-input' + order"
        accept="image/*"
      />
    </div>

    <div :id="'fileDetails' + order" :class="`upload-area__file-details${order} file-details${order}`">
      <h3 :class="'file-details__title' + order">Загруженный файл</h3>

      <div :id="'uploadedFile' + order" :class="'uploaded-file' + order">
        <div :id="'uploadedFileInfo' + order" :class="'uploaded-file__info' + order">
          <span :class="'uploaded-file__name' + order">Project 1</span>
          <span :class="'uploaded-file__counter' + order">0%</span>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
@import "@/assets/styles/file-uploader.scss";
</style>