import request from '@/utils/request'

export const getRoles = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

export const deleteRole = (id: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

export const createOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}
