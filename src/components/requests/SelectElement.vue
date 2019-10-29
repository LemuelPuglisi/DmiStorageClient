<template>
    <div class="input-field">
        <select id="select" v-model="value">
            <option value="" disabled selected>Seleziona {{name}}</option>
            <option v-for="item in sortedItems" :key="item.id" :value="item.id"> <span class="option-text">{{item.name}}</span> </option>
        </select>
    </div>
</template>

<script>
export default {
    name: "SelectElement",
    data: function() {
        return {
            value: null, 
        }
    }, 
    props: [
        'items', 
        'name', 
    ],
    computed: {

        sortedItems: function() {
            return this.items.sort((a,b) => {
                if (a.name < b.name) return -1
                if (a.name > b.name) return 1
                return 0
            }); 
        }, 

        valueWatcher: function() {
            return this.value
        }

    }, 
    watch: {

        valueWatcher: function(value) {
            this.$emit('updatevalue', value)
        }

    }, 
    mounted: function() {
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }  
}
</script>