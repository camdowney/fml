export default function test({ children, text, debug }) {
  console.log(debug?.trim())

  return (children || text) ? /*html*/`
    <div>
      ${children || text || ''}
    </a>
  ` : ``
}