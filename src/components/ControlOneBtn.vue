<template>
  <div class="flex">
    <button class="btn" @pointerdown.stop="" @dblclick.stop="" @click="props.data.onClick">{{ props.data.label }}</button>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps(["data"])
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}
.flex button {
  margin: 0 5px;
}
</style>
