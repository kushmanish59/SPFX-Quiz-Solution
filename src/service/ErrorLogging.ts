import { SPLists } from "../helper/constants";
import { createListItem } from "./SPService";

export const ErrorLogging = async (context:any,error:any,fileName:string) => {
    try{
    const currentDate = new Date();
    const errorLogBody = JSON.stringify({
        __metadata: { type: `SP.Data.${SPLists.errorLogsInternalName}ListItem` },
        'Title': fileName,
        'Error': error,
        'Date': currentDate
      })

      console.log(error);
      return await createListItem(context, errorLogBody, SPLists.errorLogsTitle);
  }catch(error){
    console.log(error)
  }
}

