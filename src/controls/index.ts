import { ClassicPreset as Classic } from "rete"

import { BaseSchemes } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'
// import './background.css'

// пока тут будет..
export function addCustomBackground<S extends BaseSchemes, K>(area: AreaPlugin<S, K>) {
  const background = document.createElement('div')

  background.classList.add('background')
  background.classList.add('fill-area')

  area.area.content.add(background)
}

export class TwoButtonControl extends Classic.Control {
  constructor(
    public label1: string,
    public label2: string,
    public onClick1: () => void,
    public onClick2: () => void
  ) {
    super()
  }
}


export class OneButtonControl extends Classic.Control {
  constructor(
    public label: string,
    public onClick: () => void
  ) {
    super()
  }
}

export class CheckboxControl extends Classic.Control {
  constructor(
    public textFalse: string,
    public textTrue: string,
    public active: boolean,
    public onClick: () => void,
    public blockColor: boolean = false
  ) {
    super()
  }
}

export class SelectControl extends Classic.Control {
  constructor(
    public selected: string | number,
    public optionList: any,
    public onChange: (e:any) => void
  ) {
    super()
  }
}

export class UserControl extends Classic.Control {
  constructor(
    public userList: any,
    public currentUser: number,
    public onChange: (e:any) => void
  ) {
    super()
  }
}