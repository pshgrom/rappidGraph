<template>
  <div class="toolbar-container" ref="toolbarContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ui } from "@clientio/rappid/index";

export default defineComponent({
  name: "Toolbar",
  props: {
    scroller: {
      type:Object
    },
    graph: {
      type:Object
    }
  },
  setup(props) {
    const toolbarContainer = ref(null)
    const toolbar = new ui.Toolbar({ // Создаем шапку
      groups: {
        clear: { index: 1 },
        zoom: { index: 2 }
      },
      tools: [
        { type: 'button', name: 'clear', group: 'clear', text: 'Clear Diagram' },
        { type: 'zoom-out', name: 'zoom-out', group: 'zoom' },
        { type: 'zoom-in', name: 'zoom-in', group: 'zoom' }
      ],
      references: {
        paperScroller: props.scroller ?? {}
      }
    });
    toolbar.render();

    toolbar.on({ // Удаляем все элементы с полотна
      // @ts-ignore
      'clear:pointerclick': props.graph.clear.bind(props.graph)
    });

    onMounted((): void => {
      // @ts-ignore
      toolbarContainer.value.appendChild(toolbar.el); // Добавляем в дом тулбар
      toolbar.setTheme('dark'); // ставим тёмную тему
    })

    return {
      toolbarContainer
    }
  }
})
</script>

<style scoped lang="scss">
.toolbar-container {
  position: absolute;
  height: 50px;
  left: 240px;
  right: 0;
  top: 138px;
}
</style>
