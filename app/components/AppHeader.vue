<script setup lang="ts">
const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <div class="flex flex-row items-center justify-between gap-6 border-b p-6 shadow-sm">
    <div class="flex flex-row items-center gap-4">
      <UIcon name="maki:warehouse" class="size-6" />

      <div class="text-3xl font-medium">
        DA Storage
      </div>
    </div>

    <div class="grow">
      <UButton
        variant="link"
        color="neutral"
        label="Campaigns"
      />
    </div>

    <div class="flex flex-row items-center gap-2">
      <ThemePicker />
      <ColorModeButton />

      <UAvatar
        :alt="user!.name"
        size="md"
      />
    </div>
  </div>
</template>
