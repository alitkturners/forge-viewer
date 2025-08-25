'use client';

import * as React from 'react';
import { Provider } from 'react-redux';

import { store } from './store';

interface ProviderType {
  children: React.ReactNode;
}

export function ReduxStateProvider({ children }: ProviderType) {
  return <Provider store={store}>{children}</Provider>;
}
