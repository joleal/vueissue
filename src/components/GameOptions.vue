<template>
    <ul>
        <li v-if="options.numPlayers">{{options.numPlayers + ' jogadores'}}</li>
        <li v-if="options.anon == true">Anonimo</li>
        <li v-if="options.prelude">Prelude</li>
        <li v-if="options.venus">Venus</li>
        <li v-if="options.colonies">Colonias</li>
        <li v-if="options.turmoil">Turmoil<span v-if="options.turmoilA">(Chairman escolhe)</span></li>
    </ul>
</template>

<script>
export default {
  name: "GameOptions",
  props: ['options']
};
</script>

<style scoped>
    ul { 
        padding-left: 0;
    }
</style>