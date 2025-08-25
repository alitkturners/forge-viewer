import React from 'react';
import { TreeItem } from '@mui/x-tree-view';

interface TreeComponentProps {
  nodes: any;
  loadingNodeIds: any;
  axiosLoading: boolean;
  handleNodeClick: (event: React.MouseEvent, id: string) => void;
  handleFiles: (e: React.ChangeEvent<HTMLInputElement>, nodeId: string) => void;
  uploadingNodeId: string | null;
}

const TreeComponent: React.FC<TreeComponentProps> = ({
  nodes,
  loadingNodeIds,
  axiosLoading,
  handleNodeClick,
  handleFiles,
  uploadingNodeId,
}) => {
  const isVersion = nodes.id.startsWith('version|');
  const isProject = nodes.id.startsWith('folder|') && nodes.name === 'Project Files';

  return (
    <TreeItem
      itemId={nodes.id}
      key={nodes.id}
      label={loadingNodeIds.has(nodes.id) ? 'Loading...' : nodes.name}
      sx={{ color: 'var(--NavGroup-item-color)', fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}
      onClick={(event: any) => handleNodeClick(event, nodes.id)}
    >
      {axiosLoading && nodes.id === uploadingNodeId ? (
        <p>Uploading...</p>
      ) : isProject ? (
        <input
          id="apsUploadHidden"
          name="file"
          type="file"
          accept=".rvt"
          onChange={(e: any) => {
            handleFiles(e, nodes.id);
          }}
        />
      ) : null}
      {Array.isArray(nodes.children) && !loadingNodeIds.has(nodes.id) ? (
        nodes.children.length > 0 ? (
          nodes.children.map((node: any) => (
            <TreeComponent
              nodes={node}
              loadingNodeIds={loadingNodeIds}
              axiosLoading={axiosLoading}
              handleNodeClick={handleNodeClick}
              handleFiles={handleFiles}
              uploadingNodeId={uploadingNodeId}
            />
          ))
        ) : (
          <TreeItem
            itemId={`${nodes.id}-no-result`}
            label={isVersion ? 'Viewing model...' : 'No result'}
            slots={{ endIcon: () => <span /> }}
          />
        )
      ) : null}
    </TreeItem>
  );
};

export default TreeComponent;
