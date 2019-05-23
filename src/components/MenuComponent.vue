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
                <div class="menuButton filterButton" @click="openFilterBox"> Nieuwe filter</div>
            </li>
            <li>
                <ExportComponent :toPrint="toPrint"></ExportComponent>
            </li>
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
                    <div class="selectDiv">


                    <label class="label">weergave:</label>
                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <div
                                    class="selectButton"
                                    v-on="on"
                            >
                                Dashboard
                            </div>
                        </template>

                        <v-list>
                            <v-list-tile @click="emitDash">
                                <v-list-tile-title >Dashboard</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="emitList">
                                <v-list-tile-title>List</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                    </div>
                </li>
            </ul>

        </div>
               </v-flex>
           </v-layout>

        </div>
</v-container>

</template>

<script>

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

            },
            openFilterBox(){
                this.$store.state.filterActive = true;
            },
            sluitbox(){
                this.$store.state.filterActive = false;
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
    .label{
        display: inline-block;
        font-weight: 400;
        padding-right: 6px;
    }
    .filterButton {
        background: #00bfa5 !important;
        border: 2px solid #00bfa5 !important;
    }
    .filterButton:hover {
        background: #009688 !important;
        border: 2px solid #009688 !important;
    }
    .menuButton:hover {
        background: #37474f;
        border: 2px solid #37474f;
    }
    .menu ul {
        min-height: 10%;
        margin: 0;
        padding: 0;
        list-style: none;
        /*float: left;*/
    }
    .menu ul li {

        font-weight: 600;
        margin-right: 10px;
        margin-bottom: 10px;
        min-height: 50px;
        display: inline-block;
    }
    .menu .rightButtons li {
  float:right;
    }
    .menuButton {
        cursor: pointer;
        -webkit-transition: all .2s ease-out;
        transition: all .2s ease-out;
        /*display:block;*/
        /*width: 100%;*/
        background: #455a64;
        font-size: 14px;
        display: block;
        color:white;
        border: 2px solid #455a64;
        padding: 10px 30px;
        border-radius: 22px;
        margin-right: 10px;
        margin-bottom: 10px;

    }
    .leftButtons  {
        float:left;
    }
    .rightButtons {
        float:right;
    }
    .rightButtons .menuButton {
        float: left;
    }
    .selectButton {
        display: inline-block;
        cursor: pointer;
        font-weight: 400;
        color: black;
        background:white;
        padding: 12px 20px;
        border-radius: 22px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: solid 2px #dadada;
    }

    .menu {
        /*margin-bottom: 30px;*/
        min-height: 75px;
        padding: 0;

    }
    .selectDiv{
        display:inline-block;
    }
</style>
