if (typeof window === 'undefined') {
  throw new Error('[MSW] setupWorker called in a non-browser environment')
}

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
