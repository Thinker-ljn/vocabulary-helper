import { vi } from 'vitest'
let state = {}

const localStorageMock = {
  getItem: vi.fn(x => state[x]),
  setItem: vi.fn((x, v) => (state[x] = v)),
  removeItem: vi.fn(x => delete state[x]),
  clear: vi.fn(() => (state = {})),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
