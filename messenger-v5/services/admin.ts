import { useApi } from './api'
export const useAdminSvc=()=>{
  const api=useApi()
  return{
    users:async()=>{const{data}=await api.get('/admin/users');return data as any[]},
    create:async(p:{email:string;password:string;role:string})=>{const{data}=await api.post('/admin/users',p);return data},
    role:async(id:number,r:string)=>{await api.put(`/admin/users/${id}/role`,null,{params:{new_role:r}})},
    block:async(id:number)=>{await api.put(`/admin/users/${id}/block`)},
    unblock:async(id:number)=>{await api.put(`/admin/users/${id}/unblock`)},
    del:async(id:number)=>{await api.delete(`/admin/users/${id}`)},
  }
}