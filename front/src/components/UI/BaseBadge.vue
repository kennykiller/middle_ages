<script setup lang="ts">
interface Props {
  text: string;
  popover?: boolean;
  popoverText?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="badge__wrapper">
    <button>
      <span>{{ props.text }}</span>
    </button>
    <div v-if="props.popover" class="badge__popover">
        {{ props.popoverText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.badge__wrapper {
  position: relative;
  width: auto;
  display: block;
  border: 1px solid #ced4da;
  background-color: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 15px #88b8fe;
  &:hover,
  &:active {
    color: #88b8fe;
    border-color: #88b8fe;
    box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
  }
  &:hover .badge__popover {
      opacity: 1;
  }
  button {
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
    span {
      font-size: 1.5rem;
    }
  }
}
.badge__popover {
    position: absolute;
    opacity: 0;
    width: 8rem;
    top: calc(100% + 1rem);
    left: 50%;
    transition: opacity .5s ease;
    transform: translateX(-50%);
    padding: 0.5rem;
    pointer-events: none;
    background: #fff;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    color: #88b8fe;
    border: 1px solid #88b8fe;
    box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
}
</style>
