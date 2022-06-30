import produce from 'immer'
import { Edge, Node, Position, ReactFlowInstance } from 'react-flow-renderer'
import { GetState, SetState } from 'zustand'
import {
  Elements,
  ModuleDefinitions,
  Pipeline,
  PropValue,
  RawModule,
  Module,
  Connection
} from '../types'
import { MyState } from './useStore'
import {
  getRFNode,
  getRFNodes,
  getRFEdges,
  getRFEdge,
  graphLayoutHelper,
  getNextModuleId,
  updateIds,
  setModulePropInited
} from '../helpers'
import { initValue } from './initState'

export interface CoreSlice {
  value: Pipeline
  moduleDefinitions: ModuleDefinitions
  rfElements: Elements
  rfInstance?: ReactFlowInstance<any>
  layoutVertically: boolean
  setRfInstance: (inst: ReactFlowInstance<any> | undefined) => void
  setModuleDefinitions: (newMDs: ModuleDefinitions) => void
  setValue: (newValue: Pipeline) => void
  addModule: (module: RawModule) => void
  addPipeline: (modules: Module[], connections: Connection[]) => void
  modifyModuleProp: (
    moduleId: number,
    propName: string,
    propVal: PropValue
  ) => void
  modifyModuleName: (moduleId: number, newName: string) => void
  modifyModuleRunner: (moduleId: number, runner: string) => void
  removeModule: (moduleId: number) => void
  connectModules: (
    srcId: number,
    srcOutputId: number,
    targetId: number,
    targetInputId: number
  ) => void
  removeConnection: (rfEdgeId: string) => void
  layoutGraph: () => void
  clear: () => void
  setLayoutVertically: (lv: boolean) => void
  putNodeFront: (moduleId: number) => void
}

const createCoreSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): CoreSlice => ({
  value: initValue,
  moduleDefinitions: {},
  rfElements: [],
  layoutVertically: false,
  setRfInstance: (inst: ReactFlowInstance<any> | undefined) => {
    set(
      produce((draft: MyState) => {
        draft.rfInstance = inst
      })
    )
  },
  setModuleDefinitions: (newMDs: ModuleDefinitions) => {
    set(
      produce((draft: MyState) => {
        draft.moduleDefinitions = { ...newMDs }
      })
    )
  },
  setValue: async (newValue: Pipeline) => {
    const rfElements = [
      ...getRFNodes(newValue.nodes),
      ...getRFEdges(newValue.pipe)
    ]
    const { layoutVertically } = get()

    const newPostions = await graphLayoutHelper(rfElements, layoutVertically)
    newPostions.nodes.forEach((np) => {
      const ele = rfElements.find((e) => e.id === np.nodeId)
      if (ele) {
        ;(ele as Node).position = { x: np.x, y: np.y }
      }
    })
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.value.version = newValue.version
        draft1.value.nodes = newValue.nodes.map(
          (node) => setModulePropInited(node) as Module
        )
        draft1.value.pipe = [...newValue.pipe]
        draft1.rfElements = [...rfElements]
      })
    )
  },
  addPipeline: async (modules: Module[], connections: Connection[]) => {
    const { value, rfElements, layoutVertically } = get()
    // update modules and connections IDs
    const [mods1, conns1] = updateIds(modules, connections, value.nodes)
    // update positions
    const rfNodesNew = mods1.map((mod) => getRFNode(mod))
    const rfEdgeNew = conns1.map(
      ([srcId, srcOutputId, targetId, targetInputId]) =>
        getRFEdge([srcId, srcOutputId, targetId, targetInputId])
    )
    const rfElements1 = [...rfElements, ...rfNodesNew, ...rfEdgeNew]

    const newPostions = await graphLayoutHelper(rfElements1, layoutVertically)
    // set state
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        // set state - value
        mods1.forEach((mod1) => {
          draft1.value.nodes.push(setModulePropInited(mod1) as Module)
        })
        conns1.forEach(([srcId, srcOutputId, targetId, targetInputId]) => {
          draft1.value.pipe.push([srcId, srcOutputId, targetId, targetInputId])
        })
        // set state - add new rfElements
        rfNodesNew.forEach((nodeNew) => {
          const p = newPostions.nodes.find((np) => np.nodeId === nodeNew.id)
          if (p) {
            nodeNew.position = { x: p.x, y: p.y }
          }
          draft1.rfElements.push(nodeNew)
        })
        rfEdgeNew.forEach((edgeNew) => {
          draft1.rfElements.push(edgeNew)
        })
        // set state - update old rfElements' positions
        newPostions.nodes.forEach((np) => {
          const ele1 = draft1.rfElements.find((e) => e.id === np.nodeId)
          if (ele1) {
            ;(ele1 as Node).position = { x: np.x, y: np.y }
          }
        })
      })
    )
  },
  addModule: (module: RawModule) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        let { id } = module
        if (id === undefined) {
          id = getNextModuleId(draft.value.nodes)
        }
        const module1 = { ...setModulePropInited(module), id }
        draft1.value.nodes.push(module1)
        draft1.rfElements.push(getRFNode(module1))
      })
    )
  },
  modifyModuleProp: (
    moduleId: number,
    propName: string,
    propVal: PropValue
  ) => {
    set(
      produce((draft: MyState) => {
        const module = draft.value.nodes.find((n) => n.id === moduleId)
        if (module) {
          if (module.props) {
            module.props[propName] = propVal
          } else {
            module.props = {}
            module.props[propName] = propVal
          }
        }
      })
    )
  },
  modifyModuleName: (moduleId: number, newName: string) => {
    set(
      produce((draft: MyState) => {
        const module = draft.value.nodes.find((n) => n.id === moduleId)
        if (module) {
          module.name = newName
        }
      })
    )
  },
  modifyModuleRunner: (moduleId: number, runner: string) => {
    set(
      produce((draft: MyState) => {
        const module = draft.value.nodes.find((n) => n.id === moduleId)
        if (module) {
          module.runner = runner
        }
      })
    )
  },
  removeModule: (moduleId: number) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        // 1. remove module
        const rfNodeIdx = draft1.rfElements.findIndex(
          (ele) => ele.data.id === moduleId
        )
        if (rfNodeIdx >= 0) {
          draft1.rfElements.splice(rfNodeIdx, 1)
        }
        const moduleIdx = draft1.value.nodes.findIndex(
          (node) => node.id === moduleId
        )
        if (moduleIdx >= 0) {
          draft1.value.nodes.splice(moduleIdx, 1)
        }
        // 2. remove all edges connected to the module
        draft1.rfElements = draft1.rfElements.filter(
          (ele) =>
            ele.data.connection === undefined ||
            (ele.data.connection &&
              ele.data.connection[0] !== moduleId &&
              ele.data.connection[2] !== moduleId)
        )
        draft1.value.pipe = draft1.value.pipe.filter(
          (conn) => conn[0] !== moduleId && conn[2] !== moduleId
        )
      })
    )
  },
  connectModules: (
    srcId: number,
    srcOutputId: number,
    targetId: number,
    targetInputId: number
  ) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.value.pipe.push([srcId, srcOutputId, targetId, targetInputId])
        draft1.rfElements.push(
          getRFEdge([srcId, srcOutputId, targetId, targetInputId])
        )
      })
    )
  },
  removeConnection: (rfEdgeId: string) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        const edgeIdx = draft1.rfElements.findIndex(
          (rfEle) => rfEle.id === rfEdgeId
        )
        if (edgeIdx >= 0) {
          const removedRFEdge = draft1.rfElements.splice(edgeIdx, 1)
          if (removedRFEdge) {
            const removedConn = removedRFEdge[0].data.connection
            const pipeIdx = draft1.value.pipe.findIndex(
              (conn) =>
                conn[0] === removedConn[0] &&
                conn[1] === removedConn[1] &&
                conn[2] === removedConn[2] &&
                conn[3] === removedConn[3]
            )
            if (pipeIdx >= 0) {
              draft1.value.pipe.splice(pipeIdx, 1)
            }
          }
        }
      })
    )
  },
  layoutGraph: () => {
    const { rfElements, layoutVertically } = get()
    graphLayoutHelper(rfElements, layoutVertically).then((res) => {
      res.nodes.forEach((r) => {
        set(
          produce((draft: MyState) => {
            const eleNode = draft.rfElements.find((n) => n.id === r.nodeId)
            if (eleNode) {
              // + Math.random() is a hack to force rerendering the Flow
              ;(eleNode as Node).position = { x: r.x + Math.random(), y: r.y }
            }
          })
        )
      })
      // res.edges.forEach((r) => {
      //   set(
      //     produce((draft: MyState) => {
      //       const eleEdge = draft.rfElements.find((n) => n.id === r.edgeId)
      //       if (eleEdge) {
      //         ;(eleEdge as Edge).s = { x: r.x + Math.random(), y: r.y }
      //       }
      //     })
      //   )
      // })
    })
  },
  clear: () => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.value = {
          version: 'v0.1.0',
          nodes: [],
          pipe: []
        }
        draft1.rfElements = []
      })
    )
  },
  setLayoutVertically: (lv: boolean) => {
    set(
      produce((draft: MyState) => {
        draft.layoutVertically = lv
        draft.rfElements.forEach((ele) => {
          if (ele.data && ele.data.elementType === 'node') {
            const rfNode = ele as Node
            rfNode.sourcePosition = lv
              ? ('bottom' as Position)
              : ('right' as Position)
            rfNode.targetPosition = lv
              ? ('top' as Position)
              : ('left' as Position)
          }
        })
      })
    )
  },
  putNodeFront: (moduleId: number) => {
    set(
      produce((draft: MyState) => {
        for (const node of draft.rfElements) {
          if (node.data && node.data.elementType === 'node') {
            node.zIndex = node.data && node.data.id === moduleId ? 100 : 0
          }
        }
      })
    )
  }
})

export default createCoreSlice
