export default function layout({ children }) {
  return /*html*/`
    <f-header></f-header>
    <main>
      ${children}
    </main>
    <f-footer></f-footer>
  `
}