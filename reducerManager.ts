import { combineReducers } from '@reduxjs/toolkit'
import type { AnyAction, Reducer } from '@reduxjs/toolkit'

export type ReducerMap = Record<string, Reducer>

export function createReducerManager(initialReducers: ReducerMap) {
  let reducers: ReducerMap = { ...initialReducers }
  let combinedReducer = combineReducers(reducers)
  const keysToRemove = new Set<string>()

  return {
    reduce(state: unknown, action: AnyAction) {
      if (keysToRemove.size > 0 && state && typeof state === 'object') {
        state = { ...(state as object) }
        for (const key of keysToRemove) {
          // @ts-ignore - dynamic remove
          delete (state as any)[key]
        }
        keysToRemove.clear()
      }
      return combinedReducer(state as any, action)
    },
    add(key: string, reducer: Reducer) {
      if (!key || reducers[key]) return
      reducers[key] = reducer
      combinedReducer = combineReducers(reducers)
    },
    remove(key: string) {
      if (!key || !reducers[key]) return
      delete reducers[key]
      keysToRemove.add(key)
      combinedReducer = combineReducers(reducers)
    },
    getReducers() {
      return { ...reducers }
    },
  }
}


