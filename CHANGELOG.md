## v0.1.2

- AppInstance 新增 methods ----
  - clear(); clear all contents in the canvas
  - resetModuleProps(); 重置所有模块的属性; reset all module's properties to their initial ones (values when they are added to the canvas)
- Dark mode
  - component prop: `dark`
  - component prop: `hideDarkModeButton` -- 是否隐藏 dark mode 的 button
- component mounted 及 addPipeline() called 时**自动布线**。不需要在 init 或 addPipeline 后手动 call layoutGraph()
