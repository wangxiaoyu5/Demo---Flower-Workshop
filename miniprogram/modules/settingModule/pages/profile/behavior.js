import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../../../stores/userstores'
userBehavior
export const userBehavior = BehaviorWithStore({
  storeBindings: {
    store: userStore,
    fields: ['userInfo'],
    actions: ['setUserInfo']
  }
})
