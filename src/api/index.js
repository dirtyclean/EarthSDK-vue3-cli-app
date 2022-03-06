import req from '@/utils/request.js'
import { deleteOptionsEmptyChildren, getTreeData } from '@/utils/methods'
const base = '/pc/area/v1/areas'
const getAreaTreeData = async ({ name } = { name: '' }) => {
  return await req
    .get(`${base}/all`, {
      name
    })
    .then(({ data: res }) => {
      res = res.filter(({ code }) => code !== '0')
      res = res.map(item => ({
        ...item
      }))
      res = getTreeData(res)
      return deleteOptionsEmptyChildren(res)
    })
    .catch(() => {})
}
const getEnterpriseList = ({ areaId, pageNum, pageSize, name }) => {
  const organizationType = '01'
  return req.get('/pc/org/v1/orgs', { pageNum, pageSize, areaId, organizationType, type: '00', name })
}
export default {
  getAreaTreeData,
  getEnterpriseList
}
