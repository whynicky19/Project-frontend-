import { useAuthStore } from '~/stores/auth.store'
export default defineNuxtPlugin(()=>{const a=useAuthStore();a.loadFromStorage()})