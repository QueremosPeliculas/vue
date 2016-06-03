/* flow */

import { warn } from 'core/util/index'

export default {
  props: {
    mode: {
      validator (val) {
        if (val && val !== 'out-in' && val !== 'in-out') {
          warn('transition-mode must be either "out-in" or "in-out".')
          return false
        }
        return true
      }
    }
  },
  render () {
    const oldChild = this._vnode
    const newChild = this.$slots.default[0]
    if (oldChild && oldChild.data && oldChild.tag !== newChild.tag) {
      if (this.mode === 'out-in') {
        // return empty node
        // and queue an update when the leave finishes
        addHook(oldChild, 'afterLeave', () => {
          this.$forceUpdate()
        })
        return
      } else {
        if (this.mode === 'in-out') {
          let delayedLeave
          const performLeave = () => { delayedLeave() }
          addHook(newChild, 'afterEnter', performLeave)
          addHook(newChild, 'enterCancelled', performLeave)
          addHook(oldChild, 'delayLeave', leave => {
            delayedLeave = leave
          })
        }
        return newChild
      }
    } else {
      return newChild
    }
  }
}

function addHook (vnode: VNode, name: string, hook: Function) {
  if (!vnode.data || !vnode.data.transition) {
    return
  }
  let trans = vnode.data.transition
  if (typeof trans === 'string') {
    trans = vnode.data.transition = { name: trans }
  } else if (typeof trans !== 'object') {
    trans = vnode.data.transition = { name: 'v' }
  }
  if (trans[name]) {
    const oldHook = trans[name]
    trans[name] = function (el) {
      const res = oldHook.apply(this, arguments)
      hook()
      return res
    }
  } else {
    trans[name] = hook
  }
}
