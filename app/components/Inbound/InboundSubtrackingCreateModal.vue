<script setup lang="ts">
import dayjs from 'dayjs' 

const props = defineProps<{
  trackingCode: string
}>()
const emit = defineEmits<{ close: [boolean] }>()

const readableTrackingNumber = computed(() => toReadableTTN(props.trackingCode))

const { data } = useTrpc().inbound.getByTrackingCode.useQuery({
  trackingCode: props.trackingCode
})

const subTrackingCode = ref(1)

const isLoading = ref(false)
const toast = useToast()

async function onSubmit() {
  isLoading.value = true

  try {
    await useTrpc().inbound.create.mutate({
      trackingCode: props.trackingCode,
      subTrackingCode: subTrackingCode.value.toString()
    })
    toast.add({ title: 'Inbound created', color: 'success' })
    emit('close', true)
  }
  catch {
    toast.add({ title: 'Error', description: 'Failed to create inbound', color: 'error' })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    :title="`Sub track ${readableTrackingNumber}`"
    :close="{ onClick: () => emit('close', false) }"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <ul class="flex flex-col gap-2">
          <li
            v-for="(item, index) in data"
            :key="index"
            class="flex items-center gap-2 text-base"
          >
            {{ item.subTrackingCode ?? '-' }} | {{ dayjs(item.createdAt).format('DD.MM.YY HH:MM') }}
          </li>
        </ul>

        <div class="grid grid-cols-3 gap-y-2 gap-x-1">
          <UButton
            v-for="i in 9"
            :key="i"
            :variant="i === subTrackingCode ? 'solid' : 'subtle'"
            size="lg"
            block
            @click="subTrackingCode = i"
          >
            {{ i }}
          </UButton>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="outline"
          label="Cancel"
          @click="emit('close', false)"
        />

        <UButton
          label="Create"
          :loading="isLoading"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
