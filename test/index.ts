import { Reactive, addChild, button, input, tag } from '../dist/index'

let title = new Reactive('This is a tooltip!')

addChild(
  document.body,
  [
    tag(
      'p',
      [
        'This is testing reactive attributes!',
      ],
      {
        'title': title,
      },
    ),
    button(
      [
        'Change Tooltip',
      ],
      {},
      e => title.value = 'The tooltip changed!',
    )
  ],
)