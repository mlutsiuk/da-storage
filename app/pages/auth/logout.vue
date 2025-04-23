<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'hero'
})

onMounted(() => {
  useAuthStore().logout()

  useToast().add({
    title: 'You have been logged out',
    description: 'See you soon!'
  })

  useRouter().push({ name: 'auth-login' })
})
</script>

<template>
  <UIcon
    name="i-svg-spinners-180-ring"
    class="text-primary size-10"
    dynamic
  />
</template>