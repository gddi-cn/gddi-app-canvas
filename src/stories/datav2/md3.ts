import { ModuleDefinitions } from './../../AppCanvas'

export const md3: ModuleDefinitions = {
  Demuxer_v2: {
    version: 'null',
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
  Tracking_v2: {
    version: 'null',
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
        type: 'boolean'
      }
    }
  },
  VideoEncode_v2: {
    version: 'null',
    name: 'VideoCaptureNode',
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
    name: 'VideoCaptureNode',
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
        description: '所有ROI区域的列表；每个ROI -- [topX, topY, width, height]'
      }
    }
  },
  BoxFilter_v2: {
    version: 'null',
    name: 'BoxFilter',
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
        enum: ['blue', 'red', 'orange']
      }
    }
  }
}
