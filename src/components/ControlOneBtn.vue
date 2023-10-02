<template>
  <div class="flex">
    <CustomBtn @pointerdown.stop="" @dblclick.stop="" @click="data.onClick">{{
      data.label
    }}</CustomBtn>
  </div>
</template>

<script lang="ts">
import { Button } from "ant-design-vue"

export default {
    name: "CustomOneBtn",
  props: ["data"],
  created() {
   // console.log(this.data)
  },
  components: {
    CustomBtn: Button
  }
}
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
  border: 1px solid var(--nodeChildrenBorderColor);
  background: var(--nodeChildrenBg);
  color: var(--nodeChildrenColor);
}
</style>
