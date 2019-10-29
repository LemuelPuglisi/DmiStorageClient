<template>
  <div class="RequestRender">
    <div class="cloud container">
      <AdminPanel v-if="getUserRole == 2 || getUserRole == 3"></AdminPanel>
      <UserPanel v-if="getUserRole == 1"></UserPanel>
    </div>
  </div>
</template>

<script>
import UserPanel from "@/components/requests/UserPanel";
import AdminPanel from "@/components/requests/AdminPanel";

export default {
  name: "RequestRender",
  components: {
    UserPanel,
    AdminPanel
  },
  computed: {

    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },

    getUserRole: function() {
      return this.$store.getters.getUserRole || 0;
    }

  },
  watch: {

    isLoggedIn: function(newValue) {
      if (!newValue) {
        this.$router.push({ path: "/" });
      }
    }

  }
};
</script>

<style scoped>
.cloud {
  margin-top: 20px;
  background-color: white;
}
</style>