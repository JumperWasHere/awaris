<script>
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      form: {},
    };
  },
  methods: {
    openModal() {
      this.$refs["modal"].toggle();
    },
    async submitForm() {
      await this.addFundTransfer();
      this.$parent.getFundTransferList();
    },
    async addFundTransfer() {
      this.form.fund_transferred_at =
        this.form.fund_transferred_at_date +
        " " +
        this.form.fund_transferred_at_time;
      return await ApiService.post(`ez-qurban/fund-transfer`, this.form);
    },
  },
};
</script>


<template>
  <div>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Pindah Dana"
      ok-title="Simpan"
      cancel-title="Batal"
      @ok="submitForm"
    >
      <div class="form-group">
        <label for="">Pindahan Dana untuk Transaksi Bertarikh</label>
        <input
          type="date"
          name=""
          id=""
          class="form-control"
          v-model="form.fund_for_transaction_date"
        />
      </div>
      <div class="form-group">
        <label for="">Dana Dipindahkan Pada</label>
        <div class="row">
          <div class="col-md-6">
            <input
              type="date"
              name=""
              id=""
              class="form-control"
              v-model="form.fund_transferred_at_date"
            />
          </div>
          <div class="col-md-6">
            <input
              type="time"
              name=""
              id=""
              class="form-control"
              v-model="form.fund_transferred_at_time"
            />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="">Penerangan</label>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-control"
          v-model="form.description"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="">Jumlah</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.amount" />
        </div>
      </div>
    </b-modal>
  </div>
</template>