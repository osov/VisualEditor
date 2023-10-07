<template>
    <div class="node" :class="{ selected: data.selected, node__module: data.label == 'Module'}" :style="{ width: data.width + 'px', height: data.height + 'px' }" data-testid="node" :data-label="data.label">

      <div class="title node__title" :class="[data.nodeTitle.type]" :data-label="data.label" data-testid="title">
        <span>{{ data.nodeTitle.ru }}</span>
        <span v-if="data.nodeTitle.module" class="node__module-span">{{ data.nodeTitle.module }}</span>
      </div>

      <template v-if="data.outputs2">
        <!-- Outputs 2 for reactive outputs -->
        <div class="output" v-for="[key, output] in data.outputs2" :key="'output' + key + seed" :data-testid="'output-' + key">
          <div class="output-title" data-testid="output-title">{{ output.label }}</div>
          <Ref class="output-socket" :emit="emit"
          :data="{ type: 'socket', side: 'output', key: key, nodeId: data.id, payload: output.socket }"
          data-testid="output-socket" />
        </div>
      </template>
      <template v-else>
        <!-- Outputs-->
        <div class="output" v-for="[key, output] in outputs" :key="'output' + key + seed" :data-testid="'output-' + key">
          <div class="output-title" data-testid="output-title">{{ output.label }}</div>
          <Ref class="output-socket" :emit="emit"
            :data="{ type: 'socket', side: 'output', key: key, nodeId: data.id, payload: output.socket }"
            data-testid="output-socket" />
        </div>
      </template>

      <!-- Controls-->
      <Ref class="control" v-for="[key, control] in controls" :key="'control' + key + seed" :emit="emit"
        :data="{ type: 'control', payload: control }" :data-testid="'control-' + key" />

      <template v-if="data.answers">
      <!-- answers -->
        <div class="answers" :class="{leftInput: data.inputs2}">
          <input v-for="(item, key) in data.answers" type="text" class="input" :data-item="item" v-model="data.answers[key]" >
        </div>
      </template>

      
      <template v-if="data.inputs2">
        <!-- Inputs2 for reactive -->
        <div class="wr_input">
          <div class="input input2" v-for="[key, input] in data.inputs2" :key="'input' + key + seed" :data-testid="'input-' + key">
            <Ref class="input-socket" :emit="emit"
            :data="{ type: 'socket', side: 'input', key: key, nodeId: data.id, payload: input.socket }"
            data-testid="input-socket" />
            <div class="input-title" v-show="!input.control || !input.showControl" data-testid="input-title">{{ input.label }}</div>
            <Ref class="input-control" v-show="input.control && input.showControl" :emit="emit"
            :data="{ type: 'control', payload: input.control }" data-testid="input-control" />
          </div>
        </div>
      </template>

      <!-- Inputs-->
      <div class="input input1" v-for="[key, input] in inputs" :key="'input' + key + seed" :data-testid="'input-' + key">
        <Ref class="input-socket" :emit="emit"
        :data="{ type: 'socket', side: 'input', key: key, nodeId: data.id, payload: input.socket }"
        data-testid="input-socket" />
        <div class="input-title" v-show="!input.control || !input.showControl" data-testid="input-title">{{ input.label }}</div>
        <Ref class="input-control" v-show="input.control && input.showControl" :emit="emit"
        :data="{ type: 'control', payload: input.control }" data-testid="input-control" />
      </div>
      
    </div>
  </template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Ref } from 'rete-vue-plugin'

  function sortByIndex(entries:any) {
    entries.sort((a:any, b:any) => {
      const ai = a[1] && a[1].index || 0
      const bi = b[1] && b[1].index || 0

      return ai - bi
    })
    return entries
  }

  const props = defineProps(["data", "emit", "seed"])

  const controls = computed(() => {
    return sortByIndex(Object.entries(props.data.controls))
  })
  const inputs = computed(() => {
    return sortByIndex(Object.entries(props.data.inputs))
  })
  const outputs = computed(() => {
    // return Object.entries(data.outputs)
    return sortByIndex(Object.entries(props.data.outputs))
  })


