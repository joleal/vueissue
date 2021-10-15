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
        </div>
      </div>
    </nav>

    
    <router-view />
    
  </div>
</template>

<script>
export default {
  
};
</script>

<style scoped>
  
</style>