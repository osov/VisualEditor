<template>
  <div class="btns">
    <button class="btn" @pointerdown.stop="" @dblclick.stop="" @click="props.data.onClick1">{{ props.data.label1 }}</button>
    <button class="btn" @pointerdown.stop="" @dblclick.stop="" @click="props.data.onClick2">{{ props.data.label2 }}</button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["data"])
</script>

<style scoped>
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}
.btns button {
  margin: 0 5px;
}
</style>
