<template>
  <div class="node__title" :class="data.type">{{ data.title }}</div>
</template>

<script lang="ts">

export default {
  name: "TitleNode",
  props: ["data"],
}
</script>

<style>
.node[data-testid] .control[data-testid="control-TitleNode"]{
  order: 0;
  padding: 0 0 5px;
}
</style>

<style scoped>
.node__title{
  color: white;
  font-size: 18px;
  text-align: center;
  white-space: nowrap;
  padding: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node__title.green {
  background: radial-gradient(50% 90%, rgba(48, 180, 36, 0.62) 0%, transparent 80%);
}
.node__title.blue {
  /* background: radial-gradient(50% 90%, rgba(63, 128, 195, 0.62) 0%, transparent 80%); */
  background: linear-gradient(to right, transparent 0%, rgba(63, 128, 195, 0.62) 50%, transparent 100%);
}
.node__title.red {
  /* background: radial-gradient(50% 90%, rgba(180, 36, 36, 0.62) 0%, transparent 80%); */
  background: linear-gradient(to right, transparent 0%, rgba(180, 36, 36, 0.712) 50%, transparent 100%);
}

</style>