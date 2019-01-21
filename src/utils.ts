import {
  observe,
  isObservable,
  IObjectDidChange,
  IArrayChange,
  IArraySplice,
  IMapDidChange,
  IObservableArray,
  IObservableObject,
} from "mobx"
import { Pointer } from './Pointer'

export type IChange = IObjectDidChange
  | IArrayChange
  | IArraySplice
  | IMapDidChange

export type IDisposer = () => void

export type Entry = {
  dispose: IDisposer
  path: string|number
  parent?: Entry
}

export type part = (string|number)
export type parts = part[]

export type IPatchOp = "add" | "remove" | "replace" | "copy" | "move" | "test"
export type IPatch = {
  op: IPatchOp
  path: Pointer
  from?: Pointer
  value?: any
}
export type IPatchOpJSON = {
  op: IPatchOp
  path: string
  from?: string
  value?: any
}
