import { Module, Connection } from './pipeline'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type RawModule = Optional<Module, 'id'>

export type AIAppType = {
  /**
   * Add a Module (node)
   */
  addModule: (module: RawModule) => void
  /**
   * Add a Pipeline (template)
   */
  addPipeline: (modules: Module[], connections: Connection[]) => void
  /**
   * Horizontally layout the graph
   */
  layoutGraph: () => void
  /**
   * Fit the graph in view
   */
  fitView: () => void
  /**
   * Clear content in canvas
   */
  clear: () => void
  /**
   * Reset all modules' properties to what they were when inited
   */
  resetModuleProps: () => void
}
