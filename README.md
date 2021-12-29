A React component to visualize and edit GDDi's AI APPs.

- **Demo:** ...🚧
- **API Doc:** ...🚧

## Installation

```
yarn add gddi-app-canvas
```

## Simple Usage

```typescript
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
