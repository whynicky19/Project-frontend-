<template>
  <div class="cw">
    <!-- Header -->
    <div class="cw-head">
      <div class="cw-head-left">
        <div :class="['av','av-sm',colorFor(chatsStore.active?.id||0)]">{{cInit}}</div>
        <div>
          <div class="cw-name">{{chatsStore.active?.name}}</div>
          <div class="cw-sub">{{chatsStore.activeUsers.length}} участников</div>
        </div>
      </div>
      <div class="cw-head-right">
        <button class="btn btn-icon btn-ghost" @click="showSearch=!showSearch" title="Поиск в сообщениях">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <button class="btn btn-icon btn-ghost" @click="showUsers=!showUsers" title="Участники">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
        </button>
        <!-- Кнопка добавления участника -->
        <button class="btn btn-icon btn-ghost" @click="showAddUser=true" title="Добавить участника">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div v-if="showSearch" class="search-bar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text4)"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input v-model="searchQ" class="input input-sm" placeholder="Поиск в сообщениях..." style="border:none;box-shadow:none;padding:0;flex:1"/>
    </div>

    <!-- Users panel -->
    <div v-if="showUsers&&chatsStore.activeUsers.length" class="users-bar">
      <div v-for="u in chatsStore.activeUsers" :key="u.id" class="u-chip">
        <div :class="['av','av-xs',colorFor(u.id)]">{{u.email[0].toUpperCase()}}</div>
        <span style="font-size:12px;font-weight:500;max-width:120px" class="truncate">{{u.email.split('@')[0]}}</span>
        <button class="u-remove" @click="removeUser(u.id)" title="Удалить из чата">×</button>
      </div>
    </div>

    <!-- Messages -->
    <div ref="area" class="msg-area">
      <div v-if="chatsStore.loadingMsgs" class="empty"><div class="spinner"></div></div>
      <div v-else-if="!filteredMsgs.length" class="empty">
        <div class="empty-icon">💬</div>
        <div class="empty-title">{{searchQ?'Ничего не найдено':'Нет сообщений'}}</div>
        <div class="empty-sub">{{searchQ?'Попробуйте другой запрос':'Начните переписку'}}</div>
      </div>
      <div v-else class="msgs">
        <div style="height:8px"></div>
        <ChatMessage
          v-for="(msg,i) in filteredMsgs" :key="msg.id"
          :message="msg" :is-own="msg.user_id===auth.user?.id"
          :chat-users="chatsStore.activeUsers"
          :show-name="!filteredMsgs[i-1]||filteredMsgs[i-1].user_id!==msg.user_id"
          @delete="doDelete(msg.id)" @scroll="scrollBottom"
        />
        <div style="height:8px"></div>
      </div>
    </div>

    <!-- Input -->
    <div class="inp-wrap">
      <div v-if="pFile" class="pfile-bar">
        <span>{{pFile.type.startsWith('image/')?'🖼️':'📎'}} {{pFile.name}}</span>
        <button class="btn btn-icon btn-ghost btn-sm" @click="pFile=null">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="inp-row">
        <label class="attach-lbl" title="Прикрепить файл">
          <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" style="display:none" @change="onPick"/>
          <div class="attach-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
          </div>
        </label>
        <textarea ref="ta" v-model="txt" class="msg-inp" placeholder="Написать сообщение..." rows="1"
          @keydown.enter.exact.prevent="doSend" @input="resize"></textarea>
        <button :class="['send-btn',{active:txt.trim()||pFile}]" :disabled="(!txt.trim()&&!pFile)||sending" @click="doSend">
          <div v-if="sending" class="spinner" style="width:14px;height:14px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>

    <!-- Модалка добавления участника по email -->
    <div v-if="showAddUser" class="overlay" @click.self="closeAddUser">
      <div class="modal anim-scale">
        <div class="modal-head">
          <span class="modal-title">Добавить участника</span>
          <button class="btn btn-icon btn-ghost" @click="closeAddUser">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <!-- Поиск по email -->
        <div class="frow">
          <label class="flabel">Поиск по email</label>
          <div class="add-search-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text4);flex-shrink:0"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input v-model="addSearchQ" class="add-search-inp" placeholder="Введите email..." @input="onAddSearch"/>
          </div>
        </div>
        <!-- Результаты поиска -->
        <div v-if="addSearchQ&&addResults.length" class="add-results">
          <div v-for="u in addResults" :key="u.id" class="add-result-item">
            <div :class="['av','av-sm',colorFor(u.id)]">{{u.email[0].toUpperCase()}}</div>
            <div style="flex:1;min-width:0">
              <div class="truncate" style="font-size:13px;font-weight:500">{{u.email}}</div>
              <div style="font-size:11px;color:var(--text4)">{{u.role}}</div>
            </div>
            <button
              class="btn btn-blue btn-sm"
              :disabled="isAlreadyMember(u.id)||addingId===u.id"
              @click="doAddUser(u)"
            >
              <div v-if="addingId===u.id" class="spinner" style="width:12px;height:12px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
              <span v-else-if="isAlreadyMember(u.id)">Уже в чате</span>
              <span v-else>Добавить</span>
            </button>
          </div>
        </div>
        <div v-else-if="addSearchQ&&!addResults.length&&!addSearching" class="add-empty">
          Пользователи не найдены
        </div>
        <div v-if="addSearching" style="display:flex;justify-content:center;padding:12px">
          <div class="spinner"></div>
        </div>
        <!-- Текущие участники -->
        <div v-if="chatsStore.activeUsers.length" style="margin-top:16px">
          <div class="flabel">Участники чата ({{chatsStore.activeUsers.length}})</div>
          <div class="members-list">
            <div v-for="u in chatsStore.activeUsers" :key="u.id" class="member-row">
              <div :class="['av','av-xs',colorFor(u.id)]">{{u.email[0].toUpperCase()}}</div>
              <span class="truncate" style="font-size:13px;flex:1">{{u.email}}</span>
              <button
                v-if="u.id!==auth.user?.id"
                class="btn btn-danger btn-sm"
                @click="removeUser(u.id)"
              >Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useChatsStore } from '~/stores/chats.store'
