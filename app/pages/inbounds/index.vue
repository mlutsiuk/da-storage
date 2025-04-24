<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="font-mono text-4xl">Inbounds</h2>
    <InboundTable />
  </div>
</template>
