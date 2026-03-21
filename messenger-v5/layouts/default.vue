<template>
  <div class="shell">
    <AppSidebar />
    <main class="shell-main"><slot /></main>
    <ToastContainer />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth.store'
const{fetchMe}=useAuth();const auth=useAuthStore()
onMounted(async()=>{if(auth.token&&!auth.user)await fetchMe()})
</script>
<style scoped>
.shell{display:flex;height:100vh;overflow:hidden;background:var(--bg)}
.shell-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
</style>