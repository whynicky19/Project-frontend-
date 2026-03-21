<template>
  <div class="pg">
    <div class="pg-head"><h1 class="pg-title">Настройки</h1></div>
    <div class="pg-body">
      <!-- Profile -->
      <div class="card" style="margin-bottom:16px">
        <div class="sec-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Профиль</div>
        <div class="profile-row">
          <div class="profile-av-wrap">
            <div :class="['av','av-xl',avColor]">{{uInit}}</div>
            <button class="av-edit-btn" title="Изменить фото">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
          </div>
          <div style="flex:1">
            <div class="profile-name">{{displayName}}</div>
            <div class="profile-email">{{auth.user?.email}}</div>
            <div class="profile-role">
              <span :class="['badge',auth.user?.role==='admin'?'badge-blue':'badge-gray']">{{auth.user?.role}}</span>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="frow"><label class="flabel">Имя пользователя</label><input v-model="username" class="input" :placeholder="displayName"/></div>
        <div class="frow"><label class="flabel">Email</label><input :value="auth.user?.email" class="input" disabled style="opacity:.6"/></div>
      </div>
      <!-- Appearance -->
      <div class="card" style="margin-bottom:16px">
        <div class="sec-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Внешний вид</div>
        <div class="appear-row">
          <div>
            <div style="font-size:14px;font-weight:500">Тёмная тема</div>
            <div style="font-size:13px;color:var(--text3);margin-top:2px">Включить тёмный режим</div>
          </div>
          <label class="toggle"><input type="checkbox" v-model="darkMode" @change="applyTheme"/><span class="tog-t"></span></label>
        </div>
        <div class="divider"></div>
        <div style="margin-bottom:8px;font-size:13px;font-weight:500;color:var(--text2)">Акцентный цвет</div>
        <div class="color-row">
          <button v-for="c in colors" :key="c" :class="['c-swatch',{sel:accent===c}]" :style="{background:c}" @click="setAccent(c)">
            <svg v-if="accent===c" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>
      <!-- Save button -->
      <button class="btn btn-blue" @click="save">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Сохранить
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useToast } from '~/composables/useToast'
definePageMeta({layout:'default'})
const auth=useAuthStore();const toast=useToast()
const username=ref('');const darkMode=ref(false);const accent=ref('#2563eb')
const colors=['#2563eb','#7c3aed','#059669','#d97706','#dc2626','#0891b2','#db2777']
const uInit=computed(()=>auth.user?.email?.[0]?.toUpperCase()||'?')
const displayName=computed(()=>auth.user?.email?.split('@')[0]||'')
const avColors=['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const avColor=computed(()=>avColors[(auth.user?.id||0)%avColors.length])
const setAccent=(c:string)=>{accent.value=c;document.documentElement.style.setProperty('--blue',c);document.documentElement.style.setProperty('--blue-h',c);localStorage.setItem('accent',c)}
const applyTheme=()=>{
  if(darkMode.value){
    document.documentElement.style.setProperty('--bg','#111827');document.documentElement.style.setProperty('--surface','#1f2937');
    document.documentElement.style.setProperty('--text1','#f9fafb');document.documentElement.style.setProperty('--text2','#d1d5db');
    document.documentElement.style.setProperty('--border','#374151');
  }else{
    document.documentElement.style.setProperty('--bg','#f9fafb');document.documentElement.style.setProperty('--surface','#ffffff');
    document.documentElement.style.setProperty('--text1','#111827');document.documentElement.style.setProperty('--text2','#374151');
    document.documentElement.style.setProperty('--border','#e5e7eb');
  }
  localStorage.setItem('darkMode',darkMode.value?'1':'0')
}
const save=()=>{if(username.value)localStorage.setItem('username',username.value);toast.ok('Настройки сохранены')}
onMounted(()=>{
  const a=localStorage.getItem('accent');if(a)setAccent(a)
  const d=localStorage.getItem('darkMode');if(d==='1'){darkMode.value=true;applyTheme()}
  const u=localStorage.getItem('username');if(u)username.value=u
})
</script>
<style scoped>
.pg{height:100%;overflow-y:auto;background:var(--bg)}
.pg-head{padding:24px 32px 0;display:flex;align-items:center;justify-content:space-between}
.pg-title{font-size:20px;font-weight:700;letter-spacing:-.02em}
.pg-body{padding:20px 32px 32px;max-width:640px}
.sec-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:var(--text2);margin-bottom:16px}
.profile-row{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.profile-av-wrap{position:relative}
.av-edit-btn{position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer}
.profile-name{font-size:16px;font-weight:600;margin-bottom:2px}
.profile-email{font-size:13px;color:var(--text3);margin-bottom:6px}
.appear-row{display:flex;align-items:center;justify-content:space-between}
.color-row{display:flex;flex-wrap:wrap;gap:8px}
.c-swatch{width:30px;height:30px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:transform .15s;display:flex;align-items:center;justify-content:center}
.c-swatch:hover{transform:scale(1.1)}
.c-swatch.sel{border-color:#fff;box-shadow:0 0 0 3px var(--blue)}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>