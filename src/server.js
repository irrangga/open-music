require('dotenv').config()

const Hapi = require('@hapi/hapi')
const openmusic = require('./api/music')
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

  await server.start()
  console.log(`Server is running on ${server.info.uri}`)
}

init()
