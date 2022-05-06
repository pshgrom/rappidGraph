<template>
  <div class="stencil-container" ref="stencilContainer"></div>
  <div class="toolbar-container" ref="toolbarContainer"></div>
  <div class="canvas" ref="canvas"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { dia, ui, shapes, elementTools } from '@clientio/rappid';
import * as joint from 'jointjs'
import {generateMainBlock, generateRectNew} from "@/utils/generateFigures";
import _ from 'underscore';

window.joint = joint;

@Options({})
export default class App extends Vue {
  declare public $refs: {
    canvas: HTMLDivElement;
    stencilContainer: HTMLDivElement;
    toolbarContainer: HTMLDivElement;
  }

  private graph: dia.Graph;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;
  private stencil: ui.Stencil;
  private toolbar: ui.Toolbar;

  public created(): void {
    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes }); // Создаем граф

    const paper = this.paper = new dia.Paper({ // Создаем полотно с настройками
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

    const scroller = this.scroller = new ui.PaperScroller({ // Настройки управления над полотном
      paper,
      cursor: 'grab'
    });
    scroller.render();

    const toolbar = this.toolbar = new ui.Toolbar({ // Создаем шапку
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
        paperScroller: scroller
      }
    });
    toolbar.render();

    const stencil = this.stencil = new ui.Stencil({ // Создаем сайдбар с аккордеоном
      paper: scroller,
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

    const saveGraph = () => {
      const jsonGraph = JSON.stringify(graph)
      localStorage.setItem('figureSettings', jsonGraph)
    }

    const removeTools = new dia.ToolsView({
      tools: [
        new elementTools.Remove({
          useModelGeometry: true,
          action: (_evt, view) => {
            view.model.remove()
            saveGraph()
          }
        })
      ]
    });

    //Events
    stencil.on('element:dragend', (cloneView, evt, cloneArea) => { // При перемещении нового элемента на лист делаем под него родятеля и сейвим
      const {x, y} = cloneArea
      const mainBlock2 = generateMainBlock(x, y, 'test')
      graph.addCells([mainBlock2]);
      saveGraph()
    });

    graph.on('change:position', (cell) => { // запрещает выход элементов за родительский блок
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

    toolbar.on({ // Удаляем все элементы с полотна
      'clear:pointerclick': graph.clear.bind(graph)
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
  }

  public mounted(): void {
    const { scroller, paper, stencil, toolbar, $refs : { canvas, stencilContainer, toolbarContainer } } = this;

    canvas.appendChild(this.scroller.el); // Добавляем в дом лист
    stencilContainer.appendChild(this.stencil.el); // Добалвляем в дом сайдбар
    toolbarContainer.appendChild(this.toolbar.el); // Добалвляем в дом тулбар
    scroller.center(); // Центрируем полотно
    paper.unfreeze(); // Размораживаем полотно

    stencil.setTheme('dark'); // ставим тёмную тему
    toolbar.setTheme('dark'); // ставим тёмную тему

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
}
</script>

<style lang="scss">
@import "~@clientio/rappid/rappid.css";

body {
  height: 100vh;
  box-sizing: border-box;
  margin: 0;

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
}

.stencil-container {
  position: absolute;
  left: 0;
  top: 138px;
  bottom: 0;
  width: 240px;
}

.toolbar-container {
  position: absolute;
  height: 50px;
  left: 240px;
  right: 0;
  top: 138px;
}
</style>
