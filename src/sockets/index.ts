import { ClassicPreset } from 'rete'

export const socketAction = new ClassicPreset.Socket('action')
export const socketString = new ClassicPreset.Socket('string')
export const socketNumber = new ClassicPreset.Socket('number')
export const socketBoolean = new ClassicPreset.Socket('boolean')
export const socketColor = new ClassicPreset.Socket('color')
export const socketVector3 = new ClassicPreset.Socket('vector3')
export const socketAny = new ClassicPreset.Socket('any')