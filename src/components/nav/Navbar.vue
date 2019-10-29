<template>
  <div>
    <nav class="grey darken-4">
      <div class="nav-wrapper">
        <a @click="goHome()" class="brand-logo center" style="cursor: pointer">
          <i class="material-icons red-text text-lighten-1">school</i>
          <span>dmi</span>
          <span class="red-text text-lighten-1">Cloud</span>
        </a>
        <a href="#" data-target="slide-out" class="sidenav-trigger show-on-large">
          <i class="material-icons">menu</i>
        </a>
      </div>
    </nav>

    <ul id="slide-out" class="sidenav sidenav-fixed">
      
      <li>
        <div class="user-view">
          <div class="background">
            <img src="@/assets/media/sidenav-background.jpg" />
          </div>
        </div>
      </li>

      <AuthLabel></AuthLabel>
      <div class="divider"></div>

      <li>
        <router-link to="/">
          <i class="material-icons">home</i> Home
        </router-link>
      </li>
      <div class="divider"></div>

      <li>
        <a class="header">lista dei corsi:<i class="material-icons">cloud</i></a>
      </li>
      <div class="divider"></div>

      <div v-if="courses == null" class="progress">
        <div class="indeterminate"></div>
      </div>

      <ul class="collapsible" v-for="year in years" :key="year">
        <div v-if="!emptyYear(year)" class="year-container teal lighten-2 z-depth-2">
            <a class="year">corsi del {{ year }}° anno</a>
        </div>
        <CourseLabel  v-for="(course, i) in getCourseByYear(year)" 
                      :key="i" 
                      v-bind:course="course">
        </CourseLabel>
      </ul>

      <div class="spacer"></div>

    </ul>
  </div>
</template>

<script>
import { RepoFactory }  from '@/repositories/RepoFactory'
import errorMixin       from '@/mixins/errorMixin'
import CourseLabel      from '@/components/nav/CourseLabel'
import AuthLabel        from '@/components/nav/AuthLabel'

const CoursesRepo = RepoFactory.get('courses')

export default {
  name: "Navbar",
  mixins: [
    errorMixin
  ], 
  components: {
    CourseLabel, 
    AuthLabel
  }, 
  data: function() {
    return {
      courses: null, 
      years: [1, 2, 3, 4, 5]
    };
  },
  methods: {

    getCourseByYear: function(year) {
      if (this.courses == null) return this.courses; 
      return this.courses.filter( course => {
        return course.year == year; 
      });
    },

    fetchCourses: function() {
      CoursesRepo.get()
      .then(result => {
        result.data.forEach(this.fetchFolders);
        this.courses = result.data;
      })
      .catch(error => {
            this.handleError(error)
      });
    },

    fetchFolders: function(course) {
      course.folders = null;
      CoursesRepo.getFolders(course.id)
      .then(result => { 
        course.folders = result.data.content;
      })
      .catch(error => {
            this.handleError(error)
      });
    },
    
    emptyYear: function(year) {        
        if (this.courses == null) return true; 
        return this.courses.filter(course => {
          return course.year == year; 
        }).length <= 0
    }, 

    goHome: function() {
      this.$router.push({name: "cloud"})
    }
    
  },
  created: function() {
    this.fetchCourses();
  }

};
</script>

<style scoped>

  .user-view {
    height: 170px;
  }

  .hfix {
    margin-top: 75px !important;
  }

  .hfix-g {
    margin-top: 95px !important;
  }

  .year-container {
      margin: 7px;
      text-align: center; 
  }

  .year {
      padding: 4px; 
      font-size: 17px;
      font-weight: 400; 
      color: white; 
  }

  .nav-icon {
    font-size: 20px;  
  }

  .spacer {
    padding-bottom: 100px; 
  }
  
</style>