<template>
  <div class="user">
    <img class="user__avatar" :src="props.data.userList[props.data.currentUser].ava" alt="">
    <div class="user__info">
      <div class="user__name">{{ props.data.userList[props.data.currentUser].name }}</div>
      <select class="user__list" name="" id="" @pointerdown.stop="" @dblclick.stop="" @change="changeOption" v-model="props.data.currentUser">
        <option disabled :selected="props.data.currentUser === -1" hidden>Выбрать персонажа</option>
        <option v-for="option in props.data.userList" :key="option.id" :value="option.id - 1" :selected="option.id - 1 === props.data.currentUser">
          {{ option.name }}
        </option>
      </select>
    </div>
    <!-- <pre>{{ props.data.userList }}</pre> -->
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps(["data"])

  const changeOption = (event:any) => {
    console.log('changeOption', event.target.value);
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
  background-color: var(--nodeChildrenBg);
  color: #fff;
  outline: none;
  border-radius: 3px;
  height: 22px;
  font-size: 14px;
  border: 1px solid var(--nodeChildrenBorderColor);
}
.user__list option{
  font-size: 16px;
}

</style>
