import { useEffect, useMemo, useState } from 'react'
import { Module, Pipeline, ModLabelsValueType } from '../types'
import { isModelNode } from './nodeHelperFunc'

export function isBoxFilterNode(nodeData: Module): boolean {
  return nodeData.type.toLocaleLowerCase().includes('boxfilter')
}

function getBoxFilterDependentNodeIds(
  bfNodeId: number,
  pipeline: Pipeline
): number[] {
  const result: number[] = []

  function isReachableToBoxFilterNode(srcId: number): boolean {
    // Assume: srcId is a modelnode
    const srcNode = pipeline.nodes.find((n) => n.id === srcId)
    if (srcNode === undefined) {
      return false
    }
    const queue: Module[] = [srcNode as Module]
    while (queue.length > 0) {
      const lvLen = queue.length
      const reachedBFNodeId: number[] = []
      for (let i = 0; i < lvLen; i += 1) {
        const node = queue.shift() as Module
        if (isModelNode(node) && node.id !== srcId) {
          // if reached to another Model Node
          return false
        }
        if (isBoxFilterNode(node)) {
          reachedBFNodeId.push(node.id)
        }
        pipeline.pipe.forEach((c) => {
          if (c[0] === node.id) {
            // if the node has children
            const childId = c[2]
            const childNode = pipeline.nodes.find((n) => n.id === childId)
            if (childNode !== undefined) {
              queue.push(childNode as Module)
            }
          }
        })
      }
      if (reachedBFNodeId.includes(bfNodeId)) {
        // if reached to this BoxFilterNode before
        //  reaching to any other BoxFilter nodes
        return true
      } else if (reachedBFNodeId.length > 0) {
        // if reached to any other boxFilter nodes before
        //  reaching this boxfilter node
        return false
      }
    }
    return false
  }

  pipeline.nodes.forEach((node) => {
    if (isModelNode(node) && isReachableToBoxFilterNode(node.id)) {
      result.push(node.id)
    }
  })

  return result
}

function collectCheckedLabels(nodeIds: number[], pipeline: Pipeline): string[] {
  const labelSet = new Set<string>()
  nodeIds.forEach((id) => {
    const node = pipeline.nodes.find((n) => n.id === id)
    if (node !== undefined) {
      // node should be a Model Node
      if (node.props && node.props.mod_labels) {
        const modLabels = node.props.mod_labels as ModLabelsValueType
        Object.values(modLabels).forEach((val) => {
          if (val.checked && val.label) {
            labelSet.add(val.label)
          }
        })
      }
    }
  })
  return Array.from(labelSet)
}

export function useBoxFilterLabelOptions(
  boxFilterNode: Module,
  pipeline: Pipeline
): [string[], number[]] {
  const [labelOptions, setLabelOptions] = useState<string[]>([])
  const [dependencies, setDepen] = useState<number[]>([])

  const isBoxFilter = useMemo(() => {
    return isBoxFilterNode(boxFilterNode)
  }, [boxFilterNode])

  useEffect(() => {
    if (isBoxFilter) {
      const depenNodeIds = getBoxFilterDependentNodeIds(
        boxFilterNode.id,
        pipeline
      )
      const checkedLabels = collectCheckedLabels(depenNodeIds, pipeline)
      setDepen(depenNodeIds)
      setLabelOptions(checkedLabels)
    }
  }, [boxFilterNode.id, isBoxFilter, pipeline])

  return [labelOptions, dependencies]
}

export function useBoxFilterBestThreshold(
  dependentNodeIds: number[],
  pipeline: Pipeline
): [number, number | null] {
  // Assume that the node is a box filter node
  const [bt, setBT] = useState(0.75)
  const [btNodeId, setBTNodeId] = useState<number | null>(null)

  useEffect(() => {
    let minBT = 1
    let btid = null
    pipeline.nodes.forEach((node) => {
      if (dependentNodeIds.indexOf(node.id) >= 0) {
        const nodeBF =
          node.props &&
          node.props['best_threshold'] &&
          typeof node.props['best_threshold'] === 'number'
            ? (node.props['best_threshold'] as number)
            : 1
        if (nodeBF < minBT) {
          btid = node.id
        }
        minBT = Math.min(minBT, nodeBF)
      }
    })
    setBTNodeId(btid)
    setBT(minBT)
  }, [pipeline, dependentNodeIds])

  return [bt, btNodeId]
}
