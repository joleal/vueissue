<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col" v-if="currentUser">
        <h3 @click="openAll">Os meus jogos</h3>
        <table class="table table-sm table-stripped table-hover" style="" v-show="myGames.length">
          <thead class="thead-dark">
            <tr>
              <th style="min-width: 100px;">Nome</th>  
              <th>Corp</th> 
              <th>Gen</th>
              <th>A jogar</th> 
              <th colspan="2">Actividade</th>
              
            </tr>
          </thead> 
          <tbody>
            <tr class="clickable" v-for="game in this.myGames" v-bind:key="game.player_id" @click="openGame(game)" v-bind:class="{'row-active': amActive(game)}" >
              <td>{{game.name}}</td> 
              <td>{{game.corporation}}</td>
              <td>{{game.props.generation}}</td> 
              <td>{{activePlayers(game)}}</td> 
              <td>{{deltaToNow(game.props.lastPlayed)}}</td> 
              <td @click.stop="openNote(game)">
                <font-awesome-icon v-if="game.notes" icon="sticky-note"/>&nbsp;
                <font-awesome-icon v-if="game.league_id == 1" icon="trophy" />&nbsp;
                <font-awesome-icon v-if="game.props.anon" icon="user-secret"/>
              </td>
            </tr>
          </tbody>
        </table>
        <h2 v-show="myGames.length == 0">No games added</h2>   
        <button v-show="gamesToPlay()" type="button" href="" v-on:click="openAll" class="pure-button pure-button-primary">Abrir todos</button>
        <LastGames v-if="currentUser" :loading="loadingLastGames" :lastGames="lastGames"/>
      </div>
      <div class="col">
        <h3>Jogos Abertos</h3>
        <table class="table table-sm table-stripped" style="">
          <thead class="thead-dark">
            <tr>
              <th style="min-width: 100px;">Nome</th> 
              <th>Opcoes</th> 
              <th>Mapa</th> 
              <th>Anonimo</th> 
              <th>Jogadores</th>
            </tr>
          </thead> 
          <tbody>
            <tr v-for="game in this.openGames" v-bind:key="game._id">
              <td>{{game.name}}</td>
              <td><game-options :options="game.options" /></td>
              <td>{{game.options.map}}<span v-if="game.options.tiles == 'random tiles'"> (com tiles random)</span></td>
              <td>{{game.options.anon?'Sim':'Nao'}}</td>
              <td>
                <div v-if="!game.options.anon">
                  <ul>
                    <li v-for="player in game.players" v-bind:key="player">{{player.username}}
                      <a href="#" @click="leaveGame(game, $event);" v-if="currentUser && player.username == currentUser.username">(sair)</a>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  {{ `${game.players.length}\\${game.options.numPlayers}` }}
                  <a href="#" @click="leaveGame(game, $event);" v-if="currentUser && game.players.find(p => p.username == currentUser.username)">(sair)</a>
                </div>
                <a v-if="notInGame(game)" href="#" @click="openColourPicker(game)">Juntar ao jogo</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal :colours="colours" :visible="modalVisible" @closeModal="modalVisible = false" @joinGame="joinGame(gameToJoin, $event)"/>
      <GameNotes :visible="notesVisible" :game="notesGame" @closeModal="notesVisible = false" @saveNotes="saveNotes(notesGame, $event)"/>
    </div>
  </div>
</template>

<script>
import TMService from "../services/tm.service";
import GameOptions from "./GameOptions";
import Modal from "./ui/Modal.vue";
import GameNotes from "./ui/GameNotes.vue";
import LastGames from "./LastGames";
import util from '../util';

