import VNode from './vnode'
import { createComponent } from './create-component'
import { flatten } from './helpers'
import { renderState } from '../instance/render'
import { warn, isReservedTag, isUnknownElement, resolveAsset } from '../util/index'

export default function createElement (tag, data, children, namespace) {
  const context = this
  const parent = renderState.activeInstance
  if (typeof tag === 'string') {
    let Ctor
    if (isReservedTag(tag)) {
      return VNode(tag, data, flatten(children), undefined, undefined, namespace)
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      return createComponent(Ctor, data, parent, children)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        if (!namespace && isUnknownElement(tag)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.'
          )
        }
      }
      return VNode(tag, data, flatten(children && children()), undefined, undefined, namespace)
    }
  } else {
    return createComponent(tag, data, parent, children)
  }
}
