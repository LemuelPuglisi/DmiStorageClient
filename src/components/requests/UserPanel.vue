<template>
  <div class="UserPanel">

    <!-- Description -->
    <div class="row">
      <div class="col s12">
        <h4>Sistema di richieste</h4>
        <p>
          Il
          <b>sistema di richieste</b> permette agli utenti di richiedere determinati permessi temporanei su corsi o cartelle esistenti.
        </p>
        <div class="divider"></div>
      </div>
    </div>

    <!-- Request list -->
    <div class="row">
      <div class="col s12">
        <RequestsList></RequestsList>
      </div>
    </div>

    <!-- Forms  -->
    <div class="row">
      <div class="col s12">
        <ul class="collapsible" id="collaps">
          <li>
            <div class="collapsible-header">
              <i class="material-icons">add_circle</i>
              Richiedi dei permessi globali sui corsi
            </div>
            <div class="collapsible-body">
              <CourseRequestForm :courses="courses"></CourseRequestForm>
            </div>
          </li>
          <li>
            <div class="collapsible-header">
              <i class="material-icons">add_circle</i>
              Richiedi dei permessi sulle cartelle
            </div>
            <div class="collapsible-body">
              <FolderRequestForm :folders="folders" :listOfCourses="folders"></FolderRequestForm>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script>
import CourseRequestForm from "@/components/requests/forms/CourseRequestForm"; 
import FolderRequestForm from "@/components/requests/forms/FolderRequestForm"; 
import SelectElement from "@/components/requests/SelectElement";
import RequestsList from "@/components/requests/RequestsList";
import { RepoFactory } from "@/repositories/RepoFactory";
import errorMixin from "@/mixins/errorMixin";

const CourseRequestRepo = RepoFactory.get("courseRequests");
const CoursesRepo = RepoFactory.get("courses");
const FoldersRepo = RepoFactory.get("folders");

export default {
  name: "UserPanel",
  mixins: [errorMixin],
  components: {
    CourseRequestForm, 
    FolderRequestForm, 
    SelectElement,
    RequestsList
  },
  computed: {
    
    userId: function() {
      return this.$store.getters.getUserId;
    },

    userToken: function() {
      return this.$store.getters.getUserToken;
    }

  },
  data: function() {
    return {
      courses: null,
      folders: null,
      selectedFolder: null,
      folderRequestReason: "", 
      folderRequestLifeSpan: 0,
      lifeSpanMin: 0,
      lifeSpanMax: 360,
      folderPermissions: {
        manage: false, 
        remove: false, 
      },
      folderSendLoading: false
    };
  },
  methods: {

    fetchAvaiblesCourses: function() {
      CoursesRepo.get()
        .then(result => {
          this.courses = result.data
        })
        .catch(error => this.showError(error));
    },

    fetchAvaiblesFolders: function() {
      FoldersRepo.get()
        .then(result => {
          this.folders = result.data
          this.folders.forEach(folder => {
            folder.name = folder.display_name
            delete folder.display_name
          });
        })
        .catch(error => this.showError(error));
    },

    getCourseFromId: function(id) {
      if (this.courses == null) return ''
      for (let i = 0; i < this.courses.length; i++) {
        if (this.courses[i].id == id) {
          return this.courses[i].name
        }
      }
      return ''; 
    }, 

  },
  created: function() {
    this.fetchAvaiblesCourses();
    this.fetchAvaiblesFolders();
  },
  mounted: function() {
    let collaps = document.getElementById("collaps");
    let tabs = document.getElementById("tabs");
    M.Collapsible.init(collaps);
    M.Tabs.init(tabs);
  }
};
</script>

<style scoped>

  .switch-text {
    color: black; 
    font-size: 15px !important; 
  }

</style>