export default {
  name: "Home",
  components: { GameOptions, Modal, GameNotes, LastGames },
  data() {
    return {
      openGames: [],
      myGames: [],
      modalVisible: false,
      notesVisible: false,
      gameToJoin: {},
      notesGame: {},
      colours: [],
      animate: false,
      lastGames: [],
      loadingLastGames: true,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods:{
    refreshOpenGames(){
      TMService.getOpenGames().then(
        (response) => {
          this.openGames = response.data;
          this.openGames.forEach(g => 
            {
              g.options = JSON.parse(g.options); 
              g.players = JSON.parse(g.players);
            });
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    notInGame(game){
      return this.$store.state.auth.user && game.players.filter(p => p.username == this.$store.state.auth.user.username).length == 0;
    },
    leaveGame(game){
      TMService.leaveGame(game._id, this.currentUser.user_id).then(() => {
        this.refreshOpenGames();
      });
    },
    joinGame(game, colour){
      TMService.joinGame(game._id, this.currentUser.user_id, colour).then(() => {
        this.modalVisible = false;
        this.refreshOpenGames();
      });
    },
    getMyGames(){
      if(!this.currentUser) return;
      TMService.getLastFinishedGames(this.currentUser.user_id).then(
        (response) => {
          this.lastGames = response.data;
          this.loadingLastGames = false;
        },(error) => {
          console.log(error);
        });
      TMService.getMyGames(this.currentUser.user_id).then(resp => {
        this.myGames = resp.data;
        window.clearInterval(this.animate);
        if(this.gamesToPlay()){
          this.animate = window.setInterval(() => this.animateTitle(), 1000);
        } else {
          document.title = 'Liga Terraforming Mars';
        }
      })
    },
    animateTitle() {
        const sequence = '\u25D1\u25D2\u25D0\u25D3';
        const first = document.title[0];
        const position = sequence.indexOf(first);
        let next = sequence[0];
        if (position !== -1 && position < sequence.length - 1) {
            next = sequence[position + 1];
        }
        document.title = next + ' Liga Terraforming Mars';
    },
    openGame(game){
      window.open(game.url + 'fake', '_blank');
    },
    amActive(game){
      return !Array.isArray(game.props.activePlayer) || game.props.activePlayer.filter(x => x.colour == game.colour).length > 0;
    },
    activePlayers(game){
      return Array.isArray(game.props.activePlayer) ? game.props.activePlayer.map(x => x.name).join(', ') : game.props.activePlayer ;
    },
    gamesToPlay(){
      let active = false;
      this.myGames.forEach(game => {
        if(this.amActive(game))
          active = true;
      });
      return active;
    },
    openAll(){
        this.myGames.forEach(game => {
          if(this.amActive(game))
              window.open(game.url + 'fake', '_blank');
        });
        window.focus()
    },
    openNote(game){
      this.notesVisible = true;
      this.notesGame = game;
    },
    saveNotes(game, text) {
      TMService.addNotes(game._id, this.currentUser.user_id, text).then(() => {
        this.notesVisible = false;
        this.getMyGames();
      });
    },
    openColourPicker(game){
      if(game.options.anon){
        this.joinGame(game, 'red');
        return;
      }
      this.colours = ['red','yellow','blue','green','pink','orange','purple','black'];
      game.players.forEach(p => {
        if(this.colours.includes(p.colour)) {
          let index = this.colours.indexOf(p.colour);
          this.colours.splice(index, 1); 
        }
      });
      this.modalVisible=true;
      this.gameToJoin=game
    },
    gameLoader(){
      this.$router.push("/gameLoader");
    },
    deltaToNow: util.deltaToNow,
    mobileCheck: util.mobileCheck
  },
  mounted() {
    this.refreshOpenGames();
    this.getMyGames();
    setInterval(() => {
      this.getMyGames();
      this.refreshOpenGames();
    },30000);
  }
};
</script>

<style scoped>
  .table{
    font-size: 0.65em
  }

  ul {
    padding-left: 0;
  }

  .clickable {
    cursor: pointer;
  }

  .row-active {
    background-color: rgb(175, 224, 175);
  }

  .row-active:hover {
    background-color: rgb(24, 110, 24);
  }
</style>