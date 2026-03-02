<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-primary-500/20 border border-primary-500/30 rounded-2xl mb-4">
          <UIcon name="i-heroicons-shield-check" class="text-primary-400 text-2xl" />
        </div>
        <h1 class="text-2xl font-bold text-white">Добро пожаловать</h1>
        <p class="text-gray-400 mt-1">Войдите в свой аккаунт</p>
      </div>

      <UCard class="bg-gray-900/80 backdrop-blur border-gray-800">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <UFormGroup label="Email">
            <UInput v-model="form.email" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" size="lg" :disabled="loading" autocomplete="email" />
          </UFormGroup>

          <UFormGroup label="Пароль">
            <UInput v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" :disabled="loading" autocomplete="current-password">
              <template #trailing>
                <UButton color="gray" variant="ghost" size="xs" :padded="false" :icon="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" @click="showPass = !showPass" />
              </template>
            </UInput>
          </UFormGroup>

          <UAlert v-if="error" color="red" variant="subtle" :description="error" icon="i-heroicons-exclamation-triangle" />

          <UButton type="submit" block size="lg" :loading="loading" :disabled="!form.email || !form.password">
            Войти
          </UButton>
        </form>

        <template #footer>
          <p class="text-center text-sm text-gray-400">
            Нет аккаунта?
            <NuxtLink to="/register" class="text-primary-400 hover:text-primary-300 font-medium">Зарегистрироваться</NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const authStore = useAuthStore()
const config = useRuntimeConfig()
const router = useRouter()

onMounted(() => {
  authStore.init()
  if (authStore.isAuthenticated) {
    router.push(authStore.isAdmin ? '/admin' : '/dashboard')
  }
})

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    formData.append('username', form.email)
    formData.append('password', form.password)

    const data = await $fetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: formData,
    })

    const user = await $fetch<{ id: number; email: string; role: string; is_active: boolean }>('/auth/me', {
      baseURL: config.public.apiBase,
      headers: { Authorization: `Bearer ${data.access_token}` },
    })

    authStore.setAuth(data.access_token, user)
    await router.push(user.role === 'admin' ? '/admin' : '/dashboard')
  } catch (err: any) {
    error.value = err?.data?.detail || 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}
</script>
