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
- 🍗 feature: 当 `propEditingDisabled === true` 时，点击「模型」节点，看到的是已选择的模型名称、版本、创建时间、标签列表等信息

## v1.1.2
- **🚨Breaking Change**: 对于ROI module的 `props.regions`, 改为多边形 (见：https://vme0c7akap.feishu.cn/docs/doccnZgaLeaOfL55jHn1H2F01Gh)。
- ROI module去除对摄像头分辨率的选择.

## v1.1.3
- 🐛 fix: addPipeline() 后，第一次点击「缩小按钮」有可能会放大
- 🐛 fix: 对于 detection model node, 限制node的宽度 ---- 以避免model name过长导致
node过长。model name在cursor hover时用tooltip显示。
- 🍗 feature: 选择detection model时按 model name搜索.
  - prop `fetchModelList: ModelListFetcher`, 新增一个参数`queryModelName?: string`. 当 `queryModelName === undefined` 时，get所有model; 当 `queryModelName ！== undefined` 时，按queryModelName匹配搜索，仅返回搜索结果的model.

## v1.2.0
- 🍗 feature: 选择detection model的节点，其中filter_labels prop从`string[]`变为object -- 用于配置‘标签映射’、‘标签颜色’等.