import React from 'react';
import { useModelElements } from '@/redux/ModelViewslice';
import { TreeView } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function SpoolListing() {
  const { data } = useModelElements();
  const renderTree = (nodes: any) => {
    return (
      <SimpleTreeView key={data?.[nodes]?.objectId}>
        <TreeItem itemId={data?.[nodes]?.objectId} label={data?.[nodes]?.name}>
          {Array.isArray(data?.[nodes]?.children)
            ? data?.[nodes]?.children?.map((node: any) => renderTree(node))
            : null}
        </TreeItem>
      </SimpleTreeView>
    );
  };
  return (
    <div>
      <TreeView>
        <SimpleTreeView key={data?.Root?.objectId}>
          <TreeItem itemId={data?.Root?.objectId} label={data?.Root?.name}>
            {Array.isArray(data?.Root?.children) ? data?.Root?.children?.map((node: any) => renderTree(node)) : null}
          </TreeItem>
        </SimpleTreeView>
      </TreeView>
    </div>
  );
}
