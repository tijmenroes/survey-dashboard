<template>
  <v-app class="app">
    <v-content>
        <div id="crumbpath" class="clear">

            <h2>Formulieren</h2>
            <div class="pageButtons">
                 <v-btn class="Vuebutton text-none" v-for="(button,index) in buttons" @click="pageNumber = index" flat depressed>{{button}}</v-btn>
            </div>
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

    <div id="dashboard">
    <!--<MenuComponent :toPrint="$refs" v-if="$store.state.configuredSurvey.length > 0"></MenuComponent>-->

    <!--<FilterBox></FilterBox>-->


<div v-if="$store.state.configuredSurvey.length > 0">

      <keep-alive>

      <Overview ref="printMe" v-if="pageNumber === 2"></Overview>

      <Individual v-else-if="pageNumber === 1"></Individual>

        <div v-else-if="pageNumber === 0">
        <SurveyView></SurveyView>
        </div>

      </keep-alive>

</div>
    <v-layout v-else>
        Oeps hier gaat iets fout!
    </v-layout>

    </div>
    </v-content>
  </v-app>
</template>

<script>

import Overview from "./views/Overview.vue";
import SurveyView from "./views/SurveyView.vue";

// import FilterBox from './components/FilterBox.vue'
import axios from 'axios'

export default {
  name: 'App',
  props: ['source'],
  components: {
    Overview, SurveyView,
      //FilterBox,
    Individual: () => import('./views/Individual.vue'),
      // MenuComponent
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

      buttons: ["Statistics", "Individual", "Overview"],

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
      console.log(this.source);
      this.logSurvey(24000);

    },
    mounted(){

    }
}
</script>

<style scoped>

    #dashboard {
        padding: 20px;
        position: relative;
        font-family: 'Open Sans' , sans-serif;
    }
    #crumbpath {

        background: #f7f7f7;
        padding: 15px 20px;
        border-bottom: 1px solid #e3e8e9;
        border-bottom: 1px solid #cecece;
    }

  .Vuebutton {
    /*float:right;*/
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
