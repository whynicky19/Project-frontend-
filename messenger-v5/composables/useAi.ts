import { ref } from 'vue'
import { useToast } from '~/composables/useToast'

interface Msg { id: number; role: 'user' | 'assistant'; text: string; ts: Date }

// Groq API key — замени на свой ключ на https://console.groq.com
const GROQ_API_KEY = 'your_groq_api_key'

export const useAi = () => {
  const msgs = ref<Msg[]>([])
  const loading = ref(false)
  const toast = useToast()
  let n = 0

  const send = async (text: string) => {
    if (!text.trim() || loading.value) return
    const um: Msg = { id: ++n, role: 'user', text: text.trim(), ts: new Date() }
    msgs.value.push(um)
    loading.value = true
    try {
      const history = msgs.value
        .filter(m => m.id !== um.id)
        .map(m => ({ role: m.role, content: m.text }))

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Ты AI-ассистент. Отвечай на русском языке.' },
            ...history,
            { role: 'user', content: text.trim() },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!res.ok) {
        const e = await res.json()
        throw new Error(e?.error?.message || `Groq error ${res.status}`)
      }

      const d = await res.json()
      const t = d.choices?.[0]?.message?.content || ''
      msgs.value.push({ id: ++n, role: 'assistant', text: t, ts: new Date() })
    } catch (e: any) {
      toast.err('AI: ' + (e.message || 'ошибка'))
      msgs.value = msgs.value.filter(m => m.id !== um.id)
    } finally {
      loading.value = false
    }
  }

  return { msgs, loading, send, clear: () => { msgs.value = [] } }
}
