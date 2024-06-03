import React, { useEffect, useRef } from 'react'
import useMeasure, { Options as ResizeOptions } from 'react-use-measure'
import { mergeRefs } from 'react-merge-refs'
import { Canvas as CanvasImpl, RenderProps } from '@react-three/fiber'
import { EVENTS } from './events'

export interface CanvasProps
  extends Omit<RenderProps<HTMLCanvasElement>, 'size'>,
    React.HTMLAttributes<HTMLDivElement> {
  worker: Worker
  fallback?: React.ReactNode
  /**
   * Options to pass to useMeasure.
   * @see https://github.com/pmndrs/react-use-measure#api
   */
  resize?: ResizeOptions
  /** The target where events are being subscribed to, default: the div that wraps canvas */
  eventSource?: HTMLElement | React.MutableRefObject<HTMLElement>
  /** The event prefix that is cast into canvas pointer x/y events, default: "offset" */
  eventPrefix?: 'offset' | 'client' | 'page' | 'layer' | 'screen'
}

function isRefObject<T>(ref: any): ref is React.MutableRefObject<T> {
  return ref && ref.current !== undefined
}

export function Canvas({ eventSource, worker, fallback, style, className, id, ...props }: CanvasProps) {
  const [shouldFallback, setFallback] = React.useState(false)
  const [measureRef, bounds] = useMeasure(props.resize)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const mergedRef = mergeRefs([canvasRef, measureRef])
  const hasTransferredToOffscreen = useRef(false)

  useEffect(() => {
    if (!worker) return

    const canvas = canvasRef.current
    try {
      if (!hasTransferredToOffscreen.current) {
        const offscreen = canvasRef.current.transferControlToOffscreen()
        hasTransferredToOffscreen.current = true
        worker.postMessage(
          {
            type: 'init',
            payload: {
              props,
              drawingSurface: offscreen,
              width: canvas.clientWidth,
              height: canvas.clientHeight,
              top: canvas.offsetTop,
              left: canvas.offsetLeft,
              pixelRatio: window.devicePixelRatio,
            },
          },
          [offscreen]
        )
      }
    } catch (e) {
      // Browser doesn't support offscreen canvas at all
      setFallback(true)
      return
    }

    worker.onmessage = (e) => {
      if (e.data.type === 'error') {
        // Worker failed to initialize
        setFallback(true)
      }
    }

    const currentEventSource = isRefObject(eventSource) ? eventSource.current : eventSource || canvas

    Object.values(EVENTS).forEach(([eventName, passive]) => {
      currentEventSource.addEventListener(
        eventName,
        (event: any) => {
          // Prevent default for all passive events
          if (!passive) event.preventDefault()
          // Capture pointer automatically on pointer down
          if (eventName === 'pointerdown') {
            event.target.setPointerCapture(event.pointerId)
          } else if (eventName === 'pointerup') {
            event.target.releasePointerCapture(event.pointerId)
          }

          worker.postMessage({
            type: 'dom_events',
            payload: {
              eventName,
              deltaX: event.deltaX,
              deltaY: event.deltaY,
              pointerId: event.pointerId,
              pointerType: event.pointerType,
              button: event.button,
              buttons: event.buttons,
              altKey: event.altKey,
              ctrlKey: event.ctrlKey,
              metaKey: event.metaKey,
              shiftKey: event.shiftKey,
              movementX: event.movementX,
              movementY: event.movementY,
              clientX: event.clientX,
              clientY: event.clientY,
              offsetX: event.offsetX,
              offsetY: event.offsetY,
              pageX: event.pageX,
              pageY: event.pageY,
              x: event.x,
              y: event.y,
            },
          })
        },
        { passive }
      )
    })
  }, [worker])

  useEffect(() => {
    worker.postMessage({
      type: 'resize',
      payload: {
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      },
    })
  }, [bounds])

  useEffect(() => {
    if (!worker) return
    worker.postMessage({ type: 'props', payload: props })
  }, [worker, props])

  return shouldFallback ? (
    <CanvasImpl id={id} className={className} style={style} {...props}>
      {fallback}
    </CanvasImpl>
  ) : (
    <canvas
      id={id}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'block', ...style }}
      ref={mergedRef}
    />
  )
}
