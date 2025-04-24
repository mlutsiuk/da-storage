<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()

const props = defineProps<{
  id: string
}>()

const toast = useToast()
const isLoading = ref(false)

async function handleDelete() {
  isLoading.value = true
  try {
    await useTrpc().inbound.delete.mutate({ id: props.id })

    toast.add({
      title: 'Inbound deleted',
      color: 'success'
    })
    
    emit('close', true)
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to delete inbound', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    title="Delete inbound?"
    :close="{ onClick: () => emit('close', false) }"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-muted">
          Are you sure you want to delete this inbound? This action cannot be undone.
        </p>

        <div class="flex justify-end gap-2">
          <UButton label="Cancel" variant="outline" color="neutral" @click="emit('close', false)" />
          <UButton label="Delete" color="error" :loading="isLoading" @click="handleDelete" />
        </div>
      </div>
    </template>
  </UModal>
</template>