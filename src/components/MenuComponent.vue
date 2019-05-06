<template>
    <v-container >
    <div v-if="$store.state.filterActive === false" >
    <div class="headline">Product survey</div>

    <v-divider class="pa-1"></v-divider>

    <span class="grey--text">Made on: 13-06-2018</span> <br>
    <span class="grey--text">Last seen: 20-06-2018</span> <br>
    <span class="grey--text">Status: Open </span>

    <v-divider class="pa-1"></v-divider>
    <v-btn dark round class="menuButton text-none" color="#475963"> Herstel pagina</v-btn>
    <ExportComponent :toPrint="toPrint"></ExportComponent>
    <div class="headline">Filters</div>
    <v-divider></v-divider>
        <DataFilter></DataFilter>
    </div>
        <div v-else>
            <h3>Filter Aanpassen</h3>
            <DataFilter></DataFilter>
        </div>
    <!--<export-component :toPrint="$refs" :vragen="vragen"></export-component>-->


        </v-container>
</template>

<script>
    import DataFilter from './Filter.vue'
    import ExportComponent from './ExportComponent.vue'

    export default {
        name: "MenuComponent",
        props: ['toPrint'],
        components: {
            DataFilter, ExportComponent
        }
    }
</script>

<style scoped>

</style>
