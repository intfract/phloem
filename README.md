# Phloem

Phloem is the best font-end framework written in TypeScript!

## About

Phloem is a lightweight ESM library for creating reactive web applications.

> [!NOTE]
> Any examples in this file assume TypeScript is being used but type annotations can be excluded to make them suitable for JavaScript!

## Reactivity

Reactive variables can be declared in Phloem using the `Reactive<T>` class.

```ts
import { Reactive } from 'phloem'
let counter = new Reactive<number>(0)
counter.subscribe(newValue => console.log(newValue)) // log to console whenever counter.value changes
counter.value++ // 1
```

Subscriber functions get triggered whenever `Reactive<T>.value` gets set. However, there are some exceptions when it comes to `Array<T>` types.

> [!TIP]
> Use the `Reactive<T>.broadcast` method to update subscribers manually

```ts
import { Reactive } from 'phloem'
let classList = new Reactive([])
classList.value.push('dark') // does not trigger setter
classList.broadcast() // manually update subscribers
```

## Examples

### Counter

This code creates a **reactive** button that counts the number of times it has been clicked.

```ts
import { Reactive, addChild, button, tag } from 'phloem'

let counter = new Reactive<number>(0) // create a reactive object with value 0
const btn = button(
  ['count: ', counter], // children
  {}, // attributes
  e => counter.value++, // click event listener
)

addChild(
  document.body,
  [
    tag(
      'p',
      [
        'Click the button to increment its value!',
      ],
    ),
    btn,
  ],
)
```

## Input Binding

```ts
import { Reactive, addChild, input, tag } from 'phloem'

let textBind = new Reactive<string>('Hello, world!') // create a reactive object with value 'Hello, world!'

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
  ],
)
```

### Reactive Attributes

```ts
import { Reactive, addChild, button, tag } from 'phloem'
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
```

## Contributing

All contributions are welcome!