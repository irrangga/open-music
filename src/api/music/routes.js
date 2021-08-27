const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.addSongHandler
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getSongByIdHandler
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.editSongByIdHandler
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteSongByIdHandler
  }
]

module.exports = routes
