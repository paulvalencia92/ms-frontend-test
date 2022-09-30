<template>
  <b-container>

    <div class="text-end">
      <router-link class="btn btn-primary" :to="{name: 'InvoiceGenerate'}">Generar factura</router-link>
    </div>

    <b-table
        v-if="invoices.length"
        class="mt-5"
        :fields="fields"
        :items="invoices"
        striped hover responsive bordered>
      <template v-slot:cell(actions)="data">
        <ItemActions :invoice="data.item"/>
      </template>
    </b-table>

    <b-alert v-else show variant="warning" class="mt-4">
      No hay facturas generadas
    </b-alert>

  </b-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import ItemActions from './ItemActions'

export default {
  name: "List",
  created() {
    this.getInvoices();
  },
  components: {
    ItemActions
  },
  data() {
    return {
      fields: [
        {key: 'number', label: 'Número de factura'},
        {key: 'sender.name', label: 'Generada por'},
        {key: 'sender.nit', label: 'Nit'},
        {key: 'receiver.name', label: 'Comprador'},
        {key: 'receiver.nit', label: 'Nit'},
        {key: 'total', label: 'Valor antes de IVA'},
        {key: 'iva', label: 'IVA'},
        {key: 'totalInvoice', label: 'Valor a pagar'},
        {key: 'actions', label: 'Acciónes'},
      ],
    }
  },
  methods: {
    ...mapActions('invoiceModule', ['getInvoices']),
  },
  computed: {
    ...mapState('invoiceModule', ['invoices'])
  }
}
</script>

<style scoped>

</style>
