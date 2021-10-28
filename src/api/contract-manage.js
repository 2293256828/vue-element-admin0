import request from '@/utils/request'
export function searchContract(data) {
  return request({
    url: 'search/searchContract',
    method: 'post',
    data
  })
}

export function countersign(data) {
  return request({
    url: '/contract/countersign',
    method: 'post',
    data
  })
}

export function audit(data) {
  return request({
    url: '/contract/audit',
    method: 'post',
    data
  })
}

export function saveDraft(data) {
  return request({
    url: '/contract/draft',
    method: 'post',
    data
  })
}

export function finalizeDraft(data) {
  return request({
    url: '/contract/finalizeDraft',
    method: 'post',
    data
  })
}

export function deleteContract(contractNo) {
  return request({
    url: '/contract/delete',
    method: 'delete',
    params: { contractNo }
  })
}

export function assignTask(data) {
  return request({
    url: '/contract/assignTask',
    method: 'post',
    data
  })
}

export function sign(data) {
  return request({
    url: '/contract/sign',
    method: 'post',
    data
  })
}
