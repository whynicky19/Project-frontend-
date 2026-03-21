import { defineStore } from 'pinia'
interface User{id:number;email:string;is_active:boolean;role:string}
export const useAuthStore = defineStore('auth',{
  state:()=>({token:null as string|null,user:null as User|null}),
  getters:{isAuthenticated:(s)=>!!s.token&&!!s.user,isAdmin:(s)=>s.user?.role==='admin'},
  actions:{
    setToken(t:string){this.token=t;if(import.meta.client)localStorage.setItem('_tk',t)},
    setUser(u:User){this.user=u},
    logout(){this.token=null;this.user=null;if(import.meta.client)localStorage.removeItem('_tk')},
    loadFromStorage(){if(import.meta.client){const t=localStorage.getItem('_tk');if(t)this.token=t}},
  },
})