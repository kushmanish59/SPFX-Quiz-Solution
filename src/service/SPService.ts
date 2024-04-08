import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { SPLists } from '../helper/constants';

export const updateListItem = async (context: any, itemID: number, body: any, listName: string): Promise<number> => {
  try {
    const endpoint = `/_api/web/lists/getByTitle('${listName}')/items(${itemID})`;
    const url = `${context.pageContext.web.absoluteUrl}${endpoint}`;

    const requestOptions: ISPHttpClientOptions = {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-HTTP-Method': 'MERGE',
        'IF-MATCH': '*',
        'odata-version': ''
      },
      body: body
    };
    return await context.spHttpClient.post(url, SPHttpClient.configurations.v1, requestOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json().then((result) => {
            console.log(result.d.Id);
            return result.d.Id;
          });
        } else {
          return 0;
        }
      })
      .catch((error: any) => {
        return 0;
      });
  } catch (error) {
    console.log(error)
    return 0 ;
  }
};

export const createListItem = async (context: any, body: any, listName: string) : Promise<number> => {
  try {
    const endpoint = `/_api/web/lists/getByTitle('${listName}')/items`;
    const url = `${context.pageContext.web.absoluteUrl}${endpoint}`;

    const requestOptions: ISPHttpClientOptions = {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'odata-version': ''
      },
      body: body
    };

    const response = await context.spHttpClient.post(url, SPHttpClient.configurations.v1, requestOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json().then((result) => {
            console.log(result.d.Id);
            return result.d.Id;
          });
        } else {
          return 0;
        }
      })
      .catch((error: any) => {
        return 0;
      });

    return response;
  } catch (error) {
    console.log(error)
    return 0 ;
  }
};

export const getListItems = async (context: any, listName: string, params:string) : Promise<any> => {
  try {
    const endpoint = `/_api/web/lists/getByTitle('${listName}')/items?${params}`;
    const url = `${context.pageContext.web.absoluteUrl}${endpoint}`;

    const requestOptions: ISPHttpClientOptions = {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'odata-version': ''
      }
    };

    const response = await context.spHttpClient.get(url, SPHttpClient.configurations.v1, requestOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json().then((json: any) => {
            return json.d.results;
          });
        } else {
          return 0;
        }
      })
      .catch((error: any) => {
        return 0;
      });

    return response;
  } catch (error) {
    console.log(error)
    return 0 ;
  }
};

export const getConfigListItems = async(context:any, key:string):Promise<string> => {
  try {
    const queryString = `$select=Title,Value&$filter=Title eq '${key}'`;
    const resConfigItems = await getListItems(context,SPLists.configListTitle,queryString);
    if(resConfigItems && resConfigItems.length > 0){
      return resConfigItems[0].Value
    }
  } catch (error) {
    console.log(error)
  }
  return '';
}
