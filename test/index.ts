import { Reactive, addChild, button, input, tag } from '../dist/index'

let textBind = new Reactive('Hello, world!')
let counter = new Reactive(0)

addChild(
  document.body,
  [
    tag(
      'p',
      [
        textBind,
      ],
    ),
    input(
      'text', // input type
      {}, // attributes
      textBind, // value binding
    ),
    button(
      ['counter: ', counter],
      {},
      e => counter.value++
    )
  ],
)