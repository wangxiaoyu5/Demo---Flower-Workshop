import { BehaviorWithStore, storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userstores'
export const userBehavior = BehaviorWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token']
  }
})
