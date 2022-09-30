<template>
  <b-row class="d-flex justify-content-center">

    <b-col md="6" class="bg-light shadowForm p-5">
      <FormInvoice :payload="payload" @save="save"/>
    </b-col>
  </b-row>
</template>

<script>
import FormInvoice from "./FormInvoice";
import {mapActions} from "vuex";

export default {
  name: "Index",
  created() {
  },
  components: {
    FormInvoice
  },
  data() {
    return {
      payload: {
        receiver_id: '',
        sender_id: '',
        iva: 19,
        items: [],
        total: 0,
        totalInvoice: 0,
      },
    }
  },
  methods: {
    ...mapActions('invoiceModule', ['createInvoice']),
    save() {
      this.createInvoice(this.payload).then(status => {
        if (status == 201) {
          this.$toast.success('Factura generada', {position: 'top-right'});
          this.$router.push({name: 'Invoice'})
        }

      });
    }
  },
}
</script>

<style scoped>
.shadowForm {
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>
