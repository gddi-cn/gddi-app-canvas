/* eslint-disable max-len */
export const modDef1 = {
  Demuxer_v1_1: {
    inputs: [
      {
        id: 0,
        name: 'demux.cmd'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'AVPacket *'
      },
      {
        id: 1,
        name: 'AVCodecParameters *'
      }
    ],
    props: {
      stream_url: {
        options: [
          'rtsp://admin:gddi1234@192.168.1.233:554/h264/ch1/main/av_stream',
          'rtsp://stream_doge',
          'rtsp://stream_kitten'
        ]
      }
    }
  },
  Decoder_v1_1: {
    inputs: [
      {
        id: 0,
        name: 'AVPacket *'
      },
      {
        id: 1,
        name: 'video_stream_open'
      }
    ],
    outputs: [
      {
        id: 0,
        name: 'AVFrame *'
      },
      {
        id: 1,
        name: 'std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> >'
      }
    ]
  },
  AvToCvMat_v1: {
    inputs: [
      {
        id: 0,
        name: 'AVFrame *'
      }
    ],
    outputs: [
      {
        id: 0,
        name: '图片'
      }
    ]
  },
  CvImShow_v2: {
    inputs: [
      {
        id: 0,
        name: '图片'
      }
    ]
  },
  MessageRefTime_v1: {
    inputs: [
      {
        id: 0,
        name: '图片'
      }
    ]
  }
}
