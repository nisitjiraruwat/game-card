import originalAxios from 'axios'

const axios = {
  ...originalAxios,
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  create: () => axios,
  defaults: {
    adapter: {}
  },
  interceptors: {
    response: {
      use (): void {}
    },
    request: {
      use (): void {}
    }
  }
}

export default axios
