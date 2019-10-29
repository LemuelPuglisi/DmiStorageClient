<template>
    <div class="col s6 m4 center align">        
        <div class="card z-depth-2 hvr-underline-reveal clickable" @click="goToCourse()">
            <div class="card-image center align">
                <i id="icon-layer" :class="getClass">school</i>
                <span class="new badge border" data-badge-caption="anno">{{ course.year }}</span>
                <div class="divider"></div>
            </div>
            <div class="card-content center align">
                <b :class="[needTruncate ? 'truncate' : '']">
                    {{course.name}}
                </b>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseItem", 
    props: [
        "course"
    ],
    computed: {

        getClass: function() {
            return 'material-icons medium course-icon ' + this.backgrounds[this.course.year - 1]
        }, 

        needTruncate: function() {
            let words = this.course.name.split(" ");
            for(let i = 0; i < words.length; i++) {
                if (words[i].length > 12) {
                    return true
                }
            }
            return false 
        }

    },
    data: function() {
        return {
            backgrounds: [
                'teal-text text-darken-3', 
                'green-text text-lighten-2', 
                'deep-orange-text text-lighten-2', 
                'deep-orange-text text-darken-4', 
                'grey-text text-darken-4'       
            ]
        }
    },
    methods: {

        goToCourse: function() {
            this.$router.push({path: "course/" + this.course.id})
        }
    
    }
}
</script>

<style scoped>

    .card {
        width: 80% !important; 
    }

    @media screen and (max-width: 600px) {
        .card {
            width: 95% !important; 
        }
    } 

    .card-content {
        min-height: 90px !important; 
    }

    @media screen and (max-width: 600px) {
        .card-content {
            height: 120px;
        }
    }

    .course-icon {
        margin-top: 10px; 
    }

    .border {
        margin: 4px; 
    }

    .clickable {
        cursor: pointer;
    }

</style>