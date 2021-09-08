require('dotenv').config()

const Hapi = require('@hapi/hapi')
const openmusic = require('./api/music')
const ClientError = require('./exceptions/ClientError')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/music')

const init = async () => {
  const songsService = new SongsService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: openmusic,
    options: {
      service: songsService,
      validator: SongsValidator
    }
  })

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      })
      newResponse.code(response.statusCode)
      return newResponse
    }
    return response
  })

  await server.start()
  console.log(`Server is running on ${server.info.uri}`)
}

init()
