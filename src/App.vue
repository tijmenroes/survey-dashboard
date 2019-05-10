<template>
  <v-app class="app">
    <v-content>


        <div class="pageButtons">
            <span v-for="(button,index) in buttons"> <v-btn class="Vuebutton text-none" @click="pageNumber = index" flat depressed>{{button}}</v-btn> </span>
        </div>

        <v-dialog
                v-model="$store.state.loading"

                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    Loading
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>



        <div style="height: 100px"></div>

<v-layout v-if="$store.state.configuredSurvey.length > 0">

      <keep-alive>
          <v-flex md10 sm12 ref="printMe" v-if="pageNumber === 2">
      <Overview ref="overview"></Overview>
          </v-flex>
      <Individual v-else-if="pageNumber === 1"></Individual>

        <div v-else-if="pageNumber === 0">
        <SurveyView></SurveyView>
        </div>
          <GAView v-else></GAView>
      </keep-alive>

          <v-flex md2 sm12 v-if="pageNumber === 2">

            <v-card class="menu">

                <MenuComponent :toPrint="$refs" ></MenuComponent>

          </v-card>
            </v-flex>
</v-layout>

    </v-content>
  </v-app>
</template>

<script>

import Overview from "./views/Overview.vue";
import SurveyView from "./views/SurveyView.vue";
import MenuComponent from './components/MenuComponent.vue'
import GAView from './components/GAnalytics.vue'
import axios from 'axios'

export default {
  name: 'App',
  props: ['source'],
  components: {
    Overview, SurveyView,
    Individual: () => import('./views/Individual.vue'),
      GAView,
      MenuComponent
  },

  data () {
    return {
      pageNumber: 2,
      oldData: [],

      filters: [],
     users: [],
      poep:  {'answers': []},
      lol: [],
      supertof: null,
      data: [],

      buttons: ["Statistics", "Individual", "Overview", "Google Analytics"],

    }
  },methods:{
        logSurvey(id){
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

                        // error = error.toString();
                        // if(error.includes('code 500')){
                        //     this.errorText = "Bestaat niet"
                        // }else if(error.includes('undefined')) {
                        //     this.errorText = "Geen vragen/ niet goed opgesteld"
                        // } else {
                        //     this.errorText = "Gewoon een error"
                        // }
                        // // this.errorText = error;
                        // this.noError = false
                        // // this.$store.state.loading = false;

                    });
                    this.$store.state.loading = false;
                }).catch(error => {
                //
                // error = error.toString();
                // if(error.includes('code 500')){
                //     this.errorText = "Bestaat niet"
                // }else if(error.includes('undefined')) {
                //     this.errorText = "Geen vragen/ niet goed opgesteld"
                // } else {
                //     this.errorText = "Gewoon een error"
                // }
                // // this.errorText = error;
                // this.noError = false
                // // this.$store.state.loading = false;

            });




        }
    },
  created(){

      this.logSurvey(24103);

    }
}
</script>

<style scoped>
  .pageButtons {
    width: 100%;
    float: right;
  }
  .Vuebutton {
    float:right;
  }
  .menu {
      margin-top: 5%;
      position: fixed;
      width: 15%;
  }
  .app {
    background: white;
  }
  .headline{
    color: #40475f;
    text-transform: uppercase;
    font-size: 14px !important;
  }
</style>
