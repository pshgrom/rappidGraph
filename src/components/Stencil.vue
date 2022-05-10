<template>
  <div class="stencil-container" ref="stencilContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ui } from "@clientio/rappid/index";
import { generateMainBlock, generateRectNew } from "@/utils/generateFigures";

export default defineComponent({
  name: "Stencil",
  props: {
    scroller: {
      type:Object
    }
  },
  setup(props, {emit}) {
    const stencilContainer = ref(null)
    const stencil = new ui.Stencil({ // Создаем сайдбар с аккордеоном
      // @ts-ignore
      paper: props.scroller ?? {},
      scaleClones: true,
      width: 240,
      height: 100,
      groups: {
        shapesGroup1: { index: 1, label: 'Shapes' },
        shapesGroup2: { index: 2, label: 'Shapes' },
      },
      dropAnimation: { duration: 200, easing: 'swing' },
      layout: true
    });
    stencil.render()

    stencil.on('element:dragend', (cloneView, evt, cloneArea) => { // При перемещении нового элемента на лист делаем под него родятеля и сейвим
      const findCanvas = evt.target.closest('.canvas')
      const svgInCanvas = findCanvas ? findCanvas.querySelector('.joint-paper') : ''
      if (evt.target.tagName === 'svg' && svgInCanvas) {
        const {x, y} = cloneArea
        const mainBlock2 = generateMainBlock(x, y, 'test')
        emit('updateGraph', mainBlock2)
      }
      emit('saveGraph')
    });

    const generateAndRenderRects = (): void => {
      // Генерация фигур в аккордеоне
      const rect = generateRectNew({
        positionName: 'right',
        magnet: 'active',
        text: 'Rect1',
        fill: '#c3c3c3'
      })

      const rect2 = generateRectNew({
        positionName: 'left',
        magnet: 'passive',
        text: 'Rect2',
        fill: '#fff'
      })

      stencil.load({
        shapesGroup1: [rect],
        shapesGroup2: [rect2],
      });
    }

    onMounted((): void => {
      // @ts-ignore
      stencilContainer.value.appendChild(stencil.el); // Добалвляем в дом сайдбар
      stencil.setTheme('dark');

      generateAndRenderRects()
    })

    return {
      stencilContainer
    }
  }
})
</script>

<style scoped lang="scss">
.stencil-container {
  position: absolute;
  left: 0;
  top: 138px;
  bottom: 0;
  width: 240px;
}
</style>
