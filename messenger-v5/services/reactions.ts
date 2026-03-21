import { useApi } from './api'
export const useReactionsSvc=()=>{
  const api=useApi()
  return{
    add:async(msgId:number,emoji:string)=>{const{data}=await api.post(`/reactions/reactions/${msgId}`,null,{params:{emoji}});return data},
    get:async(msgId:number)=>{const{data}=await api.get(`/reactions/${msgId}`);return data as any[]},
  }
}