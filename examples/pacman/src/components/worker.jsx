import * as THREE from 'three'
import React from 'react'
import { render } from '@react-three/offscreen'
import Scene from './Scene'

render(<Scene />)

// This shim is already taken care of in rt/offscreen, although unreleased, will be out next patch version
THREE.ImageLoader.prototype.load = function (url, onLoad, onProgress, onError) {
  if (this.path !== undefined) url = this.path + url
  url = this.manager.resolveURL(url)
  const scope = this
  const cached = THREE.Cache.get(url)
  if (cached !== undefined) {
    scope.manager.itemStart(url)
    if (onLoad) onLoad(cached)
    scope.manager.itemEnd(url)
    return cached
  }
  fetch(url)
    .then((res) => res.blob())
    .then((res) => createImageBitmap(res, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }))
    .then((bitmap) => {
      THREE.Cache.add(url, bitmap)
      if (onLoad) onLoad(bitmap)
      scope.manager.itemEnd(url)
    })
    .catch(onError)
  return {}
}
