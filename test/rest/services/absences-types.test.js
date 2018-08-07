const assert = require('assert')
const { clientPresensi } = require('../helper')

var docAbsenceType = null

describe('\'AbsencesTypes\' service', () => {
  it('create a document', async () => {
    const service = clientPresensi.service('absencestypes')

    const data = { name: 'test name', desc: 'test desc' }
    docAbsenceType = await service.create(data)
    assert.ok(docAbsenceType._id, 'Document created')
  })

  it('patch a document', async () => {
    const service = clientPresensi.service('absencestypes')

    const updateData = { name: 'test patched', desc: 'test desc' }
    const doc = await service.patch(docAbsenceType._id, updateData)
    assert.ok(doc.name === 'test patched', 'Document created')
  })

  it('remove a document', async () => {
    const service = clientPresensi.service('absencestypes')

    const data = { name: 'test name', desc: 'test desc' }
    const doc = await service.remove(docAbsenceType._id)
    assert.ok(doc, 'Document created')
  })

})
