<template>
    <div>

        Klik op overview of individual

        data:
        {{$store.state.surveyAnswers}}
        <hr>
        {{$store.state.configuredSurvey}}
        <!--<v-container fluid >-->
            <!--<v-layout wrap>-->
                <!--<v-flex xs12 md9 class="pa-3">-->
                    <!--<v-data-table-->
                            <!--:headers="surveyHeaders"-->
                            <!--:items="surveys"-->
                            <!--class="elevation-1"-->
                            <!--:pagination.sync="pagination"-->
                    <!--&gt;-->
                        <!--<template v-slot:items="props">-->

                            <!--<td >{{ props.item.id }}</td>-->
                            <!--<td>{{ props.item.title }}</td>-->
                            <!--<td @click="logSurvey(props.item.id)"> <v-icon small>arrow_forward</v-icon></td>-->

                        <!--</template>-->
                    <!--</v-data-table>-->
                <!--</v-flex>-->
            <!--</v-layout>-->

        <!--</v-container>-->
        <!--{{questions}}-->
        <!--<hr>-->
       <!--&lt;!&ndash;// {{answers[2][3].toString()}}&ndash;&gt;-->
        <!--{{answers}}-->


        <!--<hr>-->
        <!--<h1>Store 2</h1>-->
        <!--{{$store.state.surveyAnswers}}-->
        <!--<hr>-->
        <!--{{$store.state.surveyQuestions}}-->
        <!--<hr>-->
        <!--{{$store.state.configuredSurvey}}-->
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SurveyView",
        data() {
            return {
                surveys: [],
                errorText: '',
                noError: true,
                questions: [],
                answers: [],
                surveyHeaders: [{"text": "Id", "value": "id"},{"text": "Title", "value": "title"}, {"text": "Actie", "value": "arrow"}],
                pagination: {
                    "descending": true,
                rowsPerPage: 10, // -1 for All",
                sortBy: "id",
            totalItems: 10,
                }

            }
        },
        methods:{
            fetchSurvey: function () {
                this.$store.state.loading = true;
                axios.get('https://survey-api.test.tc8l.nl/api/survey/all')
                    .then(response => {
                        const surveyArray = [];
                        for (let key in response.data.data)
                        {
                            surveyArray.push(response.data.data[key]);
                        }
                        this.surveys = surveyArray;
                        this.$store.state.loading = false;
                    }).catch(error => {
                    console.log("ERROR: ERROR: " + error);
                    error = error.toString();
                    if(error.includes('code 404')){
                        this.errorText = "Something went wrong"
                    } else {
                        this.errorText = "error"
                    }
                    this.noError = false
                })
            }, logSurvey(id){
                this.$store.state.loading = true;
                console.log(id);
                axios.get('https://survey-api.test.tc8l.nl/api/survey/questions/' + id)
                    .then(response => {

                    //    console.log(response.data.data.pages[0].questions);
                        this.questions = response.data.data.pages[0].questions;
                        this.$store.commit('setSurveyQuestions', response.data.data.pages[0].questions);
                        //const resultArray = [];

                        //this.questions = resultArray; //Link m aan de display
                        axios.get('https://survey-api.test.tc8l.nl/api/survey/answers/' + id)
                            .then(output => {
                                //console.log(response.data.data);
                                //  this.answers = response.data.data;

                                const userArray = [];
                                for(let user in output.data.data) {
                                    //const AnswerArray = [];
                                    const  AnswerArray = Object.values(output.data.data[user].answers);
                                    userArray.push({"dateTime": output.data.data[user].dateTime, "answers": AnswerArray})
                                }

                                this.answers = userArray;

                                this.$store.commit('setUserData', userArray);
                                this.$store.commit('ConfigureAnswers');
                                //const resultArray = [];
                                this.$store.state.loading = false;
                            }).catch(error => {

                            error = error.toString();
                            if(error.includes('code 500')){
                                this.errorText = "Bestaat niet"
                            }else if(error.includes('undefined')) {
                                this.errorText = "Geen vragen/ niet goed opgesteld"
                            } else {
                                this.errorText = "Gewoon een error"
                            }
                            // this.errorText = error;
                            this.noError = false
                            // this.$store.state.loading = false;

                        });
                       this.$store.state.loading = false;
                    }).catch(error => {

                    error = error.toString();
                    if(error.includes('code 500')){
                        this.errorText = "Bestaat niet"
                    }else if(error.includes('undefined')) {
                        this.errorText = "Geen vragen/ niet goed opgesteld"
                    } else {
                        this.errorText = "Gewoon een error"
                    }
                    // this.errorText = error;
                    this.noError = false
                   // this.$store.state.loading = false;

                });




            }, SetStuff(){
             //   let users = this.answers;
            //    let questions = this.questions;
             //   console.log(this.answers);
             //   console.log(users);

            }

        }, created(){
            this.fetchSurvey();
            this.logSurvey(24103);



        }, mounted(){

        }
    }
</script>

<style scoped>

</style>
