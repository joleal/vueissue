<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-center align-items-center" style="height:100vh" v-if="loading">
      <span
        class="spinner-border spinner-border-lg"
      ></span>
    </div>
    <div class="row" v-else>
      <div class="row g-2">
        <header class="jumbotron">
        <h2>Liga Terraforming Mars</h2>
        <h5>
          Primeira temporada <font-awesome-icon icon="info-circle" style="cursor: pointer" @click="showInfo = !showInfo"/>
        </h5>
        <p class="lead" v-show="showInfo">
          A primeira edição da liga de <strong>Terraforming Mars</strong> será jogada em 4 rondas de 2 jogos cada. <br/>
          Os jogos serão de 4 ou 3 jogadores e o emparelhamento de jogadores será feito automaticamente pelo site (mais fortes contra mais fortes, etc..).<br/> 
          Cada jogo ira ser jogado num mapa random (incluindo <i>fan made</i>), com <i>awards</i> e <i>milestones</i> escolhidas aleatoriamente também. As expansões utilizadas serão <strong>Prelude</strong> + <strong>Venus</strong> (com World Government).<br/>
          Algumas corporações, preludes e cartas foram ligeiramente alteradas com base em estatísticas de centenas de jogos, de forma a tornarem-se mais equilibradas. as alterações podem ser consultadas <a href="https://jeeps.notion.site/Rebalanced-Mars-025fcc726dc645f9aacef08a1486bf4a" target="_blank">aqui</a>.<br/>
          Setup inicial: 3 ou 4 corporações, dois drafts de 5 cartas seguido de draft dos preludes.<br/> 
          Os jogos serão anónimos e apenas no final de cada ronda serão conhecidos os nomes dos jogadores.<br/>
        </p>
      </header>
      </div>
      <div class="row g-3">
        <div :class="{'col-md-2': !playersDetail, 'col-md-10': playersDetail}">
          <table class="table table-sm table-stripped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Jogador</th>
                <th v-show="playersDetail">#1</th>
                <th v-show="playersDetail">#2</th>
                <th v-show="playersDetail">#3</th>
                <th v-show="playersDetail">#4</th>
                <th>Pontos&nbsp;&nbsp;&nbsp;&nbsp;<span class="link" @click="showDetails" >
                    <font-awesome-icon icon="angle-double-right" v-if="!playersDetail"/>
                    <font-awesome-icon icon="angle-double-left" v-else/>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(j, index) in sortedLeaguePlayers" :key="index">
                <td>{{index +1}}</td>
                <td>{{j.username}}</td>
                <td v-show="playersDetail">{{j.victories}}</td>
                <td v-show="playersDetail">{{j.seconds}}</td>
                <td v-show="playersDetail">{{j.thirds}}</td>
                <td v-show="playersDetail">{{j.fourths}}</td>
                <td>{{j.points}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-10">
          <div v-if="currentUser && !signedIn && league.status == 'created'">
            <div class="card text-center">
              <div class="card-body">
                <button type="button" class="btn btn-lg btn-success" @click="joinLeague">Inscrever Primeira Temporada</button>
              </div>
            </div>
          </div>
          <div v-if="currentUser && signedIn && league.status == 'created'">
            <div class="card text-center">
              <div class="card-body">
                <p>Já estás inscrito na liga. Ainda não começou.</p>
                <button type="button" class="btn btn-sm btn-danger" @click="leaveLeague">Sair</button>
              </div>
            </div>         
          </div>
          <div v-if="league && league.status != 'created'">
            <div class="games">
              <h3>Jogos a decorrer - Ronda {{league.round_id}}</h3>
              <table class="table table-sm table-stripped table-hover">
                <thead class="thead-dark">
                  <tr>
                    <th style="min-width: 100px;">Nome</th>  
                    <th>Gen</th>
                    <th>Jog 1</th>
                    <th>Jog 2</th>
                    <th>Jog 3</th>
                    <th>Jog 4</th> 
                  </tr>
                </thead> 
                <tbody>
                  <tr class="clickable" v-for="game in ongoingGames" v-bind:key="game._id" @click="openGame(game)">
                    <td>{{game.name}}</td> 
                    <td>{{game.generation}}</td>
                    <td v-for="player in [1,2,3,4]" v-bind:key="player">
                      <font-awesome-icon icon="user" v-show="game.player_id && game.player_colour == game[`player${player}`].colour" />
                      {{game[`player${player}`].colour}}
                      <span style="font-size: 0.7em;" v-show="game[`player${player}`].points"> ({{game[`player${player}`].points}})</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Jogos terminados </h3>
              <table class="table table-sm table-stripped table-hover">
                <thead class="thead-dark">
                  <tr>
                    <th style="min-width: 100px;">Nome</th>  
                    <th>Gen</th>
                    <th>Jog 1</th>
                    <th>Jog 2</th>
                    <th>Jog 3</th>
                    <th>Jog 4</th> 
                  </tr>
                </thead> 
                <tbody>
                  <tr class="clickable" v-for="game in finishedGames" v-bind:key="game._id" @click="openGame(game)">
                    <td>{{game.name}}</td> 
                    <td>{{game.generation}}</td>
                    <td v-for="player in [1,2,3,4]" v-bind:key="player">
                      <font-awesome-icon icon="user" v-show="game.player_id && game.player_colour == game[`player${player}`].colour"/>
                      {{game[`player${player}`].name}} 
                      <span style="font-size: 0.7em;" v-show="game[`player${player}`].score"> ({{game[`player${player}`].score}})</span>
                      - 
                      {{game[`player${player}`].colour}}
                      <span style="font-size: 0.7em;" v-show="game[`player${player}`].points"> ({{game[`player${player}`].points}})</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="btn btn-sm btn-secondary">Ronda 1</button>&nbsp;
            </div>
          </div>
          
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import LeagueService from "../services/league.service";
import util from '../util';

export default {
  name: "League",
  data() {
    return {
      loading: true,
      leaguesList: [],
      selectedLeague: {},
      league: {},
      showInfo: false,
      playersDetail: false,
    };
  },
  computed: {
    sortedLeaguePlayers() {
      if(this.league && this.league.players)
        return [...this.league.players].sort((a,b) => { return b.points - a.points; });
      else 
        return [];
    },
    currentUser() {
      //return this.$store.state.auth.user;
      return false;
    },
    signedIn (){
      //return this.currentUser && this.league && this.league.status == 'created' && this.league.players && this.league.players.find(p => p.user_id == this.currentUser.user_id);
    
      return false;},
    ongoingGames(){
      if(this.league && this.league.games)
        return this.league.games.filter(g => g.round_id == this.league.round_id && g.status != 'end');
      else 
        return [];
    },
    finishedGames(){
      if(this.league && this.league.games)
        return this.league.games.filter(g => g.status == 'end');
      else 
        return [];
    }
  },
  created() {
    this.refreshPage();
  },
  methods: {
    async refreshPage() {
      if(this.selectedLeague._id){
        this.loading = true;
        let response = await LeagueService.getLeagueInfo(this.selectedLeague._id)
        this.league = response.data;
        this.loading = false;
      } else {
        let allLeagues = await LeagueService.getAllLeagues();
        this.leaguesList = allLeagues.data;
        //by default the selected is either the created one or the running one (only 1 of those at any time)
        console.log(this.leaguesList);  
        console.log(this.leaguesList.find(x => x.status == 'created' || x.status == 'running'));  
        this.selectedLeague = this.leaguesList.find(x => x.status == 'created' || x.status == 'running');
        if(!this.selectedLeague) 
          this.selectedLeague = this.leaguesList.max(x => x.season);


        let leagueData = await LeagueService.getLeagueInfo(this.selectedLeague._id);
        this.league = leagueData.data;
        this.loading = false;
        
      }      
    },
    showDetails() {
      this.playersDetail = !this.playersDetail;
    },
    joinLeague(){
      LeagueService.joinCurrentLeague(this.currentUser.user_id).then(() => this.refreshPage());
    },
    leaveLeague(){
      LeagueService.leaveCurrentLeague(this.currentUser.user_id).then(() => this.refreshPage());
    },
    winner(game, player){
      let points;
      [1,2,3,4].forEach(p => {
        if(!points && game[`player${player}`].user_id == game[`player${p}`].user_id && game.status == 'end')
          points = game[`player${p}`].points;
      });
      return false;
    },
    openGame(game){ 
      let url = game.player_id ? `/player?id=${game.player_id}` : `/spectator?id=${game.spectator}`;
      let g_url = new URL(game.url); 
      window.open(g_url.origin + url, '_blank');
    },
    deltaToNow: util.deltaToNow,
  }
};
</script>

<style scoped>
  .table{
    font-size: 12px
  } 

  .highlight {
    font-weight: bold;
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

  .link {
    color: #0d6efd;
    cursor: pointer;
  }
</style>