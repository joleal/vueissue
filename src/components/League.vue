<template>
  <div class="container-fluid">
    <div class="row">
      <div class="row g-2">
        <header class="jumbotron">
        <h2>League</h2>
      </header>
      </div>
      <div class="row g-3">
        <div class="col-md-2">
          <table class="table table-sm table-stripped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Jogador</th>
                <th v-show="playersDetail">#1</th>
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
                <td>{{j.points}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-10">
            <div class="games">
              <h3>Games</h3>
              <table class="table table-sm table-stripped table-hover">
                <thead class="thead-dark">
                  <tr>
                    <th style="min-width: 100px;">Nome</th>  
                    <th>Gen</th>
                    <th>Icon</th>
                  </tr>
                </thead> 
                <tbody>
                  <tr v-for="game in ongoingGames" v-bind:key="game._id">
                    <td>{{game.name}}</td> 
                    <td>{{game.generation}}</td>
                    <td>
                      <font-awesome-icon icon="user" v-show="game.player_id" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import LeagueService from "../services/league.service";

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
    
    ongoingGames(){
      if(this.league && this.league.games)
        return this.league.games.filter(g => g.round_id == this.league.round_id && g.status != 'end');
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
    }
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