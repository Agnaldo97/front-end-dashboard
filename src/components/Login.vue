<template>
  <div class="authentication-wrapper authentication-2 ui-bg-cover ui-bg-overlay-container px-4" :style="`background-image: url('${publicUrl}img/bg/1.jpg');`">
    <notifications group="notifications-default" />
    <div class="ui-bg-overlay bg-dark opacity-25"></div>

    <div class="authentication-inner py-5">
      <b-card no-body class="login-box">
        <div class="p-4 p-sm-5">
          <div class="d-flex justify-content-center align-items-center pb-2 mb-1">
            <div>
              <div class="w-100 position-relative">
                <img src="https://www.rededorsaoluiz.com.br/assets/imgs/svg/logo-rededor-saoluiz.svg"/>
              </div>
            </div>
          </div>

          <form>
            <b-form-group label="Usuário">
              <b-input v-model="credentials.email" />
            </b-form-group>
            <b-form-group>
              <div slot="label" class="d-flex justify-content-between align-items-end">
                <div>Senha</div>
              </div>
              <b-input type="password" v-model="credentials.password" />
            </b-form-group>

            <div class="d-flex align-items-center m-0" style="justify-content: center;">
              <b-btn id="btn-login" @click="auth()" variant="primary">
                <div v-if="isLoading">
                  <b-spinner />
                  <span class="sr-only">Entrando...</span>
                </div>
                <div v-if="!isLoading">
                  Entrar
                </div>
              </b-btn>
            </div>
          </form>
        </div>
        <!-- <b-card-footer class="py-3 px-4 px-sm-5">
        </b-card-footer> -->
      </b-card>

    </div>
  </div>
</template>

<!-- Page -->
<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
.login-box {
  background-color: #003f89;
}
#btn-login {
  background-color: white;
  color: #003f89;
}
#__BVID__7 {
  color: white !important;
}
#__BVID__9 {
  color: white !important;
}
</style>
<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import axios from 'axios'

Vue.use(Notifications)

export default {
  name: 'pages-authentication-login-v2',
  metaInfo: {
    title: 'Login'
  },
  data: () => ({
    credentials: {
      email: '',
      password: ''
    },
    isLoading: false
  }),
  methods: {
    async auth () {
      this.isLoading = true
      // this.$notify({
      //   group: 'notifications-default',
      //   title: 'Important message',
      //   text: 'Hello user! This is a custom notification!'
      // })
      const { data } = await axios.post(`public/authenticate`, {
        email: this.credentials.email,
        password: this.credentials.password
      })
      try {
        if (data.user) {
          localStorage.setItem('active-user', JSON.stringify(data.user))
          localStorage.setItem('access-token', data.user.accessToken)
          this.$router.push('/')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
