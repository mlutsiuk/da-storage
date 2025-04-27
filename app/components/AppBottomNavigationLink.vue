<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  to: RouteLocationRaw
  icon: string
  text: string
}>()
</script>

<template>
  <NuxtLink
    :to
    class="flex flex-col gap-1 items-center justify-center p-1.5"
  >
    <UIcon
      :name="icon"
      class="size-6"
    />

    <div class="text-center leading-none">
      {{ text }}
    </div>
  </NuxtLink>
</template>