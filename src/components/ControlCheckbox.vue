<template>
  <div class="wr_checkbox">
    <span v-if="props.data.blockColor" class="blockColor" :class="{active: props.data.active}"></span>
    <span v-if="props.data.hideCheckBox" class="blockTitle" >Состояние</span>
    <div v-if="!props.data.hideCheckBox" class="checkbox" :class="{active: props.data.active}" @pointerdown.stop="" @dblclick.stop="" @click="props.data.onClick">
      <span class="checkbox__false">{{ props.data.textFalse }}</span>
      <span class="checkbox__true">{{ props.data.textTrue }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps(["data"])
</script>


<style scoped>
.wr_checkbox{
  text-align: center;
}
.checkbox{
  color: #fff;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 5px 3px 3px 30px;
  display: inline-block;
  min-width: 80px;
  text-align: left;
}
.checkbox::before,
.checkbox::after{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.checkbox::before{
  left: 0;
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  border: 1px solid var(--nodeChildrenBorderColor);
  background-color: var(--nodeChildrenBg);
  border-radius: 3px;
}
.checkbox.active::before{
  border-color: #fff;
}
.checkbox.active::after{
  left: 6px;
  display: block;
  content: '\2713';
  color: #fff;
}
.checkbox:not(.active) .checkbox__true,
.checkbox.active .checkbox__false{
  display: none;
}
.blockColor{
  display: inline-block;
  width: 22px;
  height: 22px;
  background-color: rgba(180, 36, 36, 0.9);
  margin-right: 7px;
  border-radius: 3px;
  position: relative;
  top: 5px;
}
.blockColor.active{
  background-color: rgba(48, 180, 36, 0.9);
}

.blockTitle{
  color:#fff;
}

</style>
