import { onError } from "./onError";
import { onSuccess } from "./onSuccess";

export const copyAddress = async (text:string) => {
  
    try {
      await navigator.clipboard.writeText(text);
      onSuccess("Address Copied!!!")
     
    } catch (err) {
    
      onError(err)
    }
  };