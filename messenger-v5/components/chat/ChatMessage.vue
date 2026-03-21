<template>
  <div :class="['mrow',{own:isOwn}]">
    <div v-if="!isOwn" :class="['av','av-sm',colorFor(message.user_id)]" style="flex-shrink:0;align-self:flex-end">{{sInit}}</div>
    <div :class="['mgroup',{own:isOwn}]">
      <div v-if="!isOwn&&showName" class="msender">{{sEmail}}</div>
      <div :class="['bubble',isOwn?'b-own':'b-other']" @mouseenter="hov=true" @mouseleave="hov=false">
        <img v-if="isImg" :src="fUrl" class="msg-img" @load="$emit('scroll')" @click="lb=true"/>
        <a v-else-if="isFile" :href="fUrl" target="_blank" class="msg-file">
          <span style="font-size:20px;flex-shrink:0">{{fEmoji}}</span>
          <div><div class="mf-name truncate">{{fName}}</div><div class="mf-dl">Нажмите для скачивания</div></div>
        </a>
        <div v-else class="mtext">{{message.content}}</div>
        <div class="mfooter">
          <span class="mtime">{{mTime}}</span>
        </div>
        <Transition name="ha">
          <div v-if="hov" :class="['mactions',{own:isOwn}]">
            <button v-for="e in emojis" :key="e" class="ea" @click.stop="react(e)">{{e}}</button>
            <div class="ea-sep"></div>
            <button v-if="isOwn" class="ea-del" @click.stop="$emit('delete')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </Transition>
      </div>
      <div v-if="rxs.length" class="rxs">
        <span v-for="(cnt,em) in rxG" :key="em" class="rx-chip">{{em}} {{cnt}}</span>
      </div>
    </div>
    <div v-if="isOwn" :class="['av','av-sm','bg-b0']" style="flex-shrink:0;align-self:flex-end">{{sInit}}</div>
    <div v-if="lb" class="lightbox" @click="lb=false"><img :src="fUrl"/></div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useReactionsSvc } from '~/services/reactions'
const props=defineProps<{message:any;isOwn:boolean;chatUsers?:any[];showName?:boolean}>()
defineEmits<{delete:[];scroll:[]}>()
const auth=useAuthStore();const rxSvc=useReactionsSvc()
const hov=ref(false);const rxs=ref<any[]>([]);const lb=ref(false)
const emojis=['👍','❤️','😂','🔥','😮']
const avColors=['bg-b0','bg-b1','bg-b2','bg-b3','bg-b4','bg-b5']
const colorFor=(id:number)=>avColors[id%avColors.length]
const sInit=computed(()=>{if(props.isOwn)return auth.user?.email?.[0]?.toUpperCase()||'?';const u=props.chatUsers?.find(u=>u.id===props.message.user_id);return u?.email?.[0]?.toUpperCase()||'U'})
const sEmail=computed(()=>{const u=props.chatUsers?.find(u=>u.id===props.message.user_id);return u?.email||`User ${props.message.user_id}`})
const isImg=computed(()=>props.message.content?.startsWith('🖼️ ['))
const isFile=computed(()=>props.message.content?.startsWith('📎 ['))
const fUrl=computed(()=>props.message.content?.match(/\(([^)]+)\)/)?.[1]||'')
const fName=computed(()=>props.message.content?.match(/— (.+)$/)?.[1]||'Файл')
const fExt=computed(()=>fName.value.split('.').pop()?.toLowerCase()||'')
const fEmoji=computed(()=>({pdf:'📄',doc:'📝',docx:'📝',xls:'📊',xlsx:'📊',zip:'🗜️',mp4:'🎥',mp3:'🎵'})[fExt.value]||'📎')
const mTime=computed(()=>{if(!props.message.created_at)return '';try{return new Date(props.message.created_at).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}catch{return ''}})
const rxG=computed(()=>{const a:Record<string,number>={};rxs.value.forEach(r=>{a[r.emoji]=(a[r.emoji]||0)+1});return a})
const react=async(emoji:string)=>{try{await rxSvc.add(props.message.id,emoji);rxs.value=await rxSvc.get(props.message.id)}catch{}}
onMounted(async()=>{try{rxs.value=await rxSvc.get(props.message.id)}catch{}})
</script>
<style scoped>
.mrow{display:flex;align-items:flex-end;gap:8px;margin-bottom:4px;animation:fadeIn .15s ease;padding:0 16px}
.mrow.own{flex-direction:row-reverse}
.mgroup{display:flex;flex-direction:column;max-width:70%}
.mgroup.own{align-items:flex-end}
.msender{font-size:12px;font-weight:500;color:var(--blue);margin-bottom:3px;padding-left:12px}
.bubble{position:relative;border-radius:var(--r-lg);word-break:break-word;transition:box-shadow .15s}
.b-other{background:#fff;border-bottom-left-radius:4px;box-shadow:var(--sh-xs);border:1px solid var(--border)}
.b-own{background:var(--blue);color:#fff;border-bottom-right-radius:4px}
.mtext{font-size:14px;line-height:1.5;padding:9px 13px}
.msg-img{max-width:240px;max-height:200px;border-radius:var(--r-md);cursor:pointer;margin:6px}
.msg-file{display:flex;align-items:center;gap:10px;padding:10px 13px;text-decoration:none;color:inherit}
.mf-name{font-size:13px;font-weight:500;max-width:150px}
.mf-dl{font-size:11px;opacity:.65;margin-top:1px}
.b-own .msg-file{color:#fff}
.mfooter{display:flex;justify-content:flex-end;padding:0 10px 6px;margin-top:-2px}
.mtime{font-size:11px;opacity:.55}
.mactions{position:absolute;top:-36px;left:0;display:flex;align-items:center;gap:2px;background:#fff;border:1px solid var(--border);border-radius:100px;padding:4px 8px;box-shadow:var(--sh-md);z-index:10}
.mactions.own{left:auto;right:0}
.ea{font-size:15px;padding:2px;cursor:pointer;border:none;background:none;transition:transform .1s;line-height:1}
.ea:hover{transform:scale(1.3)}
.ea-sep{width:1px;height:14px;background:var(--border);margin:0 2px}
.ea-del{display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;cursor:pointer;border:none;background:none;color:var(--text3)}
.ea-del:hover{background:var(--red-l);color:var(--red)}
.rxs{display:flex;flex-wrap:wrap;gap:3px;margin-top:3px}
.rx-chip{font-size:12px;padding:2px 7px;background:#fff;border:1px solid var(--border);border-radius:100px}
.lightbox{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out}
.lightbox img{max-width:90vw;max-height:90vh;border-radius:var(--r-lg)}
.ha-enter-active,.ha-leave-active{transition:opacity .15s}
.ha-enter-from,.ha-leave-to{opacity:0}
.bg-b0{background:#2563eb}.bg-b1{background:#7c3aed}.bg-b2{background:#059669}.bg-b3{background:#d97706}.bg-b4{background:#dc2626}.bg-b5{background:#0891b2}
</style>