<script setup lang="ts">
import type {
  CameraDevice
} from 'html5-qrcode'
import type { ScannerCallbackPayload } from '~/types/scanner'
import {
  Html5Qrcode,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats
} from 'html5-qrcode'

const container = ref<HTMLElement | null>(null)
const scanner = ref<Html5Qrcode | null>(null)
const isActive = ref(false)
let onScanned: ((payload: ScannerCallbackPayload) => void) | null = null

const mitt = useMitt()
mitt.on('scanner:start', ({ onScanned: callback }) => {
  onScanned = callback
  start()
})
mitt.on('scanner:pause', pause)
mitt.on('scanner:resume', resume)

let cameraDevices: CameraDevice[] = []
const selectedCameraId = ref<string | null>(null)

const init = async () => {
  if (cameraDevices.length === 0) {
    cameraDevices = await Html5Qrcode.getCameras()

    if (!cameraDevices.length)
      return false

    selectedCameraId.value = localStorage.getItem('selectedCameraId') || cameraDevices[0]?.id || null
  }

  return true
}

async function start() {
  if (!container.value || isActive.value)
    return

  if (!await init()) {
    useToast().add({
      title: 'No camera found',
      description: 'Please connect a camera and try again.',
      color: 'error'
    })
    return
  }

  isActive.value = true
  scanner.value = new Html5Qrcode(container.value.id, { verbose: false })

  await scanner.value.start(
    selectedCameraId.value!,
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
      onScanned?.({
        value: decodedText,
        close: stop
      })
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

function pause() {
  if (scanner.value) {
    scanner.value.pause()
  }
}
function resume() {
  if (scanner.value) {
    scanner.value.resume()
  }
}

const onSelectedCameraChange = async () => {
  if (!selectedCameraId.value)
    return

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
        id="qr-scanner-global"
        ref="container"
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
        v-model="selectedCameraId"
        :items="cameraDevices"
        value-key="id"
        label-key="label"
        class="fixed top-6 left-1/2 -translate-x-1/2"
        :search-input="false"
        @change="onSelectedCameraChange"
      />
    </div>
  </Teleport>
</template>
