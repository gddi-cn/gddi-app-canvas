import { FetchLabelRes, FetchModelRes } from '../../AppCanvas'

export const fetchModelResult: FetchModelRes = {
  models: [
    {
      mod_id: '0',
      mod_iter_id: '0',
      mod_name: '检测可爱动物',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_result_id: '033'
    },
    {
      mod_id: '1',
      mod_iter_id: '0',
      mod_name: '检测丑陋动物',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_result_id: '133'
    },
    {
      mod_id: '2',
      mod_iter_id: '0',
      mod_name: '检测丑陋人脸',
      mod_created_at: new Date(),
      mod_version: '1.2.1',
      mod_version_id: '1',
      mod_result_id: '233'
    },
    {
      mod_id: '3',
      mod_iter_id: '0',
      mod_name: '大西瓜模型',
      mod_created_at: new Date(),
      mod_version: '1.12',
      mod_version_id: '1',
      mod_result_id: '333'
    },
    {
      mod_id: '4',
      mod_iter_id: '0',
      mod_name: '神奇动物在哪里？',
      mod_created_at: new Date(),
      mod_version: '2.2',
      mod_version_id: '1',
      mod_result_id: '433'
    }
  ],
  totalCnt: 5
}

const labels1: FetchLabelRes = {
  labels: ['cat', 'dog', 'panda', 'horse']
}
const labels2: FetchLabelRes = {
  labels: [
    'lucy',
    'tom',
    'lily',
    'almond',
    'black',
    'daisy',
    'clark',
    'rosenburg',
    'alexander the great'
  ]
}
const labels3: FetchLabelRes = {
  labels: ['twinkle', 'little star', 'wish', 'milky', 'molly']
}
const labels4: FetchLabelRes = {
  labels: ['pat', 'shawn the sheep']
}

export const modelLabels = {
  '033': labels1,
  '133': labels2,
  '233': labels3,
  '333': labels4,
  '433': [...labels4.labels, ...labels2.labels]
}
