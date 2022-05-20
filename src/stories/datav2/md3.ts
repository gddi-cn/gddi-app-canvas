import { ModuleDefinitions } from './../../AppCanvas'

export const md3: ModuleDefinitions = {
  Demuxer_v2: {
    version: 'null',
    description: '视频读取组件',
    outputs: [
      {
        id: 0,
        name: 'output_0'
      },
      {
        id: 1,
        name: 'output_1'
      }
    ]
  },
  Decoder_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      },
      {
        id: 1,
        name: 'input_1'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      },
      {
        id: 1,
        name: 'output_1'
      }
    ]
  },
  AvToCv_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  DetectionModel_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  ClassificationModel_v2: {
    version: 'null',
    description: '分类模型',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  PoseModel_v2: {
    version: 'null',
    description: '姿态检测模型',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  Tracking_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  Graphics_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  Report_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ]
  },
  Bridge_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ],
    props: {
      enable: {
        type: 'boolean',
        label: '开启',
        description: '开启智慧之门👁'
      }
    }
  },
  VideoEncode_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    props: {
      output_stream_url: {
        type: 'string'
      }
    }
  },
  ROI_v2: {
    version: 'null',
    description: '视频读取组件',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ],
    props: {
      regions: {
        type: 'array',
        label: 'ROI区域',
        description: '所有ROI区域的列表；每个ROI -- [topX, topY, width, height]'
      },
      dinner: {
        type: 'string',
        label: '晚餐',
        description: '晚餐吃什么？'
      }
    }
  },
  BoxFilter_v2: {
    version: 'null',
    description: '框过滤',
    inputs: [
      {
        id: 0,
        name: 'input_0'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'output_0'
      }
    ],
    props: {
      box_labels1: {
        type: 'stringArray',
        label: '标签',
        enum: ['blue', 'red', 'orange'],
        default: ['blue']
      },
      best_threshold: {
        type: 'number',
        default: 0.75
      },
      min_width: {
        type: 'number',
        label: '最小宽度',
        description: '什么是快乐星球？？？'
      },
      min_height: {
        type: 'number',
        label: '最小高度',
        description: '请致电zhehong'
      }
    }
  }
}
