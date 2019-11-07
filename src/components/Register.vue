<template>
  <div>
    <notifications group="notifications-default" />
    <b-tabs v-model="tabIndex" class="nav-tabs-top mb-4" responsive>
      <b-tab title="Usuários Cadastrados" active>
        <b-card>
          <table class="table">
            <thead>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Sexo</th>
              <th>Data de Nascimento</th>
              <th>Ações</th>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{user.id}}</td>
                <td>{{user.name}}</td>
                <td>{{user.email}}</td>
                <td>{{ user.phone | formatPhone}}</td>
                <td>{{user.gender}}</td>
                <td>{{ user.birthDate | formatDate}}</td>
                <td>
                  <b-button id="primary" @click="edit(user)" variant="primary">Editar</b-button>
                  <b-button id="primary" @click="removeUser(user)" variant="danger">Deletar</b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-card>
      </b-tab>
      <b-tab title="Novo Usuário">
        <b-card header="Usuários" header-tag="h6" class="mb-4">
          <b-form-row>
            <b-form-group label="Nome" class="col-md-3">
              <b-input
                type="text"
                v-validate="'required'"
                v-model="user.name"
                placeholder="Insira o nome"
              />
            </b-form-group>
            <b-form-group label="Telefone" class="col-md-3">
              <b-input
                type="text"
                v-validate="'required'"
                v-model="user.phone"
                placeholder="Insira o telefone"
              />
            </b-form-group>
            <b-form-group label="Sexo" class="col-md-3">
              <b-select
                value="Selecione o sexo"
                v-validate="'required'"
                v-model="user.gender"
                :options="genderOptions"
              />
            </b-form-group>
            <b-form-group label="Data de Nascimento" class="col-md-3">
              <flat-pickr :config="dateConfig" v-model="user.birthDate"></flat-pickr>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Email" class="col-md-3">
              <b-input
                type="email"
                v-validate="'required'"
                v-model="user.email"
                placeholder="Insira o email"
              />
            </b-form-group>
            <b-form-group label="Senha" class="col-md-3">
              <password
                v-model="user.password"
                v-validate="'required'"
                placeholder="Insira a senha"
                :secureLength="6"
                :badge="false"
                defaultClass="form-control"
              />
            </b-form-group>
          </b-form-row>
          <b-form-row id="btn-login-box">
            <b-button v-if="!isEditing" @click="cadaster()" variant="success">Cadastrar</b-button>
            <b-button v-if="isEditing" id="btn-login" @click="edit()" variant="primary">Salvar</b-button>
          </b-form-row>
        </b-card>
      </b-tab>
    </b-tabs>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<style>
#btn-login-box {
  display: flex;
  justify-content: center;
}

#btn-login {
  background-color: #e74424;
}
#__BVID__23 > div > div > div > div.VuePagination.row.col-md-12 > nav > ul {
  display: none;
}
</style>
<script>
import Password from "vue-password-strength-meter";
import Vue from "vue";
import flatPickr from "vue-flatpickr-component";
import Notifications from "vue-notification";
import axios from "axios";
import "flatpickr/dist/flatpickr.css";
import MaskedInput from "vue-masked-input";
import { ClientTable } from "vue-tables-2";
import moment from "moment";

Vue.use(ClientTable);
Vue.use(Notifications);
Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY");
  }
});
Vue.filter("formatPhone", function(value) {
  return value
    .replace(/[^0-9]/g, "")
    .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
});

export default {
  name: "page-2",
  metaInfo: {
    title: "Page 2"
  },
  components: {
    Password,
    flatPickr,
    MaskedInput
  },
  data: function() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        phone: "",
        birthDate: null,
        gender: null
      },
      errors: {
        phone: false
      },
      genderOptions: [
        { value: null, text: "Seleciona um gênero" },
        { value: "M", text: "Masculino" },
        { value: "F", text: "Feminino" },
        { value: "O", text: "Não especificado" }
      ],
      dateConfig: {
        altInput: true,
        dateFormat: "d/m/Y",
        altFormat: "d/m/Y"
      },
      tabIndex: 0,
      users: [],
      isEditing: false
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.users = [];
      const { data } = await axios.get("private/user");
      this.users = data.map((item, index) => {
        item["id"] = item.id;
        if (item.gender === "F") {
          item.gender = "Feminino";
        } else {
          item.gender = "Masculino";
        }
        return item;
      });
    },
    async cadaster() {
      try {
        await axios.post("private/user", this.user);
        this.getUsers();
        this.activeTab = "newUser";
        this.$notify({
          group: "notifications-default",
          title: "",
          text: "Usuário cadastrado com sucesso",
          type: "success"
        });
        this.tabIndex = 0;
      } catch (e) {
        this.$notify({
          group: "notifications-default",
          title: "",
          text: "Ocorreu um erro ao cadastrar esse usuário",
          type: "error"
        });
      }
    },
    edit(user) {
      this.tabIndex = 1;
      this.isEditing = true;
      this.user = user;
      this.user.password = "";
    },
    async removeUser(user) {
      const confirmDelete = confirm("Deseja deletar esse usuário?");
      if (confirmDelete) {
        await axios.delete(`private/user/${user.id}`);
        this.getUsers();
        this.$notify({
          group: "notifications-default",
          title: "",
          text: "Usuário deletado com sucesso",
          type: "success"
        });
      }
    },
    isFormValid() {
      const errors = [];
      if (!this.phone) {
        this.errors.phone = true;
        errors.push("phone");
      } else {
        this.errors.phone = false;
      }
      return !errors.length > 0;
    }
  }
};
</script>
