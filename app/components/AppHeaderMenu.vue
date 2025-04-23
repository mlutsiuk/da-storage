<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { user } = storeToRefs(useAuthStore())

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: user.value!.name,
      avatar: {
        alt: user.value!.name,
      },
      type: 'label'
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user'
    },
    {
      label: 'Settings',
      icon: 'i-lucide-cog',
      kbds: ['meta', 's']
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q'],
      onSelect: () => {
        useRouter().push({ name: 'auth-logout' })
      }
    }
  ]
])
</script>

<template>
    <UDropdownMenu
    :items="items"
    :ui="{
      content: 'w-48'
    }"
  >
    <UAvatar
      :alt="user!.name"
      size="md"
    />
  </UDropdownMenu>
</template>