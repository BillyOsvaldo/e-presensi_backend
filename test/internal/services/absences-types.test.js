const assert = require('assert')
const app = require('../../../src/app')

var docAbsenceType = null

describe('\'AbsencesTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('absencestypes')

    assert.ok(service, 'Registered the service')
  })

  it('create a document', async () => {
    const service = app.service('absencestypes')

    const data = { name: 'test name', desc: 'test desc' }
    docAbsenceType = await service.create(data)
    assert.ok(docAbsenceType._id, 'Document created')
  })

  it('patch a document', async () => {
    const service = app.service('absencestypes')

    const updateData = { name: 'test patched', desc: 'test desc' }
    const doc = await service.patch(docAbsenceType._id, updateData)
    assert.ok(doc.name === 'test patched', 'Document created')
  })

  it('remove a document', async () => {
    const service = app.service('absencestypes')

    const data = { name: 'test name', desc: 'test desc' }
    const doc = await service.remove(docAbsenceType._id)
    assert.ok(doc, 'Document created')
  })

})
