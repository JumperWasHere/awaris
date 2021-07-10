
<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      transaction: {},
      billplz: null,
      isBillFound: null,
    };
  },
  computed: {
    amountNotMatch() {
      if (!this.billplz.paid) {
        return false;
      }
      var billplzAmount = this.billplz.paid_amount.amount / 100;
      return billplzAmount != this.transaction.price;
    },
  },
  methods: {
    openModal(transaction) {
      this.billplz = null;
      this.isBillFound = null;
      console.log(transaction);
      this.transaction = transaction;
      this.$refs["modal"].toggle();
      this.getBill();
    },
    getBill() {
      ApiService.get(
        `ez-qurban/transaction/${this.transaction.id}/billplz-bill`
      )
        .then((response) => {
          if (response.data.bill) {
            this.billplz = response.data.bill;
            this.isBillFound = true;
          }
        })
        .catch((error) => {
          this.isBillFound = false;
        });
    },
  },
};
</script>


<template>
  <div>
    <b-modal
      :no-enforce-focus="true"
      ok-only
      id="modal-prevent-closing"
      ref="modal"
      :title="`Perincian Transaksi Billplz: ${transaction.bill_id}`"
    >
      <div class="p-5" v-if="isBillFound === false">
        <h4 class="text-center">Bill tidak dijumpai</h4>
      </div>
      <div v-if="billplz">
        <div class="row">
          <div class="col-md-12">
            <div class="alert alert-success" v-if="billplz.paid">
              Bayaran Diterima: RM {{ billplz.paid_amount.amount / 100 }}
            </div>
            <div class="alert alert-warning" v-if="amountNotMatch">
              <strong>Bayaran Tidak Sama</strong>
              <ul>
                <li>Billplz: RM {{ billplz.paid_amount.amount / 100 }}</li>
                <li>EzQurban: RM {{ transaction.price }}</li>
              </ul>
            </div>
            <div class="alert alert-warning" v-if="!billplz.paid">
              Bayaran Belum Diterima
            </div>
          </div>
          <div class="col-md-12">
            <h4 class="text-center">{{ transaction.ref_no }}</h4>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <div class="form-group">
              <label class="m-0" for="">Collection ID</label>
              <p class="form-control-static">{{ billplz.collection_id }}</p>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="m-0" for="">Bill Description</label>
              <p class="form-control-static">{{ billplz.description }}</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6" v-if="billplz.reference_1">
            <div class="form-group">
              <label class="m-0" for=""
                >Ref. 1: {{ billplz.reference_1_label }}</label
              >
              <p class="form-control-static">{{ billplz.reference_1 }}</p>
            </div>
          </div>
          <div class="col-md-6" v-if="billplz.reference_2">
            <div class="form-group">
              <label class="m-0" for=""
                >Ref. 2: {{ billplz.reference_2_label }}</label
              >
              <p class="form-control-static">{{ billplz.reference_2 }}</p>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="m-0" for="">Nama</label>
              <p class="form-control-static">{{ billplz.name }}</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="m-0" for="">E-mel</label>
              <p class="form-control-static">{{ billplz.email }}</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="m-0" for="">No. Telefon</label>
              <p class="form-control-static">{{ billplz.mobile }}</p>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>