<template>
    <div class="modal" tabindex="-1" v-if="visible" @before-open="beforeOpen">
        <div class="modal-dialog" >
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Notas e info</h5>
                    <button type="button" class="btn-close" @click="cancel" aria-label="Close"></button>
                </div>
                <div class="modal-body"> 
                    <div class="mb-3">
                      <a :href='spectatorLink(game)' target="_blank">Spectator link</a><br>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="6" v-model="text"></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-sm" @click="save">Gravar</button>
                    <button type="button" class="btn btn-secondary btn-sm" @click="cancel">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import util from '../../util';

export default {
  name: "GameNotes", 
  props: ["game", "visible"],
  emits: ["closeModal", "saveNotes"],
  data() {
    return {
        text: ''
    };
  },
  methods:{
    save(){
        this.$emit('saveNotes', this.text);
    },
    cancel(){
      this.$emit('closeModal');
    },
    spectatorLink: util.spectatorLink
  },
  watch: { 
    game: function() { // watch it
      this.text = this.game.notes;
    }
  }
};
</script>

<style scoped>
  .modal {
    display: block;
  }
</style>