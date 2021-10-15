<template>
    <div class="modal" tabindex="-1" v-if="visible">
        <div class="modal-dialog" >
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Que côr queres jogar?</h5>
                    <button type="button" class="btn-close" @click="cancel" aria-label="Close"></button>
                </div>
                <div class="modal-body"> 
                    <ColourPicker :colours="colours" :value="selectedColour" @update:value="selectedColour = $event" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-sm" @click="save">Confirmar</button>
                    <button type="button" class="btn btn-secondary btn-sm" @click="cancel">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ColourPicker from "./ColourPicker.vue";

export default {
  name: "Modal",
  components: {ColourPicker},
  props: ["joinGame", "colours", "visible"],
  emits: ["closeModal", "joinGame"],
  data() {
    return {
        selectedColour: 'red'
    };
  },
  methods:{
    save(){
        this.$emit('joinGame', this.selectedColour);
    },
    cancel(){
      this.$emit('closeModal');
    }
  },
  mounted(){
      let user = this.$store.state.auth.user;
      if(user && this.colours.includes(user.colour)){
        this.selectedColour = user.colour;
      }
  }
};
</script>

<style scoped>
  .modal {
    display: block;
  }
</style>