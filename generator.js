import { generateFML } from './fml.js'
import counter from './components/counter.js'
import footer from './components/footer.js'
import header from './components/header.js'
import layout from './components/layout.js'
import test from './components/test.js'
import todos from './components/todos.js'

const components = {
  counter,
  footer,
  header,
  layout,
  test,
  todos,
}

generateFML(components)