<template>
    <div>



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
            testje(input){
              console.log(input);
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
    .autocomplete {
        border: 1px solid #dfdfdf;
        border-radius: 6px;
        padding: 4px;
        min-height: 40px;
        color: #3e3e3e;
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

    form {
        width: 100%;

    }
    .keuzeButton{
        background: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 6px;
        padding: 4px;
        min-height: 40px;
        color: #3e3e3e;
    }
</style>
