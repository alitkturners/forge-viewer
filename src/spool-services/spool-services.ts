// THIS is for External API Calls to APS
class SpoolService {
  bearerToken = '';

  async getAuthHeader() {
    if (!this.bearerToken) {
      const resp = await fetch('/api/auth/');
      const { access_token: accessToken } = await resp.json();

      const token = `Bearer ${accessToken}`;
      this.bearerToken = token;
    }
    return this.bearerToken;
  }

  async getMetadata(urn: string) {
    try {
      const { data } = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata`, {
        headers: {
          Authorization: await this.getAuthHeader(),
        },
      }).then((response: any) => response.json());
      const modelGuideId = data?.metadata?.find((i: any) => i?.role === '3d')?.guid;

      return modelGuideId;
    } catch (error) {
      console.error(error);
    }
  }

  async getModelGuid(urn: string) {
    try {
      const data = await this.getMetadata(urn);
      const { data: options } = await fetch(
        `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${data}`,
        {
          headers: {
            Authorization: await this.getAuthHeader(),
          },
        }
      ).then((response: any) => response.json());

      return options?.objects?.[0]?.objects;
    } catch (error) {
      console.error(error);
    }
  }

  async getModelElements(urn: string) {
    try {
      const modelGuideId = await this.getMetadata(urn);
      const { data: options } = await fetch(
        `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${modelGuideId}`,
        {
          headers: {
            Authorization: await this.getAuthHeader(),
          },
        }
      ).then((response: any) => response.json());

      return options?.objects?.[0]?.objects;
    } catch (error) {
      console.error(error);
    }
  }

  async getModelElementsProperties(urn: string) {
    try {
      const modelGuideId = await this.getMetadata(urn);
      const { data } = await fetch(
        `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${modelGuideId}/properties`,
        {
          headers: {
            Authorization: await this.getAuthHeader(),
          },
        }
      ).then((response: any) => response.json());

      return data?.collection;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new SpoolService();
