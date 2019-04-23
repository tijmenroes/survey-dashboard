<template>
  <v-app>

    <v-content>

      <div class="pageButtons">

      <span v-for="(button,index) in buttons"> <v-btn class="button" @click="pageNumber = index" flat depressed>{{button}}</v-btn> </span>
        <!--<hr>-->

      </div>
      <v-btn @click="changeData"></v-btn>
      {{pageNumber}}<br>

        <v-layout>

          <v-flex xs10 ref="printMe">
      <keep-alive>
      <Overview v-if="pageNumber === 2" :questions="poep" ref="overview"></Overview>
      <Individual v-else-if="pageNumber === 1"></Individual>

        <div v-else> haha</div>
      </keep-alive>
          </v-flex>
          <v-flex xs2>
            <v-card class="menu">

            <v-card-title primary-title>
              <div class="headline">Product survey</div>
            </v-card-title>
            <span class="grey--text">Made on: 13-06-2018</span> <br>
            <span class="grey--text">Last seen: 20-06-2018</span>

            <v-divider></v-divider>
            <ExportComponent :toPrint="$refs"></ExportComponent>
            <!--<export-component :toPrint="$refs" :vragen="vragen"></export-component>-->
            <DataFilter :vragen="questions" @addFilter="FilterConfig"></DataFilter>
            <div>
              <v-btn flat class="text-none"
                     v-for="(filter,index)  in filters" :key="index" @click="delFilter(index)">
                Q {{filter.Question}}: {{filter.Answer.toString()}}  <v-icon right small> close</v-icon></v-btn>
            </div>
          </v-card></v-flex>
        </v-layout>

    </v-content>
  </v-app>
</template>

<script>

import Overview from "./views/Overview.vue";
// import Individual from './views/Individual.vue'
import DataFilter from './components/Filter.vue'
import ExportComponent from './components/ExportComponent.vue'
export default {
  name: 'App',
  props: ['source'],
  components: {
    Overview,
    Individual: () => import('./views/Individual.vue'),
    DataFilter, ExportComponent
  },
  watch: {
    users(){
      this.voegSamen();
    },
    poep(){
      this.changeData();
    }
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


    },  FilterConfig(answer, question){
      const filterExists = this.filterExists(answer, question);
      if(filterExists === false) {
        this.addFilter(answer, question);
      } else if (filterExists === "bestaat") {
        this.delFilter(question);
        this.addFilter(answer, question);
      } else {
        alert('Die filter bestaat al!');
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
      this.voegSamen();
      this.oldData = this.users;
    }
}
</script>

<style scoped>
  .pageButtons {
    width: 100%;
    float: right;
  }
  .button {
    float:right;
  }
  .menu {
    position: fixed;
  }
</style>
