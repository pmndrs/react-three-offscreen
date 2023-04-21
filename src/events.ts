import { UseBoundStore } from 'zustand'
import { createEvents, RootState, EventManager, Events } from '@react-three/fiber'
import { Emitter } from 'mitt'

export const EVENTS = {
  onClick: ['click', false],
  onContextMenu: ['contextmenu', false],
  onDoubleClick: ['dblclick', false],
  onWheel: ['wheel', true],
  onPointerDown: ['pointerdown', true],
  onPointerUp: ['pointerup', true],
  onPointerLeave: ['pointerleave', true],
  onPointerMove: ['pointermove', true],
  onPointerCancel: ['pointercancel', true],
  onLostPointerCapture: ['lostpointercapture', true],
} as const

export function createPointerEvents(emitter: Emitter<Record<any, unknown>>) {
  return (store: UseBoundStore<RootState>): EventManager<HTMLElement> => {
    const { handlePointer } = createEvents(store)

    return {
      priority: 1,
      enabled: true,
      compute(event, state) {
        // https://github.com/pmndrs/react-three-fiber/pull/782
        // Events trigger outside of canvas when moved, use offsetX/Y by default and allow overrides
        state.pointer.set((event.offsetX / state.size.width) * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1)
        state.raycaster.setFromCamera(state.pointer, state.camera)
      },

      connected: undefined,
      handlers: Object.keys(EVENTS).reduce(
        (acc, key) => ({ ...acc, [key]: handlePointer(key) }),
        {}
      ) as unknown as Events,
      connect: (target) => {
        const { set, events } = store.getState()
        events.disconnect?.()
        set((state) => ({ events: { ...state.events, connected: target } }))
        Object.entries(events?.handlers ?? []).forEach(([name, event]) => {
          const [eventName] = EVENTS[name as keyof typeof EVENTS]
          emitter.on(eventName as any, event as any)
        })
      },
      disconnect: () => {
        const { set, events } = store.getState()
        if (events.connected) {
          Object.entries(events.handlers ?? []).forEach(([name, event]) => {
            const [eventName] = EVENTS[name as keyof typeof EVENTS]
            emitter.off(eventName as any, event as any)
          })
          set((state) => ({ events: { ...state.events, connected: undefined } }))
        }
      },
    }
  }
}
