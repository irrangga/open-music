class UploadsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addUploadImageHandler = this.addUploadImageHandler.bind(this)
  }

  async addUploadImageHandler (request, h) {
    const { data } = request.payload
    this._validator.validateImageHeaders(data.hapi.headers)

    const filename = await this._service.writeFile(data, data.hapi)

    const response = h.response({
      status: 'success',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`
      }
    })
    response.code(201)
    return response
  }
}

module.exports = UploadsHandler
