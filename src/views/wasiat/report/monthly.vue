<script>
import { ArrowUpIcon } from "vue-feather-icons";
import { mapGetters } from "vuex";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";
import moment from "moment";

export default {
  data() {
    return {
      organizations: [],
      branches: [],
      organizationType: null,
      selectedOrganization: "",
      selectedBranch: "",
      wasiats: null,
      currentMonth: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  mounted() {
    this.currentMonth = moment().format("YYYY-MM");
    this.getOrgnizations();
    this.getWasiats();
  },
  created() {
    this.selectedOrganization = this.organizationId;
    this.selectedBranch = this.branchId;
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toHumanDate: function (value) {
      return moment(value, "YYYY-MM").format("MMMM YYYY");
    },
  },

  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  computed: {
    ...mapGetters(["userRole", "userAccess"]),
    organizationId() {
      if (this.selectedOrganization) {
        return this.selectedOrganization;
      }
      if (["Admin", "Super Admin"].includes(this.userRole)) {
        return this.userAccess.organization_id;
      } else {
        return "";
      }
    },
    branchId() {
      if (this.selectedBranch) {
        return this.selectedBranch;
      }
      if (["Admin"].includes(this.userRole)) {
        return this.userAccess.accessible_id;
      } else {
        return "";
      }
    },
  },
  methods: {
    getWasiats() {
      var query = new URLSearchParams({
        created_at_month: this.currentMonth,
        load_with: "agent,user,organization,branch",
        limit: this.pagination.perPage,
        page: this.pagination.currentPage,
        organization_id: this.organizationId,
        branch_id: this.branchId,
      }).toString();

      ApiService.get(`wasiat?${query}`).then((response) => {
        this.wasiats = response.data.wasiats.data ?? [];
        this.pagination.totalRows = response.data.wasiats.total;
      });
    },
    monthChange() {
      this.getWasiats();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getWasiats();
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getWasiats();
    },
    onOrganizationChange() {
      this.selectedBranch = "";
      this.getWasiats();
      if (this.selectedOrganization != "") this.getBranches();
    },
    getOrgnizations() {
      ApiService.get(`organization?limit=100`).then((response) => {
        this.organizations = response.data.organizations.data ?? [];
        console.log(this.organizations);
        this.organizations = this.organizations.reduce((r, a) => {
          r[a.type] = [...(r[a.type] || []), a];
          return r;
        }, {});
        this.onOrganizationChange();
      });
    },
    getBranches() {
      ApiService.get(`organization/${this.selectedOrganization}/branch`).then(
        (response) => {
          this.branches = response.data.branches.data ?? [];
        }
      );
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
                Laporan Bulanan
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
          <h5 class="text-center">LAPORAN BULANAN - WASIAT</h5>
          <h6 class="text-center">{{ currentMonth | toHumanDate }}</h6>
          <div class="row mt-5">
            <div class="col-md-12">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label"
                  >Bulan</label
                >
                <div class="col-sm-8 col-md-4 col-lg-3">
                  <input
                    type="month"
                    class="form-control"
                    name=""
                    id=""
                    @change="monthChange"
                    v-model="currentMonth"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Organisasi</label
                >
                <div class="col-sm-8 col-md-8 col-lg-6">
                  <select
                    name=""
                    id=""
                    :disabled="userRole != 'Staff'"
                    class="form-control"
                    @change="onOrganizationChange"
                    v-model="selectedOrganization"
                  >
                    <option value="">Semua Organisasi</option>
                    <optgroup
                      v-for="(type, index) in Object.entries(
                        this.organizations
                      )"
                      :key="index"
                      :label="type[0]"
                    >
                      <option
                        :value="organization.id"
                        v-for="(organization, index2) in type[1]"
                        :key="index2"
                      >
                        {{ organization.name }}
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-6" v-if="selectedOrganization != ''">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Cawangan</label
                >
                <div class="col-sm-8 col-md-8 col-lg-6">
                  <select
                    name=""
                    id=""
                    :disabled="userRole == 'Admin'"
                    class="form-control"
                    @change="getWasiats"
                    v-model="selectedBranch"
                  >
                    <option value="">Semua Cawangan</option>

                    <option
                      :value="branch.id"
                      v-for="(branch, index) in branches"
                      :key="index"
                    >
                      {{ branch.branch_name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-md-12">
              <div
                class="d-flex justify-content-between align-items-center form-group"
              >
                <label>Bilangan Wasiat: {{ pagination.totalRows }}</label>
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
                    {{ wasiat.branch ? wasiat.branch.branch_name : "-" }}
                  </td>
                  <td>{{ wasiat.agent ? wasiat.agent.name : "-" }}</td>
                  <td>RM {{ wasiat.price }}</td>
                </tr>
                <tr v-if="wasiats && wasiats.length == 0">
                  <td colspan="9" class="text-center">
                    <h6 class="mt-5 mb-5">Tiada wasiat ditemui</h6>
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
    </section>
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
