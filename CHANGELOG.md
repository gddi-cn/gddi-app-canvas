## v0.1.3

- AppInstance 新增 methods ----
  - clear(); clear all contents in the canvas
  - resetModuleProps(); 重置所有模块的属性; reset all module's properties to their initial ones (values when they are added to the canvas)
- Dark mode
  - component prop: `dark`
  - component prop: `hideDarkModeButton` -- 是否隐藏 dark mode 的 button
- component mounted 及 addPipeline() called 时**自动布线**。不需要在 init 或 addPipeline 后手动 call layoutGraph()

## v0.1.10
- 🐛 fix: `fetchModelList` 和 `fetchLabelList` 改变时并没有重新fetch API
- feature: 当 `propEditingDisabled === true` 时，点击「模型」节点，看到的是已选择的模型名称、版本、创建时间、标签列表等信息

## v1.1.2
- **🚨Breaking Change**: 对于ROI module的 `props.regions`, 改为多边形 (见：https://vme0c7akap.feishu.cn/docs/doccnZgaLeaOfL55jHn1H2F01Gh)。
- ROI module去除对摄像头分辨率的选择.
