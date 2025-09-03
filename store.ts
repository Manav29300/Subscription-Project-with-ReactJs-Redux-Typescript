import { configureStore, createSlice } from '@reduxjs/toolkit'
import { createReducerManager } from './reducerManager'
import authReducer from '../../modules/auth/redux/slices/authSlice'
import productsReducer from '../../modules/products/redux/slices/productsSlice'
import settingsReducer from '../../modules/settings/redux/slices/settingsSlice'
import adminReducer from '../../modules/admin/redux/slices/adminSlice'
import { apiMiddleware } from '../../shared/middleware/apiMiddleware'

// Create a simple root reducer to avoid the "Store does not have a valid reducer" error
const rootSlice = createSlice({
  name: 'root',
  initialState: {},
  reducers: {}
})

// Initialize with core reducers
const reducerManager = createReducerManager({
  root: rootSlice.reducer,
  auth: authReducer,
  products: productsReducer,
  settings: settingsReducer,
  admin: adminReducer
})

export const store = configureStore({
  reducer: reducerManager.reduce,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as they might contain non-serializable data
        ignoredActions: ['persist/PERSIST']
      }
    }).concat(apiMiddleware),
  devTools: import.meta.env.DEV,
})

export const dynamicReducers = reducerManager

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


