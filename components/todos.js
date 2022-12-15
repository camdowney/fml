import { onRender, onClick, useState, arrRemove, map, setCookie } from '../fml.js'

export default function todos({ uid, list }) {
  const state = useState(uid)

  onRender(() =>
    document.querySelectorAll('.btn-close').forEach((button, index) =>
      onClick(button, () => deleteTodo(index))
    )
  )

  const deleteTodo = index => {
    let list = arrRemove(state.get().list, index)
    state.set({ list })
    setCookie(uid, list)
  }

  return /*html*/`
    <div class='todo-list'>
      ${map(list, todo => /*html*/`
        <div class='todo'>
          ${todo}
          <button class='btn-close'>X</button>
        </div>
      `)}
    </div>
  `
}