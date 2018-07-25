const menusHook = {}

menusHook.generateOrder = async context => {
  const Menus = context.app.service('menus').Model
  context.data.order = (await Menus.count()) + 1
}

menusHook.paginationBefore = async context => {
  context.params.paginate = false
}

menusHook.paginationAfter = async context => {
  context.result = {
    "total": context.result.length,
    "limit": context.result.length,
    "skip": 0,
    "data": context.result
  }
}

module.exports = menusHook
