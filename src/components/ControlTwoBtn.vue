<template>
  <div class="btns">
    <CustomBtn @pointerdown.stop="" @dblclick.stop="" @click="data.onClick1">{{
      data.label1
    }}</CustomBtn>
    <CustomBtn @pointerdown.stop="" @dblclick.stop="" @click="data.onClick2">{{
      data.label2
    }}</CustomBtn>
  </div>
</template>

<script lang="ts">
import { Button } from "ant-design-vue"

export default {
    name: "CustomTwoBtn",
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
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}
.btns button {
  margin: 0 5px;
  border: 1px solid var(--nodeChildrenBorderColor);
  background: var(--nodeChildrenBg);
  color: var(--nodeChildrenColor);
}
</style>
