
# CHANGELOG

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

- 🍗 feature: export `DrawROI` 组件;

## v1.2.9

- 🐛 fix: `DrawROI` 组件更换image后image变为可选（selectable）

## v1.2.12

- 🐛 fix: rotobo字体woff2 not found

## v1.2.19

- 🍗 feature: 新增 model 节点种类：`ClassificationModel`, `PoseModel` (参考例子: `src/stories/datav2/md3.ts`[./src/stories/datav2/md3.ts] 与 `src/stories/datav2/pipeline5.json`[./src/stories/datav2/pipeline5.json])

  - **API CHANGE**: 为了在fetch模型列表及按名称搜索模型时，仅在相应 model 种类范围中搜索，property -- `fetchModelList` 允许传入第三个参数 `queryModelType?: string`; 当前支持的 model 节点对应的 queryModelType 如下：
    - detection model - `detection`
    - classification model - `classification`
    - pose model - `pose`

- 🍗 feature: 当 ROI 节点有除 `regions` 之外的 props 时，ROI 节点也会有 Details 部分. (但details不包含regions)

## v2.0.0

- **🚨Breaking Change**: `AppCanvas` 的prop去掉了`fetchLabelList`这个prop; `fetchModelList` 的接口有变化，返回的model element新增了labels, accelerate, best_threshold等。详见typescript definition。

- 🍗 feature: `ModelDefinition` 文件，新增 `props.label` （optional）, 用来为module prop指定显示名称（例如中文翻译）；参考 `src/stories/datav2/md3.ts`[./src/stories/datav2/md3.ts].

- 🍗 feature: 交换了 module 显示中`module type` 和 `module name` 的显示位置。增加了description question mark.

- 🍗 feature: model显示区域，增加显示加速器（accelerator）类型的标签.

## v2.0.1

- 🍗 feature: BoxFilter节点的prop -- `best_threshold` 默认值(default value)根据pipeline中上游所有dependency模型节点的`best_threshold`中最小值确定.

- 🍗 feature: 当模型节点有除 `mod_iter_id`, `mod_id`等 之外的 props 时，ROI 节点也会有 Details 部分. (但details不包含`mod_iter_id`, `mod_id`等)

- 🐛 fix: 模型名称过长导致的UI问题

## 2.0.2

- 🍗 feature: module definition 通过配置 `visibility_and_readonly` - 'visible_editable' (默认), 'visibility_and_readonly', 'invisible' 指定某个prop是否显示以及是否可编辑.

- 🍗 feature: BoxFilter节点的prop -- `box_prop` (而不是`best_threshold`) 默认值(default value)根据pipeline中上游所有dependency模型节点的`best_threshold`中最小值确定.

- 🐛 fix: BoxFilter节点的prop 的label未显示问题.