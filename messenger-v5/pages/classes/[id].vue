<template>
  <div class="cd-page">
    <!-- Header with back -->
    <div class="cd-head">
      <div class="cd-head-l">
        <NuxtLink to="/classes" class="btn btn-icon btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </NuxtLink>
        <div>
          <h1 class="cd-title">{{classTitle}}</h1>
          <div style="font-size:13px;color:var(--text3)">{{classMeta.period}}</div>
        </div>
      </div>
      <button class="btn btn-blue" @click="showCreate=true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Добавить
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs" style="margin-bottom:20px">
      <button :class="['tab-btn',{active:tab==='all'}]" @click="tab='all'">Всё</button>
      <button :class="['tab-btn',{active:tab==='lectures'}]" @click="tab='lectures'">
        📖 Лекции ({{lectures.length}})
      </button>
      <button :class="['tab-btn',{active:tab==='hw'}]" @click="tab='hw'">
        📝 Домашние задания ({{homeworks.length}})
      </button>
    </div>

    <!-- Content -->
    <div v-if="loading" class="empty"><div class="spinner" style="width:24px;height:24px;border-width:3px"></div></div>
    <div v-else>
      <!-- Lectures section -->
      <div v-if="tab==='all'||tab==='lectures'">
        <div v-if="tab==='all'" class="sec-label">📖 Лекции</div>
        <div v-if="!lectures.length" class="empty-sec">
          <span style="font-size:28px">📖</span>
          <span>Лекций пока нет</span>
        </div>
        <div v-else class="posts-list">
          <PostCard v-for="p in lectures" :key="p.id" :post="p" type="lecture" @view="viewPost(p,'lecture')"/>
        </div>
      </div>
      <div style="height:20px" v-if="tab==='all'"></div>
      <!-- HW section -->
      <div v-if="tab==='all'||tab==='hw'">
        <div v-if="tab==='all'" class="sec-label">📝 Домашние задания</div>
        <div v-if="!homeworks.length" class="empty-sec">
          <span style="font-size:28px">📝</span>
          <span>Заданий пока нет</span>
        </div>
        <div v-else class="posts-list">
          <PostCard v-for="p in homeworks" :key="p.id" :post="p" type="hw" @view="viewPost(p,'hw')"/>
        </div>
      </div>
    </div>

    <CreatePostModal v-if="showCreate" :class-id="classId" @close="showCreate=false" @created="onPostCreated"/>
    <ViewPostModal v-if="viewingPost" :post="viewingPost" @close="viewingPost=null"/>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'
import { useToast } from '~/composables/useToast'
import { usePostsSvc } from '~/services/posts'
definePageMeta({layout:'default'})
const route=useRoute();const postsSvc=usePostsSvc();const toast=useToast()
const classId=computed(()=>Number(route.params.id))
const loading=ref(false);const tab=ref<'all'|'lectures'|'hw'>('all')
const showCreate=ref(false);const viewingPost=ref<any>(null)
const allPosts=ref<any[]>([]);const classPost=ref<any>(null)

// Parse class title
const classTitle=computed(()=>classPost.value?.title||'Класс')
const classMeta=computed(()=>{try{return JSON.parse(classPost.value?.body||'{}')}catch{return{}}})

// Filter posts for this class
const classPosts=computed(()=>allPosts.value.filter(p=>p.title?.includes(`[${classId.value}]`)))
const lectures=computed(()=>classPosts.value.filter(p=>p.title?.startsWith('[LECTURE]')))
const homeworks=computed(()=>classPosts.value.filter(p=>p.title?.startsWith('[HW]')))

const viewPost=(p:any,type:'lecture'|'hw')=>{viewingPost.value={...p,type}}
const onPostCreated=(p:any)=>{allPosts.value.unshift(p)}

onMounted(async()=>{
  loading.value=true
  try{
    const posts=await postsSvc.list()
    allPosts.value=posts
    // Find the class post by id
    classPost.value=posts.find((p:any)=>{try{const b=JSON.parse(p.body);return b.type==='class'&&p.id===classId.value}catch{return false}})
  }catch{toast.err('Ошибка загрузки')}
  finally{loading.value=false}
})
</script>
<style scoped>
.cd-page{padding:24px 32px;height:100%;overflow-y:auto}
.cd-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
.cd-head-l{display:flex;align-items:center;gap:12px}
.cd-title{font-size:20px;font-weight:700;letter-spacing:-.02em}
.sec-label{font-size:14px;font-weight:600;color:var(--text2);margin-bottom:10px}
.posts-list{display:flex;flex-direction:column;gap:8px}
.empty-sec{display:flex;align-items:center;gap:10px;padding:20px;background:var(--surface2);border-radius:var(--r-lg);color:var(--text4);font-size:14px}
</style>