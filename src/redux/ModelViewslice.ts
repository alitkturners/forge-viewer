'use client';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { getAllModelProperties, getAllModelViews, getModelsList, SelectOption } from './api';

export interface WidgetState {
  data: { [key: string]: any };
  loading: boolean;
  error: string | null;
}
export interface modelListType {
  data: SelectOption[];
  loading: boolean;
  error: string | null;
}

const modelElements: WidgetState = {
  data: {},
  loading: false,
  error: null,
};

const modelElementsProperties: WidgetState = {
  data: {},
  loading: false,
  error: null,
};
const modelList: modelListType = {
  data: [],
  loading: false,
  error: null,
};

const initialState = {
  buttonState: false,
  urn: '',
  modelElements,
  modelElementsProperties,
  modelList,
};

export const modelBrowserRedux = createSlice({
  name: 'modelBrowserRedux',
  initialState,
  reducers: {
    toggleModalViewState: (state) => {
      state.buttonState = !state.buttonState;
    },
    updateUrn: (state, action) => {
      state.urn = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getAllModelViews.pending.type, (state) => {
        state.modelElements.loading = true;
        state.modelElements.error = null;
      })
      .addCase(getAllModelViews.fulfilled.type, (state, action: PayloadAction<object>) => {
        state.modelElements.loading = false;
        state.modelElements.data = action.payload;
      })
      .addCase(getAllModelViews.rejected.type, (state, action: PayloadAction<string>) => {
        state.modelElements.loading = false;
        state.modelElements.error = action.payload;
      })
      .addCase(getAllModelProperties.pending.type, (state) => {
        state.modelElementsProperties.loading = true;
        state.modelElementsProperties.error = null;
      })
      .addCase(getAllModelProperties.fulfilled.type, (state, action: PayloadAction<object>) => {
        state.modelElementsProperties.loading = false;
        state.modelElementsProperties.data = action.payload;
      })
      .addCase(getAllModelProperties.rejected.type, (state, action: PayloadAction<string>) => {
        state.modelElementsProperties.loading = false;
        state.modelElementsProperties.error = action.payload;
      })

      .addCase(getModelsList.pending.type, (state) => {
        state.modelList.loading = true;
        state.modelList.error = null;
      })
      .addCase(getModelsList.fulfilled.type, (state, action: PayloadAction<SelectOption[]>) => {
        state.modelList.loading = false;
        state.modelList.data = action.payload;
      })
      .addCase(getModelsList.rejected.type, (state, action: PayloadAction<string>) => {
        state.modelList.loading = false;
        state.modelList.error = action.payload;
      }),
});

export const { toggleModalViewState, updateUrn } = modelBrowserRedux.actions;

export const useModelElements = () => useSelector((state: any) => state.modelBrowser.modelElements);
export const useModelElementsProperties = () => useSelector((state: any) => state.modelBrowser.modelElementsProperties);
export const useModelElementsOverlapCount = () =>
  useSelector((state: any) => {
    let properties: any[] = [];
    Object?.keys(state.modelBrowser.modelElements?.data)?.map((i: any) => {
      if (
        state.modelBrowser.modelElementsProperties?.data?.[i]?.properties?.Other?.['PiM_Assembly Name'] &&
        !properties?.includes(
          state.modelBrowser.modelElementsProperties?.data?.[i]?.properties?.Other?.['PiM_Assembly Name']
        )
      ) {
        properties?.push(
          state.modelBrowser.modelElementsProperties?.data?.[i]?.properties?.Other?.['PiM_Assembly Name']
        );
      }
      return null;
    });
    return properties?.length;
  });

export const useModelsList = () => useSelector((state: any) => state.modelBrowser.modelList);
export const useDrawerState = () => useSelector((state: any) => state.modelBrowser.buttonState);
export const useUrn = () => useSelector((state: any) => state.modelBrowser.urn);
export default modelBrowserRedux.reducer;
