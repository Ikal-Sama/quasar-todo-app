import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'

export const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: [],
    current: null,
    loading: false,
    error: null,
  }),

  getters: {
    completed: (state) => state.todos.filter((t) => t.is_completed),
    pending: (state) => state.todos.filter((t) => !t.is_completed),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const data = await api.get('todos')
        // Laravel pagination returns { data, links, meta }; accept both shapes.
        this.todos = Array.isArray(data) ? data : data.data || []
        return this.todos
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      this.error = null
      try {
        const data = await api.get(`todos/${id}`)
        this.current = data?.data ?? data
        return this.current
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      const data = await api.post('todos', payload)
      const todo = data?.data ?? data
      this.todos.unshift(todo)
      return todo
    },

    async update(id, payload) {
      const data = await api.put(`todos/${id}`, payload)
      const todo = data?.data ?? data
      const idx = this.todos.findIndex((t) => t.id === id)
      if (idx !== -1) this.todos[idx] = todo
      if (this.current?.id === id) this.current = todo
      return todo
    },

    async remove(id) {
      this.error = null
      try {
        // 1. Wait for the server to confirm deletion
        await api.delete(`todos/${id}`)

        // 2. ONLY update the frontend state if the server request succeeds (status 200/204)
        this.todos = this.todos.filter((t) => t.id !== id)
        if (this.current?.id === id) this.current = null
      } catch (err) {
        this.error = err.message
        // 3. Re-throw the error so your UI notification component knows it failed
        throw err
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore, import.meta.hot))
}
