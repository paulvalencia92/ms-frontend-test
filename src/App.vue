<template>
  <div id="app">
    <div class="row main">
      <div class="col-md-2 py-4 menu">
        <ul class="menu-ul">
          <template v-if="loggedIn">
            <li>
              <router-link tag="a" :to="{name:'EditProfile'}"><i class="fa fa-user-circle" aria-hidden="true"></i> Editar perfil</router-link>
            </li>
            <li>
              <router-link tag="a" :to="{name:'Invoice'}"><i class="fa fa-id-card" aria-hidden="true"></i> Facturas</router-link>
            </li>
            <li v-if="loggedIn">
              <a @click.prevent="onsubmit()" style="cursor: pointer"><i class="fa fa-sign-out" aria-hidden="true"></i> Cerrar sesión</a>
            </li>
          </template>
        </ul>
      </div>
      <div class="col-md-10 p-5">
        <router-view/>
      </div>
    </div>

  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  methods: {
    ...mapActions(['logout']),
    onsubmit() {
      this.logout().then(response => {
        this.$toast.success(response, {position: 'top-right'})
        this.$router.push({name: 'Login'})
      })
    },
  },
  computed: {
    ...mapState(['loggedIn'])
  }
}
</script>

<style>

.main {
  height: 100vh;
  width: 100%;
}

.menu {
  background-color: #2c3e50;
  color: white;
}

.menu-ul {
  display: flex;
  height: 25%;
  flex-direction: column;
  justify-content: space-around;
}

li {
  list-style: none;
}

li a {
  color: white;
  text-decoration: none;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}


</style>
