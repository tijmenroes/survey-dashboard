<template>
    <div>
        {{surveys}}
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
                console.log(id);
            }

        }, created(){
            this.fetchSurvey();
        }
    }
</script>

<style scoped>

</style>
