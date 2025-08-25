export const hashMapFunction = (nodes: unknown[]) => {
  let hashMap: { [key: string]: any } = {};
  nodes?.forEach((i: any) => {
    if (!hashMap[i?.objectid]) {
      hashMap[i?.objectid] = i;
    }
  });
  return hashMap;
};
