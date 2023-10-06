<template>
  <div class="user">
    <img v-if="props.data.currentUser != ''" class="user__avatar" :src="props.data.userList[props.data.currentUser].ava" alt="">
    <div class="user__info">
      <div class="user__name">Персонаж:</div>
      <select class="user__list select" name="" id="" @pointerdown.stop="" @dblclick.stop="" @change="changeOption" v-model="props.data.currentUser">
        <option disabled :selected="props.data.currentUser == ''" hidden>Выбрать персонажа</option>
        <option v-for="option in props.data.userList" :key="option.id" :value="option.id" :selected="option.id == props.data.currentUser">
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps(["data"])

  const changeOption = (event:any) => {
    props.data.onChange(event.target.value)
  }
</script>


<style scoped>
.user{
  color: #fff;
  display: flex;
  gap: 15px;
}
.user__avatar{
  max-width: 100px;
  max-height: 100px;
  width: 100px;
  height: 100px;
}
.user__info{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
}
.user__name{
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
}
.user__list{
  width: 100%;
  max-width: 100%;
}
.user__list option{
  font-size: 16px;
}

</style>
