import { defineStore } from 'pinia'
export interface Chat{id:number;name:string}
export interface Msg{id:number;content:string;chat_id:number;user_id:number;created_at:string|null;is_read:boolean|null;fike_url:string|null}
export interface ChatUser{id:number;email:string;role:string;is_active:boolean}
export const useChatsStore = defineStore('chats',{
  state:()=>({chats:[] as Chat[],active:null as Chat|null,messages:{} as Record<number,Msg[]>,chatUsers:{} as Record<number,ChatUser[]>,loadingChats:false,loadingMsgs:false,ws:{} as Record<number,WebSocket>}),
  getters:{
    activeMsgs:(s):Msg[]=>s.active?(s.messages[s.active.id]||[]):[],
    activeUsers:(s):ChatUser[]=>s.active?(s.chatUsers[s.active.id]||[]):[],
  },
  actions:{
    setChats(c:Chat[]){this.chats=c},addChat(c:Chat){if(!this.chats.find(x=>x.id===c.id))this.chats.unshift(c)},
    setActive(c:Chat|null){this.active=c},setMsgs(id:number,m:Msg[]){this.messages[id]=m},
    removeMsg(cid:number,mid:number){if(this.messages[cid])this.messages[cid]=this.messages[cid].filter(m=>m.id!==mid)},
    setChatUsers(id:number,u:ChatUser[]){this.chatUsers[id]=u},
    connectWs(chatId:number,wsBase:string,onMsg:()=>void){
      if(this.ws[chatId])return
      const ws=new WebSocket(`${wsBase}/ws/${chatId}`)
      ws.onmessage=()=>onMsg();ws.onclose=()=>{delete this.ws[chatId]};ws.onerror=()=>{}
      this.ws[chatId]=ws
    },
    sendWs(chatId:number,d:object){const w=this.ws[chatId];if(w&&w.readyState===1)w.send(JSON.stringify(d))},
    disconnectAll(){Object.values(this.ws).forEach(w=>w.close());this.ws={}},
  },
})