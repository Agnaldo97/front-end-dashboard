<template>
  <b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">
    <b-navbar-brand to="/">
      <img src="https://www.rededorsaoluiz.com.br/assets/imgs/svg/logo-rededor-saoluiz.svg"/>
    </b-navbar-brand>

    <b-navbar-nav class="align-items-lg-center mr-auto mr-lg-4" v-if="sidenavToggle">
      <a class="nav-item nav-link px-0 ml-2 ml-lg-0" href="javascript:void(0)" @click="toggleSidenav">
        <i class="ion ion-md-menu text-large align-middle" />
      </a>
    </b-navbar-nav>
    <b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>
    <b-collapse is-nav id="app-layout-navbar">
    </b-collapse>
    <i style="color: white;" id="icon-exit" @click="logout()" class="ion ion-md-exit"></i>
  </b-navbar>
</template>

<style lang="scss" scoped>
#icon-exit {
  cursor: pointer;
}
.navbar {
  background-color: #003f89 !important;
}
.navbar-brand {
  text-align: center;
  padding-top: 0px;
  padding-bottom: 0px;

  img {
    width: 65%;
  }
}
</style>
<script>
export default {
  name: 'app-layout-navbar',

  props: {
    sidenavToggle: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },

    getLayoutNavbarBg () {
      return this.layoutNavbarBg
    },
    logout () {
      localStorage.removeItem('active-user')
      localStorage.removeItem('access-token')
      this.$router.push('/login')
    }
  }
}
</script>
