import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
// import router from '../router'

const API_URL = 'http://127.0.0.1:8000'

Vue.use(Vuex)


export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
    movies: [],
    today_movies:[],
    token: null,
    userdata: null,
    // comments:[],
    // search: null
  },
  getters: {
    isLogin(state) {
      return state.token ? true : false
    }
  },
  mutations: {
    // GET_COMMENTS(state, comments) {
    //   state.comments = comments
    // },
    GET_MOVIES(state, movies) {
      state.movies = movies
    },
    GET_TODAY_MOVIES(state, movies) {
      state.today_movies = movies
    },
    // signup & login -> 완료하면 토큰 발급
    SAVE_TOKEN(state, token) {
      state.token = token
      // router.push({name : 'HomeView'}) // store/index.js $router 접근 불가 -> import를 해야함
      location.reload(true)
    },
    LOG_OUT(state) {
      state.token = null
      // router.push({name : 'HomeView'}) // store/index.js $router 접근 불가 -> import를 해야함
      location.reload(true)
    },
    // SEARCH(state, search) {
    //   state.search = search
    // }
  },

  actions: {
    // getComments(context) {
    //   axios({
    //     method: 'get',
    //     url: `${API_URL}/api/v1/articles/`,
    //   })
    //     .then((res) => {
    //     // console.log(res, context)
    //       context.commit('GET_COMMENTS', res.data)
    //     })
    //     .catch((err) => {
    //     console.log(err)
    //   })
    // },
    getMovies(context) {
      axios({
        method: 'get',
        url: `${API_URL}/api/v1/movies/today/`,
      })
        .then((res) => {
        // console.log(res, context)
          context.commit('GET_MOVIES', res.data)
          // console.log(res.data)
        })
        .catch((err) => {
        console.log(err)
      })
    },
    getTodayMovies(context) {
      axios({
        method: 'get',
        url: `${API_URL}/api/v1/movies/today/`,
      })
        .then((res) => {
        console.log(res, context)

          context.commit('GET_TODAY_MOVIES', res.data)
          // console.log(res.data)
        })
        .catch((err) => {
        console.log(err)
      })
    },
    signUp(context, payload) {
      const username = payload.username
      const password1 = payload.password1
      const password2 = payload.password2
      const email = payload.email

      axios({
        method: 'post',
        url: `${API_URL}/accounts/signup/`,
        data: {
          username, password1, password2, email
        }
      })
        .then((res) => {
          console.log(res)
          context.commit('SAVE_TOKEN', res.data.key)
        })
        .catch((err) => {
        console.log(err)
      })
    },
    profileChange(context, payload) {
      const new_password1 = payload.new_password1
      const new_password2 = payload.new_password2
      axios({
        method:'post',
        url: `${API_URL}/accounts/password/change/`,
        data: {
          new_password1, new_password2
        },
        headers: {
          Authorization: `Token ${this.state.token}`
        }
        })
        .then((res) => {
          console.log(res)
          context.commit('SAVE_TOKEN', res.data.key)
        })
        .catch((err) => {
        console.log(err)
      })
    },
    login(context, payload) {
      const username = payload.username
      const password = payload.password
      axios({
        method: 'post',
        url: `${API_URL}/accounts/login/`,
        data: {
          username, password
        } 
      })
        .then((res) => {
        context.commit('SAVE_TOKEN', res.data.key)
        })
      .catch((err) => console.log(err))
    },
    logout(context){
      context.commit('LOG_OUT')
    },
    // search(context, payload) {
    //   const serach = payload.search
    //   axios({
    //     method: 'GET',
    //     url:`https://api.themoviedb.org/3/search/movie?query=${search}&language=ko-KR`,
    //     headers:{
    //       Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTg4ZGNlZmM5ODcyZTdkOGViNGExYjE1OTJmZDBjOCIsInN1YiI6IjYzZDMxNjg1YTQxMGM4MTFmMTkzMjY2MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4ih03Kuit6v5-emGvTjbcZUMh5P4naEO0vl-Db7PTCk
    //     }
    //   })
    //   .then((res) => {
    //     context.commit('SEARCH', res.data)
    //     })
    //   .catch((err) => console.log(err))
    // }
  },
  modules: {
  }
})
