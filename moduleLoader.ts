import moduleConfig from '../../../module.json'
import type { Reducer } from '@reduxjs/toolkit'
import { dynamicReducers, store } from '@app/store/store'
import { createElement } from 'react'
import type { ComponentType, ReactElement } from 'react'
import { ProtectedRoute } from '@shared/components/ProtectedRoute'

type RouteConfig = { path: string; component: string; authorization?: boolean }
type ModuleConfig = {
  name: string
  active?: boolean
  routes?: RouteConfig[]
  store?: {
    slices?: Record<string, { name: string; path: string }>
    actions?: Record<string, { name: string; path: string }>
  }
}

type AppConfig = {
  name: string
  active?: boolean
  modules: ModuleConfig[]
}

const pageModules = import.meta.glob('../../modules/**/pages/*.tsx')
const sliceModules = import.meta.glob<{ default: Reducer }>(
  '../../modules/**/redux/**/*.ts',
)
const actionModules = import.meta.glob<{ [key: string]: any }>(
  '../../modules/**/redux/**/*.ts',
)

export async function registerModules() {
  const appConfig = moduleConfig as AppConfig
  if (appConfig.active === false) return
  
  // Process each module
  for (const moduleConfig of appConfig.modules) {
    if (moduleConfig.active === false) continue;
    
    // Register reducers
    const slices = moduleConfig.store?.slices ?? {}
    for (const [stateKey, { path }] of Object.entries(slices)) {
      const desired = '../../' + path.replace(/^src\//, '')
      let match = Object.keys(sliceModules).find((p) => p === desired)
      if (!match) {
        const fileName = path.split('/').pop()
        match = Object.keys(sliceModules).find((p) => p.endsWith(String(fileName)))
      }
      if (!match) continue
      
      const mod: any = await sliceModules[match]()
      const reducer: Reducer | undefined =
        (mod && mod.default) ||
        (mod && Object.values(mod).find((v: unknown) => typeof v === 'function'))
      if (reducer && typeof reducer === 'function') {
        dynamicReducers.add(stateKey, reducer)
        store.replaceReducer(dynamicReducers.reduce as unknown as Reducer)
      }
    }

    // Register actions (for future use)
    const actions = moduleConfig.store?.actions ?? {}
    for (const [actionKey, { path }] of Object.entries(actions)) {
      const desired = '../../' + path.replace(/^src\//, '')
      let match = Object.keys(actionModules).find((p) => p === desired)
      if (!match) {
        const fileName = path.split('/').pop()
        match = Object.keys(actionModules).find((p) => p.endsWith(String(fileName)))
      }
      if (!match) continue
      
      // Actions are imported but not registered in store
      // They can be used directly in components
      console.log(`Loaded actions for module: ${actionKey}`)
    }
  }
}

export async function getModuleRoutes() {
  const appConfig = moduleConfig as AppConfig
  if (appConfig.active === false) return [] as Array<{ path: string; element: ReactElement }>
  
  const resolved: Array<{ path: string; element: ReactElement }> = []
  
  // Process routes from each module
  for (const moduleConfig of appConfig.modules) {
    if (moduleConfig.active === false) continue;
    
    const routes = moduleConfig.routes ?? []
    
    for (const r of routes) {
      const file = Object.keys(pageModules).find((p) => p.endsWith(`${r.component}.tsx`))
      if (!file) continue
      
      const mod: any = await pageModules[file]()
      const Comp = (mod as { default: ComponentType }).default
      const baseEl = Comp ? createElement(Comp) : createElement('div')
      const wrapped = r.authorization ? createElement(ProtectedRoute, undefined, baseEl) : baseEl
      resolved.push({ path: r.path, element: wrapped })
    }
  }
  
  return resolved
}


