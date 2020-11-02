import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		user:{
		},
		cust:[]
  },
  mutations: {
		updateUser(state,user){
			state.user = user;
		},
		updateCust(state,cust){
			state.cust = cust;
		}
  },
  actions: {

  }
})
