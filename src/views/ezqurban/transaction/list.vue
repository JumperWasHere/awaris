<script>
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import { ArrowUpIcon } from "vue-feather-icons";
import ApiService from "@/services/api.service";
import moment from "moment";
import BillplzDetails from "./billplz-details";

export default {
  data() {
    return {
      transactions: [],
      date: null,
      endDate: null,
      status: 0,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
      total: {
        pending: 0,
        verified: 0,
        sum: 0,
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
    BillplzDetails,
  },
  mounted() {
    if (this.$route.query.date) {
      this.date = this.$route.query.date;
      this.status = this.$route.query.status;
    } else {
      this.date = moment().format("YYYY-MM-DD");
      this.endDate = moment().add(1, "day").format("YYYY-MM-DD");
    }

    this.getTransactionsList();
  },
  watch: {
    date: {
      handler: function (val) {
        this.endDate = moment(val).add(1, "day").format("YYYY-MM-DD");
      },
    },
  },
  methods: {
    getTransactionsList() {
      ApiService.get(
        `ez-qurban/transaction?start_date=${this.date}&end_date=${this.endDate}&status=${this.status}&report_verification=true`
      ).then((response) => {
        this.transactions = response.data.transactions.data;
        this.pagination.totalRows = response.data.transactions.total;
        this.total.pending = response.data.total_pending;
        this.total.verified = response.data.total_verified;
        this.total.sum = response.data.sum_pending + response.data.sum_verified;
        this.responseDate.start = response.data.dates.start;
        this.responseDate.end = response.data.dates.end;
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getTransactionsList();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getTransactionsList();
    },
    async setVerified(transaction) {
      this.$swal.fire({
        icon: "warning",
        html: "Adakah anda benar-benar yakin untuk meluluskan transaksi ini?",
        showCancelButton: true,
        focusConfirm: true,
        confirmButtonText: "Luluskan",
        cancelButtonText: "Batal",
        confirmButtonColor: "#3085d6",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          return await ApiService.post(
            `ez-qurban/transaction/${transaction.id}`,
            {
              _method: "PATCH",
              status: 1,
            }
          ).then((response) => {
            transaction.verified_at = moment();
            this.total.pending -= 1;
            this.total.verified += 1;
          });
        },
      });
    },
    search(status) {
      this.pagination.currentPage = 1;
      if (status != null) {
        this.status = status;
      }
      this.getTransactionsList();
    },
    getExcel() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/ezqurban/transaction/report/daily?start_date=${this.date}&end_date=${this.endDate}`,
        "_blank"
      );
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toHumanDate: function (value) {
      return moment(value).format("D MMMM YYYY");
    },
    toHumanDateTime: function (value) {
      if (value) {
        return moment(value).format("D MMM YY, HH:mm:ss");
      }
      return "";
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
                Transaksi EzQurban
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
                  >Tarikh Mula</label
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
            <div class="col-md-6">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Tarikh Akhir</label
                >
                <div class="col-sm-8 col-md-8">
                  <input
                    type="date"
                    class="form-control"
                    name=""
                    id=""
                    v-model="endDate"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Status</label
                >
                <div class="col-sm-8 col-md-8">
                  <select name="" id="" v-model="status" class="form-control">
                    <option value="0">Belum Disahkan</option>
                    <option value="-1">Semua</option>
                    <option value="1">Disahkan</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-12 text-right">
              <button @click="getExcel" class="btn btn-primary">
                Dapatkan Excel
              </button>
              &nbsp;
              <button @click="search(null)" class="btn btn-primary">
                Carian
              </button>
            </div>
          </div>
          <hr />

          <h5 class="text-center">Transaksi EzQurban Pada</h5>
          <h6 class="text-center">
            {{ responseDate.start | toHumanDateTime }} -
            {{ responseDate.end | toHumanDateTime }}
          </h6>
          <div class="row">
            <div class="offset-md-1 col-md-3">
              <a
                href="#"
                @click="search(1)"
                class="accounts rounded d-block shadow text-center py-3"
              >
                <h3>{{ total.verified }}</h3>
                <h6 class="title text-dark h6 my-0">Disahkan</h6></a
              >
            </div>
            <div class="col-md-3">
              <a
                href="#"
                @click="search(0)"
                class="accounts rounded d-block shadow text-center py-3"
              >
                <h3>{{ total.pending }}</h3>
                <h6 class="title text-dark h6 my-0">Belum Disahkan</h6>
              </a>
            </div>
            <div class="col-md-4">
              <a
                href="#"
                class="accounts rounded d-block shadow text-center py-3"
              >
                <h3>{{ total.sum.toFixed(2) }}</h3>
                <h6 class="title text-dark h6 my-0">Nilaian (RM)</h6></a
              >
            </div>
          </div>

          <div class="table-responsive bg-white shadow rounded mt-3">
            <table
              class="table mb-0 table-center table-bordered"
              style="font-size: 12px"
            >
              <thead class="bg-light">
                <tr>
                  <th rowspan="2">No. Ruj.</th>
                  <th colspan="2" class="text-center">Pelanggan</th>
                  <th colspan="5" class="text-center">Pembelian</th>
                  <th rowspan="2">Verifikasi</th>
                  <th rowspan="2">Tindakan</th>
                </tr>
                <tr>
                  <th>Nama</th>
                  <th>No. MyKad</th>
                  <th>Produk</th>
                  <th>Harga (RM)</th>
                  <th>Saluran</th>
                  <th>Bill ID</th>
                  <th>Tarikh/Masa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="transactions && transactions.length == 0">
                  <td class="text-center" colspan="10">
                    <h6 class="mt-5 mb-5">{{ $t("no-data") }}</h6>
                  </td>
                </tr>
                <tr v-for="(transaction, index) in transactions" :key="index">
                  <td>{{ transaction.ref_no }}</td>
                  <td>{{ transaction.client_name }}</td>
                  <td>{{ transaction.client_mykad_number }}</td>
                  <td>{{ transaction.product }}</td>
                  <td class="text-right">{{ transaction.price }}</td>
                  <td>{{ transaction.payment_channel }}</td>
                  <td>
                    <span
                      v-if="transaction.bill_id"
                      @click="$refs.modalBillplz.openModal(transaction)"
                    >
                      {{ transaction.bill_id }}
                      <img
                        src="/images/icon/check.svg"
                        alt=""
                        width="20"
                        v-if="transaction.is_billplz_verified"
                      />
                      <img
                        src="/images/icon/warning.svg"
                        alt=""
                        width="18"
                        v-if="!transaction.is_billplz_verified"
                      />
                    </span>
                  </td>
                  <td>
                    {{ transaction.product_purchased_at | toHumanDateTime }}
                  </td>
                  <td class="text-center">
                    <span
                      v-if="transaction.verified_at"
                      class="badge badge-success"
                      >Ya</span
                    >
                    <span
                      v-if="!transaction.verified_at"
                      class="badge badge-warning"
                      >Belum</span
                    >
                  </td>
                  <td class="text-center">
                    <button
                      v-if="!transaction.verified_at"
                      @click="setVerified(transaction)"
                      class="btn btn-sm btn-success"
                    >
                      Lulus
                    </button>
                  </td>
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
        <router-link
          :to="{
            name: 'ezqurban.fund-transfer.list',
            query: {
              date: this.date,
            },
          }"
          class="btn btn-primary"
          >Pindah Dana</router-link
        >
      </div>
    </section>
    <BillplzDetails ref="modalBillplz" />
    <Footer />
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
