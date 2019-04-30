<template>
  <v-app class="app">
    <v-content>
      <div class="pageButtons">
      <span v-for="(button,index) in buttons"> <v-btn class="Vuebutton text-none" @click="pageNumber = index" flat depressed>{{button}}</v-btn> </span>

      </div>
      <v-btn @click="vuexCommit">Vuex commit</v-btn>
        <v-btn @click="FilterVuex">Add filter via vuex</v-btn>
      {{pageNumber}}<br>
      {{ $store.state.userAnswers }}
        <hr>
        {{ $store.state.filters }}
        <hr>
        {{ $store.state.configured }}
<v-layout>
          <v-flex md10 sm12 ref="printMe">
      <keep-alive>
      <Overview v-if="pageNumber === 2" :questions="poep" ref="overview"></Overview>
      <Individual v-else-if="pageNumber === 1" :users="users" :questions="questions"></Individual>

        <div v-else>
        <SurveyView></SurveyView>
        </div>
      </keep-alive>
          </v-flex>
          <v-flex md2 sm12 v-if="pageNumber === 2">

            <v-card class="menu" >
            <v-container>

              <div class="headline">Product survey</div>

              <v-divider class="pa-1"></v-divider>

            <span class="grey--text">Made on: 13-06-2018</span> <br>
            <span class="grey--text">Last seen: 20-06-2018</span> <br>
              <span class="grey--text">Status: Open </span>

            <v-divider class="pa-1"></v-divider>
              <v-btn dark round class="menuButton text-none" color="#475963"> Herstel pagina</v-btn>
            <ExportComponent :toPrint="$refs" ></ExportComponent>
              <div class="headline">Filters</div>
              <v-divider></v-divider>
            <!--<export-component :toPrint="$refs" :vragen="vragen"></export-component>-->
            <DataFilter :vragen="questions" @addFilter="FilterConfig"></DataFilter>
            <div>
              <v-btn flat class="text-none"
                     v-for="(filter,index)  in filters" :key="index" @click="delFilter(index)">
                Q {{filter.Question}}: {{filter.Answer.toString()}}  <v-icon right small> close</v-icon></v-btn>
            </div>
            </v-container>
          </v-card>
            </v-flex>
</v-layout>
    </v-content>
  </v-app>
</template>

<script>

import Overview from "./views/Overview.vue";
import SurveyView from "./views/SurveyView.vue";
// import Individual from './views/Individual.vue'
import DataFilter from './components/Filter.vue'
import ExportComponent from './components/ExportComponent.vue'
export default {
  name: 'App',
  props: ['source'],
  components: {
    Overview, SurveyView,
    Individual: () => import('./views/Individual.vue'),
    DataFilter, ExportComponent
  },
  watch: {
    users(){
      this.voegSamen();
    },
    poep(){
      this.changeData();
    },
      userAnswers(){
        console.log('wow');
      }
  },
  computed: {

    // counter(){
    //   return store.$state.counter
    // }
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
      questions:[{
        "questionTitle": "Welk genre is jouw favoriet?",
        "questionChoices": ["Actie","Drama", "Familie"],
        "questionAnswers": []
      },
        {
          "questionTitle": "Welk tijdstip ga je meestal naar de film?",
          "questionChoices": ["Ochtend", "Middag", "Avond"],
          "questionAnswers": []
        },
        {
          "questionTitle": "Hoe tevreden ben je over de klantenservice?",
          "questionChoices": ["Tevreden","Gemiddeld", "Ontevreden"],
          "questionAnswers": []
        }],
      buttons: ["Statistics", "Individual", "Overview"],

    }
  },
  methods: {
      vuexCommit(){
      //  this.$store.commit('changeUsers', this.users);
      },
      FilterVuex(){
          console.log('vuexdone');
          let actie = ["Actie"];
         // this.$store.commit('addFilter', 0, actie)
      },
    changeData(){
      this.$refs.overview.drawCharts();
    },
      voegSamen() {
        this.poep = [];
      const dataArray = [];

      for(let key in this.questions) {

        const answerArray = [];
        const vraagArray =[];
        for(let user in this.users) {

          answerArray.push(this.users[user].answers[key])
        }
        for(let vraag in this.questions[key].questionChoices){
          const get = this.countInArray(answerArray,this.questions[key].questionChoices[vraag]);
          vraagArray.push(get);
        }
        dataArray.push({"Title": this.questions[key].questionTitle,"questionChoices": this.questions[key].questionChoices, questionAnswers: vraagArray});

        this.$set(this.questions[key], 'questionAnswers', vraagArray)
      }
      //  console.log(this.questions);
        this.poep = this.questions;
     },
    countInArray(array, what) {
      var count = 0;
      let tempArray = {};
      for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
          count++;
        }
      }
      if(count > 0 ) {
        tempArray = {"name": what, "value": count};
      } else {
       tempArray = {"name": what, "value": null, "label": {"show": false}};
      }
      return tempArray;


    },  FilterConfig(answer, question) {
      const filterExists = this.filterExists(answer, question);
      console.log(answer + 'dit is de app: ' + question);
      if (answer.length === 0) {
        alert('Selecteer een filter!');
      } else {
        if (filterExists === false) {
          this.addFilter(answer, question);
          this.$store.commit('addFilter', {answer, question});
          console.log("hoi");
        } else if (filterExists === "bestaat") {
          this.delFilter(question);
          this.addFilter(answer, question);
        } else {
          alert('Die filter bestaat al!');
        }
      }
    },
    filterExists(answer, question){
     // console.log(answer);
      if (typeof this.filters[question] === 'undefined') {
        return false
      } else {
        if (this.filters[question].Code[0].a === answer) {
          return true;
        } else {
          return "bestaat";
        }
      }
    },
    addFilter(answer, question) {

      const array = [];
      for (let key in this.users) {
        for (let aantal in answer) {
          if (this.users[key].answers[question] === answer[aantal]) {
            array.push(this.users[key])
          }
        }
      }
      //Push in filters array
      this.filters.push({'Question': question, 'Answer': answer, 'Code': [{'q': question, 'a': answer}]});
      this.users = array;
    },
    delFilter(number){
          this.$store.commit('delFilter', number);
      this.filters.splice(number ,1);
      this.users = this.oldData;
      const array = [];

      if(this.filters.length > 0) {
        console.log('MEER DAN 0');
        for (let filter in this.filters) {
          const question = this.filters[filter].Code[0].q;
          const answer = this.filters[filter].Code[0].a;
        //  console.log(answer);
          for (let key in this.users) {
            for (let aantal in answer) {
              //console.log('q =' + this.users[key].answers[question]  + ' : A =' + answer[aantal]);
              if (this.users[key].answers[question] ===answer[aantal]) {
                console.log('matching!');
                array.push(this.users[key])
              }
            }
          }
        }
      //  console.log(array);

        this.users = array;
      }
    },

  },  created(){

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
      this.voegSamen();
      this.oldData = this.users;
        console.log(users);
        this.$store.commit('changeUsers', {users, questions});
        this.$store.commit('ConfigureAnswers');
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
    width:15%;


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
