/* 
  A few limitations...
  * State within subcomponents will be lost upon parent state change
  * Slots must be direct children of their parent component
*/

export const generateFML = components => {
  let index = 0
  const tags = Object.keys(components).reduce((acc, curr) => acc += `f-${curr}, `, '').slice(0, -2)

  const createComponent = e => {
    const name = sliceTag(e, 2)
    const uid = e.getAttribute('uid') || `_f${index++}`
    const props = { uid, ...getProps(e) }

    if (!components[name]) return null

    const component = components[name](props)
    return createState(component, uid, e)
  }

  const generate = () => {
    while (1) {
      let e = document.querySelector(tags)
      if (!e) break
      replaceWith(e, createComponent(e))
    }

    window.dispatchEvent(new Event('FMLComplete'))
  }

  generate()
  window.addEventListener('FMLRerender', generate)
}


const getProps = e => {
  let props = {}
  e.getAttributeNames().forEach(a => props[hyphenToCamelCase(a)] = e.getAttribute(a))

  const withoutSlots = e

  Array.from(createFragment(e.innerHTML).children, c => {
    if (sliceTag(c, 0, 5) !== 'slot-') return
    props[hyphenToCamelCase(sliceTag(c, 5))] = c.innerHTML
    withoutSlots.querySelector(c.tagName).remove()
  })

  return { children: withoutSlots.innerHTML.trim(), ...props }
}

const createState = (component, uid, e) => {
  const stateComp = document.createElement('f-state')
  stateComp.innerHTML = component
  stateComp.setAttribute('id', uid)
  stateComp.dataset.state = e.outerHTML
  return createFragment(stateComp.outerHTML)
}

const sliceTag = (e, ...i) =>
  e.tagName.toLowerCase().slice(...i)

const createFragment = e =>
  document.createRange().createContextualFragment(e)

const replaceWith = (e, component) =>
  e.parentNode.replaceChild(component, e)

const setAttributes = (e, data) =>
  Object.keys(data).forEach(k => e.setAttribute(k, data[k]))

const hyphenToCamelCase = s =>
  s.replace(/-([a-z])/g, h => h[1].toUpperCase())

export const useState = uid => {
  const set = data => {
    const component = document.querySelector('#' + uid)

    if (!component) return
    if (!component.dataset.state) return setAttributes(component, data)

    const frag = createFragment(component.dataset.state)
    setAttributes(frag.querySelector('*'), data)
    replaceWith(component, frag)
    window.dispatchEvent(new Event('FMLRerender'))
  }

  const get = () => {
    const component = document.querySelector('#' + uid)

    if (!component) return {}
    if (!component.dataset.state) return getProps(component)

    const frag = createFragment(component.dataset.state)
    return getProps(frag.querySelector('*'))
  }

  return { set, get }
}

export const onEvent = (e, event, callback) => {
  const element = typeof e !== 'string' ? e : e.startsWith('_f')
    ? document.querySelector('#' + e)
    : document.querySelector(e)
  element.addEventListener(event, callback)
}

export const onClick = (e, callback) =>
  onEvent(e, 'click', callback)

export const onSubmit = (e, callback) =>
  onEvent(e, 'submit', callback)

export const map = (arr, callback) =>
  parse(arr).map(callback).join('')

export const arrPush = (arr, e) => {
  const newArr = parse(arr)
  newArr.push(e)
  return newArr
}

export const arrRemove = (arr, i, isItem) => {
  const newArr = parse(arr)
  const index = isItem ? newArr.indexOf(i) : i
  newArr.splice(index, 1)
  return newArr
}

export const parse = arr => {
  if (!arr) return []
  if (Array.isArray(arr)) return arr
  return arr.split(',')
}

export const onRender = callback => {
  window.addEventListener(
    document.readyState === 'complete' ? 'FMLComplete' : 'DOMContentLoaded', 
    callback,
    { once: true }
  )
}

export const setCookie = (name, value, exp = 7) =>
  document.cookie = name + '=' + value + ';max-age=' + (exp * 24 * 60 * 60) + ';path=/'

export const getCookie = name =>
  document.cookie.split(';').filter(c => c.trim().startsWith(name + '='))[0]?.trim().substring(name.length + 1) || ''