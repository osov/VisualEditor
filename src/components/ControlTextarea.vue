<template>
  <textarea class="textarea my_scroll" @pointerdown.stop="" @dblclick.stop="" v-model="props.data.text" @change="changeText"></textarea>
</template>

<script lang="ts" setup>

  const props = defineProps(["data"])

  const changeText = (event:any) => {
    props.data.onChange(event.target.value)
  }
</script>

