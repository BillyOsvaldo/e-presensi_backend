const config = require('../../config/default')

const getParamsWithHeader = (originalParams1 = {}, originalParams2 = {}) => {
  const paramsWithHeader = { headers :{ 'x-api-key': config.api_key } }
  const res = { ...originalParams1, ...originalParams2, ...paramsWithHeader }
  delete res.provider
  return res
}

module.exports = getParamsWithHeader
