<template>
  <div class="auth-card">
    <h2 class="auth-title">Создать аккаунт</h2>
    <p class="auth-sub">Заполните данные для регистрации</p>
    <form @submit.prevent="sub" class="auth-form">
      <div class="frow"><label class="flabel">Email</label><input v-model="email" type="email" class="input" placeholder="you@company.com" required/></div>
      <div class="frow">
        <label class="flabel">Пароль</label>
        <input v-model="pw" type="password" class="input" placeholder="Минимум 6 символов" required minlength="6"/>
        <div v-if="pw" class="str-row">
          <div class="str-bar"><div :style="{width:sc+'%',background:scol}" class="str-fill"></div></div>
          <span class="str-lbl">{{slbl}}</span>
        </div>
      </div>
      <div class="frow">
        <label class="flabel">Роль</label>
        <div class="role-grid">
          <button type="button" :class="['role-btn',{active:role==='employee'}]" @click="role='employee'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Сотрудник
          </button>
          <button type="button" :class="['role-btn',{active:role==='admin'}]" @click="role='admin'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Администратор
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-blue w-full btn-lg" :disabled="loading||!valid">
        <div v-if="loading" class="spinner" style="width:15px;height:15px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
        <span v-else>Зарегистрироваться</span>
      </button>
    </form>
    <p class="auth-link-row">Уже есть аккаунт? <NuxtLink to="/login" style="color:var(--blue);font-weight:500">Войти</NuxtLink></p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
definePageMeta({layout:'auth'})
const{register}=useAuth();const email=ref('');const pw=ref('');const role=ref('employee');const loading=ref(false)
const valid=computed(()=>email.value&&pw.value.length>=6)
const score=computed(()=>{const p=pw.value;if(!p)return 0;let s=0;if(p.length>=6)s+=20;if(p.length>=10)s+=20;if(/[A-Z]/.test(p))s+=20;if(/[0-9]/.test(p))s+=20;if(/[^A-Za-z0-9]/.test(p))s+=20;return s})
const sc=computed(()=>score.value);const scol=computed(()=>sc.value<=40?'var(--red)':sc.value<=60?'var(--yellow)':'var(--green)')
const slbl=computed(()=>sc.value<=40?'Слабый':sc.value<=60?'Средний':'Надёжный')
const sub=async()=>{loading.value=true;const ok=await register(email.value,pw.value,role.value);if(ok)await navigateTo('/login');loading.value=false}
</script>
<style scoped>
.auth-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-xl);padding:32px;width:100%;max-width:420px;box-shadow:var(--sh-md)}
.auth-title{font-size:20px;font-weight:700;letter-spacing:-.02em;margin-bottom:4px}
.auth-sub{font-size:14px;color:var(--text3);margin-bottom:24px}
.auth-form{display:flex;flex-direction:column;gap:0}
.str-row{display:flex;align-items:center;gap:10px;margin-top:6px}
.str-bar{flex:1;height:3px;background:var(--surface3);border-radius:3px;overflow:hidden;max-width:100px}
.str-fill{height:100%;border-radius:3px;transition:all .3s}
.str-lbl{font-size:11px;color:var(--text4)}
.role-grid{display:flex;gap:8px}
.role-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border:1px solid var(--border2);border-radius:var(--r-md);font-size:13px;font-weight:500;color:var(--text2);background:#fff;cursor:pointer;transition:all .15s}
.role-btn:hover{border-color:var(--blue);color:var(--blue)}
.role-btn.active{border-color:var(--blue);background:var(--blue-l);color:var(--blue)}
.auth-link-row{text-align:center;font-size:13px;color:var(--text3);margin-top:20px}
</style>