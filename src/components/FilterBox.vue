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
                    <!--<v-flex >-->
                        <!--<v-menu offset-y>-->
                            <!--<template v-slot:activator="{ on }">-->
                                <!--<div-->
                                        <!--class="keuzeButton choiceMenu"-->
                                        <!--v-on="on"-->
                                        <!--append-icon="arrow_drop_down"-->
                                <!--&gt;-->
                                    <!--Nieuwe filter-->

                                <!--</div>-->

                            <!--</template>-->

                            <!--<v-list>-->
                                <!--<v-list-tile-->
                                        <!--:key="index"-->
                                        <!--@click="selectItem(index)"-->
                                        <!--v-for="(item, index) in $store.state.configuredSurvey"-->
                                <!--&gt;-->
                                    <!--<v-list-tile-title>{{ item.Title }}</v-list-tile-title>-->
                                <!--</v-list-tile>-->
                            <!--</v-list>-->
                        <!--</v-menu>-->
                    <!--</v-flex>-->
                    <v-flex shrink >
                        <div class="menuButton " @click="$store.state.filterActive = false"> Terug</div>

                    </v-flex>

                </v-layout>



                </dl>
                <div v-else>
                    Q{{filterStatus}}: {{$store.state.configuredSurvey[filterStatus].Title}}
                    <div class="mt-2">

                        <div v-for="(keuzes, index) in $store.state.configuredSurvey[filterStatus].questionChoices">
                            <v-checkbox
                                    :label="keuzes" :value="$store.state.configuredSurvey[filterStatus].questionChoices[index]"
                                    color="#707171" v-model="filterVModel[filterStatus].choices" class="selectievakje">
                            </v-checkbox>
                        </div>
                    </div>
                    <v-btn @click="discardFilter">Discard</v-btn>

                    <v-btn @click="saveFilter(filterVModel[filterStatus].choices, filterStatus)">Save</v-btn>
                </div>

                <!--<div class="menuButton " @click=""> Terug</div>-->
            </v-container>

        </div>
            </v-expand-transition>
    </div>

</template>

<script>
    export default {
        name: "FilterBox",
        watch:{
          model(){
              console.log('da minde nie');
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

    form {
        width: 100%;
    }

</style>
