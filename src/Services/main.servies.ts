import { Endpoint } from './endpoint';

class MainService {

  async LoginAsync(uri: string, bodyParam: any) {
    const url = Endpoint.URL_BASE + uri;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyParam),
      });

      if (response != null && response.status === 200) {
        return await response.json();
      }

      return null;

    } catch (error) {

      return null;
    }
  }
  async GetDataAsync(uri: string) {
    const url = Endpoint.URL_BASE + uri;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return await response.json();
      }

      return null;

    } catch (error) {

      return null;
    }
  }
  async PostDataNoAuthAsync(uri: string, bodyParam: any) {
    const url = Endpoint.URL_BASE + uri;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyParam),
      });
      return await response.json();
    } catch (error) {
      return null;
    }
  }
  async PostDataAsync(uri: string) {
    const url = Endpoint.URL_BASE + uri;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return await response.json();
      }

      return null;

    } catch (error) {

      return null;
    }
  }

  async PostDataWithFilesBodyAsync(uri: string, bodyParam: any) {
    const url = Endpoint.URL_BASE + uri;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: bodyParam,
      });

      if (response.status == 200) {
        const responseJson = await response.json();
        return responseJson;
      }

      return null;

    } catch (error) {
      return null;
    }
  }

  async PostDataWithBodyAsync(uri: string, bodyParam: any) {
    const url = Endpoint.URL_BASE + uri;
    const cookies = '';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',

          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyParam),
      });
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async PutDataAsync(uri: string, bodyParam: any) {
    const cookies = await '';
    const url = Endpoint.URL_BASE + uri;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyParam),
      });
      if (response.status === 200) {
        return await response.json();
      }

      return null;

    } catch (error) {

      return null;
    }
  }

  async DeleteAsync(uri: string) {
    const url = Endpoint.URL_BASE + uri;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return await response.json();
      }

      return null;
    }
    catch (error) {
      return null;
    }
  }

}
export default new MainService;
