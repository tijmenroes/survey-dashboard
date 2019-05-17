<template>

<v-container fluid grid-list-sm style="padding: 0;">




       <div class="menu">
           <v-layout row wrap>
<v-flex align-self-baseline>
<!--Toch wel per ding een flex???!?!-->

<div class="leftButtons">
        <ul>
            <li>
                <!--<DataFilter></DataFilter>-->
                <div class="menuButton " @click="sluitbox"> Exporteren</div>
            </li>
            <!--<li>-->
                <!--&lt;!&ndash;<ExportComponent :toPrint="toPrint"></ExportComponent>&ndash;&gt;-->
            <!--</li>-->
        </ul>


</div>
</v-flex>

           <v-flex>

        <div class="rightButtons">
            <ul>
                <li>
                    <div class="menuButton " @click="sluitbox"> Terug</div>
                </li>
                <li>
                    <div class="menuButton " @click="restorePage"> Herstel pagina</div>

                </li>
                <li>
                    <div class="menuButton " @click="searchItems"> Zoeken</div>
                </li>
            </ul>

        </div>
               </v-flex>
           </v-layout>

        </div>
</v-container>

</template>

<script>
    import DataFilter from './Filter.vue'
    import ExportComponent from './ExportComponent.vue'

    export default {
        name: "MenuComponent",
        props: ['toPrint'],
        components: {
          ExportComponent
        },
        methods:{
            restorePage(){
                this.$store.commit('resetData');
                this.$store.commit('ConfigureAnswers');
                //this.$emit('resetPage');
            },
            searchItems(){
                this.$store.state.searchActive = true;
            },
            sluitbox(){
                this.$store.state.searchActive = false;
            },
            emitDash(){
                this.$emit('toDash');
            },
            emitList(){
                this.$emit('toList');
            }
        }
    }
</script>

<style>

</style>
