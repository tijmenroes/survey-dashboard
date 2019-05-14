import Vue from 'vue';
import 'es6-promise/auto'
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        surveyAnswers: [],
        surveyQuestions: [],
        surveyOldData: [],
        configuredSurvey: [],
        filterActive: false,
        reset: 0,
        filters: [],
        loading: false,
        showFilterMenu: true,
    }, mutations: {
        setUserData(state, users){
            state.surveyAnswers  = users;
            state.surveyOldData = users;

        },
        setSurveyQuestions( state, questions){
           state.surveyQuestions = questions;
            for (let key in state.surveyQuestions) {

                if(state.surveyQuestions[key].hasOther === true) {
                    state.surveyQuestions[key].choices.push('other'); //Als other een optie is, voeg deze toe
                }
            }
        },
        addFilter(state, {answer, question}) {
            const array = [];
            let counter = 0;
            for (let key in state.surveyAnswers) {
                for (let aantal in answer) {
                    console.log(state.surveyAnswers[key].answers);
                    if(typeof state.surveyAnswers[key].answers[question] === "object" ) {

                            for (let entry in state.surveyAnswers[key].answers) {

                                if(typeof state.surveyAnswers[key].answers[question][entry] === "string" ) {
                                    counter++
                                if (state.surveyAnswers[key].answers[question][entry] === answer[aantal]) {

                                    array.push(state.surveyAnswers[key])
                                }
                            }
                            }

                    } else{

                        if (state.surveyAnswers[key].answers[question] === answer[aantal]) {
                            array.push(state.surveyAnswers[key])
                        }

                    }

                }
            }
            //Push in filters array
            state.filters.push({'Question': question, 'Answer': answer, 'Code': [{'q': question, 'a': answer}]});
            state.surveyAnswers = array;

        },delFilter(state, number){

            state.filters.splice(number ,1);
            state.surveyAnswers = state.surveyOldData;
            const array = [];

            if(state.filters.length > 0) {

                for (let filter in state.filters) {
                    const question = state.filters[filter].Code[0].q;
                    const answer = state.filters[filter].Code[0].a;

                    for (let key in state.surveyAnswers) {
                        for (let aantal in answer) {

                            if (state.surveyAnswers[key].answers[question] ===answer[aantal]) {

                                array.push(state.surveyAnswers[key])
                            }
                        }
                    }
                }
                state.surveyAnswers = array;
            }
        },  ConfigureAnswers(state) {

            state.configuredSurvey = [];
            const dataArray = [];
            function countInArray(array, what) {
                let count = 0;
                let dataEntry = {};

                    for (var i = 0; i < array.length; i++) {

                        if(typeof array[i]  === "object"){
                            for(let entry in array[i]){
                                    if (array[i][entry] === what) {
                                        count++;
                                    }
                            }
                        } else {
                            if (array[i] === what) {
                                count++;
                            }
                        }
                    }

                if(count > 0 ) {
                    dataEntry = {"name": what, "value": count};
                } else {
                    dataEntry = {"name": what, "value": null, "label": {"show": false}};
                }
                return dataEntry;
            }

            for (let key in state.surveyQuestions) {
                let questionType = 0;
               const answerArray = [];
               const questionArray = [];
               let litArray = state.surveyQuestions[key].choices;

               for (let user in state.surveyAnswers) {
                    answerArray.push(state.surveyAnswers[user].answers[key]);
               }

                if(state.surveyQuestions[key].type === "rating" ){
                    questionType = 2;
                    const min = state.surveyQuestions[key].rateMin;
                    const max = state.surveyQuestions[key].rateMax;
                    const optionArray = [];
                    for(let i = min; i < max + 1; i++){

                        const string = i.toString();
                        optionArray.push(string);
                        const get = countInArray(answerArray, string);

                        questionArray.push(get);
                    }

                    state.surveyQuestions[key].choices = optionArray;
                } else {
                    if(state.surveyQuestions[key].choices.length > 5){

                        questionType = 1;
                    }
                    for (let vraag in litArray) {
                        const get = countInArray(answerArray,litArray[vraag]);
                        questionArray.push(get);
                    }
                }
                let aantal = 0;
                for(let antwoord in state.surveyQuestions[key].choices){
                   aantal = aantal + questionArray[antwoord].value;
                }

                dataArray.push({
                    "Title": state.surveyQuestions[key].title,
                    "questionChoices": state.surveyQuestions[key].choices,
                    questionAnswers: questionArray,
                    Type: questionType,
                    SumAnswers: aantal
                });

            }

            state.configuredSurvey = dataArray;
        }, resetData(state){
            state.reset++;
            state.surveyAnswers = state.surveyOldData;
            state.filters = [];

        }
    }, getters : {

        getData: state => () => state.configuredSurvey,
        getFilters: state => () => state.filters,
        getReset: state => () => state.reset,

    }, actions : {


    }

});

