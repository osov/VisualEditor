<template>
    <div class="node myNode" :class="{ selected: data.selected }" :style="nodeStyles" data-testid="node">
      <div class="title" data-testid="title">{{ data.label }}</div>
      <!-- Outputs-->
      <div class="output" v-for="[key, output] in outputs" :key="'output' + key + seed" :data-testid="'output-' + key">
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
    <ul >
        <li v-for="item in list"> {{ item[1].label }}</li>
    </ul>
    <!-- <pre>{{ list }}</pre> -->
    <button class="btn2" @click="myClick">button</button>
    <pre>{{ counter }}</pre>
    </div>
  </template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Ref } from 'rete-vue-plugin'

function sortByIndex(entries:any) {
  entries.sort((a:any, b:any) => {
    const ai = a[1] && a[1].index || 0
    const bi = b[1] && b[1].index || 0

    return ai - bi
  })
  return entries
}



export default defineComponent({
  props: ['data', 'emit', 'seed'],
  data() {
    return {
        counter: 10
    }
  },
  methods: {
    myClick(){
      console.log('click..');
      this.counter += 10
    },
    onRef(element:any, key:any, entity:any, type:any) {
      if (!element) return

      if (['output', 'input'].includes(type)) {
        this.emit({
          type: 'render', data: {
            type: 'socket',
            side: type,
            key,
            nodeId: this.data.id,
            element,
            payload: entity.socket
          }
        })
      } else if (type === 'control') {
        this.emit({
          type: 'render', data: {
            type: 'control',
            element,
            payload: entity
          }
        })
      }
    }
  },
  computed: {
    nodeStyles() {
      console.log({w: this.data.width, h: this.data.height});
      
      return {
        width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
        height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
      }
    },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs))
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls))
    },
    outputs() {
    //   return sortByIndex(Object.entries(this.data.outputs))
      return Object.entries(this.data.outputs)
    },
    list() {
        console.table(this.data.list)
        console.table(Object.entries(this.data.list))
      return sortByIndex(Object.entries(this.data.list))
    
    //   return this.data.list.reverse()
    }
  },
  components: {
    Ref
  }
})
</script>

<style>
    .myNode{
        border-top: 3px solid red!important;;
        user-select: none;
    }
    ul{
        color: #fff;
        list-style: none;
        order: 5;
    }
    li{line-height: 1.4;}
    pre{
        color: #fff;
    }
    .btn2:hover{
        color: green;
    }
    .btn2{
        /* border: 1px solid red; */
        font-size: 30px;
        /* color: #fff; */
        /* order: 6; */
        cursor: pointer;
        width: 150px;
        margin: 0 auto;
    }
</style>