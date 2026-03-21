<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal anim-scale">
      <div class="modal-head">
        <span class="modal-title">Создать класс</span>
        <button class="btn btn-icon btn-ghost" @click="$emit('close')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="frow"><label class="flabel">Название класса</label><input v-model="title" class="input" placeholder="Например: Математика 10А" autofocus/></div>
      <div class="frow"><label class="flabel">Период</label><input v-model="period" class="input" placeholder="Например: 2024-2025"/></div>
      <div class="frow"><label class="flabel">Учитель / Преподаватель</label><input v-model="teacher" class="input" placeholder="Ваше имя"/></div>
      <div class="modal-foot">
        <button class="btn btn-white" @click="$emit('close')">Отмена</button>
        <button class="btn btn-blue" :disabled="!title.trim()||loading" @click="submit">
          <div v-if="loading" class="spinner" style="width:13px;height:13px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
          <span v-else>Создать</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '~/composables/useToast'
import { usePostsSvc } from '~/services/posts'
const emit=defineEmits<{close:[];created:[p:any]}>()
const postsSvc=usePostsSvc();const toast=useToast()
const title=ref('');const period=ref('');const teacher=ref('');const loading=ref(false)
const submit=async()=>{
  loading.value=true
  try{
    // Кодируем мета данные класса в body
    const body=JSON.stringify({type:'class',period:period.value,teacher:teacher.value,members:1,color:''})
    const p=await postsSvc.create(title.value,body)
    toast.ok('Класс создан');emit('created',p)
  }catch(e:any){toast.err(e?.response?.data?.detail||'Ошибка')}
  finally{loading.value=false}
}
</script>