<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Пользователи</h1>
        <p class="text-gray-400 mt-1">Управление аккаунтами</p>
      </div>
      <UButton icon="i-heroicons-user-plus" @click="openCreate">Добавить</UButton>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <UInput v-model="search" placeholder="Поиск по email..." icon="i-heroicons-magnifying-glass" class="w-64" />
      <USelect v-model="roleFilter" :options="roleFilterOpts" class="w-40" />
      <USelect v-model="statusFilter" :options="statusFilterOpts" class="w-44" />
    </div>

    <UCard class="bg-gray-900 border-gray-800">
      <div v-if="loading" class="py-12 flex justify-center">
        <UIcon name="i-heroicons-arrow-path" class="text-primary-400 text-3xl animate-spin" />
      </div>

      <UTable v-else :rows="filteredUsers" :columns="columns">
        <template #email-data="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar :alt="row.email" size="xs" />
            <span class="text-white font-medium">{{ row.email }}</span>
          </div>
        </template>
        <template #role-data="{ row }">
          <UBadge :color="row.role === 'admin' ? 'orange' : 'blue'" variant="subtle">
            {{ row.role === 'admin' ? 'Администратор' : 'Сотрудник' }}
          </UBadge>
        </template>
        <template #is_active-data="{ row }">
          <UToggle :model-value="row.is_active" @update:model-value="toggleActive(row)" />
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" size="xs" @click="openEdit(row)" />
            <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs" @click="confirmDelete(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Create / Edit Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-white">{{ editingUser ? 'Редактировать' : 'Новый пользователь' }}</h3>
        </template>
        <form @submit.prevent="saveUser" class="space-y-4">
          <UFormGroup label="Email">
            <UInput v-model="form.email" type="email" placeholder="user@example.com" :disabled="!!editingUser" />
          </UFormGroup>
          <UFormGroup v-if="!editingUser" label="Пароль">
            <UInput v-model="form.password" type="password" placeholder="Пароль" />
          </UFormGroup>
          <UFormGroup label="Роль">
            <USelect v-model="form.role" :options="roleOpts" />
          </UFormGroup>
          <UFormGroup label="Статус">
            <div class="flex items-center gap-3">
              <UToggle v-model="form.is_active" />
              <span class="text-sm text-gray-300">{{ form.is_active ? 'Активен' : 'Неактивен' }}</span>
            </div>
          </UFormGroup>
          <UAlert v-if="formError" color="red" variant="subtle" :description="formError" />
        </form>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showModal = false">Отмена</UButton>
            <UButton :loading="saving" @click="saveUser">{{ editingUser ? 'Сохранить' : 'Создать' }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-white">Удалить пользователя?</h3>
        </template>
        <p class="text-gray-300">
          Вы уверены, что хотите удалить <span class="font-medium text-white">{{ deletingUser?.email }}</span>? Это действие необратимо.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showDeleteModal = false">Отмена</UButton>
            <UButton color="red" :loading="deleting" @click="deleteUser">Удалить</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get, post, patch, del } = useApi()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(true)
const users = ref<any[]>([])
const search = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref<any>(null)
const deletingUser = ref<any>(null)
const saving = ref(false)
const deleting = ref(false)
const formError = ref('')
const form = reactive({ email: '', password: '', role: 'employee', is_active: true })

const columns = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Роль' },
  { key: 'is_active', label: 'Активен' },
  { key: 'actions', label: '' },
]

const roleOpts = [
  { label: 'Сотрудник', value: 'employee' },
  { label: 'Администратор', value: 'admin' },
]
const roleFilterOpts = [
  { label: 'Все роли', value: 'all' },
  { label: 'Администраторы', value: 'admin' },
  { label: 'Сотрудники', value: 'employee' },
]
const statusFilterOpts = [
  { label: 'Все статусы', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Неактивные', value: 'inactive' },
]

const filteredUsers = computed(() =>
  users.value.filter(u => {
    const s = !search.value || u.email.toLowerCase().includes(search.value.toLowerCase())
    const r = roleFilter.value === 'all' || u.role === roleFilter.value
    const st = statusFilter.value === 'all' || (statusFilter.value === 'active' && u.is_active) || (statusFilter.value === 'inactive' && !u.is_active)
    return s && r && st
  })
)

onMounted(async () => {
  authStore.init()
  loading.value = true
  try {
    users.value = await get('/users/') as any[]
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
})

function openCreate() {
  editingUser.value = null
  Object.assign(form, { email: '', password: '', role: 'employee', is_active: true })
  formError.value = ''
  showModal.value = true
}

function openEdit(user: any) {
  editingUser.value = user
  Object.assign(form, { email: user.email, password: '', role: user.role, is_active: user.is_active })
  formError.value = ''
  showModal.value = true
}

async function saveUser() {
  saving.value = true
  formError.value = ''
  try {
    if (editingUser.value) {
      const updated = await patch(`/users/${editingUser.value.id}`, { email: form.email, role: form.role, is_active: form.is_active })
      const idx = users.value.findIndex(u => u.id === editingUser.value.id)
      if (idx !== -1) users.value[idx] = updated
      toast.add({ title: 'Пользователь обновлён', color: 'green' })
    } else {
      const created = await post('/auth/register', { email: form.email, password: form.password, role: form.role })
      users.value.unshift(created)
      toast.add({ title: 'Пользователь создан', color: 'green' })
    }
    showModal.value = false
  } catch (err: any) {
    formError.value = err?.data?.detail || 'Ошибка при сохранении'
  } finally {
    saving.value = false
  }
}

async function toggleActive(user: any) {
  try {
    await patch(`/users/${user.id}`, { is_active: !user.is_active })
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) users.value[idx].is_active = !user.is_active
    toast.add({ title: user.is_active ? 'Деактивирован' : 'Активирован', color: 'green' })
  } catch {
    toast.add({ title: 'Ошибка', color: 'red' })
  }
}

function confirmDelete(user: any) {
  deletingUser.value = user
  showDeleteModal.value = true
}

async function deleteUser() {
  if (!deletingUser.value) return
  deleting.value = true
  try {
    await del(`/users/${deletingUser.value.id}`)
    users.value = users.value.filter(u => u.id !== deletingUser.value.id)
    toast.add({ title: 'Пользователь удалён', color: 'green' })
    showDeleteModal.value = false
  } catch {
    toast.add({ title: 'Ошибка при удалении', color: 'red' })
  } finally {
    deleting.value = false
  }
}
</script>
