<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal anim-scale" style="max-width:540px">
      <div class="modal-head">
        <span class="modal-title">{{type==='lecture'?'Добавить лекцию':'Задать домашнее задание'}}</span>
        <button class="btn btn-icon btn-ghost" @click="$emit('close')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="type-tabs">
        <button :class="['type-tab',{active:type==='lecture'}]" @click="type='lecture'">📖 Лекция</button>
        <button :class="['type-tab',{active:type==='hw'}]" @click="type='hw'">📝 Домашнее задание</button>
      </div>
      <div class="frow" style="margin-top:16px">
        <label class="flabel">Заголовок</label>
        <input v-model="title" class="input" :placeholder="type==='lecture'?'Тема лекции...':'Задание...'" autofocus/>
      </div>
      <div class="frow">
        <label class="flabel">Описание / Содержание</label>
        <textarea v-model="body" class="input" rows="5" placeholder="Подробное описание..." style="resize:vertical"></textarea>
      </div>

      <!-- Прикрепить несколько файлов и фото -->
      <div class="frow">
        <label class="flabel">Прикрепить файлы / фото</label>
        <div
          class="file-drop"
          :class="{drag}"
          @dragover.prevent="drag=true"
          @dragleave="drag=false"
          @drop.prevent="onDrop"
        >
          <input type="file" style="display:none" ref="fi" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.ppt,.pptx" @change="onPick"/>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text4)"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span style="font-size:13px;color:var(--text3)">Перетащите или <button class="btn-link" @click.prevent="fi?.click()">выберите файлы</button></span>
        </div>

        <!-- Список выбранных файлов -->
        <div v-if="selFiles.length" class="sel-files">
          <div v-for="(f,i) in selFiles" :key="i" class="sel-file">
            <span style="font-size:16px">{{fileIcon(f)}}</span>
            <span class="truncate" style="font-size:13px;font-weight:500;flex:1">{{f.name}}</span>
            <span style="font-size:11px;color:var(--text4)">{{fileSize(f)}}</span>
            <button class="rm-file" @click="removeFile(i)">×</button>
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-white" @click="$emit('close')">Отмена</button>
        <button class="btn btn-blue" :disabled="!title.trim()||loading" @click="submit">
          <div v-if="loading" class="spinner" style="width:13px;height:13px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
          <span v-else>{{type==='lecture'?'Опубликовать':'Задать'}}</span>
        </button>
      </div>

      <!-- Upload progress -->
      <div v-if="uploading" class="upload-progress">
        <div class="upload-bar" :style="{width:uploadPct+'%'}"></div>
        <span style="font-size:12px;color:var(--blue)">Загрузка {{uploadCurrent}}/{{selFiles.length}}...</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '~/composables/useToast'
import { usePostsSvc } from '~/services/posts'
import { useUploadSvc } from '~/services/uploads'

const props = defineProps<{ classId: number }>()
const emit = defineEmits<{ close: []; created: [p: any] }>()
const postsSvc = usePostsSvc()
const uploadSvc = useUploadSvc()
const toast = useToast()

const type = ref<'lecture'|'hw'>('lecture')
const title = ref('')
const body = ref('')
const loading = ref(false)
const selFiles = ref<File[]>([])
const drag = ref(false)
const fi = ref<HTMLInputElement|null>(null)
const uploading = ref(false)
const uploadCurrent = ref(0)
const uploadPct = ref(0)

const fileIcon = (f: File) => {
  if (f.type.startsWith('image/')) return '🖼️'
  const ext = f.name.split('.').pop()?.toLowerCase() || ''
  return ({ pdf:'📄', doc:'📝', docx:'📝', xls:'📊', xlsx:'📊', ppt:'📋', pptx:'📋', zip:'🗜️', txt:'📃' })[ext] || '📎'
}
const fileSize = (f: File) => f.size < 1024*1024 ? (f.size/1024).toFixed(0)+' KB' : (f.size/1024/1024).toFixed(1)+' MB'

const onPick = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  selFiles.value = [...selFiles.value, ...files]
}
const onDrop = (e: DragEvent) => {
  drag.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  selFiles.value = [...selFiles.value, ...files]
}
const removeFile = (i: number) => { selFiles.value = selFiles.value.filter((_,idx) => idx !== i) }

const submit = async () => {
  loading.value = true
  uploading.value = selFiles.value.length > 0
  uploadCurrent.value = 0
  uploadPct.value = 0
  try {
    let finalBody = body.value
    // Upload all files
    const urls: string[] = []
    for (let i = 0; i < selFiles.value.length; i++) {
      uploadCurrent.value = i + 1
      uploadPct.value = Math.round(((i + 1) / selFiles.value.length) * 100)
      const { file_url } = await uploadSvc.upload(selFiles.value[i])
      urls.push(`📎 [${selFiles.value[i].name}](${file_url})`)
    }
    if (urls.length > 0) {
      finalBody += '\n\n' + urls.join('\n')
    }
    const p = await postsSvc.create(
      `[${type.value.toUpperCase()}][${props.classId}] ${title.value}`,
      finalBody
    )
    toast.ok(type.value === 'lecture' ? 'Лекция опубликована' : 'Задание задано')
    emit('created', p)
  } catch (e: any) {
    toast.err(e?.response?.data?.detail || 'Ошибка')
  } finally {
    loading.value = false
    uploading.value = false
  }
}
</script>
<style scoped>
.type-tabs{display:flex;gap:8px}
.type-tab{padding:8px 16px;border:1px solid var(--border2);border-radius:var(--r-lg);font-size:14px;font-weight:500;color:var(--text2);cursor:pointer;background:#fff;transition:all .15s}
.type-tab.active{background:var(--blue);color:#fff;border-color:var(--blue)}
.file-drop{border:1.5px dashed var(--border2);border-radius:var(--r-md);padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px;transition:all .15s;cursor:default}
.file-drop.drag{border-color:var(--blue);background:var(--blue-l)}
.btn-link{color:var(--blue);background:none;border:none;cursor:pointer;font-size:13px;text-decoration:underline;padding:0}
.sel-files{display:flex;flex-direction:column;gap:4px;margin-top:8px}
.sel-file{display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--surface2);border-radius:var(--r-sm);border:1px solid var(--border)}
.rm-file{width:18px;height:18px;border-radius:50%;border:none;background:var(--surface3);color:var(--text3);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.rm-file:hover{background:var(--red-l);color:var(--red)}
.upload-progress{margin-top:12px;padding:0 4px}
.upload-bar{height:3px;background:var(--blue);border-radius:3px;transition:width .3s;margin-bottom:4px}
</style>
