import { FetchLabelRes, FetchModelRes } from '../../AppCanvas'

export const fetchModelResult: FetchModelRes = {
  models: [
    {
      mod_id: '0',
      mod_iter_id: 'fe033',
      mod_name: '检测可爱动物',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '033'
    },
    {
      mod_id: '1',
      mod_iter_id: 'fe133',
      mod_name: '检测丑陋动物',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '133'
    },
    {
      mod_id: '2',
      mod_iter_id: 'fe233',
      mod_name: '检测丑陋人脸',
      mod_created_at: new Date(),
      mod_version: '1.2.1',
      mod_version_id: '1',
      mod_license: 'MIT',
      mod_result_id: '233'
    },
    {
      mod_id: '3',
      mod_iter_id: 'fe333',
      mod_name: '大西瓜模型',
      mod_created_at: new Date(),
      mod_version: '1.12',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '333'
    },
    {
      mod_id: '4',
      mod_iter_id: 'fe433',
      mod_name: '神奇动物在哪里？',
      mod_created_at: new Date(),
      mod_version: '2.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '433'
    },
    {
      mod_id: '5',
      mod_iter_id: 'fe533',
      mod_name: '早安，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '533'
    },
    {
      mod_id: '6',
      mod_iter_id: 'fe633',
      mod_name: '早安，滴丽滴丽',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '633'
    },
    {
      mod_id: '7',
      mod_iter_id: 'fe733',
      mod_name: '玛卡巴卡暴风吸入',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '733'
    },
    {
      mod_id: '8',
      mod_iter_id: 'fe833',
      mod_name: '再见，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '833'
    },
    {
      mod_id: '9',
      mod_iter_id: 'fe933',
      mod_name: '午安，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '933'
    },
    {
      mod_id: '10',
      mod_iter_id: 'fe1033',
      mod_name: '晚安，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '1033'
    }
  ],
  totalCnt: 11
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
  '433': { labels: [...labels4.labels, ...labels2.labels] },
  '533': labels1,
  '633': labels2,
  '733': labels3,
  '833': labels4,
  '933': { labels: [...labels4.labels, ...labels2.labels] },
  '1033': labels3
}
