import request from '@/utils/request'

export const addBlog = data => request({
  method: 'POST',
  url: '/blogs',
  data
})

export const editBlog = data => request({
  method: 'PUT',
  url: `/blogs/${data.id}`,
  data
})

export const deleteBlog = id => request({
  method: 'DELETE',
  url: `/blogs/${id}`
})