<script>
import { ArrowUpIcon } from "vue-feather-icons";
import ApiService from "@/services/api.service";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default {
  mounted() {
    this.organizationId = this.$route.query.organization_id;
    this.getPendingWasiat();
    this.getOrganization();
  },
  watch: {
    // organizationId() {
    //   return this.$route.query.organization_id;
    // },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    getConvertDate(tempDate) {
      var date = new Date(tempDate);
      var dateConvert =
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "/" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "/" +
        date.getFullYear();
      return dateConvert;
    },
  },
  data() {
    return {
      organizationId: null,
      wasiats: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
      organization: {
        is_bmmb: null,
      }
    };
  },
  methods: {
    getOrganization() {
      ApiService.get(`organization/${this.organizationId}`).then((response) => {
        this.organization = response.data.organization ?? {};
        console.log(this.organization);
      });
    },
    getPendingWasiat() {
      ApiService.get(
        `wasiat?organization_id=${this.organizationId}&status=1&load_with=user,agent,organization&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
      ).then((response) => {
        var temp_array = response.data.wasiats.data;
        this.pagination.totalRows = response.data.wasiats.total;
        console.log("senarai-pengesahan", this.wasiats);

        var newobj = {};
        var count;
        if (this.pagination.currentPage == 1) {
          count = this.pagination.currentPage;
        } else {
          count =
            this.pagination.currentPage * this.pagination.perPage -
            this.pagination.perPage +
            1;
        }
        console.log("count", count);
        for (const index in temp_array) {
          newobj[count] = Object.assign({}, temp_array[index]);
          count++;
        }
        this.wasiats = newobj;
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getPendingWasiat();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getPendingWasiat();
    },
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
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
                Senarai Carian
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
          <h5 class="text-center pb-4">SENARAI PENGESAHAN PEWASIAT</h5>
          <div class="row">
            <div
              class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0 sidebar sticky-bar"
            ></div>
          </div>
          <div v-if="wasiats == null" class="p-5 text-center">
            <h5>Tiada rekod ditemui</h5>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-4"
            v-if="wasiats"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th>{{ $t("index") }}</th>
                  <th>{{ $t("fullname") }}</th>
                  <th>{{ $t("mykad") }}</th>
                  <th>Organisasi</th>
                  <th>Ejen</th>
                  <th>{{ $t("register-date") }}</th>
                  <th style="width: 100px">{{ $t("action") }}</th>
                  <th v-if="organization.is_bmmb">Status Pinjaman</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(wasiat, index) in wasiats" :key="index">
                  <td>{{ index }}</td>
                  <td>{{ wasiat.user ? wasiat.user.name : "-" }}</td>
                  <td>
                    {{ wasiat.user ? wasiat.user.ic_number : "-" }}
                  </td>
                  <td>
                    {{ wasiat.organization ? wasiat.organization.name : "-" }}
                  </td>
                  <td>
                    {{ wasiat.agent ? wasiat.agent.name : "-" }}
                  </td>
                  <td>
                    {{
                      wasiat
                        ? wasiat.recorded_wasiat_date
                        : "-" | getConvertDate
                    }}
                  </td>
                  <td>
                    <router-link
                      tag="button"
                      block
                      class="btn-sm btn-primary"
                      :to="{
                        name: 'wasiat.part_a',
                        query: { wasiat_id: wasiat.id, pengesahan: true },
                      }"
                      >Pengesahan</router-link
                    >
                  </td>
                  <td v-if="organization.is_bmmb">
                    <span class="badge badge-warning" v-if="[0, null].includes(wasiat.bmmb_loan_status)">Dalam Proses</span>
                    <span class="badge badge-success" v-if="wasiat.bmmb_loan_status == 1">Lulus</span>
                    <span class="badge badge-danger" v-if="wasiat.bmmb_loan_status == 2">Gagal</span>
                  </td>
                </tr>
                <tr v-if="wasiats.length == 0">
                  <td class="p-5 text-center" colspan="7">
                    <h5>Tiada rekod ditemui</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="card-body">
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
                          <option value="10">10 {{ $t("per-page") }}</option>
                          <option value="25">25 {{ $t("per-page") }}</option>
                          <option value="50">50 {{ $t("per-page") }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
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
