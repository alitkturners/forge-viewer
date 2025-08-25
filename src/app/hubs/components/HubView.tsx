'use client';

import React, { useEffect, useState } from 'react';
import { loadModel } from '@/app/viewer';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MinusCircle as MinusCircleIcon } from '@phosphor-icons/react/dist/ssr/MinusCircle';
import { PlusCircle as PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import axios from 'axios';
import { toast } from 'sonner';

import TreeComponent from './HubTreeItem';

function HubViewer() {
  const [hubState, setHubState] = useState({
    treeData: [],
    isLoading: true,
    axiosLoading: false,
    uploadingNodeId: null as string | null,
    clickedNodeIds: new Set(),
    loadingNodeIds: new Set(),
    projectId: '',
    folderId: '',
    hubId: '',
  });

  useEffect(() => {
    getHubs().then((data) => {
      setHubState((prevState) => ({
        ...prevState,
        isLoading: false,
        treeData: data,
      }));
    });
  }, []);
  const getJSON = async (url: string) => {
    const value = JSON.parse(localStorage.getItem('token') || '{}');
    const { data } = await axios(url, {
      headers: {
        internal_token: value.internal_token,
      },
    });

    return data;
  };

  const createTreeNode = (id: string, name: string, children: any = []) => {
    if (id === undefined) {
      throw new Error('id is undefined');
    }
    if (name === undefined) {
      throw new Error('name is undefined');
    }
    return { id, name, children };
  };
  const getHubs = async () => {
    const hubs = await getJSON('/api/hubs');
    return hubs.map((hub: any) => createTreeNode(`hub|${hub.id}`, hub.attributes.name, []));
  };

  const getProjects = async (hubId: string) => {
    const projects = await getJSON(`/api/hubs/${hubId}/projects`);

    return projects.map((project: any) =>
      createTreeNode(`project|${hubId}|${project.id}`, project.attributes.name, [])
    );
  };

  const getContents = async (hubId: string, projectId: string, folderId: any = null) => {
    const contents = await getJSON(
      `/api/hubs/${hubId}/projects/${projectId}/contents` + (folderId ? `?folder_id=${folderId}` : '')
    );
    return contents.map((item: any) => {
      if (item.type === 'folders') {
        return createTreeNode(`folder|${hubId}|${projectId}|${item.id}`, item.attributes.displayName, []);
      } else {
        return createTreeNode(`item|${hubId}|${projectId}|${item.id}`, item.attributes.displayName, []);
      }
    });
  };

  const getVersions = async (hubId: string, projectId: string, itemId: string) => {
    const versions = await getJSON(`/api/hubs/${hubId}/projects/${projectId}/contents/${itemId}/versions`);
    return versions.map((version: any) => createTreeNode(`version|${version.id}`, version.attributes.createTime, []));
  };

  const fetchData = async (nodeId: string) => {
    setHubState((prevState) => ({
      ...prevState,
      loadingNodeIds: new Set(prevState.loadingNodeIds).add(nodeId),
    }));
    let data: any;
    const tokens = nodeId.split('|');
    switch (tokens[0]) {
      case 'hub':
        data = await getProjects(tokens[1]);
        break;
      case 'project':
        data = await getContents(tokens[1], tokens[2]);
        break;
      case 'folder':
        data = await getContents(tokens[1], tokens[2], tokens[3]);
        break;
      case 'item':
        data = await getVersions(tokens[1], tokens[2], tokens[3]);
        break;
      default:
        data = [];
    }
    setHubState((prevState) => {
      const newSet = new Set(prevState.loadingNodeIds);
      newSet.delete(nodeId);
      return {
        ...prevState,
        loadingNodeIds: newSet,
      };
    });

    setHubState((prevState) => {
      const newData = JSON.parse(JSON.stringify(prevState.treeData));
      const node = findNode(newData, nodeId);
      if (node) {
        node.children = data;
      }
      return {
        ...prevState,
        treeData: newData,
      };
    });
  };

  const findNode = (nodes: any[], id: string): any | null => {
    for (let node of nodes) {
      if (node.id === id) {
        return node;
      } else if (node.children) {
        const result = findNode(node.children, id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const handleNodeClick = async (event: any, nodeId: any) => {
    const tokens = nodeId.split('|');
    if (tokens[0] === 'version') {
      if (typeof window !== 'undefined' && window.viewer) {
        await loadModel(window.viewer, window.btoa(tokens[1]).replace(/=/g, ''));
      }
    } else if (!hubState.clickedNodeIds.has(nodeId)) {
      fetchData(nodeId);
      setHubState((prevState) => ({
        ...prevState,
        clickedNodeIds: new Set(prevState.clickedNodeIds).add(nodeId),
      }));
    }
    if (tokens[0] === 'folder') {
      const projectId = tokens[2];
      const folderId = tokens[3];
      setHubState((prevState) => ({
        ...prevState,
        projectId: projectId,
        folderId: folderId,
        hubId: tokens[1],
      }));
    }
  };

  const handleFiles = async (e: any, nodeId: string) => {
    setHubState((prevState) => ({
      ...prevState,
      axiosLoading: true,
      uploadingNodeId: nodeId,
    }));
    const data = new FormData();
    const value = JSON.parse(localStorage.getItem('token') || '{}');

    const fileName: string = e.target.files[0].name;
    data.append('model-file', e.target.files[0]);
    try {
      const response = await axios({
        url: '/api/upload',
        method: 'POST',
        headers: {
          'x-file-name': fileName,
          'wip-proId': hubState.projectId,
          'wip-folId': hubState.folderId,
          'is-attachment': false,
          internal_token: value.internal_token,
        },
        data,
      });

      if (response.status === 200) {
        toast.success(`Model has been uploaded.`);
        fetchData(`folder|${hubState.hubId}|${hubState.projectId}|${hubState.folderId}`);
        setHubState((prevState) => ({
          ...prevState,
          axiosLoading: false,
        }));
      }
    } catch (error) {
      console.error(error);
      setHubState((prevState) => ({
        ...prevState,
        axiosLoading: false,
      }));
    }
  };

  return (
    <>
      {hubState.isLoading ? (
        <p>Data is loading, please wait...</p>
      ) : (
        <SimpleTreeView slots={{ collapseIcon: MinusCircleIcon, expandIcon: PlusCircleIcon, endIcon: PlusCircleIcon }}>
          {hubState.treeData.map((treeItem) => (
            <TreeComponent
              uploadingNodeId={hubState.uploadingNodeId}
              nodes={treeItem}
              loadingNodeIds={hubState.loadingNodeIds}
              axiosLoading={hubState.axiosLoading}
              handleNodeClick={handleNodeClick}
              handleFiles={handleFiles}
            />
          ))}
        </SimpleTreeView>
      )}
    </>
  );
}

export default HubViewer;
