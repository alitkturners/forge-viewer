import spoolServices from '@/spool-services/spool-services';
import { hashMapFunction } from '@/utils/hash-map';
import { parentToChildHashMap } from '@/utils/parent-to-child-hash-map';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface SelectOption {
  label: string;
  value: string;
}

export const getAllModelViews = createAsyncThunk('get-all-view', async ({ urn }: { urn: string }) => {
  try {
    const data = await spoolServices.getModelElements(urn);
    const hashMap = parentToChildHashMap(data as unknown[]);
    return hashMap;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
});

export const getAllModelProperties = createAsyncThunk(
  'get-all-element-properties',
  async ({ urn }: { urn: string }) => {
    try {
      const data = await spoolServices.getModelElementsProperties(urn);
      const hashMap = hashMapFunction(data as unknown[]);
      return hashMap;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
);

export const getModelsList = createAsyncThunk('getModelsList', async () => {
  try {
    const url = await fetch('/api/models');
    const { data } = await url.json();
    const optionsArray: SelectOption[] = data?.map((i: { name: string; urn: string }) => ({
      label: i?.name,
      value: i?.urn,
    }));
    return optionsArray;
  } catch (error) {
    throw new Error(error as string);
  }
});
