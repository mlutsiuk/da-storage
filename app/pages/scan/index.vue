<script setup lang="ts">
import { LazyInboundSubtrackingCreateModal } from '#components'

const mitt = useMitt()

const overlay = useOverlay()
const subtrackingModal = overlay.create(LazyInboundSubtrackingCreateModal)
const openSubtrackingModal = async (trackingCode: string) => {
  mitt.emit('scanner:pause')

  await subtrackingModal.open({
    trackingCode
  })

  mitt.emit('scanner:resume')
}

const createInbound = async (trackingCode: string) => {
  await useTrpc().inbound.create.mutate({
    trackingCode
  })
}

const getInboundsByTrackingCode = async (trackingCode: string) => {
  return await useTrpc().inbound.getByTrackingCode.query({
    trackingCode
  })
}

const previousScanned = ref<string | null>(null)

const scanInbounds = () => {
  mitt.emit('scanner:start', {
    onScanned: async ({ value, close }) => {
      const validity = checkTTNFormat(value)

      if (!validity.isValid) {
        useToast().add({
          title: validity.message,
          description: value,
          color: 'error'
        })
        return
      }

      if(value === previousScanned.value) {
        return
      }

      previousScanned.value = value

      const inboundsByTrackingCode = await useTrpc().inbound.getCountByTrackingCode.query({
        trackingCode: value
      })

      if(inboundsByTrackingCode.count > 0) {
        await openSubtrackingModal(value)

        return
      }

      try {
        useToast().add({
          title: 'Creating',
          description: toReadableTTN(value),
          color: 'info',
          duration: 1000
        })

        mitt.emit('scanner:pause')
        await createInbound(value)
        mitt.emit('scanner:resume')
      }
      catch {
        useToast().add({
          title: 'Failed to create inbound',
          description: toReadableTTN(value),
          color: 'error'
        })
      }
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-3 grow">
    <h2 class="font-mono text-4xl">
      Scan
    </h2>

    <div class="grid grow grid-cols-1 grid-rows-3 justify-center">
      <UButton
        variant="soft"
        size="lg"
        block
        @click="scanInbounds"
      >
        Scan inbounds
      </UButton>
    </div>
  </div>
</template>
