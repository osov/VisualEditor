<template>
    <div class="node myNode" :class="{ selected: data.selected }" :style="{ width: width + 'px', height: height + 'px' }" data-testid="node">
      <div class="title" data-testid="title">{{ data.label }}</div>
      <!-- Outputs-->
      <div class="output" v-for="[key, output] in data.outputs2" :key="'output' + key + seed" :data-testid="'output-' + key">
        <div class="output-title" data-testid="output-title">{{ output.label }}</div>
        <Ref class="output-socket" :emit="emit"
          :data="{ type: 'socket', side: 'output', key: key, nodeId: data.id, payload: output.socket }"
          data-testid="output-socket" />
      </div>
      <!-- Controls-->
      <Ref class="control" v-for="[key, control] in controls" :key="'control' + key + seed" :emit="emit"
        :data="{ type: 'control', payload: control }" :data-testid="'control-' + key" />
      <!-- Inputs-->
      <div class="input" v-for="[key, input] in inputs" :key="'input' + key + seed" :data-testid="'input-' + key">
        <Ref class="input-socket" :emit="emit"
          :data="{ type: 'socket', side: 'input', key: key, nodeId: data.id, payload: input.socket }"
          data-testid="input-socket" />
        <div class="input-title" v-show="!input.control || !input.showControl" data-testid="input-title">{{ input.label }}</div>
        <Ref class="input-control" v-show="input.control && input.showControl" :emit="emit"
          :data="{ type: 'control', payload: input.control }" data-testid="input-control" />
      </div>
    <pre>height: {{ height }}</pre>
    </div>
  </template>

<script lang="ts" setup>
  import { 
    // defineComponent, 
    // ref,
    toRefs,
    computed
   } from 'vue'
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
  console.log({props});
  console.log('pd', props.data);  
  
  const {height, width} = toRefs(props.data)

  
  const controls = computed(() => {
    return sortByIndex(Object.entries(props.data.controls))
  })
  const inputs = computed(() => {
    return sortByIndex(Object.entries(props.data.inputs))
  })
  // const outputs = computed(() => {
  //   // return Object.entries(data.outputs)
  //   return sortByIndex(Object.entries(props.data.outputs))
  // })
  // const nodeStyles = computed(() => {
  //   return {
  //     width: Number.isFinite(width.value) ? `${width.value}px` : '',
  //     height: Number.isFinite(height.value) ? `${height.value}px` : ''
  //   }
  // })


</script>

<style>
    .myNode{
        border-top: 3px solid red!important;;
        user-select: none;
    }
    pre{
        color: #fff;
    }
</style>