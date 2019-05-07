import Vue from 'vue';
import 'es6-promise/auto'
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userAnswers: 12123213,
        surveyAnswers: [],
        filterActive: false,
        surveyQuestions: [],
        surveyOldData: [],
        users: [],
        filters: [],
        oldData: [],
        questions: [],
        configured: [],
        configuredSurvey: [],
        loading: false,
    }, mutations: {
        changeUsers(state, {users, questions}){
            state.userAnswers  = users;
            state.oldData = users;
            state.users = users;
            state.questions = questions;
        },
        setUserData(state, users){
            state.surveyAnswers  = users;
            state.surveyOldData = users;

        },
        setSurveyQuestions( state, questions){
           state.surveyQuestions = questions;

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
               //     console.log(counter);
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
            let questionType = 0;

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
                var count = 0;
                let tempArray = {};
                console.log(array.length);
                if(typeof array[0]  === "object"){
                    for(let entry in array){

                        for(let answer in array[entry]){

                            if (array[entry][answer] === what) {

                                count++;

                            }
                        }
                    }
                } else {
                    for (var i = 0; i < array.length; i++) {
                        //   if (array[i].includes(what)) {
                        if (array[i] === what) {
                            count++;
                        }
                    }
                }
                if(count > 0 ) {
                    tempArray = {"name": what, "value": count};
                } else {
                    tempArray = {"name": what, "value": null, "label": {"show": false}};
                }
                return tempArray;

            }

            for (let key in state.surveyQuestions) {
                let questionType = 0;
               const answerArray = [];
               const vraagArray = [];
               // console.log(state.surveyQuestions);
               for (let user in state.surveyAnswers) {
                  //  console.log(user);
                    answerArray.push(state.surveyAnswers[user].answers[key]);

               }
                 console.log(answerArray);
                if(state.surveyQuestions[key].type === "rating" ){
                    questionType = 2;
                    const min = state.surveyQuestions[key].rateMin;
                    const max = state.surveyQuestions[key].rateMax;
                    const optionArray = [];
                    for(let i = min; i < max + 1; i++){

                        const string = i.toString();
                        optionArray.push(string);
                        const get = countInArray(answerArray, string);

                        vraagArray.push(get);

                    }

                    state.surveyQuestions[key].choices = optionArray;
                } else {

                    if(state.surveyQuestions[key].choices.length > 4){

                        questionType = 1;
                    }
                    for (let vraag in state.surveyQuestions[key].choices) {
                        const get = countInArray(answerArray, state.surveyQuestions[key].choices[vraag]);
                          vraagArray.push(get);
                      //  console.log(answerArray);
                      //  console.log(state.surveyQuestions[key].choices[vraag]);
                    }
                }

                let aantal = 0;
                for(let antwoord in vraagArray){
                   aantal = aantal + vraagArray[antwoord].value;
                }
              //  console.log(vraagArray)
                dataArray.push({
                    "Title": state.surveyQuestions[key].title,
                    "questionChoices": state.surveyQuestions[key].choices,
                    questionAnswers: vraagArray,
                    Type: questionType,
                    SumAnswers: aantal
                });
               // // state.$set(state.questions[key], 'questionAnswers', vraagArray)
                //state.questions[key].questionAnswers.push(vraagArray);

            }

            state.configuredSurvey = dataArray;
        },


    }, getters : {
       //getState: state => state.counter
        getData: state => () => state.configuredSurvey,
        getFilters: state => () => state.filters,

    }, actions : {


    }

});

