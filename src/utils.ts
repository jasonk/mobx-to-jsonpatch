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
import { IDisposer } from 'mobx-utils'
import { Pointer } from './Pointer'

type IChange = IObjectDidChange | IArrayChange | IArraySplice | IMapDidChange

type Entry = {
  dispose: IDisposer
  path: string|number
  parent?: Entry
}

type part = (string|number)
type parts = part[]

type IPatchOp = "add" | "remove" | "replace" | "copy" | "move" | "test"
type IPatch = {
  op: IPatchOp
  path: Pointer
  from?: Pointer
  value?: any
}
type IPatchOpJSON = {
  op: IPatchOp
  path: string
  from?: string
  value?: any
}

export { part, parts, IChange, Entry, IPatchOp, IPatch, IPatchOpJSON }
