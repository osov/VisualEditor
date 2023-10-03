<template>
  <div class="myCheckbox" :class="{active: props.data.active}" @click="props.data.onClick">{{ props.data.text }}</div>
</template>

<script lang="ts" setup>
  const props = defineProps(["data"])
</script>

<style scoped>
.myCheckbox {
  padding: 4px 0;
  color: #fff;
  cursor: pointer;
}
.myCheckbox.active{
  font-size: 20px;
  color: green;
}

.myCheckbox:hover{
  color: red;
}
</style>
