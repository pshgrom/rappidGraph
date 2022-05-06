import * as joint from 'jointjs'
import generateRectNewTypes from "@/types/generateRectNewTypes";

export const generateMainBlock = (cordX: number, cordY: number, nameFigure: string) => {
  return new joint.shapes.basic.Rect({
    position: {x: cordX, y: cordY},
    size: {width: 300, height: 200},
    attrs: {rect: {fill: '#c5c1c1'}, text: {text: nameFigure}}
  })
}

export const generateRectNew = (settings: generateRectNewTypes) => {
  return {
    type: 'standard.Rectangle',
    size: {width: 100, height: 50},
    attrs: {rect: {fill: '#fff'}, text: {text: settings.text}},
    ports: {
      items: [{
        id: 'out-port',
        group: 'out'
      }],
      groups: {
        out: {
          markup: [{
            tagName: 'circle',
            selector: 'portBody'
          }],
          position: {
            name: settings.positionName
          },
          attrs: {
            portBody: {
              r: 6,
              magnet: settings.magnet,
              fill: settings.fill,
              stroke: '#000'
            }
          }
        }
      }
    }
  }
}
