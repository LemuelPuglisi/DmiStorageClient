<template>
  <div class="cloud container">

    <div class="row">
        <div class="col s12">
            <div class="row">
                <div class="input-field col s12">
                    <i class="material-icons prefix">search</i>
                    <input type="text" v-model="filter" id="autocomplete-input" class="autocomplete">
                    <label for="autocomplete-input">Cerca tra i corsi</label>
                    <small class="filter-display" v-if="filter != ''">Filtro: {{filter}}</small>
                </div>
            </div>
        </div>
    </div>

    <div v-if="courses != null">        
        <div class="row">
            <CourseItem v-for="course in filteredCourses" :key="course.id" v-bind:course="course"></CourseItem>
        </div>
    </div>

    <div v-else class="valign center align">
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";
import CourseItem       from "@/components/main/CourseItem"; 

const CoursesRepo = RepoFactory.get("courses");

export default {
    name: "CloudRender",
    data: function() {
        return {
            courses: null, 
            filter: '', 
        };
    },
    mixins: [
        errorMixin
    ], 
    components: {
        CourseItem, 
    }, 
    computed: {

        filteredCourses: function() {
            if (this.courses == null) return null
            if (this.filter == '') return this.courses
            return this.courses.filter( course => {
                return  course.name.toLowerCase().includes(this.filter.toLowerCase())
            });
        }

    },
    methods: {
        
        fetchCourses: function() {
            CoursesRepo.get()
            .then(result => {
                this.courses = result.data;
            })
            .catch(error => {
                this.handleError(error);
            });
        }, 

        fillAutocomplete: function() {
            let suggestions = document.getElementById('autocomplete-input')
            let data = {}
            this.courses.forEach(course => {data[course.name] = null});
            let instance = M.Autocomplete.getInstance(suggestions); 
            instance.updateData(data);
        }, 

    },
    created: function() {
        this.fetchCourses()
        document.addEventListener('DOMContentLoaded', function() {
            let options = {onAutocomplete: function() {
                let searchBar = document.getElementById('autocomplete-input')
                this.filter = searchBar.value
                searchBar.dispatchEvent(new Event('input'))
            }}
            let elems = document.querySelectorAll('.autocomplete');
            M.Autocomplete.init(elems, options);
        });
    }

};
</script>

<style scoped>

    .container {
        max-width: 100% !important;
        width: 90% !important; 
    }

    .valign {
        margin-top: 20%;
        padding-bottom: 25%;  
    }

    .cloud {
        margin-top: 20px; 
        background-color: white; 
    }

    .filter-display {
        margin-left: 20px; 
        color: grey; 
    }

</style>