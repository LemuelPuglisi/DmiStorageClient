<template>
    <div class="CourseRequestForm row">
        <form @submit.prevent="sendRequest()">

            <div v-if="courses != null" class="col s12 m4">
                <SelectElement 
                    :items="courses" 
                    :name="'il corso'" 
                    v-on:updatevalue="getSelected">   
                </SelectElement>
            </div>

            <div class="col s12 m8">
                <div class="input-field">
                    <textarea
                        v-model="reason"
                        id="course-request-text"
                        class="materialize-textarea"
                        data-length="400">
                    </textarea>
                    <label for="course-request-text">
                        <span class="red-text">*</span> spiega i motivi della richiesta
                    </label>
                </div>
            </div>

            <div class="col s12 m8">
                <div class="input-field">
                    <p class="range-field">
                        <input
                          type="range"
                          id="course-lifespan-slider"
                          v-model="lifespan"
                          :min="7"
                          :max="365"/>
                        <label for="course-lifespan-slider" style="font-size:15px">
                          <span class="red-text">*</span>
                          Quanti giorni vuoi trattenere il permesso? Giorni: {{lifespan}}
                        </label>
                    </p>
                </div>
            </div>

            <div class="col s12 m4">
                <div class="input-field">
                    <button
                        class="btn waves-effect btn-small waves-light"
                        :class="loading ? 'pulse' : ''"
                        type="submit"
                        name="action">
                        Invia richiesta
                        <i class="material-icons right">send</i>
                    </button>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory";
import SelectElement    from "@/components/requests/SelectElement";
import errorMixin       from "@/mixins/errorMixin";

const CourseRequestRepo = RepoFactory.get("courseRequests");

export default {
    name: "CourseRequestForm",
    props: [
        "courses"
    ],
    components: {
        SelectElement
    }, 
    mixins: [
        errorMixin
    ],
    data: function() {
        return {
            reason: "", 
            lifespan: 0,
            selected: null, 
            loading: false
        }
    }, 
    computed: {
    
        userId: function() {
            return this.$store.getters.getUserId;
        },

        userToken: function() {
            return this.$store.getters.getUserToken;
        }

    },
    methods: {

        spawnToast: function(message, error = 0) {
            let color = error == 1 ? 'red' : 'green'; 
            M.toast({ html: message, classes: color });
        },

        checkFields: function() {
            if (this.reason.replace(/\s/g, "").length < 1 ||
                this.lifespan == 0 ||
                this.selected == null) {
                    const error = "Compila tutti i campi"                
                    this.spawnToast(error, 1)
                    return false; 
            } return true; 
        }, 

        sendRequest: function() {
            if (this.checkFields()) {
                this.loading = true;
                CourseRequestRepo.store(this.userToken, {
                    courseId: this.selected,
                    notes: this.reason,
                    lifespan: this.lifespan
                })
                .then( result => {
                    this.spawnToast(result.data.message)
                    this.loading = false; 
                    this.$store.dispatch("getUserPermissions", {
                        id: this.userId, 
                        token: this.userToken
                    }).catch(error => this.showError(error))
                    this.clearFields(); 
                })
                .catch( error => {
                    this.loading = false 
                    this.showError(error)
                })
            }
        }, 

        getSelected: function(value) {
            this.selected = value; 
        }, 

        clearFields: function() {
            this.reason = "" 
            this.lifespan = 0
            this.selected = null
        }

    }, 
    mounted: function() {
        let courseTextArea = document.getElementById("course-request-text");
        let courseLifespan = document.getElementById("course-lifespan-slider");

        M.CharacterCounter.init(courseTextArea);
        M.Range.init(courseLifespan);
    }
}
</script>