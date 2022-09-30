<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Información de perfil" active>
        <div>
          <b-card
              overlay
              img-src="https://picsum.photos/900/250/?image=3"
              img-alt="Card Image"
              text-variant="white"
              :title="user.name"
              sub-title="Correo electronico:">
            <b-card-text>
              {{ user.email }}
            </b-card-text>
          </b-card>
        </div>
      </b-tab>

      <b-tab title="Editar">
        <formEdit :user="JSON.parse(JSON.stringify(user))"/>
      </b-tab>

    </b-tabs>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";
import formEdit from './formEdit'

export default {
  name: "EditProfile",
  components: {
    formEdit
  },
  methods: {
    ...mapActions(['createUser'])
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped>

</style>
