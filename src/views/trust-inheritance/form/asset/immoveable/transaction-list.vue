<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { required } from "vuelidate/lib/validators";
export default {
  name: "HibahPartA",
  data() {
    return {
      property: {},
      productTransactions: [],
      form: {},
      submit: false,
    };
  },
  validations: {},
  mounted() {
    this.getImmoveableProperty();
    this.getProductTransactions();
  },
  methods: {
    getImmoveableProperty() {
      ApiService.get(`immoveable-property/${this.propertyId}`).then(
        (response) => {
          this.property = response.data.immoveable_property ?? {};
        }
      );
    },
    getProductTransactions() {
      ApiService.get(
        `immoveable-property/${this.propertyId}/product-transaction`
      ).then((response) => {
        this.productTransactions =
          response.data.product_transactions.data ?? [];
      });
    },
    openModalTransaction() {
      this.$v.$reset();
      this.form.type = null;
      this.form.amount = null;
      this.form.balance_before = null;
      this.form.balance_after = null;
      this.form.description = null;

      this.$refs["modalAddTransaction"].show();
    },
    hideModal() {
      this.$refs["modalAddTransaction"].hide();
    },
    deleteProductTransaction(transactionId, index) {
      ApiService.post(`product-transaction/${transactionId}`, {
        _method: "DELETE",
      }).then((response) => {
        this.getProductTransactions();
      });
    },
    async submitForm() {
      ApiService.post(
        `immoveable-property/${this.propertyId}/product-transaction`,
        this.form
      ).then((response) => {
        this.getProductTransactions();
      });
    },
  },
  computed: {
    hibahId() {
      return this.$route.query.hibah_id;
    },
    propertyId() {
      return this.$route.query.property_id;
    },
  },
  components: { TheMask },
  filters: {
    fullAddress: function (value) {
      if (value) {
        return String(value.lot_number ? value.lot_number.concat(", ") : "")
          .concat(String(value.address ? value.address.concat(", ") : ""))
          .concat(String(value.district ? value.district.concat(", ") : ""))
          .concat(String(value.city ? value.city.concat(", ") : ""))
          .concat(String(value.state ? value.state.concat(". ") : ""));
      }
      return "-";
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-md-12">
        <router-link
          class="d-flex align-items-center"
          :to="{
            name: 'trust-inheritance.property.immoveable',
            query: {
              hibah_id: hibahId,
            },
          }"
        >
          <img src="/images/icon/left-arrow.png" height="20" alt="" />
          <p
            class="m-0"
            style="padding-left: 10px; padding-top: 2px; display: inline-block"
          >
            Kembali ke Harta Tidak Alih
          </p>
        </router-link>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2 mt-3">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">Maklumat Transaksi Harta</h5>
            <div>
              <div class="row">
                <div class="col-md-12">
                  <div class="pl-3 pr-3 mt-2">
                    <strong>
                      <router-link
                        :to="{
                          name: 'trust-inheritance.immoveable-property.details',
                          query: { hibah_id: hibahId },
                        }"
                      >
                        {{ property.category }}
                      </router-link>
                    </strong>
                    <div class="row pl-3">
                      <div class="col-md-6">
                        <strong>{{ $t("property-type") }}</strong
                        >:
                        {{ property.property_type }}
                      </div>
                      <div class="col-md-6">
                        <strong>{{ $t("property-no") }}</strong
                        >:
                        {{ property.property_no }}
                      </div>
                      <div class="col-md-6">
                        <strong> {{ $t("address") }}</strong
                        >:
                        {{ property | fullAddress }}
                      </div>
                    </div>
                    <div class="text-right">
                      <b-button
                        @click="openModalTransaction"
                        class="btn btn-primary btn-sm"
                      >
                        Tambah Transaksi
                      </b-button>
                    </div>
                    <div class="table-responsive pl-3 mt-3 mb-4">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Jenis</th>
                            <th>Jumlah</th>
                            <th>Jumlah Semasa</th>
                            <th>Jumlah Selepas</th>
                            <th>Deskripsi</th>
                            <th>Tindakan</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(transaction, index) in productTransactions"
                            :key="index"
                          >
                            <td>{{ index + 1 }}</td>
                            <td>
                              {{ transaction.type == 1 ? "Debit" : "Credit" }}
                            </td>
                            <td>RM {{ transaction.amount }}</td>
                            <td>RM {{ transaction.balance_before }}</td>
                            <td>RM {{ transaction.balance_after }}</td>
                            <td>{{ transaction.description }}</td>
                            <td>
                              <b-button
                                @click="
                                  deleteProductTransaction(
                                    transaction.id,
                                    index
                                  )
                                "
                                class="btn-sm btn-danger"
                              >
                                {{ $t("remove") }}
                              </b-button>
                            </td>
                          </tr>
                          <tr v-if="productTransactions.length == 0">
                            <td colspan="7" class="text-center">
                              <h6 class="mt-3 mb-3">Tiada Transaksi</h6>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      :no-enforce-focus="true"
      title="Tambah Transaksi"
      ref="modalAddTransaction"
      class="modal fade"
      v-bind:ok-title="$t('add')"
      v-bind:cancel-title="$t('cancel')"
      @ok="submitForm"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="type">Jenis</label>
              <span class="text-danger">*</span>
              <select name="" id="" class="form-control" v-model="form.type">
                <option value="">- Pilih Jenis -</option>
                <option value="1">Debit</option>
                <option value="2">Credit</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="total">Jumlah</label>
              <span class="text-danger">*</span>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">RM</span>
                </div>
                <input type="text" class="form-control" v-model="form.amount" />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="current_total">Jumlah Semasa</label>
              <span class="text-danger">*</span>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">RM</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.balance_before"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="total_after">Jumlah Selepas</label>
              <span class="text-danger">*</span>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">RM</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.balance_after"
                />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <span class="text-danger">*</span>
              <textarea
                v-uppercase
                class="form-control"
                v-model="form.description"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
