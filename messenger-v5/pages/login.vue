<template>
  <div class="auth-card">
    <h2 class="auth-title">Добро пожаловать</h2>
    <p class="auth-sub">Войдите в свой аккаунт</p>
    <form @submit.prevent="sub" class="auth-form">
      <div class="frow"><label class="flabel">Email</label><input v-model="email" type="email" class="input" placeholder="you@company.com" required autocomplete="email"/></div>
      <div class="frow">
        <label class="flabel">Пароль</label>
        <div style="position:relative">
          <input v-model="pw" :type="show?'text':'password'" class="input" placeholder="••••••••" required style="padding-right:40px"/>
          <button type="button" @click="show=!show" class="pw-eye">
            <svg v-if="!show" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-blue w-full btn-lg" :disabled="loading" style="margin-top:4px">
        <div v-if="loading" class="spinner" style="width:15px;height:15px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
        <span v-else>Войти</span>
      </button>
    </form>
    <p class="auth-link-row">Нет аккаунта? <NuxtLink to="/register" style="color:var(--blue);font-weight:500">Зарегистрироваться</NuxtLink></p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
definePageMeta({layout:'auth'})
const{login}=useAuth();const email=ref('');const pw=ref('');const show=ref(false);const loading=ref(false)
const sub=async()=>{loading.value=true;const ok=await login(email.value,pw.value);if(ok)await navigateTo('/');loading.value=false}
</script>
<style scoped>
.auth-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-xl);padding:32px;width:100%;max-width:400px;box-shadow:var(--sh-md)}
.auth-title{font-size:20px;font-weight:700;letter-spacing:-.02em;margin-bottom:4px}
.auth-sub{font-size:14px;color:var(--text3);margin-bottom:24px}
.auth-form{display:flex;flex-direction:column;gap:0}
.pw-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--text4);background:none;border:none;cursor:pointer;padding:4px;transition:color .15s}
.pw-eye:hover{color:var(--text2)}
.auth-link-row{text-align:center;font-size:13px;color:var(--text3);margin-top:20px}
</style>