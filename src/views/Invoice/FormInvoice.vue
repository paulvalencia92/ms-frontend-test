<template>
  <ValidationObserver v-slot="{ handleSubmit }">

    <b-form @submit.prevent="handleSubmit(submit)">

      <CardErrorValidations v-if="errorMessages.length"/>


      <ValidationProvider name="Receptor" rules="required" v-slot="{ errors }">
        <b-form-group
            label="Receptor"
            class="mt-4">
          <b-form-select v-model="payload.receiver_id"
                         class="form-control"
                         :options="receivers"/>
        </b-form-group>
        <span class="text-danger">{{ errors[0] }}</span>
      </ValidationProvider>


      <template v-if="user.type === 'admin'">
        <ValidationProvider name="Emisor" rules="required" v-slot="{ errors }">
          <b-form-group
              label="Emisor"
              class="mt-4">
            <b-form-select v-model="payload.sender_id"
                           class="form-control"
                           :options="senders"/>
          </b-form-group>
          <span class="text-danger">{{ errors[0] }}</span>
        </ValidationProvider>
      </template>


      <b-row>

        <b-col cols="8">
          <b-form-group
              label="Productos"
              class="mt-4">
            <b-form-select v-model="tempProduct.id"
                           class="form-control"
                           :options="productsOptions"/>
          </b-form-group>
        </b-col>

        <b-col cols="4">
          <b-form-group
              label="Iva"
              class="mt-4">
            <b-form-input
                type="number"
                step=0.01
                v-model="payload.iva">
            </b-form-input>
          </b-form-group>
        </b-col>

      </b-row>


      <b-row>

        <b-col cols="4">
          <b-form-group
              label="Precio"
              class="mt-4">
            <b-form-input
                disabled
                v-model="tempProduct.price">
            </b-form-input>
          </b-form-group>
        </b-col>


        <b-col cols="2">
          <ValidationProvider name="Stock" :rules="`max_value:${currentStock}`" v-slot="{ errors }">
            <b-form-group
                :label="`Stock ${currentStock > 0 ? currentStock : 0}`"
                class="mt-4">
              <b-form-input
                  type="number"
                  v-model="tempProduct.stock">
              </b-form-input>
            </b-form-group>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>
        </b-col>


        <b-col cols="4">
          <b-form-group
              label="Total"
              class="mt-4">
            <b-form-input
                disabled
                v-model="totalItem">
            </b-form-input>
          </b-form-group>
        </b-col>

        <b-col cols="2">
          <b-form-group
              label="Agregar"
              class="mt-4">
            <b-button
                :disabled="tempProduct.stock < 1 || tempProduct.stock > currentStock"
                @click="addProductToItems"
                variant="secondary">
              <i class="fa fa-floppy-o" aria-hidden="true"></i>
            </b-button>
          </b-form-group>
        </b-col>

      </b-row>


      <b-table
          class="mt-5"
          v-if="payload.items.length"
          :fields="fields"
          :items="payload.items"
          striped hover responsive bordered>
        <template v-slot:cell(actions)="data">
          <div class="text-center">
            <b-button @click="deleteProduct(data.item.id)" size="sm" variant="danger">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </b-button>
          </div>
        </template>
      </b-table>


      <div class="text-end mt-4" v-if="totalSale > 0">

        <h4><b>Iva</b> : {{ payload.iva }} % </h4>
        <h4><b>Precio Iva:</b> {{ totalIva }}</h4>
        <h4><b>Total sin iva: </b>{{ totalSale }}</h4>
        <h2><b>TOTAL:</b> {{ totalWithIva }}</h2>
        <hr>
      </div>


      <div class="text-end mt-5">
        <b-button type="submit" variant="primary">Guardar</b-button>
      </div>

    </b-form>
  </ValidationObserver>
</template>

<script>
import {mapActions, mapMutations, mapGetters, mapState} from "vuex";
import CardErrorValidations from "../../components/CardErrorValidations";

export default {
  name: "FormInvoice",
  props: ['payload'],
  created() {
    this.productDraf = JSON.parse(JSON.stringify(this.tempProduct))
    this.CLEAR_ERRORS();
    this.getUsers();
    this.getProducts();
  },
  components: {
    CardErrorValidations
  },
  data() {
    return {
      tempProduct: {
        id: null,
        name: '',
        stock: 0,
        price: 0,
        total: 0,
      },
      productDraf: null,
      currentStock: 0,
      fields: [
        {
          key: 'name',
          label: 'Producto'
        },
        {
          key: 'stock',
          label: 'Cantidad'
        },
        {
          key: 'price',
          label: 'Precio'
        },
        {
          key: 'total',
          label: 'Total'
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      totalIva: 0,
      totalWithIva: 0,

    }
  },
  methods: {
    ...mapActions(['productModule/get']),
    ...mapActions('userModule', ['getUsers']),
    ...mapActions('productModule', ['getProducts']),
    ...mapActions('invoiceModule', ['createInvoice']),
    ...mapMutations(['CLEAR_ERRORS']),
    addProductToItems() {
      if (this.checkProductExists) {
        this.$toast.warning(`Este producto ya está agregado`, {position: 'top-right'})
        return;
      }
      this.tempProduct.total = parseFloat(this.totalItem)
      this.payload.items.push(this.tempProduct);
      this.$toast.success(`Producto agregado`, {position: 'top-right'})
      this.tempProduct = JSON.parse(JSON.stringify(this.productDraf));
      this.currentStock = 0;
      console.log(this.tempProduct)
    },
    deleteProduct(id) {
      const index = this.payload.items.findIndex(item => item.id == id);
      this.payload.items.splice(index, 1);
    },
    submit() {
      this.payload.total = this.totalSale;
      this.payload.totalInvoice = this.totalWithIva;
      this.$emit('save', this.payload);
    }
  },
  computed: {
    ...mapState(['errorMessages', 'user']),
    ...mapState('productModule', ['products']),
    ...mapGetters('userModule', ['senders', 'receivers']),
    ...mapGetters('productModule', ['productsOptions']),
    checkProductExists() {
      return this.payload.items.map(item => item.id).includes(this.tempProduct.id);
    },
    totalItem() {
      return (parseFloat(this.tempProduct.price) * parseInt(this.tempProduct.stock));
    },
    totalSale() {
      let total = 0;
      if (this.payload.items.length) {
        total = this.payload.items.reduce((accumulator, object) => {
          return accumulator + object.total
        }, 0);
        this.totalIva = (total * this.payload.iva) / 100
      }
      this.totalWithIva = this.totalIva + total;
      return total;
    }
  },
  watch: {
    'tempProduct.id': function (val) {
      if (!val) return;
      const product = this.products.find(product => product.id == val);
      this.currentStock = product.stock;
      this.tempProduct.price = product.value;
      this.tempProduct.name = product.name;
    },
    'tempProduct.stock': function (val) {
      if (!val) this.tempProduct.stock = 0;
    }
  }
}
</script>

<style scoped>
.shadowForm {
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>

<style scoped>

</style>
