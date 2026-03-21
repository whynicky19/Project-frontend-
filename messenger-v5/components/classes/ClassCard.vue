<template>
  <div class="cc" @click="$emit('click')">
    <div class="cc-header" :style="{background:color}">
      <div class="cc-title">{{cls.title}}</div>
      <div class="cc-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
    </div>
    <div class="cc-body">
      <div class="cc-meta">{{cls.period}}</div>
      <div class="cc-members">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
        <span>{{cls.members}} уч. · {{cls.teacher}}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{cls:{id:number;title:string;period:string;members:number;teacher:string};color:string}>()
defineEmits<{click:[]}>()
</script>
<style scoped>
.cc{background:#fff;border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;cursor:pointer;transition:box-shadow .15s,transform .15s;box-shadow:var(--sh-xs)}
.cc:hover{box-shadow:var(--sh-md);transform:translateY(-2px)}
.cc-header{height:90px;display:flex;align-items:flex-start;justify-content:space-between;padding:16px;border-radius:var(--r-xl) var(--r-xl) 0 0;position:relative}
.cc-title{font-size:16px;font-weight:700;color:#fff;line-height:1.3}
.cc-icon{opacity:.7}
.cc-body{padding:14px 16px}
.cc-meta{font-size:13px;color:var(--text2);margin-bottom:8px}
.cc-members{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text3)}
</style>