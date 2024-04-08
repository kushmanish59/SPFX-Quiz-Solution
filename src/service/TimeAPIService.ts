import { HttpClient, HttpClientResponse,IHttpClientOptions } from '@microsoft/sp-http';
const timeAPIEndPoint = 'https://timeapi.io/api'
import { getAzureFunctionURL } from './AzureFunctionService';
import { AzureFunctionKeys } from '../helper/constants';

export const TimeService = async (url: string,context:any, configBody:any) => {
    const azureFunctionURL = await getAzureFunctionURL(context,AzureFunctionKeys.azureFunctionGetTimeAPIURLKey);
    // let reqInit = {
    //     headers: {
    //       'Accept': 'application/json',
    //     //   'Access-Control-Allow-Origin': 'https://vk08.sharepoint.com',
    //     //   "Access-Control-Allow-Headers": "X-Requested-With"
    //       //'mode': 'no-cors',
    //     }
    // }
    // let timeAPICompleteURL =  `${timeAPIEndPoint}${url}`;
    // return new Promise((resolve, reject) => {
    //     axios.get(`${timeAPICompleteURL}`,reqInit)
    //         .then((response) => {
    //             resolve(response)
    //         }).catch((error: any) => {
    //             reject(error);
    //         })
    // })
    // const timeAPIBody = {
    //     "fromTimeZone": "Europe/Amsterdam",
    //     "dateTime": "2021-03-14 17:45:00",
    //     "toTimeZone": "America/Los_Angeles",
    //     "dstAmbiguity": ""
    // }
   
    const timeAPICompleteURL = `${timeAPIEndPoint}${url}`;
    const azReqBody = {
        "url":timeAPICompleteURL,
        "content":`${JSON.stringify(configBody)}`
    }
    const httpClientOptions: IHttpClientOptions = {
        headers: new Headers(),
        method: "POST",
        body:JSON.stringify(azReqBody)
    };
    return context.httpClient.post(
        azureFunctionURL, HttpClient.configurations.v1,httpClientOptions
    )
      .then((response: HttpClientResponse) => {
        return response.json();
      })
      .then((jsonResponse: any) => {
        return jsonResponse;
      }) as Promise<any>;
}