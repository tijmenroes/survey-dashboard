<template>
  <v-app class="app">
    <v-content>
        <div id="crumbpath" class="clear">

            <h2>Formulieren</h2>
            <!--<div class="pageButtons">-->
                <ul class="pageTabs">
                    <li v-for="(button,index) in buttons"  v-if="pageNumber === index" class="active">
                        {{button}}
                    </li>
                    <li v-else @click="pageNumber = index">
                        {{button}}
                    </li>
                </ul>

            <!--</div>-->
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
            axios.all([
                axios.get('https://survey-api.test.tc8l.nl/api/survey/questions/' + id),
                axios.get('https://survey-api.test.tc8l.nl/api/survey/answers/' + id)

            ]).then(axios.spread((surveyQuestions, surveyAnswers) => {
                console.log(surveyQuestions);
                console.log(surveyAnswers);
            }));
            axios.get('https://survey-api.test.tc8l.nl/api/survey/questions/' + id)
                .then(response => {
                    let qNameArray = [];
                    //    console.log(response.data.data.pages[0].questions);
                    // this.questions = response.data.data.pages[0].questions;
                    for(let vraag in response.data.data.pages[0].questions){
                        qNameArray.push(response.data.data.pages[0].questions[vraag].name);
                    }
                    this.$store.commit('setSurveyQuestions', response.data.data.pages[0].questions);
                    //const resultArray = [];

                    //this.questions = resultArray; //Link m aan de display
                    axios.get('https://survey-api.test.tc8l.nl/api/survey/answers/' + id)
                        .then(output => {
                            const userArray = [];
                                for(let user in output.data.data) {

                                    let AnswerArray = [];

                                    for(let lol in qNameArray) {
                                        const text = qNameArray[lol];
                                        const poepjes = output.data.data[user].answers[text];
                                        AnswerArray.push(poepjes);
                                    }
                                    userArray.push({"dateTime": output.data.data[user].dateTime, "answers": AnswerArray});
                                    }
;
                            this.$store.commit('setUserData', userArray);
                            this.$store.commit('ConfigureAnswers');

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
      this.logSurvey(24204);

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

  .pageTabs{
      transition: .2s;
      position: absolute;
      right: 20px;
      list-style: none;
      margin: 0;
      padding: 0;
      top: 10px;
  }
  .pageTabs li{
      transition: .2s;
      display: inline-block;
      margin-right: 5px;
      padding: 15px 35px;
      text-decoration: none;
      font-weight: 700;
      border: 1px solid #dbdbdb;
      border: 1px solid transparent;
      border-bottom: none;
      font-size: 14px;
      background: #455a64;
      background: 0 0;
      color: #353535;
      border-radius: 4px 4px 0 0;
  }
  .pageTabs .active, .pageTabs li:hover {
      transition: .2s;
      background: #fff;
      color: #40475f;
      border: 1px solid #dbdbdb;
      border-bottom: none;
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
