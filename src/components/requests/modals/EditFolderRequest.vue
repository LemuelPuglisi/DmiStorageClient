<template>
    <div class="EditFolderRequest modal" id="edit-frequest">
        <div class="modal-content">

            <div v-if="request === null">
                Nessuna richiesta da modificare
            </div>

            <div v-else>

                <h5>Modifica la tua richiesta</h5>

                <form>

                </form>


            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "EditFolderRequest", 
    props: [
        "request"
    ], 
    data: function() {
        return {
            
        }
    }, 
    methods: {

    }, 
}
</script>