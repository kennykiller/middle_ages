<script setup lang="ts">
interface Props {
  success?: Boolean;
}

const props = withDefaults(defineProps<Props>(), {
  success: () => false,
});
</script>

<template>
  <div class="info__wrapper">
    <h2></h2>
  </div>
</template>
