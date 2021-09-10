const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.addPlaylistHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  // {
  //   method: 'GET',
  //   path: '/songs/{songId}',
  //   handler: handler.getSongByIdHandler
  // },
  // {
  //   method: 'PUT',
  //   path: '/songs/{songId}',
  //   handler: handler.editSongByIdHandler
  // },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
