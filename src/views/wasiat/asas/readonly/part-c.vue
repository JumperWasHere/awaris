<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
export default {
  // props: {
  //   wasiat: {
  //     type: Object,
  //   },
  // },
  data() {
    return {
      submit: false,
      organization: null,
      branch: null,
      agent: null,
      wasiatType: null,
    };
  },
  mounted() {
    if (this.wasiat) {
      if (this.wasiat.organization_id)
        this.selectedOrganizationId = this.wasiat.organization_id;
      // this.getOrgnizations();
      this.getBranchesByOrganization();
      if (this.wasiat.wasiat_type) this.wasiatType = this.wasiat.wasiat_type;
      if (this.wasiat.branch_id) this.selectedBranchId = this.wasiat.branch_id;
      if (this.wasiat.agent_id) this.getOrganizationUsers();
    }
  },
  components: {},
  computed: {
    ...mapGetters(["userRole", "wasiat"]),
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
  // watch: {
  //   wasiat: {
  //     handler: function (val) {
  //       if (val) {
  //         console.log("val", val);
  //         if (val.organization_id)
  //           this.selectedOrganizationId = val.organization_id;
  //         this.getOrgnizations();
  //         this.getBranchesByOrganization();
  //         if (val.wasiat_type) this.wasiatType = val.wasiat_type;
  //         if (val.branch_id) this.selectedBranchId = val.branch_id;
  //         if (val.agent_id) this.getOrganizationUsers();
  //       }
  //     },
  //   },
  // },
  methods: {
    async onSubmit() {
      if (this.wasiat.wasiatType == null) {
        this.submit = true;
        let resultUpdate = await this.updateWasiat();
        if (resultUpdate) {
          this.$router.push({
            name: "wasiat.part_payment",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
      }
    },
    async updateWasiat() {
      let wasiatTemp = {};
      wasiatTemp.wasiat_type = this.wasiatType;

      wasiatTemp._method = "PATCH";

      console.log("print ", wasiatTemp);
      return await ApiService.post(`wasiat/${this.wasiatId}`, wasiatTemp)
        .then((response) => {
          console.log("wasiatType", this.wasiatType);
          return true;
        })
        .catch((error) => {
          console.log("false");
          return false;
        });
    },

    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    // nextPart() {
    //   if (this.wasiatId) {
    //     this.$router.push({
    //       name: "wasiat.part_d",
    //       query: { wasiat_id: this.wasiatId, pengesahan: this.pengesahan },
    //     });
    //   }
    // },
    // getOrgnizations() {
    //   ApiService.get(`organization`).then((response) => {
    //     var organizations = response.data.organizations.data ?? [];
    //     var filterOrg = organizations.filter(
    //       (item) => item.id == this.wasiat.organization_id
    //     );
    //     this.organization = filterOrg[0];

    //     console.log(organizations);
    //   });
    // },
    getBranchesByOrganization() {
      ApiService.get(
        `organization/${this.wasiat.organization_id}/branch?limit=200`
      ).then((response) => {
        this.branches = response.data.branches.data ?? [];
        this.organization = response.data.organization;
        console.log("brach -", response.data.branches);
        var filterbranch = this.branches.filter(
          (item) => item.id == this.wasiat.branch_id
        );
        this.branch = filterbranch[0];
        console.log("branch", this.branch);
      });
    },
    getOrganizationUsers() {
      let query = `organization/${this.wasiat.organization_id}/user?branch_id=${this.wasiat.branch_id}&limit=200`;
      ApiService.get(query).then((response) => {
        this.userAccesses = response.data.user_accesses.data ?? [];
        var filters = this.userAccesses.filter(
          (item) => item.user_id == this.wasiat.agent_id
        );
        this.agent = filters[0];
        console.log("agent", this.userAccesses);
      });
    },
  },
};
</script>

<template>
  <div class="col-lg-12 col-md-8 col-12 mt-sm-0 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("wasiatasas.will-desc") }}
            </h5>
            <form class="login-form mt-4" @submit.stop.prevent="onSubmit">
              <div class="row mt-5">
                <div class="col-md-6 form-group">
                  <label for="organization_id">{{ $t("partner-name") }}</label>
                  <p class="input-control-static">
                    {{ organization ? organization.name : "-" }}
                  </p>
                </div>
                <div class="col-md-6 form-group">
                  <label for="branch_id">{{ $t("org.nav2") }}</label>
                  <p class="input-form-static">
                    {{ branch ? branch.branch_name : "-" }}
                  </p>
                </div>
                <div class="col-md-6 form-group">
                  <label for="agent">{{ $t("agent") }}</label>
                  <p class="input-form-static">
                    {{ agent ? agent.user.name : "-" }}
                  </p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="wasiat_type">{{ $t("wasiatasas.type") }}</label>
                    <div v-if="wasiatType != null">
                      <p class="form-control-static" v-if="wasiatType == 1">
                        {{ $t("islamic-will") }}
                      </p>
                      <p class="form-control-static" v-if="wasiatType == 2">
                        {{ $t("conventional-will") }}
                      </p>
                    </div>
                    <div v-if="wasiatType == null && userRole == 'Staff'">
                      <select
                        name="group"
                        id="group"
                        class="form-control"
                        v-model="wasiatType"
                      >
                        <option value="1" selected>
                          {{ $t("islamic-will") }}
                        </option>
                        <option value="2">{{ $t("conventional-will") }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="price">{{ $t("wasiatasas.price") }}</label>
                    <p class="input-form-static">
                      RM {{ wasiat.price.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <button @click="onSubmit" class="btn btn-primary">
            {{ $t("next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
