import { getConfigListItems } from "./SPService"

export const getAzureFunctionURL = async(context:any,azureFunctionURLKey:string) =>{
    try {
        return await getConfigListItems(context,azureFunctionURLKey);
    } catch (error) {
        console.log(error)
    }
}
