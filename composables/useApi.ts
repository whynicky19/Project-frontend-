export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const baseURL = config.public.apiBase

  const headers = () =>
    authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}

  const get = async (path: string) =>
    await $fetch(path, { baseURL, headers: headers() })

  const post = async (path: string, body: any) =>
    await $fetch(path, { method: 'POST', baseURL, body, headers: headers() })

  const patch = async (path: string, body: any) =>
    await $fetch(path, { method: 'PATCH', baseURL, body, headers: headers() })

  const del = async (path: string) =>
    await $fetch(path, { method: 'DELETE', baseURL, headers: headers() })

  return { get, post, patch, del }
}