import { useChat } from '~/composables/useChat'
import { useToast } from '~/composables/useToast'
import { useUploadSvc } from '~/services/uploads'
import { useChatsSvc } from '~/services/chats'
import { useAdminSvc } from '~/services/admin'

const auth = useAuthStore()
const chatsStore = useChatsStore()
const { loadMsgs, loadUsers, connectWs, sendMsg, delMsg } = useChat()
const uploadSvc = useUploadSvc()
const chatsSvc = useChatsSvc()
const adminSvc = useAdminSvc()
const toast = useToast()

const area = ref<HTMLElement|null>(null)
const ta = ref<HTMLTextAreaElement|null>(null)
const txt = ref('')
const sending = ref(false)
const pFile = ref<File|null>(null)
const showUsers = ref(false)
const showSearch = ref(false)
const searchQ = ref('')

// Add user state
const showAddUser = ref(false)
const addSearchQ = ref('')
const addResults = ref<any[]>([])
const addSearching = ref(false)
const addingId = ref<number|null>(null)
let addSt: any = null

const avColors = ['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const colorFor = (id: number) => avColors[id % avColors.length]
const cInit = computed(() => chatsStore.active?.name?.[0]?.toUpperCase() || '#')
const filteredMsgs = computed(() => {
  if (!searchQ.value) return chatsStore.activeMsgs
  return chatsStore.activeMsgs.filter(m => m.content?.toLowerCase().includes(searchQ.value.toLowerCase()))
})

const isAlreadyMember = (uid: number) => chatsStore.activeUsers.some(u => u.id === uid)

const scrollBottom = () => nextTick(() => { if (area.value) area.value.scrollTop = area.value.scrollHeight })
const resize = () => { if (!ta.value) return; ta.value.style.height = 'auto'; ta.value.style.height = Math.min(ta.value.scrollHeight, 140) + 'px' }
const onPick = (e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) pFile.value = f }

const closeAddUser = () => { showAddUser.value = false; addSearchQ.value = ''; addResults.value = [] }

const onAddSearch = () => {
  clearTimeout(addSt)
  if (!addSearchQ.value.trim()) { addResults.value = []; return }
  addSearching.value = true
  addSt = setTimeout(async () => {
    try {
      const all = await adminSvc.users()
      addResults.value = all.filter((u: any) =>
        u.email.toLowerCase().includes(addSearchQ.value.toLowerCase())
      )
    } catch { addResults.value = [] }
    finally { addSearching.value = false }
  }, 350)
}

const doAddUser = async (user: any) => {
  if (!chatsStore.active) return
  addingId.value = user.id
  try {
    await chatsSvc.addUser(chatsStore.active.id, user.id)
    await loadUsers(chatsStore.active.id)
    toast.ok(`${user.email} добавлен в чат`)
  } catch (e: any) {
    toast.err(e?.response?.data?.detail || 'Ошибка')
  } finally {
    addingId.value = null
  }
}

