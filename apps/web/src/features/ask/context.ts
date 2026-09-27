import { createContext, use, useSyncExternalStore } from 'react'
import type { AskState, AskStore } from './store.ts'

export const AskStoreContext = createContext<AskStore | null>(null)

export function useAskStore(): AskStore {
  const store = use(AskStoreContext)
  if (!store) throw new Error('useAskStore must be used inside AskRoot')
  return store
}

export function useAskState(): AskState {
  const store = useAskStore()
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}
