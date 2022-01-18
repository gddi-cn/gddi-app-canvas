A React component to visualize and edit GDDi's AI APPs.

- **Demo:** ...🚧
- **Data Explained:** ...🚧

## Installation

```shell
yarn add gddi-app-canvas
```

## Simple Usage

```tsx
import {
  AppCanvas,
  ModuleDefinitions,
  AIAppType,
  Pipeline,
  Module,
  Connection,
} from 'gddi-app-canvas'

const handleAppLoad = useCallback((app: AIAppType) => {
    app.fitView()
    console.log('app loaded')
}, [])

const handleValueChange = useCallback((val: Pipeline) => {
    console.log('val changed')
    console.log(val)
}, [])

<div style={{ width: '1000px', height: '800px' }}>
  // width and height of the parent element are required to be set
  <AppCanvas
    defaultValue={myPipeline as Pipeline}
    moduleDefinitions={nodeDefinition1 as ModuleDefinitions}
    onLoad={handleAppLoad}
    onValueChange={handleValueChange}
    graphEditingDisabled={false}
    propEditingDisabled={false}
  />
</div>
```

## Style

### Dark Mode

set prop `dark`

## Data Explained

### moduleDefinitions

Object to describe the module's input / output endpoints, property, and other metadata.

- Type define can be found in `src/AppCanvas/types.ts`
- Example can be found in `src/stories/data/`

```typescript
export type ModulePropType = string | number | boolean | undefined

export interface ModulePropDefinition {
  // type: 'string' | 'boolean' | 'number' | 'select'
  options: ModulePropType[]
}

export interface Endpoint {
  id: number
  name: string
}

export interface ModuleDefinition {
  inputs?: Endpoint[]
  outputs?: Endpoint[]
  props?: { [propName: string]: ModulePropDefinition }
}

export interface ModuleDefinitions {
  [moduleType: string]: ModuleDefinition
}
```
