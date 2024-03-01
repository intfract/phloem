type Subscriber<T> = ((value: T) => any)

export class Reactive<T> {
  _value: T
  subscribers: Subscriber<T>[] = []
  constructor(value: T) {
    this._value = value
  }

  subscribe(subscriber: Subscriber<T>): this {
    this.subscribers.push(subscriber)
    return this
  }

  broadcast() {
    this.subscribers.forEach(subscriber => subscriber(this.value))
  }

  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    this._value = newValue
    this.subscribers.forEach(subscriber => subscriber(newValue))
  }
}

type Slot = Reactive<any> | HTMLElement | Text | string

interface SlotArray extends Array<Slot | SlotArray> {}

export function removeElement(slot: any) {
  if (slot instanceof Array) {
    for (const c of slot) {
      removeElement(c)
    }
  } else {
    slot.remove()
  }
}

export function addChild(parent: HTMLElement, slot: Slot | SlotArray | string | number): Slot | SlotArray | null {
  if (slot === null) return null
  if (slot instanceof Array) {
    const children: SlotArray = []
    slot.forEach(child => {
      const c = addChild(parent, child)
      if (c) children.push(c)
    })
    return children
  } else if (slot instanceof HTMLElement) {
    parent.appendChild(slot)
    return slot
  } else if (slot instanceof Reactive) {
    let child = addChild(parent, slot.value)
    slot.subscribe(newValue => {
      if (!(child === null || child instanceof Reactive)) removeElement(child)
      child = addChild(parent, newValue)
    })
    return child
  } else if (typeof slot === 'string' || typeof slot === 'number') {
    const text = document.createTextNode(`${slot}`)
    parent.appendChild(text)
    return text
  }
  return null
}

function addAttributes(element: HTMLElement, attributes?: Record<string, string | Reactive<string>>) {
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      const value = attributes[key]
      if (value instanceof Reactive) {
        element.setAttribute(key, value.value)
        value.subscribe(newValue => element.setAttribute(key, newValue))
      } else {
        element.setAttribute(key, value)
      }
    })
  }
  return element
}

export function tag(tagName: string, slot: SlotArray, attributes?: Record<string, string | Reactive<string>>): HTMLElement {
  const element = document.createElement(tagName)
  addChild(element, slot)
  addAttributes(element, attributes)
  return element
}

export function h(level: 1 | 2 | 3 | 4 | 5 | 6, slot: SlotArray, attributes?: Record<string, string | Reactive<string>>) {
  return tag(`h${level}`, slot, attributes)
}

export function button(slot: SlotArray, attributes?: Record<string, string | Reactive<string>>, onClick?: EventListenerOrEventListenerObject) {
  const btn = tag('button', slot, attributes)
  if (onClick) btn.addEventListener('click', onClick)
  return btn
}

export function input(type: string, attributes?: Record<string, string | Reactive<string>>, bind?: Reactive<string | number | boolean>): HTMLInputElement {
  const element = document.createElement('input')
  element.setAttribute('type', type)
  addAttributes(element, attributes)
  if (bind) {
    if (!(bind instanceof Reactive)) {
      console.error(`[ATSML] input bind must be of type Reactive<string | number>`)
    } else {
      if ((type === 'checkbox' || type === 'radio') && typeof bind.value === 'boolean') {
        element.checked = bind.value
        element.addEventListener('change', e => bind.value = element.checked)
        bind.subscribe(newValue => element.checked = typeof newValue === 'boolean' ? newValue : false)
      } else {
        element.value = bind.value.toString()
        element.addEventListener('input', e => bind.value = element.value)
        bind.subscribe(newValue => element.value = newValue.toString())
      }
    }
  }
  return element
}

export function style(declarations: Record<string, string | Reactive<string>>): string {
  let s: string = ''
  for (const [key, value] of Object.entries(declarations)) {
    s += `${key}: ${value};`
  }
  return s
}