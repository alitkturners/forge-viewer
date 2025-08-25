import fs from 'fs';



import { AuthClientThreeLegged, AuthClientTwoLegged, BucketsApi, CreateItem, CreateVersion, DerivativesApi, FoldersApi, HubsApi, ItemsApi, ObjectsApi, ProjectsApi, Scope, VersionsApi } from 'forge-apis';



import { API } from '../../config';


const internalAuthClient = new AuthClientTwoLegged(
  API.APS_CLIENT_ID,
  API.APS_CLIENT_SECRET,
  ['bucket:read', 'bucket:create', 'data:read', 'data:write', 'data:create'],
  true
);
const publicAuthClient = new AuthClientTwoLegged(API.APS_CLIENT_ID, API.APS_CLIENT_SECRET, ['viewables:read'], true);

const internalAuthClientThreeLegged = new AuthClientThreeLegged(
  API.APS_CLIENT_ID,
  API.APS_CLIENT_SECRET,
  API.APS_CALLBACK_URL,
  ['bucket:read', 'bucket:create', 'data:read', 'data:write', 'data:create'],
  true
);
const publicAuthClientThreeLegged = new AuthClientThreeLegged(
  API.APS_CLIENT_ID,
  API.APS_CLIENT_SECRET,
  API.APS_CALLBACK_URL,
  API.PUBLIC_TOKEN_SCOPES as Scope[],
  true
);

export const getAuthorizationUrl = () =>
  (internalAuthClientThreeLegged.generateAuthUrl as any)({
    scope: ['bucket:read', 'bucket:create', 'data:read', 'data:write', 'data:create'],
  });

export const getInternalToken = async () => {
  await internalAuthClient.authenticate();
  return internalAuthClient.getCredentials();
};

export const getPublicToken = async () => {
  if (!publicAuthClient.isAuthorized()) {
    await publicAuthClient.authenticate();
  }
  return publicAuthClient.getCredentials();
};

export const ensureBucketExists = async (bucketKey: string) => {
  let bucket;
  try {
    bucket = await new BucketsApi().getBucketDetails(bucketKey, null as any, await getInternalToken());
  } catch (err) {
    await new BucketsApi().createBucket(
      { bucketKey, policyKey: 'persistent' },
      {},
      null as any,
      await getInternalToken()
    );
  }
  return bucket;
};
interface Session {
  public_token?: string;
  internal_token?: string;
  refresh_token?: string;
  expires_at?: number;
}
export const authCallbackMiddleware = async (code: string) => {
  let session: Session = {};
  session.public_token = session.public_token || "''";
  session.internal_token = session.internal_token || "''";
  session.refresh_token = session.refresh_token || "''";
  session.expires_at = session.expires_at;

  const internalCredentials = await internalAuthClientThreeLegged.getToken(code);
  const publicCredentials = await publicAuthClientThreeLegged.refreshToken(internalCredentials);
  session.public_token = publicCredentials.access_token;
  session.internal_token = internalCredentials.access_token;
  session.refresh_token = publicCredentials.refresh_token;
  session.expires_at = Date.now() + internalCredentials.expires_in * 1000;
  return session;
};

export const listObjects = async () => {
  await ensureBucketExists(API.APS_BUCKET);
  let resp = await new ObjectsApi().getObjects(API.APS_BUCKET, { limit: 64 }, null as any, await getInternalToken());
  let objects = resp.body.items;
  while (resp.body.next) {
    const startAt = new URL(resp.body.next).searchParams.get('startAt');
    resp = await new ObjectsApi().getObjects(
      API.APS_BUCKET,
      { limit: 64, startAt } as { limit: number; startAt: string },
      null as any,
      await getInternalToken()
    );
    objects = objects.concat(resp.body.items);
  }
  return objects;
};

export const uploadObject = async (objectName?: string, filePath?: string) => {
  // await ensureBucketExists(API.APS_BUCKET);
  // const buffer = await fs.promises.readFile(filePath as string);
  // const results = await new ObjectsApi().uploadResources(
  //   API.APS_BUCKET,
  //   [{ objectKey: objectName as string, data: buffer }],
  //   { useAcceleration: false, minutesExpiration: 15 },
  //   null as any,
  //   await getInternalToken()
  // );
  // return results[0].completed;
};

export const translateObject = async (urn: any, rootFilename: any) => {
  // const job = {
  //   input: { urn },
  //   output: { formats: [{ type: 'svf', views: ['2d', '3d'] }] },
  // };
  // if (rootFilename) {
  //   job.input.compressedUrn = true;
  //   job.input.rootFilename = rootFilename;
  // }
  // const resp = await new DerivativesApi().translate(job, {}, null as any, await getInternalToken());
  // return resp.body;
};

export const getManifest = async (urn: string) => {
  try {
    const resp = await new DerivativesApi().getManifest(urn, {}, null as any, await getInternalToken());
    return resp.body;
  } catch (err: any) {
    if (err.response.status === 404) {
      return null;
    }
  }
};

interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}
export const getHubs = async (token: AuthToken) => {
  const resp = await new HubsApi().getHubs({}, internalAuthClientThreeLegged, token);
  return resp.body.data;
};

export const getProjects = async (hubId: string, token: AuthToken) => {
  const resp = await new ProjectsApi().getHubProjects(hubId, {}, internalAuthClientThreeLegged, token);
  return resp.body.data;
};

