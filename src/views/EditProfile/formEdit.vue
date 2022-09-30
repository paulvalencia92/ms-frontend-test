<template>
  <ValidationObserver v-slot="{ handleSubmit }">

    <b-form @submit.prevent="handleSubmit(submit)">

      <p class="lead text-center text-black">ACTUALIZACIÓN DE DATOS</p>

      <CardErrorValidations v-if="errorMessages.length"/>


      <ValidationProvider name="nombre" rules="required" v-slot="{ errors }">
        <b-form-group
            label="Nombre completo"
            class="mt-2">
          <b-form-input
              type="text"
              v-model="user.name">
          </b-form-input>
        </b-form-group>
        <span class="text-danger">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
        <b-form-group
            label="Correo electronico"
            class="mt-2">
          <b-form-input
              type="email"
              v-model="user.email">
          </b-form-input>
        </b-form-group>
        <span class="text-danger">{{ errors[0] }}</span>
      </ValidationProvider>

      <div class="text-end mt-4">
        <b-button type="submit" variant="primary">Actualizar</b-button>
      </div>
    </b-form>
  </ValidationObserver>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import CardErrorValidations from "../../components/CardErrorValidations";

export default {
  name: "formEdit",
  props: ['user'],
  created() {
    this.CLEAR_ERRORS();
  },
  components: {
    CardErrorValidations
  },
  methods: {
    ...mapActions(['updateUser']),
    ...mapMutations(['CLEAR_ERRORS']),
    submit() {
      this.updateUser(this.user).then(respose => {
        this.$toast.success(respose, {position: 'top-right'});
      });
    }
  },
  computed: {
    ...mapState(['errorMessages']),
  }
}
</script>

<style scoped>

</style>
