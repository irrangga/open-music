const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/{any}',
    handler: handler.addPlaylistsongHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/{any}',
    handler: handler.getPlaylistsongHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/{any}',
    handler: handler.deletePlaylistsongHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
