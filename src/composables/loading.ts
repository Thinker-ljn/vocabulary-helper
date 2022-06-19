export function useLoading() {
  const loading = ref(false)

  const start = <T>(action: Promise<T>) => {
    loading.value = true
    action.finally(() => {
      loading.value = false
    })
    return action
  }

  return reactive({
    value: loading,
    start,
  })
}