</script>

<style>
.node[data-testid]{
  box-shadow: rgba(0, 0, 0, 0.3) 0px 5px 5px 1px;
  border: 1px solid #000;
  border-radius: 20px ;
  background-color: var(--nodeBg);
  display: flex;
  flex-direction: column;
}
.node[data-testid]:hover{
   border: 1px dashed #12ffa5;
  background-color: var(--nodeBg)!important; 
}
.node[data-testid]::after{
  content: '';
  display: block;
  position: absolute;
  inset: 0px;
  border-top: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: inherit;
  background: linear-gradient(rgba(255, 255, 255, 0.25) 0px, rgba(255, 255, 255, 0.21) 3px, rgba(255, 255, 255, 0.14) 6px, rgba(255, 255, 255, 0.1) 9px, rgba(255, 255, 255, 0.1) 13px, transparent 13px);
  z-index: -1;
  /* display: none!important; */
}
.node[data-testid].selected[data-testid]{
  border: 1px dashed #12ffa5;
}



.answers input,
.node.node__module .node__title input,
.node[data-testid] .control[data-testid] input,
.node[data-testid] .input-control[data-testid] input{
  border-radius: 1em;
  overflow: hidden;
  border: 1px solid var(--nodeChildrenBorderColor);
  background: var(--nodeChildrenBg);
  color: var(--nodeChildrenColor);
}
.node[data-testid] .input-socket[data-testid] {
  margin-left: 0;
  display: inline-block;
}
.node[data-testid] .output-socket[data-testid] {
  margin-right: 0;
  display: inline-block;
}
.node[data-testid] .input[data-testid] {
  display: flex;
  align-items: center;
  text-align: left;
}
.node[data-testid] .input[data-testid] .input-title[data-testid]{
  display: inline-block!important;
  margin-left: 0;
  margin-right: 0;
}
.node[data-testid] .output[data-testid] {
  text-align: right;
}
.node[data-testid] input {
  max-width: 100%;
}
.node[data-testid] .input-title[data-testid],
.node[data-testid] .output-title[data-testid] {
  vertical-align: middle;
  color: white;
  display: inline-block;
  font-family: sans-serif;
  font-size: 14px;
  margin: 6px;
  line-height: 24px;
}
.node[data-testid] .input-control[data-testid] {
  max-width: 100%;
  padding: 0 5px;
  display: inline-block;
  width: auto;
}
.node[data-testid] .socket {
  border: 2px solid var(--nodeChildrenBorderColor);
  background: var(--nodeChildrenBg);
  color: var(--nodeChildrenColor);
}
.node[data-testid] .socket:hover {
  border-color: var(--nodeChildrenColor);
}

.node__title{
  color: white;
  font-size: 18px;
  text-align: center;
  padding: 5px 0;
  user-select: none;
  /* white-space: nowrap; */
  /* overflow: hidden;
  text-overflow: ellipsis; */
}
.node__title.green {
  /* background: radial-gradient(50% 90%, rgba(48, 180, 36, 0.62) 0%, transparent 80%); */
  background: linear-gradient(to right, transparent 0%, rgba(48, 180, 36, 0.62) 50%, transparent 100%);
}
.node__title.blue {
  /* background: radial-gradient(50% 90%, rgba(63, 128, 195, 0.62) 0%, transparent 80%); */
  background: linear-gradient(to right, transparent 0%, rgba(63, 128, 195, 0.62) 50%, transparent 100%);
}
.node__title.red {
  /* background: radial-gradient(50% 90%, rgba(180, 36, 36, 0.62) 0%, transparent 80%); */
  background: linear-gradient(to right, transparent 0%, rgba(180, 36, 36, 0.712) 50%, transparent 100%);
}

