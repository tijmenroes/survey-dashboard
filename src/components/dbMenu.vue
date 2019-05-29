<template>

<v-container fluid grid-list-sm class="menuContainer" >

       <div class="menu">
           <v-layout row wrap>
<v-flex align-self-baseline>


<div class="leftButtons">
        <ul>
            <li>
                <div class="menuButton " @click="sluitbox"> Terug</div>
            </li>
            <li>
                <!--<DataFilter></DataFilter>-->
                <div class="menuButton filterButton" @click="openFilterBox"> <v-icon small color="white">add</v-icon> Nieuwe filter</div>
            </li>
            <li>
                <div class="text-xs-center">

                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <div
                                    color="#38C1A7"
                                    class="menuButton text-none"
                                    v-on="on"
                            >
                                Exporteer pagina <v-icon small color="white">
                                arrow_drop_down
                            </v-icon>
                            </div>
                        </template>
                        <v-list>
                            <v-list-tile @click="exportImg">
                                <v-list-tile-title>Afbeelding (.jpeg)</v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile @click="exportCSV()">
                                <v-list-tile-title>Excel bestand (.csv)</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </div>


            </li>
        </ul>


</div>
</v-flex>
        <v-flex>

        <div class="rightButtons">
            <ul>

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
                                {{weergaveStatus}}
                            </div>
                        </template>

                        <v-list>
                            <v-list-tile @click="$emit('toDash'); weergaveStatus = 'Automatisch'" >
                                <v-list-tile-title >Automatisch</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile class="hidden-md-and-down" @click="$emit('three-per-row'); weergaveStatus = '3 per rij'">
                                <v-list-tile-title>3 per rij</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile class="hidden-sm-and-down" @click="$emit('two-per-row'); weergaveStatus = '2 per rij'">
                                <v-list-tile-title>2 per rij</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile  class="hidden-xs-only" @click="$emit('one-per-row'); weergaveStatus = '1 per rij'">
                                <v-list-tile-title>1 per rij</v-list-tile-title>
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
    export default {
        name: "MenuComponent",
        props: ['toPrint'],
        data(){
            return{
                weergaveStatus: "Automatisch"
            }
        },
        methods:{
            exportCSV(){
                this.$store.commit('exportCSV', this.$store.state.individualData);
            },
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

            exportImg(){
                this.$emit('printDashboard');

            }
        }
    }
</script>

<style>
    .menuContainer{
        padding: 0;
    }
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
        /*margin-left: 10px;*/
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
        margin-right: 15px;
        margin-bottom: 10px;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

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
