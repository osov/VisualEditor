<template>
  <div class="wr_select">
    <select class="select" name="" id="" @pointerdown.stop="" @dblclick.stop="" @change="changeOption" @click="clickOption" v-model="props.data.selected">
      <option disabled :selected="props.data.selected === -1" hidden>Выбрать</option>
      <option v-for="option in props.data.optionList" :key="option.val" :value="option.val" :selected="option.val == props.data.selected">
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

  const clickOption = (_:any) => {
    if (props.data.onClick)
      props.data.onClick()
  }
</script>


<style scoped>
.wr_select {
    text-align: right;
  }
.select{
  width: auto;
  min-width: 170px;
  display: inline-block;
}
</style>
