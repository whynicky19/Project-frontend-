<template>
  <div class="ai">
    <div class="ai-head">
      <div class="ai-head-l">
        <div class="ai-av">🤖</div>
        <div>
          <div style="font-size:15px;font-weight:600">ИИ Ассистент</div>
          <div style="font-size:12px;color:var(--text4)">{{ai.loading.value?'Думает...':'Готов к ответу'}}</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" @click="ai.clear()">Очистить</button>
    </div>
    <div ref="area" class="ai-area">
      <div v-if="!ai.msgs.value.length" class="ai-welcome">
        <div class="ai-welcome-icon">🤖</div>
        <h3 class="ai-welcome-title">ИИ Ассистент</h3>
        <p class="ai-welcome-desc">Задайте любой вопрос — отвечу на русском языке</p>
        <div class="ai-chips">
          <button v-for="t in tips" :key="t" class="ai-chip" @click="quick(t)">{{t}}</button>
        </div>
      </div>
      <div v-else class="ai-msgs">
        <div v-for="m in ai.msgs.value" :key="m.id" :class="['ai-msg',m.role]">
          <div :class="['ai-av-m',m.role==='user'?'u':'b']">{{m.role==='user'?uInit:'🤖'}}</div>
          <div class="ai-mc">
            <div class="ai-bbl" v-html="fmt(m.text)"></div>
            <div class="ai-ts">{{ts(m.ts)}}</div>
          </div>
        </div>
        <div v-if="ai.loading.value" class="ai-msg assistant">
          <div class="ai-av-m b">🤖</div>
          <div class="ai-mc"><div class="typing"><span></span><span></span><span></span></div></div>
        </div>
      </div>
    </div>
    <div class="ai-inp">
      <textarea ref="ta" v-model="txt" class="ai-field" placeholder="Написать сообщение..." rows="1"
        :disabled="ai.loading.value" @keydown.enter.exact.prevent="send" @input="resize"></textarea>
      <button :class="['send-btn',{active:txt.trim()}]" :disabled="!txt.trim()||ai.loading.value" @click="send">
        <div v-if="ai.loading.value" class="spinner" style="width:14px;height:14px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></div>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useAi } from '~/composables/useAi'
const auth=useAuthStore();const ai=useAi()
const area=ref<HTMLElement|null>(null);const ta=ref<HTMLTextAreaElement|null>(null);const txt=ref('')
const uInit=computed(()=>auth.user?.email?.[0]?.toUpperCase()||'?')
const tips=['Объясни тему кратко','Помоги с домашним заданием','Составь план урока','Проверь мой текст']
const ts=(d:Date)=>d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})
const fmt=(t:string)=>t.replace(/```([\w]*)?\n?([\s\S]*?)```/g,'<pre class="code-bl"><code>$2</code></pre>').replace(/`([^`]+)`/g,'<code class="ic">$1</code>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')
const scroll=()=>nextTick(()=>{if(area.value)area.value.scrollTop=area.value.scrollHeight})
const resize=()=>{if(!ta.value)return;ta.value.style.height='auto';ta.value.style.height=Math.min(ta.value.scrollHeight,120)+'px'}
const send=async()=>{if(!txt.value.trim()||ai.loading.value)return;const t=txt.value;txt.value='';if(ta.value)ta.value.style.height='auto';await ai.send(t);scroll()}
const quick=async(t:string)=>{txt.value=t;await send()}
watch(()=>ai.msgs.value.length,()=>scroll())
</script>
<style scoped>
.ai{display:flex;flex-direction:column;height:100%;background:#fff}
.ai-head{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:var(--topbar);border-bottom:1px solid var(--border);flex-shrink:0}
.ai-head-l{display:flex;align-items:center;gap:12px}
.ai-av{width:36px;height:36px;border-radius:var(--r-md);background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:16px}
.ai-area{flex:1;overflow-y:auto;padding:20px;background:var(--bg)}
.ai-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100% - 40px);text-align:center;padding:20px}
.ai-welcome-icon{font-size:48px;margin-bottom:16px}
.ai-welcome-title{font-size:20px;font-weight:700;margin-bottom:8px}
.ai-welcome-desc{font-size:14px;color:var(--text3);margin-bottom:24px;line-height:1.6}
.ai-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.ai-chip{padding:8px 16px;background:#fff;border:1px solid var(--border2);border-radius:var(--r-xl);font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .15s}
.ai-chip:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-l)}
.ai-msgs{display:flex;flex-direction:column;gap:14px}
.ai-msg{display:flex;gap:10px;animation:fadeIn .2s ease}
.ai-msg.user{flex-direction:row-reverse}
.ai-av-m{width:30px;height:30px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.ai-av-m.u{background:var(--blue)}
.ai-av-m.b{background:linear-gradient(135deg,#6366f1,#8b5cf6);font-size:16px}
.ai-mc{max-width:76%;display:flex;flex-direction:column}
.ai-msg.user .ai-mc{align-items:flex-end}
.ai-bbl{padding:10px 14px;border-radius:var(--r-lg);font-size:14px;line-height:1.55}
.ai-msg.user .ai-bbl{background:var(--blue);color:#fff;border-bottom-right-radius:4px}
.ai-msg.assistant .ai-bbl{background:#fff;border:1px solid var(--border);border-bottom-left-radius:4px;box-shadow:var(--sh-xs)}
.ai-ts{font-size:11px;color:var(--text4);margin-top:3px;padding:0 4px}
.typing{display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);border-bottom-left-radius:4px}
.typing span{width:6px;height:6px;border-radius:50%;background:var(--text4);animation:pulse 1.2s infinite}
.typing span:nth-child(2){animation-delay:.2s}.typing span:nth-child(3){animation-delay:.4s}
.ai-inp{display:flex;align-items:flex-end;gap:8px;padding:12px 16px;background:#fff;border-top:1px solid var(--border);flex-shrink:0}
.ai-field{flex:1;border:1px solid var(--border2);border-radius:var(--r-lg);padding:9px 14px;resize:none;font-size:14px;line-height:1.4;max-height:120px;transition:border-color .15s;background:#fff}
.ai-field:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.ai-field:disabled{opacity:.6}
.ai-field::placeholder{color:var(--text4)}
.send-btn{width:34px;height:34px;border-radius:var(--r-md);background:var(--surface3);color:var(--text4);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;border:none;transition:all .15s}
.send-btn.active{background:var(--blue);color:#fff}
.send-btn.active:hover{background:var(--blue-h)}
.send-btn:disabled{opacity:.5;cursor:not-allowed}
:deep(.code-bl){background:#1e1e2e;color:#cdd6f4;border-radius:var(--r-md);padding:12px;margin:6px 0;overflow-x:auto;font-size:13px;font-family:monospace;line-height:1.5}
:deep(.ic){background:rgba(0,0,0,.07);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.9em}
</style>