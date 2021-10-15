<template>
    <div class="colour-row">
        <div v-for="colour in colours" v-bind:key="colour">
            <input type="radio" name="playerColour" :id="`radioBox${colour}`" @change="$emit('update:value', colour)" :checked="value == colour" >
            <label :for="`radioBox${colour}`">
                <div :class="`colourbox colour-${colour}`"></div>    
            </label>
        </div>
    </div>
</template> 

<script>
export default {
  name: "ColourPicker",
  props: ["colours", "value"],
  emits: ["update:value"]
};
</script>

<style scoped>
    input[type="radio"] {
        opacity: 0;
        position: fixed;
        width: 0;
    }

    input[type="radio"]:checked + label {
        background-color: rgba(0, 0, 0, 0.3);
    }

    label {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        text-align: center;
        vertical-align: middle;
        padding: 4px 6px;
        margin: 0px 0px;
        cursor: pointer;
    }
    .colour-row {
        display: flex;
        flex-flow: row nowrap;
    }
    .colourbox {
        width: 24px;
        height: 24px;
        border-radius: 5px;
        display: inline-block;
        text-align: center;
        vertical-align: text-top;
    }

    .colour-red {
        background-color: #991100;
    }

    .colour-green {
        background-color: #009900;;
    }

    .colour-yellow {
        background-color: #aaaa00;
    }

    .colour-blue {
        background-color: #0066ff;
    }

    .colour-black {
        background-color: #aaaaaa;
    }

    .colour-purple {
        background-color: #8c00ff;
    }

    .colour-orange {
        background-color: #ec710c;
    }

    .colour-pink {
        background-color: #f574bb;
    }

</style>