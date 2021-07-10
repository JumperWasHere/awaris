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
      html_table: null,
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
      ApiService.get(
        `/wasiat/detailed-report?format=html&date=${this.currentMonth}&organization_id=${this.organizationId}&branch_id=${this.branchId}`
      ).then((response) => {
        this.html_table = response.data;
      });
    },
    downloadExcel() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/wasiat/detailed-report?format=excel&date=${this.currentMonth}&organization_id=${this.organizationId}&branch_id=${this.branchId}`,
        "_blank"
      );
    },
    monthChange() {
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
          <h5 class="text-center">AWARIS DETAILED MONTHLY REPORT</h5>

          <div class="row mt-5">
            <div class="col-md-4">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Bulan</label
                >
                <div class="col-sm-8 col-md-8 col-lg-6">
                  <input
                    type="month"
                    class="form-control"
                    @change="monthChange"
                    v-model="currentMonth"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Organisasi</label
                >
                <div class="col-sm-8 col-md-8 col-lg-6">
                  <select
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
            <div class="col-md-4" v-if="selectedOrganization != ''">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Cawangan</label
                >
                <div class="col-sm-8 col-md-8 col-lg-6">
                  <select
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
            <div class="col-md-12 text-right mb-4">
              <b-button class="btn btn-secondary btn-sm" @click="downloadExcel">
                Download Excel</b-button
              >
            </div>
          </div>
          <div class="table-responsive">
            <table class="table" v-html="html_table"></table>
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
