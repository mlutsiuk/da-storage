<script setup lang="ts">
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType
} from 'html5-qrcode'

const container = ref<HTMLElement | null>(null)
const scanner = ref<Html5Qrcode | null>(null)
const isActive = ref(false)
const onScanned = ref<(code: string) => void>()

const mitt = useMitt()
mitt.on('scanner:start', ({ onScanned: callback }) => {
  onScanned.value = callback
  start()
})

const cameraDevices = await Html5Qrcode.getCameras()
const selectedCameraId = ref<string>(localStorage.getItem('selectedCameraId') || cameraDevices[0]?.id || '')

async function start() {
  if (!container.value || isActive.value) return

  const cameras = await Html5Qrcode.getCameras()
  
  if (!cameras.length) return

  isActive.value = true

  scanner.value = new Html5Qrcode(container.value.id, { verbose: false })

  await scanner.value.start(
    selectedCameraId.value,
    {
      fps: 10,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const minSize = Math.min(viewfinderWidth, viewfinderHeight)
        return {
          width: Math.round(minSize * 0.8),
          height: Math.round(minSize * 0.8)
        }
      },
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A
      ]
    },
    (decodedText) => {
      onScanned.value?.(decodedText)
      stop()
    },
    () => {}
  )
}

async function stop() {
  if (scanner.value) {
    await scanner.value.stop()
    scanner.value.clear()
    scanner.value = null
  }
  isActive.value = false
}

const onSelectedCameraChange = async () => {
  // Save the current camera ID to local storage
  localStorage.setItem('selectedCameraId', selectedCameraId.value)

  await stop()

  await start()
}

onUnmounted(stop)
</script>

<template>
  <Teleport to="body">
    <div
      v-show="isActive"
      class="fixed inset-0 flex items-center justify-center bg-black/80"
    >
      <div
        ref="container"
        :id="`qr-scanner-global`"
        class="w-full rounded overflow-hidden"
      />
    </div>

    <div
      v-if="isActive"
      class="fixed inset-0"
    >
      <UButton
        label="Cancel"
        icon="i-lucide-x"
        size="lg"
        color="error"
        variant="solid"
        class="fixed bottom-6 left-1/2 -translate-x-1/2"
        @click="stop"
      />

      <USelectMenu
        :items="cameraDevices"
        value-key="id"
        label-key="label"
        v-model="selectedCameraId"
        class="fixed top-6 left-1/2 -translate-x-1/2"
        :search-input="false"
        @change="onSelectedCameraChange"
      />
    </div>
  </Teleport>
</template>
