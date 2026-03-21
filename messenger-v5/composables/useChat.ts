import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/stores/auth.store'
import { useChatsStore } from '~/stores/chats.store'
import { useToast } from '~/composables/useToast'
import { useMsgsSvc } from '~/services/messages'
import { useChatsSvc } from '~/services/chats'
export const useChat=()=>{
  const store=useChatsStore();const auth=useAuthStore();const cfg=useRuntimeConfig()
  const msgSvc=useMsgsSvc();const chatSvc=useChatsSvc();const toast=useToast()
  const loadMsgs=async(id:number)=>{store.loadingMsgs=true;try{const m=await msgSvc.list(id);store.setMsgs(id,m)}catch{}finally{store.loadingMsgs=false}}
  const loadUsers=async(id:number)=>{try{const u=await chatSvc.users(id);store.setChatUsers(id,u)}catch{}}
  const connectWs=(id:number)=>{store.connectWs(id,cfg.public.wsBase,()=>loadMsgs(id))}
  const sendMsg=async(chatId:number,content:string)=>{if(!content.trim())return false;try{await msgSvc.send(chatId,content.trim());store.sendWs(chatId,{type:'new',chat_id:chatId,user_id:auth.user?.id});await loadMsgs(chatId);return true}catch(e:any){toast.err(e?.response?.data?.detail||'Не удалось отправить');return false}}
  const delMsg=async(chatId:number,msgId:number)=>{try{await msgSvc.del(msgId);store.removeMsg(chatId,msgId)}catch{toast.err('Ошибка')}}
  return{loadMsgs,loadUsers,connectWs,sendMsg,delMsg}
}