const removeUser = async (userId: number) => {
  if (!chatsStore.active) return
  try {
    await chatsSvc.removeUser(chatsStore.active.id, userId)
    await loadUsers(chatsStore.active.id)
    toast.ok('Участник удалён')
  } catch {
    toast.err('Ошибка')
  }
}

const doSend = async () => {
  if (!chatsStore.active) return
  if (!txt.value.trim() && !pFile.value) return
  sending.value = true
  try {
    let content = txt.value.trim()
    if (pFile.value) {
      const { file_url } = await uploadSvc.upload(pFile.value)
      const isImg = pFile.value.type.startsWith('image/')
      content = isImg
        ? `🖼️ [Фото](${file_url}) — ${pFile.value.name}`
        : `📎 [Файл](${file_url}) — ${pFile.value.name}`
      pFile.value = null
    }
    if (content) {
      const ok = await sendMsg(chatsStore.active.id, content)
      if (ok) { txt.value = ''; if (ta.value) ta.value.style.height = 'auto' }
    }
    scrollBottom()
  } finally { sending.value = false }
}

const doDelete = (id: number) => { if (chatsStore.active) delMsg(chatsStore.active.id, id) }

watch(() => chatsStore.active, async c => {
  if (c) { await Promise.all([loadMsgs(c.id), loadUsers(c.id)]); connectWs(c.id); scrollBottom() }
}, { immediate: true })
watch(() => chatsStore.activeMsgs.length, () => scrollBottom())
</script>
<style scoped>
.cw{display:flex;flex-direction:column;height:100%;background:#fff}
.cw-head{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:var(--topbar);border-bottom:1px solid var(--border);flex-shrink:0;background:#fff}
.cw-head-left{display:flex;align-items:center;gap:10px}
.cw-name{font-size:15px;font-weight:600}
.cw-sub{font-size:12px;color:var(--text4);margin-top:1px}
.cw-head-right{display:flex;gap:4px}
.search-bar{display:flex;align-items:center;gap:8px;padding:8px 16px;border-bottom:1px solid var(--border);background:var(--surface2)}
.users-bar{display:flex;flex-wrap:wrap;gap:6px;padding:8px 16px;border-bottom:1px solid var(--border);background:var(--surface2)}
.u-chip{display:flex;align-items:center;gap:5px;background:#fff;border:1px solid var(--border);border-radius:100px;padding:3px 6px 3px 4px}
.u-remove{width:16px;height:16px;border-radius:50%;border:none;background:var(--surface3);color:var(--text3);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.u-remove:hover{background:var(--red-l);color:var(--red)}
.msg-area{flex:1;overflow-y:auto;background:var(--bg)}
.msgs{display:flex;flex-direction:column;gap:1px}
.inp-wrap{border-top:1px solid var(--border);background:#fff;flex-shrink:0}
.pfile-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 14px;background:var(--blue-l);border-bottom:1px solid var(--blue-m);font-size:13px;color:var(--blue);font-weight:500}
.inp-row{display:flex;align-items:flex-end;gap:8px;padding:10px 14px}
.attach-lbl{cursor:pointer;flex-shrink:0}
.attach-btn{width:32px;height:32px;border-radius:var(--r-sm);background:var(--surface2);display:flex;align-items:center;justify-content:center;color:var(--text3);transition:all .15s}
.attach-btn:hover{background:var(--blue-l);color:var(--blue)}
.msg-inp{flex:1;border:1px solid var(--border2);border-radius:var(--r-lg);padding:8px 14px;resize:none;font-size:14px;line-height:1.4;max-height:140px;transition:border-color .15s;background:#fff;color:var(--text1)}
.msg-inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.msg-inp::placeholder{color:var(--text4)}
.send-btn{width:34px;height:34px;border-radius:var(--r-md);background:var(--surface3);color:var(--text4);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;border:none;transition:all .15s}
.send-btn.active{background:var(--blue);color:#fff}
.send-btn.active:hover{background:var(--blue-h)}
.send-btn:disabled{opacity:.5;cursor:not-allowed}
/* Add user modal */
.add-search-wrap{display:flex;align-items:center;gap:8px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-md);padding:8px 12px}
.add-search-inp{flex:1;border:none;background:none;font-size:14px;color:var(--text1)}
.add-search-inp::placeholder{color:var(--text4)}
.add-results{display:flex;flex-direction:column;gap:6px;margin-top:4px;max-height:200px;overflow-y:auto}
.add-result-item{display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--r-md);background:var(--surface2)}
.add-empty{text-align:center;font-size:13px;color:var(--text4);padding:12px}
.members-list{display:flex;flex-direction:column;gap:4px;max-height:160px;overflow-y:auto;margin-top:6px}
.member-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:var(--r-sm);background:var(--surface2)}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>
