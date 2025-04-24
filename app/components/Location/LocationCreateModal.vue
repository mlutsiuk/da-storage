<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  name: z.string().min(1, 'Name is required')
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: ''
})

const isLoading = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await useTrpc().locations.create.mutate(event.data)
    toast.add({ title: 'Location created', color: 'success' })
    emit('close', true)
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to create location', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal title="Add Location" :close="{ onClick: () => emit('close', false) }">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Location name" name="name">
          <UInput v-model="state.name" placeholder="e.g. Main Warehouse" />
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton color="neutral" variant="outline" label="Cancel" @click="emit('close', false)" />
          <UButton type="submit" label="Create" :loading="isLoading" />
        </div>
      </UForm>
      
    </template>
  </UModal>
</template>
