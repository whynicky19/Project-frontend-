<template>
  <div :class="['cli',{active}]" @click="$emit('click')">
    <div :class="['av','av-sm',colorFor(chat.id)]">{{chat.name[0]?.toUpperCase()||'#'}}</div>
    <div style="flex:1;min-width:0">
      <div class="truncate cli-name">{{chat.name}}</div>
      <div class="cli-sub">Чат · ID {{chat.id}}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Chat } from '~/stores/chats.store'
defineProps<{chat:Chat;active:boolean}>()
defineEmits<{click:[]}>()
const avColors=['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const colorFor=(id:number)=>avColors[id%avColors.length]
</script>
<style scoped>
.cli{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .12s;border-radius:var(--r-md);margin:1px 6px}
.cli:hover{background:var(--surface2)}
.cli.active{background:var(--blue-l)}
.cli-name{font-size:14px;font-weight:500;color:var(--text1)}
.cli.active .cli-name{color:var(--blue)}
.cli-sub{font-size:12px;color:var(--text4);margin-top:1px}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>