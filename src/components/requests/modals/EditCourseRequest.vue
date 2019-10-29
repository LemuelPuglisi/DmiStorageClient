<template>
    <div class="bottom-sheet modal" id="edit-crequest">
        <div class="modal-content">
            <div v-if="request === null">
                Nessuna richiesta da modificare
            </div>
            <div v-else>
                <h5>Modifica la tua richiesta</h5>
                <div class="row">
                    <form action="">
                        
                        <div class="col s12 m8">
                            <div class="input-field">
                                <textarea
                                    v-model="buffer.notes"
                                    id="course-request-text"
                                    class="materialize-textarea"
                                    data-length="400">
                                </textarea>
                                {{buffer}}
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "EditCourseRequest", 
    props: [
        "request"
    ], 
    data: function() {
        return {
            buffer: {}
        }
    }, 
    watch: {
        "request": function(nr) {
            this.buffer = Object.create(nr)
        }
    }
}
</script>