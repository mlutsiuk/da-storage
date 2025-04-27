<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  trackingCode?: string
}>()

const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  trackingCode: z.string().min(4, 'Tracking code is required'),
  locationId: z.string().min(1, 'Location is required')
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  trackingCode: props.trackingCode,
  locationId: ''
})

const isLoading = ref(false)
const toast = useToast()

const { data: locations } = await useAsyncData('locations', () => useTrpc().locations.getAll.query())

watch(locations, (locs) => {
  if(!locs) return

  if(state.locationId && state.locationId.length > 1) return

  const latestLocationId = localStorage.getItem('latestLocationId')
  if(locs.some((loc) => loc.id === latestLocationId)) {
    state.locationId = latestLocationId!
  }
}, {
  immediate: true
})

const locationOptions = computed(() => {
  return locations.value ?? []
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    // Save selected location to local storage as latest
    localStorage.setItem('latestLocationId', event.data.locationId)

    const { trackingCode, ...rest } = event.data

    await useTrpc().inbound.create.mutate({
      trackingCode: trackingCode.replaceAll(' ', '')
    })
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
  <UModal
    title="Add Inbound"
    :close="{ onClick: () => emit('close', false) }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Tracking Code" name="trackingCode">
          <UInput
            v-model="state.trackingCode"
            class="w-full"
            v-maska="'## #### #### ####'"
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

        <div class="flex justify-end gap-2 pt-4">
          <UButton color="neutral" variant="outline" label="Cancel" @click="emit('close', false)" />
          <UButton type="submit" label="Create" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>