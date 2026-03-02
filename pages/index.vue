<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center">
    <UIcon name="i-heroicons-arrow-path" class="text-primary-400 text-4xl animate-spin" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'default' })

const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
  navigateTo(authStore.isAdmin ? '/admin' : '/dashboard')
})
</script>
