import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') ?? null
  },
  getters: {
    token: s => !!s.token
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    clearToken(state) {
      state.token = null
    }
  },
  actions: {
    login({commit}) {
      commit('setToken', 'truetoken')
      localStorage.setItem('token', 'truetoken')
    },
    logout({commit}) {
      commit('clearToken')
      localStorage.removeItem('token')
    }
  },
})
