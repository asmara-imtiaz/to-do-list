import { defineStore } from 'pinia'

const STORAGE_KEY = 'todo_list_items'
const FILTER_STORAGE_KEY = 'todo_list_filter'

function readFromLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (_) {
    return fallback
  }
}

function writeToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (_) {
    // ignore storage errors
  }
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    items: [],
    filter: 'all', // 'all' | 'active' | 'completed'
    initialized: false,
  }),
  getters: {
    filteredItems(state) {
      if (state.filter === 'active') {
        return state.items.filter((t) => !t.completed)
      }
      if (state.filter === 'completed') {
        return state.items.filter((t) => t.completed)
      }
      return state.items
    },
    remainingCount(state) {
      return state.items.filter((t) => !t.completed).length
    },
  },
  actions: {
    init() {
      if (this.initialized) return
      this.items = readFromLocalStorage(STORAGE_KEY, [])
      this.filter = readFromLocalStorage(FILTER_STORAGE_KEY, 'all')
      this.initialized = true
    },
    setFilter(next) {
      this.filter = next
      writeToLocalStorage(FILTER_STORAGE_KEY, this.filter)
    },
    addTodo(title) {
      const trimmed = (title || '').trim()
      if (!trimmed) return
      const newItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      }
      this.items.unshift(newItem)
      this.persist()
    },
    toggleTodo(id) {
      const idx = this.items.findIndex((t) => t.id === id)
      if (idx !== -1) {
        this.items[idx].completed = !this.items[idx].completed
        this.persist()
      }
    },
    deleteTodo(id) {
      const next = this.items.filter((t) => t.id !== id)
      if (next.length !== this.items.length) {
        this.items = next
        this.persist()
      }
    },
    clearCompleted() {
      const next = this.items.filter((t) => !t.completed)
      if (next.length !== this.items.length) {
        this.items = next
        this.persist()
      }
    },
    persist() {
      writeToLocalStorage(STORAGE_KEY, this.items)
    },
  },
})


