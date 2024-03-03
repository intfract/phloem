import './styles.css'
import { Reactive, addChild, button, input, tag } from '../src/index'

let classList = new Reactive<Array<string>>(['hidden'])

addChild(
  document.body,
  [
    tag(
      'p',
      [
        'This is testing reactive attributes!',
      ],
      {
        'class': classList,
      },
    ),
    button(
      [
        'Reveal Text',
      ],
      {},
      e => classList.value = [],
    )
  ],
)