export const getProjectContents = async (hubId: string, projectId: string, folderId: string, token: AuthToken) => {
  if (!folderId) {
    const resp = await new ProjectsApi().getProjectTopFolders(hubId, projectId, internalAuthClientThreeLegged, token);
    return resp.body.data;
  } else {
    const resp = await new FoldersApi().getFolderContents(
      projectId,
      folderId,
      {},
      internalAuthClientThreeLegged,
      token
    );
    return resp.body.data;
  }
};

export const getItemVersions = async (projectId: string, itemId: string, token: AuthToken) => {
  const resp = await new ItemsApi().getItemVersions(projectId, itemId, {}, internalAuthClientThreeLegged, token);
  return resp.body.data;
};

export const uploadFile = async (
  projectId: string,
  folderId: string,
  fileName: string,
  fileSize: number,
  fileTempPath: string,
  token: AuthToken
) => {
  const body = await storageSpecData(fileName, folderId);
  const resp = await new ProjectsApi().postStorage(projectId, body, internalAuthClientThreeLegged, token);

  const objectId = resp.body.data.id;
  const bucketKeyObjectName = await getBucketKeyObjectName(objectId);

  const fileData = await fs.promises.readFile(fileTempPath);

  // Upload the new file
  const objects = new ObjectsApi();
  const objectData = await objects.uploadObject(
    bucketKeyObjectName.bucketKey,
    bucketKeyObjectName.objectName,
    fileSize,
    fileData,
    {},
    internalAuthClientThreeLegged,
    token
  );

  return objectData.body.objectId;
};
export const createNewItemVersion = async (
  projectId: string,
  folderId: string,
  fileName: string,
  objectId: string,
  isComposite: boolean,
  token: AuthToken
) => {
  const folders = new FoldersApi();
  const folderData = await folders.getFolderContents(projectId, folderId, {}, internalAuthClientThreeLegged, token);

  let item: any = null;
  for (const key in folderData.body.data) {
    item = folderData.body.data[key];
    if (item && (item as any).attributes.displayName === fileName) {
      break;
    } else {
      item = null;
    }
  }

  if (item) {
    // We found it so we should create a new version
    const versions = new VersionsApi();
    const body = await versionSpecData(fileName, projectId, item.id, objectId, isComposite);
    const versionData = await versions.postVersion(projectId, body, internalAuthClientThreeLegged, token);
    return versionData.body.data.id;
  }
  // We did not find it so we should create it
  const items = new ItemsApi();
  const body = await itemSpecData(fileName, projectId, folderId, objectId, isComposite);
  const itemData = await items.postItem(projectId, body, internalAuthClientThreeLegged, token);
  // Get the versionId out of the reply
  return itemData.body.included[0].id;
};
export const storageSpecData = async (fileName: string, folderId: string) => {
  const storageSpecs = {
    jsonapi: {
      version: '1.0',
    },
    data: {
      type: 'objects',
      attributes: {
        name: fileName,
      },
      relationships: {
        target: {
          data: {
            type: 'folders',
            id: folderId,
          },
        },
      },
    },
  };

  return storageSpecs;
};
export const versionSpecData = async (
  fileName: string,
  projectId: string,
  itemId: string,
  objectId: string,
  isComposite: boolean
) => {
  const versionsType = projectId.startsWith('a.') ? 'versions:autodesk.core:File' : 'versions:autodesk.bim360:File';

  const versionSpec = {
    jsonapi: {
      version: '1.0',
    },
    data: {
      type: 'versions',
      attributes: {
        name: fileName,
        extension: {
          type: versionsType,
          version: '1.0',
        },
      },
      relationships: {
        item: {
          data: {
            type: 'items',
            id: itemId,
          },
        },
        storage: {
          data: {
            type: 'objects',
            id: objectId,
          },
        },
      },
    },
  } as CreateVersion;

  return versionSpec;
};
export const itemSpecData = async (
  fileName: string,
  projectId: string,
  folderId: string,
  objectId: string,
  isComposite: boolean
) => {
  const itemsType = projectId.startsWith('a.') ? 'items:autodesk.core:File' : 'items:autodesk.bim360:File';
  const versionsType = projectId.startsWith('a.') ? 'versions:autodesk.core:File' : 'versions:autodesk.bim360:File';
  const itemSpec = {
    jsonapi: {
      version: '1.0',
    },
    data: {
      type: 'items',
      attributes: {
        displayName: fileName,
        extension: {
          type: itemsType,
          version: '1.0',
        },
      },
      relationships: {
        tip: {
          data: {
            type: 'versions',
            id: '1',
          },
        },
        parent: {
          data: {
            type: 'folders',
            id: folderId,
          },
        },
      },
    },
    included: [
      {
        type: 'versions',
        id: '1',
        attributes: {
          name: fileName,
          extension: {
            type: versionsType,
            version: '1.0',
          },
        },
        relationships: {
          storage: {
            data: {
              type: 'objects',
              id: objectId,
            },
          },
        },
      },
    ],
  } as unknown as CreateItem;

  return itemSpec;
};
export const getBucketKeyObjectName = async (objectId: string) => {
  const objectIdParams = objectId.split('/');
  const objectNameValue = objectIdParams[objectIdParams.length - 1];
  const bucketKeyParams = objectIdParams[objectIdParams.length - 2].split(':');
  const bucketKeyValue = bucketKeyParams[bucketKeyParams.length - 1];

  const ret = {
    bucketKey: bucketKeyValue,
    objectName: objectNameValue,
  };

  return ret;
};

export const urnify = (id: string) => Buffer.from(id).toString('base64').replace(/=/g, '');