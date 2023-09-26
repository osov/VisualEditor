<template>
    <svg data-testid="connection">
      <path :d="path"></path>
    </svg>
    </template>
    
    <script lang="ts">
    import { defineComponent } from 'vue'
    
    export default defineComponent({
      props: ['data', 'start', 'end', 'path']
    })
    </script>
    
    <style scoped>
     svg {
        overflow: visible !important;
        position: absolute;
        pointer-events: none;
        width: 9999px;
        height: 9999px;
    }
    svg path {
        fill: none;
        stroke-width: 2px;
        pointer-events: auto;
        stroke-dasharray: 1.5em, 0.5em;
        stroke: rgba(255, 255, 255, 0.78)!important;
        animation: 0.4s linear 0s infinite normal none running dash;
        stroke-dashoffset: 2em;
    }

    @keyframes dash {
      100% {
        stroke-dashoffset: 0;
      }
    } 
    </style>
    