export const pipeline1 = {
  nodes: [
    {
      id: 0,
      type: 'Demuxer_v1_1',
      name: 'Demuxer_v1_1',
      runner: 'default',
      props: {
        stream_url:
          'rtsp://admin:gddi1234@192.168.1.233:554/h264/ch1/main/av_stream'
      }
    },
    {
      id: 1,
      type: 'Decoder_v1_1',
      name: 'Decoder_v1_1',
      runner: 'default',
      props: {
        prefer_hw: 0,
        disable_hw_acc: 0
      }
    },
    {
      id: 2,
      type: 'AvToCvMat_v1',
      name: 'frame to mat',
      runner: 'default',
      props: {
        print_sws_time: 1
      }
    },
    {
      id: 3,
      type: 'CvImShow_v2',
      name: 'decode show',
      runner: 'default'
    },
    {
      id: 4,
      type: 'MessageRefTime_v1',
      name: 'show time for frame',
      runner: 'default'
    }
  ],
  pipe: [
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 2, 0],
    [2, 0, 3, 0],
    [2, 0, 4, 0]
  ]
}
