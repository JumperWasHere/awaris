<script>
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import { ArrowUpIcon } from "vue-feather-icons";
import ApiService from "@/services/api.service";
import moment from "moment";
// import AddFundModal from "./add-fund-modal";
import AddFundModal from "./add-fund-modal.vue";

export default {
  data() {
    return {
      transactions: [],
      fundTransfers: [],
      date: null,
      status: 0,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
      total: {
        sumPending: 0,
        sumVerified: 0,
        sumFundTransfer: 0,
      },
      responseDate: {
        start: null,
        end: null,
      },
    };
  },
  components: {
    Navbar,
    ArrowUpIcon,
    Footer,
    AddFundModal,
  },
  mounted() {
    if (this.$route.query.date) {
      this.date = this.$route.query.date;
    } else {
      this.date = moment().format("YYYY-MM-DD");
    }
    this.getTransactionsList();
    this.getFundTransferList();
  },
  methods: {
    getTransactionsList() {
      ApiService.get(
        `ez-qurban/transaction?date=${this.date}&report_verification=true&limit=1`
      ).then((response) => {
        this.transactions = response.data.transactions.data;
        this.pagination.totalRows = response.data.transactions.total;
        this.total.sumPending = response.data.sum_pending;
        this.total.sumVerified = response.data.sum_verified;
        this.responseDate.start = response.data.dates.start;
        this.responseDate.end = response.data.dates.end;

        console.log(response.data);
      });
    },
    getFundTransferList() {
      ApiService.get(
        `ez-qurban/fund-transfer?date=${this.date}&report_transfer=true`
      ).then((response) => {
        this.fundTransfers = response.data.fund_transfers.data;
        this.pagination.totalRows = response.data.fund_transfers.total;
        this.total.sumFundTransfer = response.data.sum;
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getTransactionsList();
      this.getFundTransferList();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getTransactionsList();
      this.getFundTransferList();
    },
    search(status) {
      console.log("status", status);
      this.pagination.currentPage = 1;
      if (status != null) {
        this.status = status;
      }
      this.getTransactionsList();
      this.getFundTransferList();
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toHumanDate: function (value) {
      return moment(value).format("D MMM YY");
    },
    toHumanDateTime: function (value) {
      if (value) {
        return moment(value).format("D MMM YY, HH:mm:ss");
      }
      return "";
    },
  },
  events: {
    eventName: function (data) {
      console.log("ASD");
      this.getFundTransferList();
    },
  },
};
</script>

<template>
  <div>
    <Navbar :nav-light="true" />
    <section class="bg-half bg-primary d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title text-white" style="text-transform: capitalize">
                Dana EzQurban
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div
        class="container card public-profile border-0 rounded shadow overflow-hidden"
      >
        <div class="card-body">
          <div class="row mt-5">
            <div class="col-md-6">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Tarikh</label
                >
                <div class="col-sm-8 col-md-8">
                  <input
                    type="date"
                    class="form-control"
                    name=""
                    id=""
                    v-model="date"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-12 text-right">
              <button @click="search(null)" class="btn btn-primary">
                Carian
              </button>
            </div>
          </div>
          <hr />

          <h5 class="text-center">Dana Dipindahkan EzQurban, Transaksi Pada</h5>
          <h6 class="text-center">
            {{ responseDate.start | toHumanDateTime }} -
            {{ responseDate.end | toHumanDateTime }}
          </h6>
          <div class="row">
            <div class="col-md-4">
              <a
                href="#"
                class="accounts rounded d-block shadow text-center py-3"
              >
                <h3>
                  <small style="font-size: 9pt">RM </small>
                  {{ total.sumFundTransfer.toFixed(2) }}
                </h3>
                <h6 class="title text-dark h6 my-0">Dana Dipindahkan</h6></a
              >
            </div>
            <div class="col-md-4">
              <router-link
                :to="{
                  name: 'ezqurban.transaction.list',
                  query: {
                    status: 1,
                    date: this.date,
                  },
                }"
                class="accounts rounded d-block shadow text-center py-3"
              >
                <h3>
                  <small style="font-size: 9pt">RM </small>
                  {{ total.sumVerified.toFixed(2) }}
                </h3>
                <h6 class="title text-dark h6 my-0">Transaksi Disahkan</h6>
              </router-link>
            </div>
            <div class="col-md-4">
              <router-link
                :to="{
                  name: 'ezqurban.transaction.list',
                  query: {
                    status: 0,
                    date: this.date,
                  },
                }"
                class="accounts rounded d-block shadow text-center py-3"
              >
                <h3>
                  <small style="font-size: 9pt">RM </small>
                  {{ total.sumPending.toFixed(2) }}
                </h3>
                <h6 class="title text-dark h6 my-0">
                  Transaksi Belum Disahkan
                </h6>
              </router-link>
            </div>
          </div>

          <div class="table-responsive bg-white shadow rounded mt-3">
            <table
              class="table mb-0 table-center table-bordered"
              style="font-size: 12px"
            >
              <thead class="bg-light">
                <tr>
                  <th>Bil.</th>
                  <th>Jumlah (RM)</th>
                  <th>Penerangan</th>
                  <th>Dipindahkan Pada</th>
                  <!-- <th>Untuk Transaksi</th> -->
                  <!-- <th class="text-right">Tindakan</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-if="fundTransfers && fundTransfers.length == 0">
                  <td class="text-center" colspan="6">
                    <h6 class="mt-5 mb-5">{{ $t("no-data") }}</h6>
                  </td>
                </tr>
                <tr v-for="(fund, index) in fundTransfers" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ fund.amount.toFixed(2) }}</td>
                  <td>{{ fund.description }}</td>
                  <td>{{ fund.fund_transferred_at | toHumanDateTime }}</td>
                  <!-- <td>{{ fund.fund_for_transaction_date | toHumanDate }}</td> -->
                  <!-- <td class="text-right">
                    <button class="btn btn-primary btn-sm">Lampiran</button>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-lg-9 col-md-7">
              <b-pagination
                v-model="pagination.currentPage"
                :total-rows="pagination.totalRows"
                :per-page="pagination.perPage"
                @change="pageClicks"
                aria-controls="my-table"
              ></b-pagination>
            </div>
            <div class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <select
                    v-model="pagination.perPage"
                    class="form-control custom-select"
                    id="Sortbylist-job"
                    @change="changePerPage()"
                  >
                    <option value="5">5 setiap halaman</option>
                    <option value="10">10 setiap halaman</option>
                    <option value="25">25 setiap halaman</option>
                    <option value="50">50 setiap halaman</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <button @click="$refs.addFund.openModal()" class="btn btn-primary">
          Tambah Pindah Dana
        </button>
      </div>
    </section>

    <add-fund-modal ref="addFund" />
    <Footer />
    <!-- <Switcher /> -->
    <a
      href="javascript: void(0);"
      class="btn btn-icon btn-soft-primary back-to-top"
      id="back-to-top"
      v-scroll-to="'#topnav'"
    >
      <arrow-up-icon class="icons"></arrow-up-icon>
    </a>
  </div>
</template>
