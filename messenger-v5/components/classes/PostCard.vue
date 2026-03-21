<template>
  <div class="pc">
    <div class="pc-left">
      <div :class="['pc-icon',type==='lecture'?'lec':'hw']">
        <svg v-if="type==='lecture'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
    </div>
    <div class="pc-body">
      <div class="pc-type-label">{{type==='lecture'?'Лекция':'Домашнее задание'}}</div>
      <div class="pc-title">{{post.title}}</div>
      <div class="pc-preview">{{bodyPreview}}</div>
      <div class="pc-meta">
        <span>{{date}}</span>
        <span v-if="type==='hw'" class="due-badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Сдача
        </span>
      </div>
    </div>
    <div class="pc-actions">
      <button class="btn btn-ghost btn-icon" @click.stop="$emit('view')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props=defineProps<{post:{id:number;title:string;body:string;user_id:number};type:'lecture'|'hw'}>()
defineEmits<{view:[]}>()
const bodyPreview=computed(()=>props.post.body?.replace(/📎.*$/,'').trim().slice(0,120)||'')
const date=computed(()=>new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'short'}))
</script>
<style scoped>
.pc{display:flex;align-items:flex-start;gap:12px;padding:16px;background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);transition:box-shadow .15s;cursor:default}
.pc:hover{box-shadow:var(--sh-sm)}
.pc-left{flex-shrink:0;padding-top:2px}
.pc-icon{width:36px;height:36px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center}
.lec{background:var(--blue-l);color:var(--blue)}
.hw{background:var(--green-l);color:var(--green)}
.pc-body{flex:1;min-width:0}
.pc-type-label{font-size:11px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:var(--text4);margin-bottom:3px}
.pc-title{font-size:15px;font-weight:600;color:var(--text1);margin-bottom:4px}
.pc-preview{font-size:13px;color:var(--text3);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.pc-meta{display:flex;align-items:center;gap:10px;margin-top:8px;font-size:12px;color:var(--text4)}
.due-badge{display:flex;align-items:center;gap:3px;color:var(--yellow)}
.pc-actions{flex-shrink:0}
</style>