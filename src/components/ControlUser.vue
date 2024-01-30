<template>
  <div class="user">
    <img v-if="props.data.ava" class="user__avatar" :src="props.data.ava" alt="" >
    <div class="user__info">
      <div class="user__name">Персонаж:</div>
      <select class="user__list select" name="" id="" @pointerdown.stop="" @dblclick.stop="" @change="changeOption" v-model="props.data.currentUser">
        <option disabled :selected="props.data.currentUser == ''" hidden>Выбрать персонажа</option>
        <option v-for="option in props.data.userList" :key="option.val" :value="option.val" :selected="option.val == props.data.currentUser">
          {{ option.text }}
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
  max-width: 64px;
  max-height: 64px;
  width: 64px;
  height: 64px;
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
