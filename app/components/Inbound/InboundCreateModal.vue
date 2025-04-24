<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  trackingCode: z.string().min(4, 'Tracking code is required'),
  locationId: z.string().min(1, 'Location is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  defectiveQuantity: z.number().min(0)
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  trackingCode: '',
  locationId: '',
  quantity: 1,
  defectiveQuantity: 0
})

const isLoading = ref(false)
const toast = useToast()

const { data: locations } = await useAsyncData('locations', () =>
  useTrpc().locations.getAll.query()
)

const locationOptions = computed(() => {
  return locations.value ?? []
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await useTrpc().inbound.create.mutate(event.data)
    toast.add({ title: 'Inbound created', color: 'success' })
    emit('close', true)
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to create inbound', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal title="Add Inbound" :close="{ onClick: () => emit('close', false) }">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Tracking Code" name="trackingCode">
          <UInput
            v-model="state.trackingCode"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Location" name="locationId">
          <USelectMenu
            v-model="state.locationId"
            :items="locationOptions"
            value-key="id"
            label-key="name"
            placeholder="Select a location"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Quantity" name="quantity">
          <UInput v-model="state.quantity" type="number" min="1" class="w-full" />
        </UFormField>

        <UFormField label="Defective Quantity" name="defectiveQuantity">
          <UInput
            v-model="state.defectiveQuantity"
            type="number"
            min="0"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton color="neutral" variant="outline" label="Cancel" @click="emit('close', false)" />
          <UButton type="submit" label="Create" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
