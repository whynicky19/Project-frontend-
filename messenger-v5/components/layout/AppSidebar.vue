<template>
  <aside class="sb">
    <!-- Logo -->
    <div class="sb-top">
      <div class="sb-logo">
        <div class="sb-logo-icon">M</div>
        <span class="sb-logo-text">Messenger</span>
      </div>
    </div>

    <!-- Nav items -->
    <nav class="sb-nav">
      <NuxtLink to="/" class="sb-item" :class="{active:route.path==='/'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        <span>Чаты</span>
      </NuxtLink>
      <NuxtLink to="/ai" class="sb-item" :class="{active:route.path==='/ai'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <span>ИИ Ассистент</span>
      </NuxtLink>
      <NuxtLink to="/classes" class="sb-item" :class="{active:route.path.startsWith('/classes')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        <span>Классы</span>
      </NuxtLink>
      <NuxtLink to="/settings" class="sb-item" :class="{active:route.path==='/settings'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        <span>Настройки</span>
      </NuxtLink>
      <NuxtLink v-if="auth.isAdmin" to="/admin" class="sb-item" :class="{active:route.path==='/admin'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Админ</span>
      </NuxtLink>
    </nav>

    <!-- User at bottom -->
    <div class="sb-bottom">
      <div class="sb-user">
        <div :class="['av','av-sm',avColor]">{{uInit}}</div>
        <div style="flex:1;min-width:0">
          <div class="truncate" style="font-size:13px;font-weight:500;color:var(--text1)">{{displayName}}</div>
          <div class="truncate" style="font-size:11px;color:var(--text4)">{{auth.user?.email}}</div>
        </div>
        <button class="btn btn-icon btn-ghost" @click="doLogout" title="Выйти">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import { useAuthStore } from '~/stores/auth.store'
import { useChatsStore } from '~/stores/chats.store'
import { useAuth } from '~/composables/useAuth'
const auth=useAuthStore();const chatsStore=useChatsStore();const{logout}=useAuth();const route=useRoute()
const uInit=computed(()=>auth.user?.email?.[0]?.toUpperCase()||'?')
const displayName=computed(()=>auth.user?.email?.split('@')[0]||'')
const avColors=['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const avColor=computed(()=>avColors[(auth.user?.id||0)%avColors.length])
const doLogout=()=>{chatsStore.disconnectAll();logout()}
</script>
<style scoped>
.sb{width:var(--sidebar);height:100%;display:flex;flex-direction:column;background:#fff;border-right:1px solid var(--border);flex-shrink:0}
.sb-top{padding:16px 16px 8px}
.sb-logo{display:flex;align-items:center;gap:10px}
.sb-logo-icon{width:32px;height:32px;background:var(--blue);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0}
.sb-logo-text{font-size:16px;font-weight:700;color:var(--text1)}
.sb-nav{flex:1;padding:8px 8px;display:flex;flex-direction:column;gap:1px;overflow-y:auto}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-md);font-size:14px;font-weight:500;color:var(--text3);transition:all .15s;cursor:pointer;text-decoration:none}
.sb-item:hover{background:var(--surface2);color:var(--text1)}
.sb-item.active{background:var(--blue-l);color:var(--blue)}
.sb-item.active svg{stroke:var(--blue)}
.sb-bottom{padding:12px;border-top:1px solid var(--border)}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 4px}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>