import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import _ from 'lodash'
const SERVER_URL = 'https://pjt456.herokuapp.com'
const API_URL = process.env.VUE_APP_API_URL
const API_KEY = process.env.VUE_APP_API_KEY

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    errMsg: null,
    isLogin: false,
    loginUser: null,
    movieList: null,
    isSignup: false,
    genreList: null,
    nowMovie: null,
    nowMovieLikes: null,
    nowMovieCast: null,
    nowMovieCrew: null,
    reviewerList: null,
    isCreateReview: false,
    nowReview: null,
    userReviews: null,
    personData: null,
    isDelete: false,
    isUpdateReview: false,
    isCreateComment: false,
    nowComments: null,
    personFollowings: null,
    personFollowers: null,
    personFollowersUsername: null,
    doneFollow: false,
    selectedGenres: [],
    trending: null,
    topRate: null,
    searchResult: null,
    worldCupList: null,
    winnerMovies: [],
    lotteryMovie: null,
    backdropPath: null,
    videoId: null,
    recommendMovies: null,
    chartdata: null,
    isChangePassword: false,
  },
  mutations: {
    ERR_MSG (state, err) {
      state.errMsg = err
    },
    SIGN_UP (state) {
      state.isSignup = !state.isSignup
    },
    LOGIN (state, data) {
      state.isLogin = true
      state.errMsg = null
      state.loginUser = data.username
    },
    LOGOUT (state) {
      state.isLogin = false
      state.errMsg = null
    },
    GET_MOVIES (state, data) {
      state.movieList = data
    },
    GET_MORE_MOVIES (state, data) {
      state.movieList.push(data)
    },
    GET_GENRES (state, data) {
      state.genreList = data
    },
    GET_MOVIE_DETAIL (state, data) {
      data.vote_average /= 2
      state.nowMovie = data
      state.nowMovieLikes = data.user_set.map(user => user.username)
    },
    GET_MOVIE_CREDITS (state, data) {
      state.nowMovieCast = data.cast
      state.nowMovieCrew = data.crew
    },
    GET_REVIEWS (state, data) {
      state.reviewerList = data
    },
    CREATE_REVIEW (state) {
      state.isCreateReview = !state.isCreateReview
    },
    GET_REVIEW_DETAIL (state, data) {
      state.nowReview = data
    },
    GET_LOGIN_USER (state, data) {
      state.loginUser = data
    },
    GET_USER (state, data) {
      state.personData = data
    },
    GET_USER_REVIEWS (state, data) {
      state.userReviews = data
    },
    CREATE_COMMENT (state) {
      state.isCreateComment = !state.isCreateComment
    },
    REVIEW_DELETE (state) {
      state.isDelete = !state.isDelete
    },
    REVIEW_UPDATE (state) {
      state.isUpdateReview = !state.isUpdateReview
    },
    GET_COMMENTS (state, data) {
      state.nowComments = data
    },
    GET_PERSON_FOLLOWGINS (state, data) {
      state.personFollowings = data
    },
    GET_PERSON_FOLLOWERS (state, data) {
      state.personFollowers = data
      const followersUsername = data.map(follower => follower.username)
      state.personFollowersUsername = followersUsername
    },
    FOLLOW (state) {
      state.doneFollow = !state.doneFollow
      if (state.personFollowersUsername.includes(state.loginUser.username)) {
        const idx = state.personFollowersUsername.indexOf(state.loginUser.username)
        delete state.personFollowers[idx]
        delete state.personFollowersUsername[idx]
        // state.personFollowersUsername = state.personFollowersUsername.splice(idx, 1)
      } else {
        state.personFollowersUsername.push(state.loginUser.username)
        state.personFollowers.push(state.loginUser)
      }
    },
    SELECT_GENRE (state, data) {
      if (state.selectedGenres.includes(data)) {
        const idx = state.selectedGenres.indexOf(data)
        state.selectedGenres.splice(idx, 1)
      } else {
        state.selectedGenres.push(data)
      }
    },
    GET_TRENDING (state, data) {
      state.trending = data.results
    },
    GET_TOP_RATE (state, data) {
      state.topRate = data.results
    },
    SEARCH_KEYWORD (state, data) {
      state.searchResult = data
    },
    WORLD_CUP (state, data) {
      state.worldCupList = data
      state.winnerMovies = []
    },
    WINNER_MOVIE (state, data) {
      state.winnerMovies.push(data)
    },
    NEXT_STAGE (state) {
      state.worldCupList = state.winnerMovies
      state.winnerMovies = []
    },
    GET_LOTTERY_UNLOGIN (state, data) {
      state.lotteryMovie = data
    },
    GET_LOTTERY_LOGIN (state, data) {
      if (data.length > 1) {
        state.lotteryMovie = _.sample(data)
      } else {
        state.lotteryMovie = data
      }
    },
    GET_BACKDROP_PATH (state, data) {
      state.backdropPath = data.backdrop_path
    },
    GET_VIDEO_ID (state, data) {
      state.videoId = data
    },
    GET_RECOMMEND_MOVIES (state, data) {
      state.recommendMovies = data
    },
    GET_CHART_DATA (state, data) {
      state.chartdata = data
    },
    CHANGE_PASSWORD (state) {
      state.isChangePassword = !state.isChangePassword
    }
  },
  actions: {
    signup ({ commit }) {
      commit('SIGN_UP')
    },
    login ({ commit }, data) {
      axios({
        method: 'post',
        url: `${SERVER_URL}/accounts/api/token/`,
        data: data,
      })
        .then(res => {
          console.log(res)
          localStorage.setItem('JWT', res.data.access)
          commit('LOGIN', data)
        })
        .catch(err => {
          console.log(err)
          commit('ERR_MSG', err)
        })
    },
    logout({ commit }) {
      localStorage.removeItem('JWT')
      commit('LOGOUT')
    },
    getMovies({ commit }) {
      axios({
        method: 'get',
        url:`${SERVER_URL}/movies/movie_list/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_MOVIES', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getGenres({ commit }) {
      axios({
        method: 'get',
        url:`${SERVER_URL}/movies/genre_list/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_GENRES', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMovieDetail ({ commit, dispatch }, data) {
      axios({
        method: 'get',
        url:`${SERVER_URL}/movies/${data}/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_MOVIE_DETAIL', res.data)
          dispatch('getRecommendMovies', res.data.genres[0].id)
        })
        .catch(err => console.log(err))
    },
    getMovieCredits ({ commit }, data) {
      axios({
        method: 'get',
        url: `${API_URL}/movie/${data}/credits?api_key=${API_KEY}&language=ko-KR`
      })
        .then(res => {
          console.log(res)
          commit('GET_MOVIE_CREDITS', res.data)
        })
    },
    getReviews ({ commit }) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/`
      })
       .then(res => {
         console.log(res)
         commit('GET_REVIEWS', res.data)
       })
       .catch(err => {
         console.log(err)
       })
    },
    createReview ({ dispatch, commit }, data) {
      const id = data.movieId
      delete data.movieId
      console.log(data)
      
      axios({
        method: 'post',
        url: `${SERVER_URL}/community/${id}/create_review/`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          commit('CREATE_REVIEW')
          dispatch('getMovieDetail', id)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getReviewDetail ({ commit, dispatch }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/${data}`
      })
        .then(res => {
          console.log(res)
          commit('GET_REVIEW_DETAIL', res.data)
          dispatch('getMovieDetail', res.data.movie.id)
          dispatch('getBackdropPath', res.data.movie.id)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getLoginUser ({ commit }) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/accounts/login_user/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          commit('GET_LOGIN_USER', res.data)
        })
        .catch(err => console.log(err))
    },
    createComment ({ commit, dispatch }, data) {
      const id = data.reviewId
      delete data.reviewId
      axios({
        method: 'post',
        url: `${SERVER_URL}/community/${id}/comment/`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          commit('CREATE_COMMENT')
          dispatch('getComments', id)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUser ({ commit, dispatch }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/accounts/${data}/profile/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_USER', res.data)
          dispatch('getUserReviews', res.data.username)
          dispatch('getChartData', res.data.username)
        })
        .catch(err => console.log(err))
    },
    getUserReviews ({ commit }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/accounts/${data}/user_reviews/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_USER_REVIEWS', res.data)
        })
        .catch(err => console.log(err))
    },
    reviewDelete ({ commit }, data) {
      axios({
        method: 'delete',
        url: `${SERVER_URL}/community/${data}/update_review/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          commit('REVIEW_DELETE')
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateReview ({ commit }, data) {
      const id = data.reviewId
      delete data.reviewId
      axios({
        method: 'put',
        url: `${SERVER_URL}/community/${id}/update_review/`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
      .then(res => {
        console.log(res)
        commit('REVIEW_UPDATE')
      })
      .catch(err => {
        console.log(err)
      })
    },
    getComments ({ commit }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/${data}/comment_load/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_COMMENTS', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getPersonFollowings ({ commit }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/accounts/${data}/user_followings/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_PERSON_FOLLOWGINS', res.data)
        })
        .catch(err => console.log(err))
    },
    getPersonFollowers ({ commit }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/accounts/${data}/user_followers/`,
      })
      .then(res => {
        console.log(res)
        commit('GET_PERSON_FOLLOWERS', res.data)
      })
      .catch(err => console.log(err))
    },
    follow ( { commit, dispatch }, data ) {
      axios({
        method: 'post',
        url: `${SERVER_URL}/accounts/${data}/follow/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
      .then(res => {
        console.log(res)
        commit('FOLLOW')
        dispatch('getPersonFollowers', data)
      })
      .catch(err => console.log(err))
    },
    commentDelete ({ dispatch }, data) {
      const reviewId = data[0]
      const commentId = data[1]
      axios({
        method: 'delete',
        url: `${SERVER_URL}/community/${reviewId}/comment/${commentId}/update_comment/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          dispatch('getComments', reviewId)
        })
        .catch(err => {
          console.log(err)
        })
    },
    commentUpdate ({ dispatch }, data) {
      const reviewId = data[0]
      const commentId = data[1]
      const content = data[2]
      axios({
        method: 'put',
        url: `${SERVER_URL}/community/${reviewId}/comment/${commentId}/update_comment/`,
        data: content,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          dispatch('getComments', reviewId)
        })
        .catch(err => {
          console.log(err)
        })
    },
    likeReview ({ dispatch }, data) {
      axios({
        method: 'post',
        url: `${SERVER_URL}/community/${data}/like_review/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          dispatch('getReviewDetail', data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    likeComment ({ dispatch }, data) {
      const reviewId = data[0]
      const commentId = data[1]
      axios({
        method: 'post',
        url: `${SERVER_URL}/community/${reviewId}/comment/${commentId}/like_comment/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          dispatch('getComments', reviewId)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectGenre ({ dispatch, commit, state }, data) {
      commit('SELECT_GENRE', data)
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/select_genre/`,
        data: state.selectedGenres,
      })
        .then(res => {
          console.log(res)
          if (state.selectedGenres.length === 0) {
            dispatch('getMovies')
          } else {
            commit('GET_MOVIES', res.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    likeMovie ({ dispatch }, data) {
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/${data}/movie_like/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          dispatch('getMovieDetail', data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDayTrending ({ commit }) {
      axios({
        method: 'get',
        url: `${API_URL}/trending/movie/day?api_key=${API_KEY}&language=ko-KR`
      })
        .then(res => {
          console.log(res)
          commit('GET_TRENDING', res.data)
        })
        .catch(err => console.log(err))
    },
    getWeekTrending ({ commit }) {
      axios({
        method: 'get',
        url: `${API_URL}/trending/movie/week?api_key=${API_KEY}&language=ko-KR`
      })
        .then(res => {
          console.log(res)
          commit('GET_TRENDING', res.data)
        })
        .catch(err => console.log(err))
    },
    getTopRate ({ commit }) {
      axios({
        method: 'get',
        url: `${API_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
      })
        .then(res => {
          console.log(res)
          commit('GET_TOP_RATE', res.data)
        })
        .catch(err => console.log(err))
    },
    searchKeyword ({ commit }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${data}/search_movie/`,
      })
        .then(res => {
          console.log(res)
          commit('SEARCH_KEYWORD', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    movieWorldCup ({ commit }) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/algo/moviecup/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
      })
        .then(res => {
          console.log(res)
          commit('WORLD_CUP', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    winnerMovie ({ commit }, data) {
      commit('WINNER_MOVIE', data)
    },
    nextStage ({ commit, state }) {
      if (state.winnerMovies.length===1) {
        alert(state.winnerMovies[0].title)
        axios({
          method: 'post',
          url: `${SERVER_URL}/algo/moviecup/winner/`,
          data: state.winnerMovies[0],
          headers: {
            Authorization: `Bearer ${localStorage.getItem('JWT')}`
          }
        })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        commit('NEXT_STAGE')
      }
    },
    profileUpdate ({ dispatch }, data) {
      axios({
        method: 'put',
        url: `${SERVER_URL}/accounts/${data.username}/profile/update/`,
        data: data.profile,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`
        },
      })
        .then(res => {
          console.log(res)
          dispatch('getLoginUser')
        })
        .catch(err => {
          console.log(err)
        })
    },
    getLottery ({ commit, state } ) {
      if (state.isLogin) {
        axios({
          method: 'get',
          url: `${SERVER_URL}/algo/lottery/`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('JWT')}`
          },
        })
          .then(res => {
            console.log(res)
            commit('GET_LOTTERY_LOGIN', res.data)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        axios({
          method: 'get',
          url: `${SERVER_URL}/algo/lottery/`,
        })
          .then(res => {
            console.log(res)
            commit('GET_LOTTERY_UNLOGIN', res.data)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getBackdropPath ({ commit }, data) {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${data}?api_key=${API_KEY}&language=ko-KR`,
      })
        .then(res => {
          console.log(res)
          commit('GET_BACKDROP_PATH', res.data)
        })
        .catch(err => console.log(err))
    },
    getVideoId ({ commit }, data) {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${data}/videos?api_key=${API_KEY}&language=ko-KR`,
      })
        .then(res => {
          console.log(res)
          commit('GET_VIDEO_ID', res.data.results[0])
        })
        .catch(err => console.log(err))
    },
    getRecommendMovies ({ commit }, data) {
      console.log(data)
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${data}/genre_recommend/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_RECOMMEND_MOVIES', res.data)
        })
        .catch(err => console.log(err))
    },
    getChartData ({ commit }, data) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/accounts/${data}/chart_data/`,
      })
        .then(res => {
          console.log(res)
          commit('GET_CHART_DATA', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    changePassword ({ commit }, data) {
      const username = data.username
      delete data.username
      console.log(data)
      axios({
        method: 'put',
        data: data,
        url: `${SERVER_URL}/accounts/${username}/password_chg/`,
      })
        .then(res => {
          console.log(res)
          commit('CHANGE_PASSWORD')
      })
        .catch(err => console.log(err))
    }
  },
})
