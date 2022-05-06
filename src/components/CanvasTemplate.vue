<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: "CanvasTemplate",
  props: {
    scroller: {
      type:Object
    }
  },
  setup(props) {
    const canvas = ref(null)

    onMounted((): void => {
      // @ts-ignore
      canvas.value.appendChild(props.scroller.el); // Добавляем в дом лист
    })

    return {
      canvas
    }
  }
})
</script>

<style scoped lang="scss">
.canvas {
  position: absolute;
  height: calc(100% - 184px);
  overflow: hidden;
  top: 184px;
  left: 240px;
  right: 240px;

  .joint-paper {
    border: 1px solid #A0A0A0;
  }
}
</style>
