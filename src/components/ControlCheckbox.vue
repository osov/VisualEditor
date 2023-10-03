<template>
  <div>
    <div class="myCheckbox" :class="{active: props.data.active}" @pointerdown.stop="" @dblclick.stop=""  @click="props.data.onClick">
      {{ props.data.text }} class: {{ props.data.active }}
    </div>
    <button @pointerdown.stop="" @dblclick.stop="" @click="props.data.onClick">{{ props.data.text }}</button>
  </div>
</template>

<script lang="ts" setup>
  // import { toRefs } from 'vue'
  // import { Button } from "ant-design-vue"
  const props = defineProps(["data"])

  // const {active, text} = toRefs(props.data)
  // console.log('cc', active, text);
  
</script>
<!-- <script lang="ts">
import { Button } from "ant-design-vue"

export default {
    name: "ControlCheckbox",
  props: ["data"],
  components: {
    CustomBtn: Button
  }
}
</script> -->

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
