'use client';

export const parentToChildHashMap = (nodes: unknown[]) => {
  let modelMap: { [key: string]: any } = {};

  const constructHashMap = (nodes: unknown[]) => {
    let nodeChildren: any[] = [];

    nodes?.forEach((node: any) => {
      let children = [];

      if (Array.isArray(node.objects) && node.objects.length > 0) {
        children = node.objects.map((item: any) => item.objectid);
        constructHashMap(node.objects);
      }

      if (!modelMap[node.objectid]) {
        nodeChildren.push(node.objectid);
        modelMap[node.objectid] = {
          objectId: node.objectid,
          view: true,
          name: node.name,
          children,
        };
      }
    });

    modelMap['Root'] = {
      name: 'Model',
      objectId: 'Root',
      view: true,
      children: nodeChildren,
    };
  };

  constructHashMap(nodes);
  return modelMap;
};
