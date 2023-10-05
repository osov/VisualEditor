<template>
  <div class="wr_select">
    <select class="select" name="" id="" @pointerdown.stop="" @dblclick.stop="" @change="changeOption" v-model="props.data.selected">
      <option disabled :selected="props.data.selected === -1" hidden>Выбрать</option>
      <option v-for="option in props.data.optionList" :key="option.val" :value="option.val - 1" :selected="option.val - 1 === props.data.selected">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>

  const props = defineProps(["data"])

  const changeOption = (event:any) => {
    props.data.onChange(event.target.value)
  }
</script>


<style scoped>
.wr_select {
    text-align: right;
  }
.select{
  width: auto;
  display: inline-block;
}
</style>
