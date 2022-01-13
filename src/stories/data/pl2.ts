export const pipeline2 = {
  nodes: [
    {
      id: 0,
      type: 'Demuxer_v2',
      name: 'Demuxer_v2_0',
      runner: 'Decoder_v2_1',
      props: {
        stream_url: '$input_stream_url'
      }
    },
    {
      id: 1,
      type: 'Decoder_v2',
      name: 'Decoder_v2_1',
      runner: 'Decoder_v2_1',
      props: {
        hw_type: 2
      }
    },
    {
      id: 2,
      type: 'AvToCv_v2',
      name: 'AvToCv_v2_2',
      runner: 'default'
    },
    {
      id: 3,
      type: 'Detection_v2',
      name: 'Detection_v2_3',
      runner: 'Detection',
      props: {
        mod_name: 'det',
        conf_path: '/home/models/person.json',
        mod_path: '/home/models/person.gem',
        filter_labels: ['person']
      }
    },
    {
      id: 5,
      type: 'Graphics_v2',
      name: 'Graphics_v2_4',
      runner: 'Graphics',
      props: {
        ttf_file: '/home/ttf/NotoSans-Regular.ttf'
      }
    },
    {
      id: 4,
      type: 'Tracking_v2',
      name: 'Tracking_v2_5',
      runner: 'default'
    },
    {
      id: 6,
      type: 'Report_v2',
      name: 'Report_v2_6',
      runner: 'Report_v2_6',
      props: {
        report_url: '$report_url',
        save_raw: true
      }
    }
  ],
  pipe: [
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 1, 2, 0],
    [2, 0, 3, 0],
    [3, 0, 4, 0],
    [4, 0, 5, 0],
    [5, 0, 6, 0]
  ]
}
