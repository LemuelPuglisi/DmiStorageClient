<template>    
    <div class="AdminPanel">

        <div class="row">

            <!-- Dropdown Trigger -->
            <a class='dropdown-trigger' href='#!' :data-target="generate()">
                <i class="material-icons">more_vert</i>
            </a>

            
        

        </div>

            <!-- Dropdown Structure -->
            <ul :id="generate()" class='dropdown-content'>
                <li><a href="#!">Update</a></li>
                <div class="divider"></div>
                <li><a href="#!" class="red-text">Delete</a></li>
            </ul>

    </div>
</template>

<script>
import SelectElement    from "@/components/requests/SelectElement"
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";

const CoursesRepo = RepoFactory.get('courses')

export default {
    name: "AdminPanel", 
    mixins: [
        errorMixin
    ], 
    components: {
        SelectElement
    }, 
    data: function() {
        return {
            courses: null, 
            currentValue: 0, 

            mocks: [
                {id:1, name:'mock1'}, 
                {id:2, name:'mock2'}, 
                {id:3, name:'mock3'}, 
                {id:4, name:'mock4'}, 
            ]
        }
    }, 
    methods: {

        fetchCourses: function() {
            CoursesRepo.get()
            .then(result => this.courses = result.data)
            .catch(error => this.showError(error))
        }, 

        generate: function() {
            return 'dropdown1'; 
        }

    }, 
    created: function() {
        this.fetchCourses();
    },
    mounted: function() {
        let drops = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(drops)
    } 
}
</script>

<style scoped>

</style>