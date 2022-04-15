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

## v1.2.1
- 修改名字 - detection node的 filter_labels prop 改成了 mod_labels，等修改

## v1.2.2
- 🍗 feature: BoxFilter节点的`box_labels`属性的可选项依赖于其上游Model节点的`mod_labels`属性中`checked === true`的entry的`label`值。
  - Model节点的判断方法：module的type必须包含`model`这个substring, 例如：`DetectionModel_v2`, `classification_model_v1.2.3`.

## v1.2.3
- 判断是否为model节点的方式，从读module type修改为读`props.mod_labels`是否存在
- Model节点选择模型时，使用`mod_iter_id`来唯一确定一个model
- 增加version number显示
- `fetchModelList` 的 `pageNumber` 修改为从1开始（之前是从0开始）

## v1.2.4
- 🐛 fix: 页码的问题；model搜索后label没有load的问题；
- 🐛 fix: 当Model节点的props为空（尚未选择模型）情况的处理;

## v1.2.7
-  🍗 feature: export `DrawROI` 组件;

## v1.2.9
- 🐛 fix: `DrawROI` 组件更换image后image变为可选（selectable）