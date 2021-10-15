<template>
  <div>
    <h3 >Jogos Terminados</h3>
    <table
      class="table table-sm table-stripped table-hover"
      style=""
    >
      <thead class="thead-dark">
        <tr>
          <th style="min-width: 100px">Nome</th>
          <th>#1</th>
          <th>#2</th>
          <th>#3</th>
          <th>#4</th>
          <th>#5</th>
          <th>#6</th>
          <th></th>
          <th>Rematch</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in lastGames" :key="game.id">
          <td>{{game.name}}</td>
          <td v-for="pid in [1,2,3,4,5,6]" :key="pid" :style="{ backgroundColor: !game.blocked && game[`player${pid}`] && game[`player${pid}`].rematch ? 'yellow' : 'white' }">
            <div v-if="game[`player${pid}`]">
              {{game[`player${pid}`].name}} ({{game[`player${pid}`].score}})
              <font-awesome-icon v-if="!game.blocked && game[`player${pid}`].rematch" icon="check" />
            </div>
          </td>
          <td>
            <a title="Abrir jogo em nova tab" :href="game.url" target="_blank">
                <font-awesome-icon icon="external-link-alt" />
            </a>
          </td>
          <td>
            <a v-if="!game.blocked && !(game.rematch_id && game.join_rematch)" href="#" @click="join(game)">Rematch</a>
            <a v-if="!game.blocked && game.rematch_id && game.join_rematch" href="#" @click="leave(game)">(sair)</a>
              
          </td>
        </tr>
      </tbody>
    </table>
    
  </div>
</template>

<script>
import TMService from "../services/tm.service";

export default {
  name: "LastGames",
  props: ["loading", "lastGames"],
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    leave(game){
      TMService.leaveGame(game.rematch_id, this.currentUser.user_id).then(() => {game.blocked = true;});
    },
    join(game){
      if(game.rematch_id){
        TMService.joinGame(game.rematch_id, this.currentUser.user_id, game.colour).then(() => {game.blocked = true;});
      }
      else {
        let options = {rematch: true, game_id: game.id};
        let player = {user_id: this.currentUser.user_id, colour: game.colour};
        TMService.createGame(undefined, options, [player]).then(() => {game.blocked = true;});
      }
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
.table{
    font-size: 0.65em
  }
</style>