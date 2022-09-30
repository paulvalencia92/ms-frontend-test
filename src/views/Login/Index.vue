<template>
  <b-row class="d-flex justify-content-center">

    <b-col md="6" class="bg-light shadowForm p-5">


      <ValidationObserver v-slot="{ handleSubmit }">

        <b-form @submit.prevent="handleSubmit(submit)">

          <p class="lead text-center text-black">INICIO DE SESIÓN</p>

          <CardErrorValidations v-if="errorMessages.length"/>

          <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
            <b-form-group
                label="Correo electronico"
                class="mt-2">
              <b-form-input
                  type="email"
                  v-model="guestUser.email">
              </b-form-input>
            </b-form-group>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider name="password" rules="required" v-slot="{ errors }">
            <b-form-group
                label="Contraseña"
                class="mt-2">
              <b-form-input
                  type="password"
                  v-model="guestUser.password">
              </b-form-input>
            </b-form-group>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>

          <div class="text-end mt-4">
            <b-button type="submit" variant="primary">Acceder</b-button>
          </div>

        </b-form>
      </ValidationObserver>
    </b-col>
  </b-row>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import CardErrorValidations from "../../components/CardErrorValidations";

export default {
  name: "IndexLogin",
  created() {
    this.CLEAR_ERRORS();
  },
  components: {
    CardErrorValidations
  },
  data() {
    return {
      guestUser: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['CLEAR_ERRORS']),
    submit() {
      this.login(this.guestUser).then(response => {
        this.$toast.success(`Autenticación exitosa`, {position: 'top-right'})
        this.$router.push({name: 'EditProfile'})
      })
    }
  },
  computed: {
    ...mapState(['errorMessages']),
  }
}
</script>

<style scoped>
.shadowForm {
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>