.node__title.yellow {
  /* background: radial-gradient(50% 90%, rgba(180, 36, 36, 0.62) 0%, transparent 80%); */
  background: linear-gradient(to right, transparent 0%, rgba(249, 181, 38, 0.712) 50%, transparent 100%);
}
.title[data-testid]{
  order: 0;
}
.input[data-testid]{
  order: 1;
}
.control[data-testid]{
  order: 2;
  padding: 5px;
}
.output[data-testid]{
  order: 3;
}

.node[data-testid] .socket[title="action"] {
  /* border: 0;
  width: 20px;
  border-radius: 0px 10px 10px 0px;
  background: #fff; */
  border: none;
  width: 20px;
  border-radius: 0px;
  height: 20px;
  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 25 24' width='20' height='20' stroke='%23fff' stroke-width='1' fill='%238080807d'%3e%3cpath d='M0,0 L10,0 L20,10 L10,20 L0,20 Z'%3e%3c/path%3e%3c/svg%3e");
  /* stroke: white!important;
    fill: rgba(255, 255, 255, 0.28)!important;
    stroke-width: 1px;
    stroke-linejoin: round; */
}

.node[data-testid] .socket[title="action"]:hover{
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 25 24' width='20' height='20' stroke='%23fff' stroke-width='3' fill='%238080807d'%3e%3cpath d='M0,0 L10,0 L20,10 L10,20 L0,20 Z'%3e%3c/path%3e%3c/svg%3e");
}

.node[data-testid] .socket[title="string"]{
	background: #ffffff;
}

.node[data-testid] .socket[title="number"]{
	background: #3dd13f;
  /*background: #d33396;*/
}

.node[data-testid] .socket[title="boolean"]{
	background: #220dff;
}

.node[data-testid] .socket[title="any"]{
	background: #ff9999;
}

.node[data-testid] .socket[title="color"]{
  background: #b4e13b;
}


.node[data-label="Module"] .node__title{
  display: flex;
  flex-direction: column;
}
.node__module-span{
  font-size: 14px;
  margin-top: 3px;
  opacity: 0.9;
}
.node[data-label="Module"] .control{
  order: 1;
}

.node[data-label="Boolean"] input[type="checkbox"]{
  /* width: 20px;
  height: 20px; */
  background-color: #3dd13f!important;
}

.node[data-label="FlowBlock"] [data-testid="control-Checkbox"]{
  position: relative;
  margin-top: -25px;
  top: 29px;
  width: calc(100% - 36px);
  padding: 0 0 0 5px;
  white-space: nowrap;
}

.node[data-label="Dialog"] .textarea {
  max-height: 100px;
  min-height: 100px;
}
.node[data-label="Dialog"] .textarea.my_scroll::-webkit-resizer {
  background-color: transparent;
}
.control[data-testid="control-Textarea"] {
  padding: 10px 18px 10px 10px;
}
.answers{
  order: 2;
  position: relative;
  height: 0px;
  padding: 0px 10px 0;
  margin-top: 5px;
  top: 5px;
}
.answers .input{
  padding: 0 5px;
  height: 20px;
  margin-bottom: 10px;
  width: calc(100% - 40px);
}
.answers.leftInput .input{
  width: calc(100% - 70px);
  margin-left: 30px;
}
.node[data-label="Dialog"] .wr_input{
  order: 2;
  height: 0;
}
.node[data-label="Dialog"] .input1{
  order: 1;
}
.node[data-label="Dialog"] .input2[data-testid="input-in"],
.node[data-label="Dialog"] .input1[data-testid]:not([data-testid="input-in"]){
  display: none;
}
.node[data-label="Dialog"] .input2 .socket{
  border-radius: 50%;
  margin: 4px 0 4px 6px;
}
.node[data-label="Dialog"] .output{
  width: calc(100% - 40px);
  margin-left: auto;
}
</style>