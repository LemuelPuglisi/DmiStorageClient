<template>
    <li>

        <div class="collapsible-header" @click="goToCourse()">
            <i class="material-icons">school</i>
            {{ course.name }}
        </div>

        <div class="collapsible-body">

            <div v-if="isDisplayable()" style="padding: 10px">
                <ul class="collapsible">
                    <li v-for="(folder, i) in course.folders" :key="i">
                        <div class="collapsible-header" @click="goToFolder(folder.id)">
                            <i class="material-icons">folder</i>{{ folder.display_name }} 
                        </div>
                    </li>
                </ul>
            </div>

            <div v-else>
                <li>
                    <div class="collapsible-header">
                      <i class="material-icons red-text">error</i>Questo corso è vuoto.
                    </div>
                </li>
            </div>

        </div>

    </li>
</template>

<script>

export default {
    
    name: "CourseLabel",
    props: [
        "course"
    ], 
    methods: {

        isDisplayable: function () {
            return this.course.folders != null && this.course.folders.length > 0; 
        }, 

        goToCourse: function () {
            this.$router.push({path:'/course/' + this.course.id})
        }, 

        goToFolder: function(id) {
            this.$router.push({path: '/folder/' + id})
        }

    }

}
</script>



