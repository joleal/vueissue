<template>
 <div class="container">
    <h3>Criar Jogo</h3>
    <Form @submit="createGame" class="row g-3">
      <div class="col-md-12">
        <label for="name" class="form-label">Nome</label>
        <input type="text" class="form-control" id="name" v-model="form.name">
      </div>
      <div class="col-md-4">
        <label for="inputPlayers" class="form-label">N. Jogadores</label>
        <select id="inputPlayers" class="form-select" v-model="form.players">
          <option>2</option>
          <option>3</option>
          <option selected>4</option>
          <option>5</option>
          <option>6</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="inputMap" class="form-label">Mapa</label>
        <select id="inputMap" class="form-select" v-model="form.map">
          <option selected>Random All</option>
          <option>Random Official</option>
          <option>Tharsis</option>
          <option>Hellas</option>
          <option>Elysium</option>
          <option>Amazonis</option>
          <option>Arabia Terra</option>
          <option>V.Borealis</option>
          <option>Terra Cimmeria</option>
        </select>
      </div>
      <div class="col-md-12">
        <h4>Expansões</h4>
      </div>
      <div class="col-md-12">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cbPrelude" v-model="form.prelude">
          <label class="form-check-label" for="cbPrelude">Prelude</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cbVenus" v-model="form.venus">
          <label class="form-check-label" for="cbVenus">Venus</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cbColonies" v-model="form.colonies">
          <label class="form-check-label" for="cbColonies">Colonias</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cbTurmoil" v-model="form.turmoil">
          <label class="form-check-label" for="cbTurmoil">Turmoil</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cbTurmoilA" v-model="form.turmoilA">
          <label class="form-check-label" for="cbTurmoilA">Turmoil Agendas</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="cbAnonSwitch" v-model="form.anon">
          <label class="form-check-label" for="cbAnonSwitch">Anonimo</label>
        </div>
      </div>
      <div class="col-12" v-show="!form.anon">
        <h4>Côr</h4>
        <ColourPicker :colours="colours" :value="form.colour" @update:value="form.colour = $event" />
      </div>
      <div class="col-12">
        <button class="btn btn-primary btn-block" :disabled="loading">
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          <span>Save</span>
        </button>
      </div>
    </Form>
    
    <div
      v-if="message"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { Form } from "vee-validate";
import TMService from "../services/tm.service";
import ColourPicker from "./ui/ColourPicker.vue";

export default {
  name: "New",
  components: {
    Form,
    ColourPicker
  },
  data() {
    return {
      loading: false,
      message: "",
      form:{ players: 4, map: "Random All", colour: this.$store.state.auth.user.favouriteColour || 'red'},
      colours: ['red','yellow','blue','green','pink','orange','purple','black']
    };
  },
  methods: {
    createGame() {

      let options = {
        "anon": this.form.anon,
        "venus": this.form.venus,
        "turmoil": this.form.turmoil,
        "colonies": this.form.colonies,
        "turmoilA": this.form.turmoilA,
        "prelude": this.form.prelude,
        "map": this.form.map,
        "tiles": false,
        "name": this.form.name,
        "numPlayers": this.form.players,
        "league_id": 0
      };

      let player = {user_id: this.$store.state.auth.user.user_id, colour: this.form.colour}

      TMService.createGame(undefined, options, [player]).then(() => {
        this.$router.push("/home");
      }),
      (error) => {
        this.loading = false;
        this.message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      };
    }
  },
};
</script>