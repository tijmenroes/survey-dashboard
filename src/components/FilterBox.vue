<template>
    <div>
            <v-expand-transition >
                <div class="boxContainer" v-show="$store.state.filterActive">
            <v-container fluid class="boxContent">
                <dl class="inputje" v-if="showMenu">
                <v-layout row wrap grow>
                    <v-flex shrink>
                                        <v-autocomplete
                                                v-model="model"
                                                :items="searchItems"
                                                append-icon="search"
                                                box
                                                background-color="#fff"
                                                item-text="name"
                                                item-value="name"
                                                class="choiceMenu"
                                                dense
                                        >
                                        </v-autocomplete>
                    </v-flex>

                    <v-flex shrink >
                        <div class="menuButton " @click="$store.state.filterActive = false"> Terug</div>
                    </v-flex>
                </v-layout>

                </dl>
                <div v-else>
                    Q{{filterStatus}}: {{$store.state.configuredSurvey[filterStatus].Title}}
                    <div class="mt-2">
                        <v-layout column row>


                        <v-flex xs6  lg8 v-for="(keuzes, index) in $store.state.configuredSurvey[filterStatus].questionChoices">
                            <v-checkbox
                                    :label="keuzes" :value="$store.state.configuredSurvey[filterStatus].questionChoices[index]"
                                    color="#707171" v-model="filterVModel[filterStatus].choices" class="selectievakje">
                            </v-checkbox>
                        </v-flex>
                        </v-layout>
                    </div>
                    <ul>
                        <li>
                            <div class="saveButton menuButton" @click="saveFilter(filterVModel[filterStatus].choices, filterStatus)">
                                Opslaan
                            </div>
                        </li>
                        <li>
                            <div class="backButton menuButton"  @click="discardFilter">
                                Terug
                            </div>
                        </li>
                    </ul>
                </div>
            </v-container>

        </div>
            </v-expand-transition>

        <div v-if="$store.state.filters.length > 0">
            <h3>FILTERS</h3>

            <div class="filterList">

                <div :key="index"
                     class="chippie" v-for="(filter,index)  in $store.state.filters">
                    <span @click="editFilter(index)">Q{{filter.Question}}: {{filter.Answer.toString()}}</span>
                    <v-icon right small @click="delFilter(index)"> close</v-icon>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "FilterBox",
        watch:{
          model(){

              for(let vraag in this.$store.state.configuredSurvey){
                  if(this.$store.state.configuredSurvey[vraag].Title === this.model){
                   this.filterStatus = vraag;
                   this.model= [];
                   this.showMenu = false;
                  }
              }
          }
        },
        data(){
            return {
                showMenu: true,
                bar: false,
                searchItems: [],
                filterStatus: 0,
                selectedChoice: [],
                filterVModel: [],
                model: ["hai"],
            }
        },
        methods: {
            editFilter(index){
                console.log(index);
                this.showMenu = false;
                this.$store.state.filterActive = true;
                this.filterStatus = index;
            },
            selectItem(index) {
                this.showMenu = false;
                this.$store.state.filterActive = true;
                this.filterStatus = index;

            }, saveFilter(answers, question) {
                this.showMenu = true;
                this.$store.state.filterActive = false;
                this.selectedChoice = [];
                this.FilterConfig(answers, question);
            },discardFilter(){
                this.showMenu = true;
                this.$store.state.filterActive = false;
            },
            FilterConfig(answer, question) {
                const filterExists = this.filterExists(answer, question);
                if (answer.length === 0) {
                    alert('Selecteer een filter!');
                } else {
                    if (filterExists === false) {
                        this.$store.commit('addFilter', {answer, question});
                        this.$store.commit('ConfigureAnswers');
                        console.log("Filter send to vuex");
                    } else if (filterExists === "bestaat") {
                        this.delFilter(question);
                        this.$store.commit('addFilter', {answer, question});
                        this.$store.commit('ConfigureAnswers');
                    } else {
                        alert('Die filter bestaat al!');
                    }
                }
            },
            filterExists(answer, question) {
                // console.log(answer);
                const filters = this.$store.state.filters;
                if (typeof filters[question] === 'undefined') {
                    return false
                } else {
                    if (filters[question].Code[0].a === answer) {
                        return true;
                    } else {
                        return "bestaat";
                    }
                }
            },
            delFilter(number) {
                this.$store.commit('delFilter', number);
                this.$store.commit('ConfigureAnswers', number);
            }
        }, created() {
            const array = [];
            const array2 = [];

            for (let vraag in this.$store.state.configuredSurvey) {

                array.push({"questionNr": vraag, choices: []});
                array2.push(this.$store.state.configuredSurvey[vraag].Title)
            }
            this.searchItems = array2;

            this.filterVModel = array;
        }
    }
</script>

<style scoped>
    ul {
        display:inline-block;
        padding-left: 0;
    }
    li{
        display:inline-block;
    }
    .saveButton {
        padding: 8px 25px;
        background: #00bfa5;
        border: 2px solid #00bfa5;
    }
    .saveButton:hover{
        background: #009688;
        border: 2px solid #009688;
    }
    .backButton{
        padding: 8px 25px;
    }
    .choiceMenu {
        width: 250px;
        margin: 0;
        padding: 0px 20px;
        position: relative;
    }
    .selectievakje{
        padding: 0 !important;
        margin-top: 0 !important;
    }
    .boxContent {
        padding: 0;
        margin: 0 auto;
        text-align: left;
    }
    .boxContainer {
        min-height: 20px;
        padding: 19px;
        position: relative;
        background-color: #f5f5f5;
        border: 1px solid #e3e3e3;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.05);

        margin-bottom: 30px;
    }
    .filterList {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    h3{
        font-size: 12px;
        font-weight: 700;
        color: #40475f;
        padding: 0 0 10px 0;
        border-bottom: 1px solid #e3e8e9;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .chippie{
        background: #fff;
        display: inline-block;
        border-radius: 22px;
        padding: 8px 20px;
        border: 2px solid #00bfa5 !important;
    }

    form {
        width: 100%;
    }

</style>
