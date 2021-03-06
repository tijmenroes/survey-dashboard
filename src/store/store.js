import Vue from 'vue';
import 'es6-promise/auto'
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        //states voor beide views
        surveyAnswers: [],
        surveyQuestions: [],
        surveyOldData: [],
        //states voor dashboard
        configuredSurvey: [],
        filters: [],
        filterActive: false,
        showFilterMenu: true,
        reset: 0,
        //states voor individual View
        individualData: [],
        searchActive: false,
        //states voor veranderen layout
        menuPadding: "padding: 0 0",
        phoneDetected: false,
        weergaveStatus: "Automatisch",
        //Loading state
        loading: false,
        surveyName: "Formulier"
    }, mutations: {
        setUserData(state, users) {
            for(let user in users){
                users[user].id =  user
            }

            state.surveyAnswers = users;
            state.surveyOldData = users;
        },
        setSurveyQuestions(state, questions) {
            state.surveyQuestions = questions;
            for (let key in state.surveyQuestions) {
                if (state.surveyQuestions[key].hasOther === true) {
                    state.surveyQuestions[key].choices.push('other');
                }
            }
        },
        addFilter(state, {answer, question}) {
            //Voeg een filter toe, answer = Geselecteerde antwoord door de user. Question = vraagnummer.
            const array = [];
            let usedIds = [];
            for (let key in state.surveyAnswers) {

                for (let aantal in answer) {
                    if (typeof state.surveyAnswers[key].answers[question] === "object") {
                        for (let entry in state.surveyAnswers[key].answers) {
                            if (typeof state.surveyAnswers[key].answers[question][entry] === "string") {
                                if (state.surveyAnswers[key].answers[question][entry] === answer[aantal] && usedIds.includes(state.surveyAnswers[key].id) === false ) {
                                    array.push(state.surveyAnswers[key]);
                                    usedIds.push(state.surveyAnswers[key].id);
                                }
                            }
                        }
                    } else {
                        if (state.surveyAnswers[key].answers[question] === answer[aantal]) {
                            array.push(state.surveyAnswers[key]);
                        }
                    }
                }
            }
            let int = +question + 1;
            state.filters.push({'Question': int, 'Answer': answer, 'Code': [{'q': question, 'a': answer}]});
            state.surveyAnswers = array;
        }, delFilter(state, number) {
            //Verwijder een filter.
            state.filters.splice(number, 1);
            let array = [];
            state.surveyAnswers = state.surveyOldData;
            if (state.filters.length > 0) {

                for (let filter in state.filters) {
                    const question = state.filters[filter].Code[0].q;
                    const answer = state.filters[filter].Code[0].a;
                    for (let key in state.surveyAnswers) {
                        for (let aantal in answer) {
                            if (typeof state.surveyAnswers[key].answers[question] === "object") {
                                for (let entry in state.surveyAnswers[key].answers) {
                                    if (typeof state.surveyAnswers[key].answers[question][entry] === "string") {
                                        if (state.surveyAnswers[key].answers[question][entry] === answer[aantal]) {
                                            array.push(state.surveyAnswers[key])
                                        }
                                    }
                                }
                            } else {
                                if (state.surveyAnswers[key].answers[question] === answer[aantal]) {
                                    array.push(state.surveyAnswers[key])
                                }
                            }
                        }
                    }
                }
                state.surveyAnswers = array;
            }
        }, ConfigureAnswers(state) {
            //Configureer de answers zodat deze op het dashboard gedisplayd kunnen worden.
            state.configuredSurvey = [];
            const dataArray = [];

            function countInArray(array, what) {
                let count = 0;
                let dataEntry = {};

                for (var i = 0; i < array.length; i++) {

                    if (typeof array[i] === "object") {
                        for (let entry in array[i]) {
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

                if (count > 0) {
                    dataEntry = {"name": what, "value": count};
                } else {
                    dataEntry = {"name": what, "value": null, "label": {"show": false}};
                }
                return dataEntry;
            }

            for (let key in state.surveyQuestions) {
                const answerArray = [];

                if (state.surveyQuestions[key].type === "text" || state.surveyQuestions[key].type === "comment") {
                    for (let user in state.surveyAnswers) {
                        answerArray.push(state.surveyAnswers[user].answers[key]);
                    }
                    const length = answerArray.filter(function (value) {
                        return value !== undefined
                    }).length;

                    dataArray.push({
                        "Title": state.surveyQuestions[key].title,
                        questionAnswers: answerArray,
                        Type: 5,
                        SumAnswers: length
                    });
                } else {
                    let questionType = 0;

                    const questionArray = [];
                    let litArray = state.surveyQuestions[key].choices;

                    for (let user in state.surveyAnswers) {
                        answerArray.push(state.surveyAnswers[user].answers[key]);
                    }
                    if (state.surveyQuestions[key].type === "rating") {
                        questionType = 2;
                        const min = state.surveyQuestions[key].rateMin;
                        const max = state.surveyQuestions[key].rateMax;
                        const optionArray = [];
                        for (let i = min; i < max + 1; i++) {
                            const string = i.toString();
                            optionArray.push(string);
                            const get = countInArray(answerArray, string);
                            questionArray.push(get);
                        }
                        state.surveyQuestions[key].choices = optionArray;
                    } else {
                        if (state.surveyQuestions[key].choices.length > 5) {

                            questionType = 1;
                        }
                        for (let vraag in litArray) {
                            const get = countInArray(answerArray, litArray[vraag]);
                            questionArray.push(get);
                        }
                    }
                    let aantal = 0;
                    for (let antwoord in state.surveyQuestions[key].choices) {
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
            }

            state.configuredSurvey = dataArray;


            //Voor de rows van individual, nodig zodat het altijd exported kan worden
            //Rijen worden zo aangepast dat ze in de data table kunnen.
            const rows = [];
            const users = state.surveyOldData;

            for (let user in users) {
                let date = new Date(users[user].dateTime);
                let month = date.getMonth() + 1;
                month = checkTime(month);
                let day = date.getDay() + 1;
                day = checkTime(day);
                let yr = date.getFullYear();
                let m = date.getMinutes();
                m = checkTime(m);

                let h  = date.getHours();
                h = checkTime(h);

                let userArray =  {"id": user, "dateTime": day + '-' + month + '-' + yr + ' ' + h + ':'+  m };
                for (let answer  in users[user].answers) {
                    if(typeof users[user].answers !== "undefined"){
                        if(typeof users[user].answers[answer] === "object" && users[user].answers[answer] !== "null"){
                            const answerArray = [];
                            for(let keuze in users[user].answers[answer]){
                                answerArray.push( " " +users[user].answers[answer][keuze].toString() )
                            }
                            const antwoord =  answer.toString();
                            userArray[antwoord] = answerArray.toString()
                        }else {
                            const antwoord =  answer.toString();
                            userArray[antwoord] = users[user].answers[answer]
                        }
                    }
                }
                rows.push(userArray);

            }
            state.individualData = rows;
            function checkTime(i) {
                //Nul toegevoegd aan de tijd wanneer het geen 2 cijfers (6:8 wordt 06:08)
                if (i < 10) {i = "0" + i}
                return i;
            }
        },

         resetData(state) {
            state.reset++;
            state.surveyAnswers = state.surveyOldData;
            state.filters = [];
        },
        exportCSV(state, file) {
            //Exporteren als een CSV bestand

            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            const JSONData = file;
            const ReportTitle = state.surveyName;
            const ShowLabel = true;

            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = 'sep=,' + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }
                console.log(row);
                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
                console.log(CSV);
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
                console.log(CSV);
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "Report_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }
        },getters: {
        getData: state => () => state.configuredSurvey,
        // getFilters: state => () => state.filters,
        getReset: state => () => state.reset,
        getWeergave: state => () => state.weergaveStatus
    }, actions: {}

});

