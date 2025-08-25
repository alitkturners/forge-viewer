'use client';

import { applyMiddleware, combineReducers, createStore } from '@reduxjs/toolkit';
import type { ThunkMiddleware } from 'redux-thunk';
import { thunk } from 'redux-thunk';

// TODO Rename it to appropriate Slice Name
import modelBrowserState from './ModelViewslice';

export const rootReducer = combineReducers({
  modelBrowser: modelBrowserState,
});

export type AppState = ReturnType<typeof rootReducer>;
const bindMiddleware = (middleware: any) => {
  return applyMiddleware(...(middleware as []));
};
export const store = createStore(rootReducer, bindMiddleware([thunk as ThunkMiddleware<AppState, any>]));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
