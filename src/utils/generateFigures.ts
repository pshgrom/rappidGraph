import * as joint from 'jointjs'
import {event} from "quasar";
window.joint = joint;

export const generateMainBlock = (cordX: number, cordY: number, nameFigure: string) => {
  return new joint.shapes.basic.Rect({
    position: { x: cordX, y: cordY },
    size: { width: 300, height: 200 },
    attrs: { rect: { fill: '#c5c1c1' }, text: { text: nameFigure }}
  })
}

// export const generateRect = (settings: { positionX: number; positionY: number; positionName?: string; magnet?: string; text?: string }) => {
//   return new joint.shapes.basic.Rect({
//     position: { x: settings.positionX, y: settings.positionY },
//     size: { width: 280, height: 30 },
//     attrs: { rect: { fill: '#fff' }, text: { text: settings.text }},
//     ports: {
//       items: [{
//         id: 'out-port',
//         group: 'out'
//       }],
//       groups: {
//         out: {
//           markup: [{
//             tagName: 'circle',
//             selector: 'portBody'
//           }],
//           position: {
//             name: settings.positionName
//           },
//           attrs: {
//             portBody: {
//               r: 4,
//               magnet: settings.magnet,
//               fill: '#c3c3c3',
//               stroke: '#000'
//             }
//           }
//         }
//       }
//     }
//   })
// }

export const generateRectNew = (settings: {positionName?: string; magnet?: string; text?: string; fill: string }) => {
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
