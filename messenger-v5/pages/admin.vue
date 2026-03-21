<template>
  <div class="pg">
    <div class="pg-head">
      <div>
        <h1 class="pg-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Админ-панель
        </h1>
      </div>
    </div>
    <div class="pg-body">
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          <div class="stat-val">{{users.length}}</div>
          <div class="stat-lbl">Пользователей</div>
        </div>
        <div class="stat-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <div class="stat-val">{{chatsCount}}</div>
          <div class="stat-lbl">Чатов</div>
        </div>
        <div class="stat-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          <div class="stat-val">{{classesCount}}</div>
          <div class="stat-lbl">Классов</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs" style="margin-bottom:20px">
        <button :class="['tab-btn',{active:tab==='users'}]" @click="tab='users'">Пользователи</button>
        <button :class="['tab-btn',{active:tab==='actions'}]" @click="tab='actions'">Действия</button>
      </div>

      <!-- Users tab -->
      <div v-if="tab==='users'">
        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
          <div class="search-wrap" style="flex:1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text4)"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input v-model="sq" class="search-inp" placeholder="Поиск пользователей..."/>
          </div>
          <button class="btn btn-blue btn-sm" @click="showCreate=true">+ Создать</button>
        </div>
        <div v-if="loadingU" style="display:flex;justify-content:center;padding:24px"><div class="spinner"></div></div>
        <div v-else class="users-table">
          <table>
            <thead><tr><th>Имя</th><th>Email</th><th>Роль</th><th>Дата регистрации</th><th></th></tr></thead>
            <tbody>
              <tr v-for="u in fUsers" :key="u.id">
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div :class="['av','av-sm',colorFor(u.id)]">{{u.email[0].toUpperCase()}}</div>
                    <span style="font-size:13px;font-weight:500">{{u.email.split('@')[0]}}</span>
                  </div>
                </td>
                <td style="font-size:13px;color:var(--text3)">{{u.email}}</td>
                <td>
                  <span :class="['badge',u.role==='admin'?'badge-blue':'badge-gray']">{{u.role}}</span>
                </td>
                <td style="font-size:12px;color:var(--text4)">{{today}}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <select :value="u.role" class="role-sel" :disabled="u.id===auth.user?.id" @change="setRole(u.id,($event.target as HTMLSelectElement).value)">
                      <option value="employee">Сотрудник</option><option value="admin">Администратор</option>
                    </select>
                    <button v-if="u.is_active" class="btn btn-icon btn-ghost btn-sm" :disabled="u.id===auth.user?.id" @click="doBlock(u.id)" title="Заблокировать">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    </button>
                    <button v-else class="btn btn-icon btn-ghost btn-sm" @click="doUnblock(u.id)" title="Разблокировать">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                    <button class="btn btn-icon btn-danger btn-sm" :disabled="u.id===auth.user?.id" @click="doDel(u.id)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!fUsers.length"><td colspan="5" style="text-align:center;padding:24px;color:var(--text4);font-size:13px">Пользователи не найдены</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actions tab -->
      <div v-else-if="tab==='actions'">
        <div class="action-cards">
          <div class="action-card">
            <div class="action-icon" style="background:var(--blue-l)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div>
              <div class="action-title">Создать пользователя</div>
              <div class="action-desc">Добавить нового участника</div>
            </div>
            <button class="btn btn-blue btn-sm" @click="showCreate=true">Создать</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create user modal -->
    <div v-if="showCreate" class="overlay" @click.self="showCreate=false">
      <div class="modal anim-scale">
        <div class="modal-head"><span class="modal-title">Создать пользователя</span><button class="btn btn-icon btn-ghost" @click="showCreate=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
        <div class="frow"><label class="flabel">Email</label><input v-model="nu.e" type="email" class="input" placeholder="user@company.com"/></div>
        <div class="frow"><label class="flabel">Пароль</label><input v-model="nu.p" type="password" class="input" placeholder="Минимум 6 символов"/></div>
        <div class="frow"><label class="flabel">Роль</label><select v-model="nu.r" class="input"><option value="employee">Сотрудник</option><option value="admin">Администратор</option></select></div>
        <div class="modal-foot">
          <button class="btn btn-white" @click="showCreate=false">Отмена</button>
          <button class="btn btn-blue" :disabled="!nu.e||!nu.p||crU" @click="createU">
            <div v-if="crU" class="spinner" style="width:13px;height:13px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div><span v-else>Создать</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useToast } from '~/composables/useToast'
