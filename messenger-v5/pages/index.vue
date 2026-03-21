<template>
  <div class="chats-layout">
    <!-- Left panel: chat list -->
    <div class="chat-list-panel">
      <div class="clp-head">
        <h2 class="clp-title">Чаты</h2>
        <button class="btn btn-icon btn-ghost" @click="showNew=true" title="Новый чат">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <!-- Search users -->
      <div class="clp-search">
        <div class="search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text4)"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input v-model="searchQ" class="search-inp" placeholder="Поиск..." @input="onSearch"/>
        </div>
      </div>

      <!-- Search results -->
      <div v-if="searchQ&&sResults.length" class="sr-list">
        <div class="sr-head">Пользователи</div>
        <div v-for="u in sResults" :key="u.id" class="sr-item" @click="startChat(u)">
          <div :class="['av','av-sm',colorFor(u.id)]">{{u.email[0].toUpperCase()}}</div>
          <div style="flex:1;min-width:0">
            <div class="truncate" style="font-size:13px;font-weight:500">{{u.email}}</div>
            <div style="font-size:11px;color:var(--text4)">{{u.role}}</div>
          </div>
          <div class="sr-plus">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </div>
        </div>
      </div>

      <!-- Chats list -->
      <div v-if="!searchQ" class="chats-scroll">
        <div v-if="chatsStore.loadingChats" style="display:flex;justify-content:center;padding:24px"><div class="spinner"></div></div>
        <div v-else-if="!chatsStore.chats.length" class="empty" style="padding:24px 16px">
          <div style="font-size:32px">💬</div>
          <div class="empty-title" style="font-size:14px">Нет чатов</div>
          <div class="empty-sub" style="font-size:12px">Найдите пользователя выше</div>
        </div>
        <ChatListItem v-else v-for="c in chatsStore.chats" :key="c.id" :chat="c" :active="chatsStore.active?.id===c.id" @click="selectChat(c)"/>
      </div>
    </div>

    <!-- Right panel: chat window or placeholder -->
    <div class="chat-main">
      <ChatWindow v-if="chatsStore.active"/>
      <div v-else class="no-chat">
        <div style="font-size:48px;margin-bottom:16px;opacity:.3">💬</div>
        <div style="font-size:16px;font-weight:500;color:var(--text3)">Выберите чат</div>
        <div style="font-size:13px;color:var(--text4);margin-top:4px">Или создайте новый</div>
      </div>
    </div>

    <!-- Create chat modal -->
    <div v-if="showNew" class="overlay" @click.self="showNew=false">
      <div class="modal anim-scale">
        <div class="modal-head">
          <span class="modal-title">Новый чат</span>
          <button class="btn btn-icon btn-ghost" @click="showNew=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="frow"><label class="flabel">Название чата</label><input v-model="newName" class="input" placeholder="Например: Команда разработки" autofocus @keyup.enter="createChat"/></div>
        <div class="modal-foot">
          <button class="btn btn-white" @click="showNew=false">Отмена</button>
          <button class="btn btn-blue" :disabled="!newName.trim()||creating" @click="createChat">
            <div v-if="creating" class="spinner" style="width:13px;height:13px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
            <span v-else>Создать</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useChatsStore } from '~/stores/chats.store'
import { useToast } from '~/composables/useToast'
import { useChatsSvc } from '~/services/chats'
import { useAdminSvc } from '~/services/admin'
definePageMeta({layout:'default'})
const auth=useAuthStore();const chatsStore=useChatsStore()
const chatsSvc=useChatsSvc();const adminSvc=useAdminSvc();const toast=useToast()
const searchQ=ref('');const sResults=ref<any[]>([]);const showNew=ref(false)
const newName=ref('');const creating=ref(false)
const avColors=['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const colorFor=(id:number)=>avColors[id%avColors.length]
let st:any=null
const onSearch=()=>{clearTimeout(st);if(!searchQ.value.trim()){sResults.value=[];return};st=setTimeout(async()=>{try{const all=await adminSvc.users();sResults.value=all.filter((u:any)=>u.email.toLowerCase().includes(searchQ.value.toLowerCase())&&u.id!==auth.user?.id)}catch{sResults.value=[]}},350)}
const startChat=async(user:any)=>{try{const c=await chatsSvc.create(`Чат с ${user.email}`);chatsStore.addChat(c);chatsStore.setActive(c);searchQ.value='';sResults.value=[];toast.ok('Чат создан')}catch{toast.err('Ошибка')}}
const selectChat=(c:any)=>chatsStore.setActive(c)
const createChat=async()=>{if(!newName.value.trim())return;creating.value=true;try{const c=await chatsSvc.create(newName.value.trim());chatsStore.addChat(c);chatsStore.setActive(c);showNew.value=false;newName.value='';toast.ok('Чат создан')}catch{toast.err('Ошибка')}finally{creating.value=false}}
onMounted(async()=>{chatsStore.loadingChats=true;try{const c=await chatsSvc.list();chatsStore.setChats(c)}catch{toast.err('Не удалось загрузить чаты')}finally{chatsStore.loadingChats=false}})
</script>
<style scoped>
.chats-layout{display:flex;height:100%;overflow:hidden}
.chat-list-panel{width:300px;flex-shrink:0;border-right:1px solid var(--border);display:flex;flex-direction:column;background:#fff;overflow:hidden}
.clp-head{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 10px}
.clp-title{font-size:16px;font-weight:600}
.clp-search{padding:0 12px 8px}
.search-wrap{display:flex;align-items:center;gap:7px;background:var(--surface2);border-radius:var(--r-md);padding:8px 10px}
.search-inp{flex:1;border:none;background:none;font-size:13px;color:var(--text1)}
.search-inp::placeholder{color:var(--text4)}
.sr-list{padding:0 8px 8px;border-bottom:1px solid var(--border)}
.sr-head{font-size:11px;font-weight:600;color:var(--text4);letter-spacing:.04em;text-transform:uppercase;padding:4px 6px 6px}
.sr-item{display:flex;align-items:center;gap:9px;padding:8px 6px;border-radius:var(--r-md);cursor:pointer;transition:background .12s}
.sr-item:hover{background:var(--blue-l)}
.sr-plus{width:22px;height:22px;border-radius:50%;background:var(--blue-l);color:var(--blue);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.chats-scroll{flex:1;overflow-y:auto}
.chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.no-chat{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>