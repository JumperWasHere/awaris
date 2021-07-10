<script>
import ApiService from "@/services/api.service";
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.searchDate = moment().format("YYYY-MM");
    if (this.userRole == "Staff") {
      this.getOrganizations();
    }
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
      selectedOrganizationId: null,
      organizations: null,
      organization: null,
    };
  },
  components: {
    Navbar,
    Footer,

    ArrowUpIcon,
  },
  methods: {
    downloadSoa() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/organization/${this.organizationId}/report/soa/xlsx?date=${this.searchDate}`,
        "_blank"
      );
    },
    getOrganizations() {
      ApiService.get(`organization?limit=100`).then((response) => {
        this.organizations = response.data.organizations.data ?? [];
      });
    },
    getOrganization() {
      ApiService.get(`organization/${this.organizationId}`).then((response) => {
        this.organization = response.data.organization ?? {};
      });
    },
  },
  computed: {
    ...mapGetters(["userRole", "userAccess"]),
    organizationId() {
      if (this.selectedOrganizationId) {
        return this.selectedOrganizationId;
      } else {
        return this.userAccess.organization_id;
      }
    },
  },
  watch: {
    userAccess: function () {
      this.getOrganization();
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
                Penyata Akaun
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
          <h5 class="text-center">PENYATA AKAUN</h5>
          <div class="row mt-4">
            <div class="col-12 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label"
                  >Orgnasasi</label
                >
                <div class="col-md-6 col-lg-4">
                  <div class="input-group mb-3">
                    <select
                      v-if="userRole == 'Staff'"
                      name="organization_id"
                      v-model="selectedOrganizationId"
                      id="organization_id"
                      class="form-control"
                    >
                      <option
                        :value="organization.id"
                        v-for="(organization, index) in organizations"
                        :key="index"
                      >
                        {{ organization.name }}
                      </option>
                    </select>
                    <span
                      class="form-control-text"
                      v-if="userRole != 'Staff' && organization"
                      >{{ organization.name }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label"
                  >Bulan/Tahun</label
                >
                <div class="col-md-6 col-lg-4">
                  <div class="input-group mb-3">
                    <input
                      type="month"
                      v-model="searchDate"
                      class="form-control"
                    />
                    <div class="input-group-append">
                      <button
                        @click="downloadSoa"
                        :disabled="searchDate == null"
                        class="btn btn-sm btn-primary"
                      >
                        Download
                      </button>
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
