import request from '@/utils/request'

export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

export const getEditMenuInfo = (id: string | number = -1) => {
  return request({
    method: 'GET', // 接口文档里写的POST写错了，实际上应该是GET
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

export const getAllMenus = () => {
  return request({
    method: 'GET', // 接口文档里写的POST写错了，实际上应该是GET
    url: '/boss/menu/getAll'
  })
}

export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE', // 接口文档里写的POST写错了，实际上应该是GET
    url: `/boss/menu/${id}`
  })
}
