import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/redux/slices/authSlice';
import productsReducer from '../../modules/products/redux/slices/productsSlice';
import settingsReducer from '../../modules/settings/redux/slices/settingsSlice';
import adminReducer from '../../modules/admin/redux/slices/adminSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  settings: settingsReducer,
  admin: adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;