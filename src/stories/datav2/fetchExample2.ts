import { FetchModelRes } from '../../AppCanvas'

const labels1 = ['cat', 'dog', 'panda', 'horse']
const labels2 = [
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
const labels3 = ['twinkle', 'little star', 'wish', 'milky', 'molly']
const labels4 = ['pat', 'shawn the sheep']

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
      mod_result_id: '033',
      accelerate: 'GPU',
      labels: labels1,
      best_threshold: 0.2
    },
    {
      mod_id: '0',
      mod_iter_id: 'fe133',
      mod_name: '检测丑陋动物',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '133',
      accelerate: 'NPU',
      labels: labels2,
      best_threshold: 0.23
    },
    {
      mod_id: '0',
      mod_iter_id: 'fe233',
      mod_name: '检测丑陋人脸',
      mod_created_at: new Date(),
      mod_version: '1.2.1',
      mod_version_id: '1',
      mod_license: 'MIT',
      mod_result_id: '233',
      accelerate: 'NPU',
      labels: labels3,
      best_threshold: 0.33
    },
    {
      mod_id: '0',
      mod_iter_id: 'fe333',
      mod_name: '大西瓜模型',
      mod_created_at: new Date(),
      mod_version: '1.12',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '333',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '4',
      mod_iter_id: 'fe433',
      mod_name: '神奇动物在哪里？',
      mod_created_at: new Date(),
      mod_version: '2.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '433',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '5',
      mod_iter_id: 'fe533',
      mod_name: '早安，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '533',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '6',
      mod_iter_id: 'fe633',
      mod_name: '早安，滴丽滴丽',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '633',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '7',
      mod_iter_id: 'fe733',
      mod_name: '玛卡巴卡暴风吸入',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '733',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '8',
      mod_iter_id: 'fe833',
      mod_name: '再见，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '833',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '9',
      mod_iter_id: 'fe933',
      mod_name: '午安，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '933',
      accelerate: 'GPU',
      labels: labels2,
      best_threshold: 0.5
    },
    {
      mod_id: '10',
      mod_iter_id: 'fe1033',
      mod_name: '晚安，玛卡巴卡',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '1033',
      accelerate: 'GPU',
      labels: labels1,
      best_threshold: 0.5
    }
  ],
  totalCnt: 11
}

export const fetchModelResult2: FetchModelRes = {
  models: [
    {
      mod_id: '0',
      mod_iter_id: 'fe033',
      mod_name: '分类模型1',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '033',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '0',
      mod_iter_id: 'fe133',
      mod_name: '分类模型2',
      mod_created_at: new Date(),
      mod_version: '1.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '133',
      accelerate: 'GPU',
      labels: labels2,
      best_threshold: 0.1
    },
    {
      mod_id: '0',
      mod_iter_id: 'fe233',
      mod_name: '分类模型3',
      mod_created_at: new Date(),
      mod_version: '1.2.1',
      mod_version_id: '1',
      mod_license: 'MIT',
      mod_result_id: '233',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '0',
      mod_iter_id: 'fe333',
      mod_name: '分类模型4',
      mod_created_at: new Date(),
      mod_version: '1.12',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '333',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '4',
      mod_iter_id: 'fe433',
      mod_name: '分类模型5',
      mod_created_at: new Date(),
      mod_version: '2.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '433',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '5',
      mod_iter_id: 'fe533',
      mod_name: '分类模型6',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '533',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '6',
      mod_iter_id: 'fe633',
      mod_name: '分类模型7',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '633',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '7',
      mod_iter_id: 'fe733',
      mod_name: '分类模型8',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '733',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '8',
      mod_iter_id: 'fe833',
      mod_name: '分类模型9',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '833',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '9',
      mod_iter_id: 'fe933',
      mod_name: '分类模型10',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '933',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    },
    {
      mod_id: '10',
      mod_iter_id: 'fe1033',
      mod_name: '分类模型11',
      mod_created_at: new Date(),
      mod_version: '3.2',
      mod_version_id: '1',
      mod_license: '',
      mod_result_id: '1033',
      accelerate: 'GPU',
      labels: labels4,
      best_threshold: 0.5
    }
  ],
  totalCnt: 11
}
