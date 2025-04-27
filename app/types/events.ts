import type { ScannerCallbackPayload } from './scanner'

export type AppEvents = {
  'scanner:start': {
    onScanned: (payload: ScannerCallbackPayload) => void
  }
  'scanner:pause': void
  'scanner:resume': void
}
