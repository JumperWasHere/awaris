<script>
import ApiService from "@/services/api.service";
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
    this.searchDate = moment().format("YYYY-MM-DD");
    this.getWasiats();
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toHumanDate: function (value) {
      return moment(value, "YYYY-MM-DD").format("D MMMM, YYYY");
    },
  },
  data() {
    return {
      searchDate: null,
      organizationType: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
      wasiats: [],
    };
  },
  components: {
    Navbar,
    Footer,

    ArrowUpIcon,
  },
  methods: {
    getWasiats() {
      console.log("Search Date", this.searchDate);
      if (!this.searchDate) {
        this.$notify({
          group: "full-noti",
          title: "Sila pilih tarikh terlebih dahulu.",
          duration: 5000,
          type: "success",
        });
        return;
      }
      var query = new URLSearchParams({
        created_at_date: this.searchDate,
        load_with: "agent,user,organization,branch",
        organization_id: this.organizationId,
        branch_id: this.branchId,
        limit: this.pagination.perPage,
        page: this.pagination.currentPage,
      }).toString();
      ApiService.get(`wasiat?${query}`).then((response) => {
        this.wasiats = response.data.wasiats.data;
        this.pagination.totalRows = response.data.wasiats.total;
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getWasiats();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getWasiats();
    },
  },
  computed: {
    ...mapGetters(["userRole", "userAccess"]),
    organizationId() {
      if (["Admin", "Super Admin"].includes(this.userRole)) {
        return this.userAccess.organization_id;
      } else {
        return "";
      }
    },
    branchId() {
      if (["Admin"].includes(this.userRole)) {
        return this.userAccess.accessible_id;
      } else {
        return "";
      }
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
                Laporan Harian
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
          <h5 class="text-center">LAPORAN HARIAN</h5>
          <h6 class="text-center">{{ searchDate | toHumanDate }}</h6>
          <div class="row mt-4">
            <div class="col-12 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label"
                  >Tarikh</label
                >
                <div class="col-md-6 col-lg-4">
                  <input
                    type="date"
                    v-model="searchDate"
                    class="form-control"
                    @change="getWasiats"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-4">
            <div
              class="col-lg-8 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <label>Bilangan Wasiat: {{ pagination.totalRows }} </label>
                </div>
              </div>
            </div>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-2">
            <table class="table mb-0 table-center" style="font-size: 12px">
              <thead class="bg-light">
                <tr>
                  <th>Bil.</th>
                  <th>No. Wasiat</th>
                  <th>Tarikh Wasiat</th>
                  <th>Nama Pewasiat</th>
                  <th>No. MyKad Pewasiat</th>
                  <th>Rakan Niaga</th>
                  <th>Cawangan</th>
                  <th>Nama Ejen</th>
                  <th>Harga Wasiat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="9"></td>
                </tr>
                <tr v-for="(wasiat, index) in wasiats" :key="index">
                  <td>
                    {{
                      (pagination.currentPage - 1) * pagination.perPage +
                      index +
                      1
                    }}
                  </td>
                  <td>{{ wasiat.wasiat_no }}</td>
                  <td>{{ wasiat.created_at | formatDateTime }}</td>
                  <td>{{ wasiat.user.name }}</td>
                  <td>{{ wasiat.user.ic_number }}</td>
                  <td>
                    {{ wasiat.organization ? wasiat.organization.name : "-" }}
                  </td>
                  <td>
                    {{ wasiat.branch ? wasiat.branch.name : "-" }}
                  </td>
                  <td>{{ wasiat.agent ? wasiat.agent.name : "-" }}</td>
                  <td>RM {{ wasiat.price }}</td>
                </tr>
                <tr v-if="wasiats.length == 0">
                  <td colspan="9" class="text-center">
                    <h6 class="mt-5 mb-5">Tiada wasiat ditemui</h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-md-8">
              <b-pagination
                v-model="pagination.currentPage"
                :total-rows="pagination.totalRows"
                :per-page="pagination.perPage"
                @change="pageClicks"
                aria-controls="my-table"
              ></b-pagination>
            </div>
            <div class="col-md-4">
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <select
                    v-model="pagination.perPage"
                    class="form-control custom-select"
                    id="Sortbylist-job"
                    @change="changePerPage()"
                  >
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
    </section>
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
