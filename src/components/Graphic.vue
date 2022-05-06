<template>
  <stencil
    :scroller="scroller"
    @saveGraph="saveGraph"
    @updateGraph="updateGraph"
  />
  <toolbar
    :scroller="scroller"
    :graph="graph"
  />
  <canvas-template
    :scroller="scroller"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { dia, ui, shapes, elementTools } from '@clientio/rappid';
import * as joint from 'jointjs'
import Stencil from "@/components/Stencil.vue";
import Toolbar from "@/components/Toolbar.vue";
import CanvasTemplate from "@/components/CanvasTemplate.vue";
import _ from 'underscore';
window.joint = joint;

export default defineComponent ({
  name: "Graphic",
  components: {
    Stencil,
    Toolbar,
    CanvasTemplate
  },
  setup() {
    const graph = new dia.Graph({}, { cellNamespace: shapes }); // Создаем граф

    const paper = new dia.Paper({ // Создаем полотно с настройками
      model: graph,
      background: {
        color: '#F8F9FA',
      },
      frozen: true,
      width: 1200,
      height: 600,
      async: true,
      cellViewNamespace: shapes
    });

    const figureSettingJSON = localStorage.getItem('figureSettings') // Забираем все элементы из хранилища
    if (figureSettingJSON) {
      const figureSetting = JSON.parse(figureSettingJSON ?? '')
      graph.fromJSON(figureSetting)
    }

    const removeTools = new dia.ToolsView({
      tools: [
        new elementTools.Remove({
          useModelGeometry: true,
          action: (e, view) => {
            view.model.remove()
            saveGraph()
          }
        })
      ]
    });

    const scroller = new ui.PaperScroller({ // Настройки управления над полотном
      paper,
      cursor: 'grab'
    });
    scroller.render();

    const saveGraph = (): void => {
      const jsonGraph = JSON.stringify(graph)
      localStorage.setItem('figureSettings', jsonGraph)
    }

    const updateGraph = (data: any): void => {
      graph.addCells([data])
    }

    const addSettings = (): void => {
      scroller.center(); // Центрируем полотно
      paper.unfreeze(); // Размораживаем полотно
    }

    graph.on('change:position', (cell) => { // Запрещает выход элементов за родительский блок
      const parentId = cell.get('parent');
      if (!parentId) return;

      const parent = graph.getCell(parentId);
      const parentBbox = parent.getBBox();
      const cellBbox = cell.getBBox();

      if (parentBbox.containsPoint(cellBbox.origin()) &&
          parentBbox.containsPoint(cellBbox.topRight()) &&
          parentBbox.containsPoint(cellBbox.corner()) &&
          parentBbox.containsPoint(cellBbox.bottomLeft())) {
        return;
      }
      cell.set('position', cell.previous('position'));
    });

    paper.on({
      'element:mouseenter': (elementView: any) => {
        elementView.addTools(removeTools);
      },
      'element:mouseleave': (elementView: any) => {
        elementView.removeTools();
      },
      'cell:pointerup': (cellView: any) => {
        const cell = cellView.model;
        const cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());

        if (cellViewsBelow.length) {
          const cellViewBelow = _.find(cellViewsBelow, (c) => { return c.model.id !== cell.id });

          if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) cellViewBelow.model.embed(cell);
        }
        saveGraph()
      }
    });

    onMounted((): void => {
      addSettings()
    })

    return {
      scroller,
      graph,
      saveGraph,
      updateGraph,
    }
  }
})
</script>

<style lang="scss">
@import "~@clientio/rappid/rappid.css";

body {
  height: 100vh;
  box-sizing: border-box;
  margin: 0;
}
</style>
