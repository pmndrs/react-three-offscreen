import * as THREE from 'three'
import mitt from 'mitt'
import { extend, createRoot, ReconcilerRoot, Dpr, Size } from '@react-three/fiber'
import { createPointerEvents } from './events'

export function render(children: React.ReactNode) {
  extend(THREE)

  let root: ReconcilerRoot<HTMLCanvasElement>
  let dpr: Dpr = [1, 2]
  let size: Size = { width: 0, height: 0, top: 0, left: 0, updateStyle: false }
  const emitter = mitt()

  const handleInit = (payload: any) => {
    const { props, drawingSurface: canvas, width, top, left, height, pixelRatio } = payload
    try {
      // Shim the canvas into a fake window/document
      Object.assign(canvas, {
        pageXOffset: left,
        pageYOffset: top,
        clientLeft: left,
        clientTop: top,
        clientWidth: width,
        clientHeight: height,
        style: { touchAction: 'none' },
        ownerDocument: canvas,
        documentElement: canvas,
        getBoundingClientRect() {
          return size
        },
        setAttribute() {},
        setPointerCapture() {},
        releasePointerCapture() {},
        addEventListener(event: string, callback: () => void) {
          emitter.on(event, callback)
        },
        removeEventListener(event: string, callback: () => void) {
          emitter.off(event, callback)
        },
      })
      // Create react-three-fiber root
      root = createRoot(canvas)
      // Configure root
      root.configure({
        events: createPointerEvents(emitter),
        size: (size = { width, height, top, left, updateStyle: false }),
        dpr: (dpr = Math.min(Math.max(1, pixelRatio), 2)),
        ...props,
      })
      // Render children once
      root.render(children)
    } catch (e: any) {
      postMessage({ type: 'error', payload: e?.message })
    }

    // Shim window to the canvas from here on
    self.window = canvas
  }

  const handleResize = ({ width, height, top, left }: Size) => {
    if (!root) return
    root.configure({ size: (size = { width, height, top, left, updateStyle: false }), dpr })
  }

  const handleEvents = (payload: any) => {
    emitter.emit(payload.eventName, { ...payload, preventDefault() {}, stopPropagation() {} })
  }

  const handleProps = (payload: any) => {
    if (!root) return
    if (payload.dpr) dpr = payload.dpr
    root.configure({ size, dpr, ...payload })
  }

  const handlerMap = {
    resize: handleResize,
    init: handleInit,
    dom_events: handleEvents,
    props: handleProps,
  }

  self.onmessage = (event) => {
    const { type, payload } = event.data
    const handler = handlerMap[type as keyof typeof handlerMap]
    if (handler) handler(payload)
  }

  // Shims for web offscreen canvas
  // @ts-ignore
  self.window = {}
  // @ts-ignore
  self.document = {}
  // @ts-ignore
  self.Image = class {
    height = 1
    width = 1
    set onload (callback: any) {
      callback(true)
    }
  }
}
