const { headers } = require('../../helpers/headers')
const objectid = require('objectid')
const moment = require('moment')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {}
  }

  /*
    if today there is mode 1 and mode 2
      if mode 1 < 07.30 and mode 2 > 14.00
        then presence is tepat_waktu
      else if mode 1 > 07.30 and mode 2 > 14.00
        then presence is telat
      if mode 1 is exist and mode 2 is not exist
    else
      if today in absences is found
        count alpa, dl, cuti, izin
  */

  // 
  /*
    @provide params.organization
    @request:
      {
        organization: objectid,
        month: int,
        year: int
      }
    @response:
      [
        {
          name: String
          tepat_waktu: Number,
          telat: Number,
          pulang_cepat: Number,
          alpa: Number,
          dl: Number,
          cuti: Number,
          ijin: Number,
          sakit: Number
        }
      ]
  */
  async find (params) {
    const Presences = this.app.service('presences').Model

    const getUsersIds = async () => {
      var params2 = {
        query: {
          $nopaginate: true,
          $select: ['_id']
        },
        headers: headers
      }

      const docsUsers = await params.client.service('users').find(params2)
      const usersIds = docsUsers.map(doc => objectid(doc._id))
      return usersIds
    }

    const usersIds = await getUsersIds()

    const aggregateData = [
      {
        $project: {
          user: 1,
          month: { $month: '$time'},
          year: { $year: '$time'},
        }
      },
      {
        $match: {
          $and: [
            { user: { $in: usersIds } },
            { mont: parseInt(params.query.month) },
            { year: parseInt(params.query.year) }
          ]
        }
      }
    ]
    //console.log('aggregateData', JSON.stringify(aggregateData))

    const docs = await Presences.aggregate(aggregateData)

    const fakeData = [
      {
        _id: '5a0f959604e1cb7fd219bad9',
        name: "Edi Triono",
        tepat_waktu: Math.floor((Math.random() * 10) + 1),
        telat: Math.floor((Math.random() * 10) + 1),
        pulang_cepat: Math.floor((Math.random() * 10) + 1),
        alpa: Math.floor((Math.random() * 10) + 1),
        dl: Math.floor((Math.random() * 10) + 1),
        cuti: Math.floor((Math.random() * 10) + 1),
        ijin: Math.floor((Math.random() * 10) + 1),
        sakit: Math.floor((Math.random() * 10) + 1)
      },{
        _id: '5a123489cbf7231cdf7e9088',
        name: "Billy Joe",
        tepat_waktu: Math.floor((Math.random() * 10) + 1),
        telat: Math.floor((Math.random() * 10) + 1),
        pulang_cepat: Math.floor((Math.random() * 10) + 1),
        alpa: Math.floor((Math.random() * 10) + 1),
        dl: Math.floor((Math.random() * 10) + 1),
        cuti: Math.floor((Math.random() * 10) + 1),
        ijin: Math.floor((Math.random() * 10) + 1),
        sakit: Math.floor((Math.random() * 10) + 1)
      },{
        _id: '5ac825aeb6c1e341aef13784',
        name: "DC Kristiono",
        tepat_waktu: Math.floor((Math.random() * 10) + 1),
        telat: Math.floor((Math.random() * 10) + 1),
        pulang_cepat: Math.floor((Math.random() * 10) + 1),
        alpa: Math.floor((Math.random() * 10) + 1),
        dl: Math.floor((Math.random() * 10) + 1),
        cuti: Math.floor((Math.random() * 10) + 1),
        ijin: Math.floor((Math.random() * 10) + 1),
        sakit: Math.floor((Math.random() * 10) + 1)
      },{
        _id: '5ac82798b6c1e341aef13785',
        name: "Kristianto",
        tepat_waktu: Math.floor((Math.random() * 10) + 1),
        telat: Math.floor((Math.random() * 10) + 1),
        pulang_cepat: Math.floor((Math.random() * 10) + 1),
        alpa: Math.floor((Math.random() * 10) + 1),
        dl: Math.floor((Math.random() * 10) + 1),
        cuti: Math.floor((Math.random() * 10) + 1),
        ijin: Math.floor((Math.random() * 10) + 1),
        sakit: Math.floor((Math.random() * 10) + 1)
      },{
        _id: '5ac82c31b6c1e341aef13797',
        name: "Subhan",
        tepat_waktu: Math.floor((Math.random() * 10) + 1),
        telat: Math.floor((Math.random() * 10) + 1),
        pulang_cepat: Math.floor((Math.random() * 10) + 1),
        alpa: Math.floor((Math.random() * 10) + 1),
        dl: Math.floor((Math.random() * 10) + 1),
        cuti: Math.floor((Math.random() * 10) + 1),
        ijin: Math.floor((Math.random() * 10) + 1),
        sakit: Math.floor((Math.random() * 10) + 1)
      },{
        _id: '5ac82c77b6c1e341aef13798',
        name: "Luki Hidayat",
        tepat_waktu: Math.floor((Math.random() * 10) + 1),
        telat: Math.floor((Math.random() * 10) + 1),
        pulang_cepat: Math.floor((Math.random() * 10) + 1),
        alpa: Math.floor((Math.random() * 10) + 1),
        dl: Math.floor((Math.random() * 10) + 1),
        cuti: Math.floor((Math.random() * 10) + 1),
        ijin: Math.floor((Math.random() * 10) + 1),
        sakit: Math.floor((Math.random() * 10) + 1)
      },
    ]

    return { total: fakeData.length, skip: 0, limit: fakeData.length, data: fakeData }
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)))
    }

    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    return { id }
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
