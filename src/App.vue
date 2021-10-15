<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container-fluid">
        <div class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">
              <font-awesome-icon icon="home" />
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/league" class="nav-link">
              <font-awesome-icon icon="trophy" />
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link to="/new" class="nav-link">
              <font-awesome-icon icon="plus-circle" />
            </router-link>
          </li>
        </div>

        <div v-if="!currentUser" class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/register" class="nav-link">
              <font-awesome-icon icon="user-plus" /> Sign Up
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">
              <font-awesome-icon icon="sign-in-alt" /> Login
            </router-link>
          </li>
        </div>

        <div v-if="currentUser" class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">
              <font-awesome-icon icon="user" />
            </router-link>
          </li>
        </div>
      </div>
    </nav>

    
    <router-view />
    
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ADMIN');
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
  
</style>