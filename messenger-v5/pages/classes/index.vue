<template>
  <div class="cls-page">
    <div class="cls-head">
      <div>
        <h1 class="cls-title">Классы</h1>
        <p class="cls-sub">Ваши учебные курсы и задания</p>
      </div>
      <button class="btn btn-blue" @click="showCreate=true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Создать класс
      </button>
    </div>

    <div v-if="loading" class="empty" style="margin-top:60px"><div class="spinner" style="width:24px;height:24px;border-width:3px"></div></div>
    <div v-else-if="!classes.length" class="empty" style="margin-top:60px">
      <div class="empty-icon">🎓</div>
      <div class="empty-title">Нет классов</div>
      <div class="empty-sub">Создайте первый класс для начала</div>
      <button class="btn btn-blue" style="margin-top:16px" @click="showCreate=true">Создать класс</button>
    </div>
    <div v-else class="cls-grid">
      <ClassCard v-for="(cls,i) in classes" :key="cls.id" :cls="cls" :color="classColors[i%classColors.length]" @click="openClass(cls)"/>
    </div>

    <CreateClassModal v-if="showCreate" @close="showCreate=false" @created="onCreated"/>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useToast } from '~/composables/useToast'
import { usePostsSvc } from '~/services/posts'
definePageMeta({layout:'default'})
const postsSvc=usePostsSvc();const toast=useToast()
const loading=ref(false);const showCreate=ref(false);const allPosts=ref<any[]>([])
const classColors=['#2563eb','#7c3aed','#059669','#d97706','#dc2626','#0891b2']

// Classes = posts where body starts with {"type":"class"...}
const classes=computed(()=>allPosts.value.filter(p=>{try{const b=JSON.parse(p.body);return b.type==='class'}catch{return false}}).map(p=>{try{const b=JSON.parse(p.body);return{id:p.id,title:p.title,period:b.period||'',teacher:b.teacher||'',members:b.members||1}}catch{return null}}).filter(Boolean))

const openClass=(cls:any)=>navigateTo(`/classes/${cls.id}`)
const onCreated=(p:any)=>{allPosts.value.unshift(p);showCreate.value=false}
onMounted(async()=>{loading.value=true;try{allPosts.value=await postsSvc.list()}catch{toast.err('Ошибка загрузки')}finally{loading.value=false}})
</script>
<style scoped>
.cls-page{padding:28px 32px;height:100%;overflow-y:auto}
.cls-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
.cls-title{font-size:22px;font-weight:700;letter-spacing:-.02em}
.cls-sub{font-size:14px;color:var(--text3);margin-top:3px}
.cls-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
</style>