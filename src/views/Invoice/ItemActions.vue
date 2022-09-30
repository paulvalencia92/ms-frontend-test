<template>
  <div>
    <b-button class="me-2" @click="showProducts()" size="sm" variant="outline-primary">
      Productos
    </b-button>
    <b-button class="me-2" @click="editProduct()" size="sm" variant="outline-secondary">
      <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
    </b-button>
    <b-button class="me-2" @click="modalDeleteInvoice()" size="sm" variant="outline-danger">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </b-button>

    <!--============================
      MODAL LISTAR PRODUCTOS
    ==============================-->
    <b-modal ref="modal-products" hide-footer>
      <b-table :items="invoice.items" :fields="fields"/>
    </b-modal>


    <!--============================
        MODAL EDITAR PRODUCTOS
    ==============================-->
    <b-modal title="Actualizar Factura" ref="modal-edit-invoice" size="lg" hide-footer>
      <FormInvoice @save="save" :payload="invoiceDraft"/>
    </b-modal>

  </div>
</template>

<script>
import FormInvoice from "./FormInvoice";
import {mapActions} from "vuex";

export default {
  name: "ItemActions",
  props: ['invoice'],
  components: {
    FormInvoice
  },
  data() {
    return {
      fields: [
        {key: 'name', label: 'Producto'},
        {key: 'price', label: 'Valor unitario'},
        {key: 'stock', label: 'Cantidad'},
        {key: 'total', label: 'Total'},
      ],
      invoiceDraft: null
    }
  },
  methods: {
    ...mapActions('invoiceModule', ['updateInvoice', 'deleteInvoice']),
    showProducts() {
      this.$refs['modal-products'].show();

    },
    editProduct() {
      this.invoiceDraft = JSON.parse(JSON.stringify(this.invoice))
      this.$refs['modal-edit-invoice'].show();
    },
    modalDeleteInvoice() {
      this.$bvModal.msgBoxOk('Esta seguro de eliminar la factura', {
        title: '¿Eliminar?',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Eliminar',
        headerClass: 'p-2 border-bottom-0',
        footerClass: 'p-2 border-top-0',
        centered: true
      }).then(value => {
        if (!value) return;
        this.deleteInvoice(this.invoice.id);
      })
    },
    save(payload) {
      console.log(payload)
      this.updateInvoice(payload).then(respose => {
        this.$refs['modal-edit-invoice'].hide();
        this.$toast.success('Factura actualizada corrrectamente', {position: 'top-right'});
      });
    }
  }
}
</script>

<style scoped>

</style>
