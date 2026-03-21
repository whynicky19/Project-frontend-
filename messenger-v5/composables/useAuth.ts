import { navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth.store'
import { useToast } from '~/composables/useToast'
import { useAuthSvc } from '~/services/auth'
export const useAuth=()=>{
  const auth=useAuthStore();const svc=useAuthSvc();const toast=useToast()
  const login=async(email:string,pw:string)=>{try{const t=await svc.login(email,pw);auth.setToken(t.access_token);const u=await svc.me();auth.setUser(u);return true}catch(e:any){toast.err(e?.response?.data?.detail||'Неверный email или пароль');return false}}
  const register=async(email:string,pw:string,role='employee')=>{try{await svc.register(email,pw,role);toast.ok('Аккаунт создан');return true}catch(e:any){toast.err(e?.response?.data?.detail||'Ошибка');return false}}
  const fetchMe=async()=>{if(!auth.token)return;try{const u=await svc.me();auth.setUser(u)}catch{auth.logout()}}
  const logout=()=>{auth.logout();navigateTo('/login')}
  return{login,register,fetchMe,logout}
}