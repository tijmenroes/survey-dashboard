<template>
  <v-app class="app">
    <v-content>
        <div id="crumbpath" class="clear">
            <h2>{{$store.state.surveyName}}</h2>
                     <ul class="pageTabs">
                    <li v-for="(button,index) in buttons"  v-if="pageNumber === index" class="active">
                        {{button}}
                    </li>
                    <li v-else @click="pageNumber = index">
                        {{button}}
                    </li>
                </ul>
        </div>

<div id="dashboard"  v-bind="checkViewWidth" >
<div v-if="$store.state.configuredSurvey.length > 0">
      <keep-alive>
      <Overview ref="printMe" v-if="pageNumber === 0"></Overview>
      <Individual v-else-if="pageNumber === 1"></Individual>
        <div v-else-if="pageNumber === 2">
        <SurveyView></SurveyView>
        </div>
      </keep-alive>
</div>
    <div v-else class="loadingDiv">

        <div class="text-xs-center">
            <v-progress-circular
                    name="Loading"
            color="#ff4d4d"
            indeterminate
            :size="120"
            :width="10"
            >
            </v-progress-circular>
        </div>
          </div>

    </div>
    </v-content>
  </v-app>
</template>

<script>

import Overview from "./views/Dashboard.vue";
import SurveyView from "./views/SurveyView.vue";
import Individual from "./views/Individual.vue";
import axios from 'axios'

export default {
  name: 'App',
  props: ['source'],
  components: {
    Overview, SurveyView,
    Individual
  },

  data () {
    return {
      pageNumber:0,
      buttons: ["Dashboard", "Individual"],
      breakpoint: null,
      isLoading: true,
    }
  },methods:{
        getSurvey(id){
            this.isLoading = true;
            axios.all([
                axios.get('https://survey-api.test.tc8l.nl/api/survey/questions/' + id),
                axios.get('https://survey-api.test.tc8l.nl/api/survey/answers/' + id)
            ]).then(axios.spread((surveyQuestions, surveyAnswers) => {
                let qNameArray = [];
                for(let vraag in surveyQuestions.data.data.pages[0].questions){
                    qNameArray.push(surveyQuestions.data.data.pages[0].questions[vraag].name);
                }
                this.$store.commit('setSurveyQuestions', surveyQuestions.data.data.pages[0].questions);
                const userArray = [];
                for(let user in surveyAnswers.data.data) {
                    let AnswerArray = [];
                    for(let name in qNameArray) {
                        const text = qNameArray[name];
                        AnswerArray.push(surveyAnswers.data.data[user].answers[text]);
                    }
                    userArray.push({"dateTime": surveyAnswers.data.data[user].dateTime, "answers": AnswerArray});
                }
                this.$store.commit('setUserData', userArray);
                this.$store.commit('ConfigureAnswers');
                this.isLoading = true;
            }))
           .catch(error => {
//Dit kan je gebruiken om errors te vertonen

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
        }
    },
  created(){
      this.getSurvey(this.source);
    },
    computed :{
        checkViewWidth(){
            if(this.breakpoint !== this.$vuetify.breakpoint.name){
                this.$store.state.weergaveStatus =  'Automatisch';
            }

            this.breakpoint = this.$vuetify.breakpoint.name;
            if (this.$vuetify.breakpoint.xsOnly){ //Wanneer het mobile is
                this.$store.state.menuPadding =  "padding: 0 0"; //disable padding
                this.$store.state.phoneDetected =  true; //disable padding op dashboard vakken.

            }  else {
                this.$store.state.menuPadding =   "padding: 0 16px";
                this.$store.state.phoneDetected =  false;
            }
        }
    }
 }
</script>

<style scoped>

    #dashboard {
        padding: 20px;
        position: relative;
        font-family: 'Open Sans' , sans-serif;
        background: white;
    }
    #crumbpath {

        background: #f7f7f7;
        padding: 15px 20px;
        padding-top: 50px;
        border-bottom: 1px solid #e3e8e9;
        border-bottom: 1px solid #cecece;
    }
.loadingDiv{
    position:fixed;
    margin: auto;
    left: 45%;
    top:40%;
}
  .pageTabs{
      transition: .2s;
      position: absolute;
      right: 20px;
      list-style: none;
      margin: 0;
      padding: 0;
      top: 46px;
  }
  .pageTabs li{
      transition: .2s;
      display: inline-block;
      margin-right: 5px;
      padding: 15px 35px;
      text-decoration: none;
      font-weight: 700;

      border: 1px solid transparent;
      border-bottom: none;
      font-size: 14px;
      background: #455a64;
      background: 0 0;
      color: #353535;
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
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

</style>
