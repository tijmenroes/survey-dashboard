import Vue from 'vue';
import 'es6-promise/auto'
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userAnswers: 12123213,
        users: [],
        filters: [],
        oldData: [],
        questions: [],
        configured: [],
        loading: false,
    }, mutations: {
        changeUsers(state, {users, questions}){
            state.userAnswers  = users;
            state.oldData = users;
            state.users = users;
            state.questions = questions;
        },
        addFilter(state, {answer, question}) {
            const array = [];

            for (let key in state.userAnswers) {
                for (let aantal in answer) {
                    if (state.userAnswers[key].answers[question] === answer[aantal]) {
                        array.push(state.userAnswers[key])
                    }
                }
            }
            //Push in filters array
            state.filters.push({'Question': question, 'Answer': answer, 'Code': [{'q': question, 'a': answer}]});
            state.userAnswers = array;
            console.log(state.userAnswers);


        },delFilter(state, number){

            state.filters.splice(number ,1);
            state.userAnswers = state.oldData;
            const array = [];
            console.log('FILTER DELETED');
            if(state.filters.length > 0) {
                console.log('MEER DAN 0');
                for (let filter in state.filters) {
                    const question = state.filters[filter].Code[0].q;
                    const answer = state.filters[filter].Code[0].a;
                    //  console.log(answer);
                    for (let key in state.userAnswers) {
                        for (let aantal in answer) {

                            if (state.userAnswers[key].answers[question] ===answer[aantal]) {
                                console.log('matching!');
                                array.push(state.userAnswers[key])
                            }
                        }
                    }
                }

                state.userAnswers = array;

            }
        },  ConfigureAnswers(state) {
            console.log('configure Started');
            state.configured = [];
            const dataArray = [];
            function countInArray(array, what) {
                var count = 0;
                let tempArray = {};
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === what) {
                        count++;
                    }
                }
                if(count > 0 ) {
                    tempArray = {"name": what, "value": count};
                } else {
                    tempArray = {"name": what, "value": null, "label": {"show": false}};
                }
                return tempArray;

            }

            for (let key in state.questions) {

               const answerArray = [];
               const vraagArray = [];

               for (let user in state.userAnswers) {

                    answerArray.push(state.userAnswers[user].answers[key])
               }
               for (let vraag in state.questions[key].questionChoices) {
                    const get = countInArray(answerArray, state.questions[key].questionChoices[vraag]);
                    vraagArray.push(get);
               }
                dataArray.push({
                    "Title": state.questions[key].questionTitle,
                    "questionChoices": state.questions[key].questionChoices,
                    questionAnswers: vraagArray
                });
               //      lit.push('questionAnswers', vraagArray);
               //      console.log(lit);
               // // state.$set(state.questions[key], 'questionAnswers', vraagArray)
                //state.questions[key].questionAnswers.push(vraagArray);

            }

            state.configured = dataArray;
        }

    }, getters : {
       //getState: state => state.counter
        getData: state => () => state.configured,
        getFilters: state => () => state.filters,
    }, actions : {


    }

});

