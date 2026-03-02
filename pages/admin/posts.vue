<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Посты</h1>
        <p class="text-gray-400 mt-1">Все публикации в системе</p>
      </div>
    </div>

    <div class="mb-6">
      <UInput v-model="search" placeholder="Поиск по заголовку..." icon="i-heroicons-magnifying-glass" class="w-72" />
    </div>

    <UCard class="bg-gray-900 border-gray-800">
      <div v-if="loading" class="py-12 flex justify-center">
        <UIcon name="i-heroicons-arrow-path" class="text-primary-400 text-3xl animate-spin" />
      </div>

      <UTable v-else :rows="filteredPosts" :columns="columns">
        <template #title-data="{ row }">
          <span class="font-medium text-white">{{ row.title }}</span>
        </template>
        <template #actions-data="{ row }">
          <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs" @click="confirmDelete(row)" />
        </template>
      </UTable>
    </UCard>

    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-white">Удалить пост?</h3>
        </template>
        <p class="text-gray-300">Удалить пост <span class="font-medium text-white">«{{ deletingPost?.title }}»</span>?</p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showDeleteModal = false">Отмена</UButton>
            <UButton color="red" :loading="deleting" @click="deletePost">Удалить</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get, del } = useApi()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(true)
const posts = ref<any[]>([])
const search = ref('')
const showDeleteModal = ref(false)
const deletingPost = ref<any>(null)
const deleting = ref(false)

const columns = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'title', label: 'Заголовок' },
  { key: 'user_id', label: 'Автор (ID)' },
  { key: 'actions', label: '' },
]

const filteredPosts = computed(() =>
  posts.value.filter(p => !search.value || p.title.toLowerCase().includes(search.value.toLowerCase()))
)

onMounted(async () => {
  authStore.init()
  try {
    posts.value = await get('/posts/') as any[]
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})

function confirmDelete(post: any) {
  deletingPost.value = post
  showDeleteModal.value = true
}

async function deletePost() {
  if (!deletingPost.value) return
  deleting.value = true
  try {
    await del(`/posts/${deletingPost.value.id}`)
    posts.value = posts.value.filter(p => p.id !== deletingPost.value.id)
    toast.add({ title: 'Пост удалён', color: 'green' })
    showDeleteModal.value = false
  } catch {
    toast.add({ title: 'Ошибка при удалении', color: 'red' })
  } finally {
    deleting.value = false
  }
}
</script>
