import { Module, ModLabelsValueType } from '../types'

export function isModelNode(node: Module): boolean {
  if (node.props && node.props['mod_labels'] !== undefined) {
    const modLabelsProp = node.props['mod_labels'] as ModLabelsValueType
    if (Object.keys(modLabelsProp).length > 0) {
      return true
    }
  }
  return false
}

export function guessQueryModelType(node: Module): string | undefined {
  if (node.type.toLocaleLowerCase().includes('detection')) {
    return 'detection'
  }
  if (node.type.toLocaleLowerCase().includes('classification')) {
    return 'classification'
  }
  if (node.type.toLocaleLowerCase().includes('pose')) {
    return 'pose'
  }
  return undefined
}
