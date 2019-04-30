<template>
    <div>

        <v-btn @click="fetchSurvey">{{$store.state.loading}}</v-btn>
        <v-container fluid >
            <v-layout wrap>
                <v-flex xs12 md9 class="pa-3">
                    <v-data-table
                            :headers="surveyHeaders"
                            :items="surveys"
                            class="elevation-1"
                            :pagination.sync="pagination"
                    >
                        <template v-slot:items="props">

                            <td >{{ props.item.id }}</td>
                            <td>{{ props.item.title }}</td>
                            <td @click="logSurvey(props.item.id)"> <v-icon small>arrow_forward</v-icon></td>

                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>

        </v-container>
        {{questions}}
        <hr>
        {{answers}}
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
                axios.get('https://survey-api.test.tc8l.nl/api/survey/questions/' + id)
                    .then(response => {
                    //    console.log(response.data.data.pages[0].questions);
                        this.questions = response.data.data.pages[0].questions;
                        //const resultArray = [];

                        //this.questions = resultArray; //Link m aan de display
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

                axios.get('https://survey-api.test.tc8l.nl/api/survey/answers/' + id)
                    .then(response => {
                        //console.log(response.data.data);
                      //  this.answers = response.data.data;
                            const AnswerArray = [];
                            for(let user in response.data.data) {
                               AnswerArray.push(Object.values(response.data.data[user].answers));
                            }

                  //      this.$store.commit('changeUsers', {users, questions});
                  //      this.$store.commit('ConfigureAnswers');

                           this.answers = AnswerArray;

                        //const resultArray = [];

                        //this.questions = resultArray; //Link m aan de display
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
            }

        }, created(){
            this.fetchSurvey();
        }
    }
</script>

<style scoped>

</style>
