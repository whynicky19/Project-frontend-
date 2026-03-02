<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-primary-500/20 border border-primary-500/30 rounded-2xl mb-4">
          <UIcon name="i-heroicons-user-plus" class="text-primary-400 text-2xl" />
        </div>
        <h1 class="text-2xl font-bold text-white">Создать аккаунт</h1>
        <p class="text-gray-400 mt-1">Заполните форму регистрации</p>
      </div>

      <UCard class="bg-gray-900/80 backdrop-blur border-gray-800">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <UFormGroup label="Email">
            <UInput v-model="form.email" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" size="lg" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Пароль">
            <UInput v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Минимум 6 символов" icon="i-heroicons-lock-closed" size="lg" :disabled="loading">
              <template #trailing>
                <UButton color="gray" variant="ghost" size="xs" :padded="false" :icon="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" @click="showPass = !showPass" />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Роль">
            <USelect v-model="form.role" :options="roleOptions" size="lg" :disabled="loading" />
          </UFormGroup>

          <UAlert v-if="error" color="red" variant="subtle" :description="error" icon="i-heroicons-exclamation-triangle" />
          <UAlert v-if="success" color="green" variant="subtle" description="Аккаунт создан! Перенаправляем на вход..." icon="i-heroicons-check-circle" />

          <UButton type="submit" block size="lg" :loading="loading" :disabled="!form.email || !form.password">
            Зарегистрироваться
          </UButton>
        </form>

        <template #footer>
          <p class="text-center text-sm text-gray-400">
            Уже есть аккаунт?
            <NuxtLink to="/login" class="text-primary-400 hover:text-primary-300 font-medium">Войти</NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const config = useRuntimeConfig()
const router = useRouter()

const form = reactive({ email: '', password: '', role: 'employee' })
const roleOptions = [
  { label: 'Сотрудник', value: 'employee' },
  { label: 'Администратор', value: 'admin' },
]
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPass = ref(false)

async function handleRegister() {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    await $fetch('/auth/register', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: { email: form.email, password: form.password, role: form.role },
    })
    success.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch (err: any) {
    error.value = err?.data?.detail || 'Ошибка при регистрации'
  } finally {
    loading.value = false
  }
}
</script>
