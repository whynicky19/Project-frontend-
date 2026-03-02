<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Дашборд</h1>
      <p class="text-gray-400 mt-1">Обзор системы</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <UCard class="bg-gray-900 border-gray-800">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-users" class="text-blue-400 text-xl" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
            <p class="text-sm text-gray-400">Всего пользователей</p>
          </div>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-check-circle" class="text-green-400 text-xl" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.active }}</p>
            <p class="text-sm text-gray-400">Активных</p>
          </div>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-shield-exclamation" class="text-orange-400 text-xl" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.admins }}</p>
            <p class="text-sm text-gray-400">Администраторов</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="bg-gray-900 border-gray-800">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-white">Последние пользователи</h2>
          <NuxtLink to="/admin/users">
            <UButton variant="ghost" color="gray" size="sm" trailing-icon="i-heroicons-arrow-right">Все пользователи</UButton>
          </NuxtLink>
        </div>
      </template>

      <div v-if="loading" class="py-8 flex justify-center">
        <UIcon name="i-heroicons-arrow-path" class="text-primary-400 text-2xl animate-spin" />
      </div>

      <UTable v-else :rows="recentUsers" :columns="columns">
        <template #is_active-data="{ row }">
          <UBadge :color="row.is_active ? 'green' : 'red'" variant="subtle" size="xs">
            {{ row.is_active ? 'Активен' : 'Неактивен' }}
          </UBadge>
        </template>
        <template #role-data="{ row }">
          <UBadge :color="row.role === 'admin' ? 'orange' : 'blue'" variant="subtle" size="xs">
            {{ row.role }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get } = useApi()
const authStore = useAuthStore()

const loading = ref(true)
const users = ref<any[]>([])

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Роль' },
  { key: 'is_active', label: 'Статус' },
]

const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.is_active).length,
  admins: users.value.filter(u => u.role === 'admin').length,
}))

const recentUsers = computed(() => users.value.slice(0, 5))

onMounted(async () => {
  authStore.init()
  try {
    users.value = await get('/users/') as any[]
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
})
</script>
