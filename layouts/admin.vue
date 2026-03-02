<template>
  <div class="min-h-screen bg-gray-950 flex">
    <aside class="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
      <div class="p-6 border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-shield-check" class="text-white text-sm" />
          </div>
          <span class="font-semibold text-white text-lg">Admin Panel</span>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/admin' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
        >
          <UIcon name="i-heroicons-squares-2x2" />
          Дашборд
        </NuxtLink>

        <NuxtLink
          to="/admin/users"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/users') ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
        >
          <UIcon name="i-heroicons-users" />
          Пользователи
        </NuxtLink>

        <NuxtLink
          to="/admin/posts"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/posts') ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
        >
          <UIcon name="i-heroicons-document-text" />
          Посты
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3 mb-3">
          <UAvatar :alt="authStore.user?.email" size="sm" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-white truncate">{{ authStore.user?.email }}</p>
            <UBadge size="xs" color="primary" variant="subtle">{{ authStore.user?.role }}</UBadge>
          </div>
        </div>
        <UButton block color="gray" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" size="sm" @click="authStore.logout()">
          Выйти
        </UButton>
      </div>
    </aside>

    <main class="flex-1 ml-64 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
authStore.init()
</script>
