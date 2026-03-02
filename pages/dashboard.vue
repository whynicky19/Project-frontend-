<template>
  <div class="min-h-screen bg-gray-950 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">Личный кабинет</h1>
          <p class="text-gray-400 mt-1">{{ authStore.user?.email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <UBadge color="primary" variant="subtle" size="lg">{{ authStore.user?.role }}</UBadge>
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" @click="authStore.logout()">Выйти</UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <UCard class="bg-gray-900 border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-document-text" class="text-blue-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ posts.length }}</p>
              <p class="text-sm text-gray-400">Мои посты</p>
            </div>
          </div>
        </UCard>

        <UCard class="bg-gray-900 border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-check-circle" class="text-green-400" />
            </div>
            <div>
              <p class="text-lg font-bold text-white">{{ authStore.user?.is_active ? 'Активен' : 'Неактивен' }}</p>
              <p class="text-sm text-gray-400">Статус аккаунта</p>
            </div>
          </div>
        </UCard>

        <UCard class="bg-gray-900 border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-identification" class="text-purple-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-white">#{{ authStore.user?.id }}</p>
              <p class="text-sm text-gray-400">ID пользователя</p>
            </div>
          </div>
        </UCard>
      </div>

      <UCard class="bg-gray-900 border-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-white">Мои посты</h2>
            <UButton icon="i-heroicons-plus" size="sm" @click="showModal = true">Создать пост</UButton>
          </div>
        </template>

        <div v-if="loadingPosts" class="py-8 flex justify-center">
          <UIcon name="i-heroicons-arrow-path" class="text-primary-400 text-2xl animate-spin" />
        </div>

        <div v-else-if="posts.length === 0" class="py-8 text-center">
          <UIcon name="i-heroicons-document-text" class="text-gray-600 text-4xl mb-2" />
          <p class="text-gray-400">Постов пока нет</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="post in posts" :key="post.id" class="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <p class="font-medium text-white">{{ post.title }}</p>
            <p class="text-xs text-gray-400 mt-1">ID: #{{ post.id }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-white">Новый пост</h3>
        </template>
        <form @submit.prevent="createPost" class="space-y-4">
          <UFormGroup label="Заголовок">
            <UInput v-model="postForm.title" placeholder="Введите заголовок" />
          </UFormGroup>
          <UFormGroup label="Содержание">
            <UTextarea v-model="postForm.body" placeholder="Введите текст поста" :rows="4" />
          </UFormGroup>
          <UAlert v-if="postError" color="red" variant="subtle" :description="postError" />
        </form>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showModal = false">Отмена</UButton>
            <UButton :loading="creating" @click="createPost">Создать</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'default' })

const authStore = useAuthStore()
const { get, post } = useApi()

const posts = ref<any[]>([])
const loadingPosts = ref(true)
const showModal = ref(false)
const creating = ref(false)
const postError = ref('')
const postForm = reactive({ title: '', body: '' })

onMounted(async () => {
  authStore.init()
  try {
    posts.value = await get('/posts/my') as any[]
  } catch {
    posts.value = []
  } finally {
    loadingPosts.value = false
  }
})

async function createPost() {
  if (!postForm.title || !postForm.body) return
  creating.value = true
  postError.value = ''
  try {
    const newPost = await post('/posts/', postForm)
    posts.value.unshift(newPost as any)
    showModal.value = false
    postForm.title = ''
    postForm.body = ''
  } catch (err: any) {
    postError.value = err?.data?.detail || 'Ошибка при создании'
  } finally {
    creating.value = false
  }
}
</script>
