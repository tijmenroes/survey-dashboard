import Vue from 'vue';
import 'es6-promise/auto'
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userAnswers: ['aye lmao', 'lel'],
        counter: 0,
    }, mutations: {
        changeUsers(state, input){
            state.userAnswers  = input
        }
    }

});
