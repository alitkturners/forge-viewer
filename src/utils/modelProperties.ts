import { useModelElements, useModelElementsProperties } from '@/redux/ModelViewslice';

export const getModelProperties = async () => {
  const { data } = useModelElements();
  const { data: elementProperties } = useModelElementsProperties();
  console.log('getModelProperties', data, elementProperties);
  console.log('getModelProperties elementProperties', elementProperties);

  // Example: sending JSON from a frontend component
  await fetch('/api/save-json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(elementProperties),
  });

  let properties = {};
  Object?.keys(data)?.map((i: any) => {
    if (
      elementProperties?.[i]?.properties?.Other?.['PiM_Assembly Name'] &&
      // @ts-ignore
      !properties?.[elementProperties?.[i]?.properties?.Other?.['PiM_Assembly Name']]
    ) {
      // @ts-ignore
      properties[elementProperties?.[i]?.properties?.Other?.['PiM_Assembly Name']] = [];
    }
    // @ts-ignore
    properties[elementProperties?.[i]?.properties?.Other?.['PiM_Assembly Name']]?.push(data[i]);
  });
  return properties;
};

export const getModelPropertiesCount = (filter: string) => {
  const properties = getModelProperties();
  // @ts-ignore
  const propertiesArray = Object.keys(properties).filter((i: any) =>
    i?.toLocaleLowerCase()?.includes(filter?.toLocaleLowerCase())
  );
  return propertiesArray.length;
};
