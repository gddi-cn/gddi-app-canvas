import produce from 'immer'
import { Elements, Node } from 'react-flow-renderer'
import { GetState, SetState } from 'zustand'
import {
  ModuleDefinitions,
  Pipeline,
  ModulePropType,
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
  getNextModuleId
} from '../helpers'

export interface CoreSlice {
  value: Pipeline
  moduleDefinitions: ModuleDefinitions
  rfElements: Elements
  setModuleDefinitions: (newMDs: ModuleDefinitions) => void
  setValue: (newValue: Pipeline) => void
  addModule: (module: RawModule) => void
  addPipeline: (modules: Module[], connections: Connection[]) => void
  modifyModuleProp: (
    moduleId: number,
    propName: string,
    propVal: ModulePropType
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
}

const createCoreSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): CoreSlice => ({
  value: {
    version: 'v0.1.0',
    nodes: [],
    pipe: []
  },
  moduleDefinitions: {},
  rfElements: [],
  setModuleDefinitions: (newMDs: ModuleDefinitions) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.moduleDefinitions = { ...newMDs }
      })
    )
  },
  setValue: (newValue: Pipeline) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.value.version = newValue.version
        draft1.value.nodes = [...newValue.nodes]
        draft1.value.pipe = [...newValue.pipe]
        draft1.rfElements = [
          ...getRFNodes(newValue.nodes),
          ...getRFEdges(newValue.pipe)
        ]
      })
    )
  },
  addPipeline: (modules: Module[], connections: Connection[]) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        const mods1 = [...modules]
        const conns1 = connections.map((conn) => [...conn])
        // replace module id with new one -- mods1, conns1
        let modIdNew = getNextModuleId(draft.value.nodes)
        modules.forEach((mod, modIdx) => {
          const modId0 = mod.id
          if (modId0 !== modIdNew) {
            mods1[modIdx] = { ...mod, id: modIdNew }
            connections.forEach((conn, connIdx) => {
              if (conn[0] === modId0) {
                conns1[connIdx][0] = modIdNew
              }
              if (conn[2] === modId0) {
                conns1[connIdx][2] = modIdNew
              }
            })
          }
          modIdNew += 1
        })
        // add modules
        mods1.forEach((mod1) => {
          draft1.value.nodes.push(mod1)
          draft1.rfElements.push(getRFNode(mod1))
        })
        // connect modules
        conns1.forEach(([srcId, srcOutputId, targetId, targetInputId]) => {
          draft1.value.pipe.push([srcId, srcOutputId, targetId, targetInputId])
          draft1.rfElements.push(
            getRFEdge([srcId, srcOutputId, targetId, targetInputId])
          )
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
        const module1 = { ...module, id }
        draft1.value.nodes.push(module1)
        draft1.rfElements.push(getRFNode(module1))
      })
    )
  },
  modifyModuleProp: (
    moduleId: number,
    propName: string,
    propVal: ModulePropType
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
    const { rfElements } = get()
    graphLayoutHelper(rfElements).then((res) => {
      res.forEach((r) => {
        set(
          produce((draft: MyState) => {
            const draft1 = draft
            const eleNode = draft1.rfElements.find((n) => n.id === r.nodeId)
            if (eleNode) {
              // + Math.random() is a hack to force rerendering the Flow
              ;(eleNode as Node).position = { x: r.x + Math.random(), y: r.y }
            }
          })
        )
      })
    })
  }
})

export default createCoreSlice