import { useAdminSvc } from '~/services/admin'
import { useChatsSvc } from '~/services/chats'
import { usePostsSvc } from '~/services/posts'
definePageMeta({layout:'default'})
const auth=useAuthStore();const toast=useToast();const adminSvc=useAdminSvc()
const chatsSvc=useChatsSvc();const postsSvc=usePostsSvc()
const tab=ref('users');const users=ref<any[]>([]);const loadingU=ref(false);const sq=ref('');const showCreate=ref(false);const crU=ref(false)
const nu=ref({e:'',p:'',r:'employee'});const chatsCount=ref(0);const classesCount=ref(0)
const today=new Date().toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'.')
const avColors=['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const colorFor=(id:number)=>avColors[id%avColors.length]
const fUsers=computed(()=>users.value.filter(u=>u.email.toLowerCase().includes(sq.value.toLowerCase())))
const setRole=async(id:number,r:string)=>{try{await adminSvc.role(id,r);const u=users.value.find(u=>u.id===id);if(u)u.role=r;toast.ok('Роль обновлена')}catch{toast.err('Ошибка')}}
const doBlock=async(id:number)=>{try{await adminSvc.block(id);const u=users.value.find(u=>u.id===id);if(u)u.is_active=false;toast.ok('Заблокирован')}catch{toast.err('Ошибка')}}
const doUnblock=async(id:number)=>{try{await adminSvc.unblock(id);const u=users.value.find(u=>u.id===id);if(u)u.is_active=true;toast.ok('Разблокирован')}catch{toast.err('Ошибка')}}
const doDel=async(id:number)=>{try{await adminSvc.del(id);users.value=users.value.filter(u=>u.id!==id);toast.ok('Удалён')}catch{toast.err('Ошибка')}}
const createU=async()=>{crU.value=true;try{const u=await adminSvc.create({email:nu.value.e,password:nu.value.p,role:nu.value.r});users.value.unshift(u);showCreate.value=false;nu.value={e:'',p:'',r:'employee'};toast.ok('Создан')}catch(e:any){toast.err(e?.response?.data?.detail||'Ошибка')}finally{crU.value=false}}
onMounted(async()=>{
  if(!auth.isAdmin){return}
  loadingU.value=true
  try{users.value=await adminSvc.users()}catch{}finally{loadingU.value=false}
  try{const c=await chatsSvc.list();chatsCount.value=c.length}catch{}
  try{const p=await postsSvc.list();classesCount.value=p.filter((x:any)=>{try{return JSON.parse(x.body).type==='class'}catch{return false}}).length}catch{}
})
</script>
<style scoped>
.pg{height:100%;overflow-y:auto;background:var(--bg)}
.pg-head{padding:24px 32px 0;display:flex;align-items:center}
.pg-title{font-size:20px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:8px}
.pg-body{padding:20px 32px 32px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.stat-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;display:flex;align-items:center;gap:12px;box-shadow:var(--sh-xs)}
.stat-val{font-size:22px;font-weight:700}
.stat-lbl{font-size:12px;color:var(--text3)}
.search-wrap{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid var(--border2);border-radius:var(--r-md);padding:8px 10px}
.search-inp{flex:1;border:none;background:none;font-size:13px;color:var(--text1)}
.search-inp::placeholder{color:var(--text4)}
.users-table{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden}
.users-table table{width:100%;border-collapse:collapse}
.users-table th{padding:10px 14px;text-align:left;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text4);background:var(--surface2);border-bottom:1px solid var(--border)}
.users-table td{padding:10px 14px;border-bottom:1px solid var(--border);font-size:13px}
.users-table tr:last-child td{border-bottom:none}
.users-table tr:hover td{background:var(--surface2)}
.role-sel{border:1px solid var(--border2);border-radius:var(--r-sm);padding:3px 8px;font-size:12px;cursor:pointer;background:#fff;color:var(--text1)}
.action-cards{display:flex;flex-direction:column;gap:10px}
.action-card{display:flex;align-items:center;gap:14px;padding:16px;background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--sh-xs)}
.action-icon{width:40px;height:40px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.action-title{font-size:14px;font-weight:600;margin-bottom:2px}
.action-desc{font-size:12px;color:var(--text3)}
.action-card .btn{margin-left:auto}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>