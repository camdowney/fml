import { onRender, onClick, useState } from '../fml.js'

export default function counter({ uid, count = 0, ...props }) {
  onRender(() => {
    onClick(uid, () => 
      useState(uid).set({ count: Number(count) + 1 })
    )
  })

  return /*html*/`
    <button class='${props.class || ""}'>
      Clicked ${count} times
    </button>
  `
}