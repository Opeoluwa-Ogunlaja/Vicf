import { createInterceptorReadySignal } from '@/lib/utils/interceptorReadySignal'

export const { waitForInterceptor, markInterceptorReady } = createInterceptorReadySignal()
