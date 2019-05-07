<template>
  <v-app class="app">
    <v-content>
{{pageNumber}}
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

      <div class="pageButtons">
      <span v-for="(button,index) in buttons"> <v-btn class="Vuebutton text-none" @click="pageNumber = index" flat depressed>{{button}}</v-btn> </span>
      </div>
<div style="width:100%;">x</div>
<p style="opacity:0">x</p>

<v-layout>

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

                <MenuComponent :toPrint="$refs"></MenuComponent>

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
      pageNumber: 0,
      oldData: [],

      filters: [],
     users: [],
      poep:  {'answers': []},
      lol: [],
      supertof: null,
      data: [],

      buttons: ["Statistics", "Individual", "Overview", "Google Analytics"],

    }
  },
  created(){

      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
      function checkRand(randomNumber){
        var answer = '';
        if(randomNumber === 0) {
         answer = 'Tevreden';
         return answer

        } else  if(randomNumber === 1) {
         answer = 'Gemiddeld';
          return answer
        } else  if(randomNumber === 2) {
          answer = 'Ontevreden';
          return answer
        }
      }
      const lolarray = [];
      for(var i = 0; i < 35; i++) {
        var random = getRandomInt(7);
        var random1 = getRandomInt(5);
        var random2 = getRandomInt(3);

        if(random < 3){
          const entry1 = "Actie";
         // console.log(checkRand(random2));
          if(random1 > 1) {
            const entry2 = "Avond";
            lolarray.push({'answers':[entry1,entry2, checkRand(random2)]})
          } else {
            const entry2= "Middag";
            lolarray.push({'answers':[entry1,entry2, checkRand(random2)]})

          }
        } else if ( random < 6 && random > 2) {
          const entry1 = "Familie";

          if(random1 === 1) {
            const entry2 = "Avond";
            lolarray.push({'answers':[entry1,entry2, checkRand(random2)]})
          } else if(5 > random1 > 1){
            const entry2 = "Ochtend";
            lolarray.push({'answers':[entry1,entry2,checkRand(random2)]})
          } else {
            const entry2 = "Middag";

            lolarray.push({'answers':[entry1,entry2 ,checkRand(random2)]})
          }
        } else if (random === 6) {
          const entry1 = "Drama";

          if(random1 === 1) {
            const entry2 = "Ochtend";
            lolarray.push({'answers':[entry1,entry2, checkRand(random2)]})
          } else if(5 > random1 > 1){
            const entry2 = "Middag";
            lolarray.push({'answers':[entry1,entry2, checkRand(random2)]})
          } else {
            const entry2 = "Avond";
            lolarray.push({'answers':[entry1,entry2, checkRand(random2)]})
          }
        }
      }
      this.users = lolarray;
        const users = this.users;
        const questions = this.questions;
         this.oldData = this.users;

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
