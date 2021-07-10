<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      pricings: [],
      // wasiatType: 1,
      wasiatType: "",
      pricing: "",
      userId: null,
      hibah: {},
      submit: false,
      organizations: null,
      branches: null,
      selectedOrganizationId: "",
      userAccesses: null,
      selectedBranchId: "",
      selectedAgentId: "",
      organization: null,
      branch: null,
      agent: null,
    };
  },
  validations: {
    wasiatType: {
      required,
    },
    pricing: {
      required,
    },
  },
  mounted() {
    // this.getPricings();
    // if (this.organizationId != -1) {
    //   this.getOrgnizations();
    // }
    // this.selectedOrganizationId = this.organizationId;
    if (this.trust_id == null && this.type === undefined) {
      this.$router.push({
        name: "trust.product-list",
        query: { trust_id: this.trust_id, error: 1 },
      });
    }
    // if (this.trust) {
    //   this.selectedOrganizationId = this.trust.organization_id ?? "";
    //   this.selectedBranchId = this.trust.branch_id ?? "";
    //   this.selectedAgentId = this.trust.agent_id ?? "";
    //   this.pricing = this.trust.pricing_id ?? "";
    // }
    if (this.trust) {
      if (this.trust.organization_id) {
        this.getOrgnizations();
        this.getBranchesByOrganization();
        this.selectedOrganizationId = this.trust.organization_id;
      }

      //if (this.trust.hibah_type) this.hibahType = this.trust.hibah_type;
      if (this.trust.branch_id) this.selectedBranchId = this.trust.branch_id;
      if (this.trust.agent_id) this.getOrganizationUsers();
    }
  },
  // props: {
  //   trust: {
  //     type: Object,
  //   },
  // },
  computed: {
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "trust"]),
    // organizationId() {
    //   if (this.selectedOrganizationId != "") {
    //     return this.selectedOrganizationId;
    //   } else if (this.userAccess != null) {
    //     if (this.userAccess.accessible_type == "Branch") {
    //       return this.userAccess.organization_id;
    //     } else {
    //       return this.userAccess.accessible.id;
    //     }
    //   } else {
    //     return 1;
    //   }
    // },

    hibahType() {
      if (this.trust) {
        return this.trust.hibah_type;
      }
      return this.$route.query.type;
    },
    hibahTypeString() {
      if (this.hibahType == 1) {
        return "Deklarasi Hibah Amanah Korporat";
      } else if (this.hibahType == 2) {
        return "Deklarasi Amanah Korporat";
      } else if (this.hibahType == 3) {
        return "Deklarasi Hibah Amanah Tunai";
      } else if (this.hibahType == 4) {
        return "Deklarasi Amanah Tunai";
      } else if (this.hibahType == 5) {
        return "Deklarasi Hibah Amanah Hartanah";
      } else if (this.hibahType == 6) {
        return "Deklarasi Amanah Hartanah";
      } else if (this.hibahType == 7) {
        return "Hibah Amanah Tunai";
      } else if (this.hibahType == 8) {
        return "Amanah Tunai";
      } else if (this.hibahType == 9) {
        return "Hibah Amanah Hartanah";
      } else if (this.hibahType == 10) {
        return "Amanah Hartanah";
      } else if (this.hibahType == 11) {
        return "Amanah Perniagaan";
      }
    },
    trust_id() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  // watch: {
  //   selectedOrganizationId: {
  //     handler: function (val) {
  //       if (val) {
  //         this.getBranchesByOrganization();
  //       }
  //     },
  //   },
  //   selectedBranchId: {
  //     handler: function (val) {
  //       if (val) {
  //         this.getOrganizationUsers(val);
  //       }
  //     },
  //   },
  // },
  methods: {
    // getOrgnizations() {
    //   ApiService.get(`organization?limit=100`).then((response) => {
    //     this.organizations = response.data.organizations.data ?? [];
    //     this.organizations = this.organizations.reduce((r, a) => {
    //       r[a.type] = [...(r[a.type] || []), a];
    //       return r;
    //     }, {});
    //     this.onOrganizationChange();
    //   });
    // },
    getOrgnizations() {
      ApiService.get(`organization?limit=100`).then((response) => {
        var organizations = response.data.organizations.data ?? [];
        var filterOrg = organizations.filter(
          (item) => item.id == this.trust.organization_id
        );
        this.organization = filterOrg[0];

        console.log(this.organization);
      });
    },
    // onOrganizationChange() {
    //   this.getBranchesByOrganization();
    //   this.getPricings();
    //   this.userAccesses = null;
    // },
    // getBranchesByOrganization() {
    //   ApiService.get(`organization/${this.organizationId}/branch`).then(
    //     (response) => {
    //       this.branches = response.data.branches.data ?? [];
    //     }
    //   );
    // },
    getBranchesByOrganization() {
      ApiService.get(`organization/${this.trust.organization_id}/branch`).then(
        (response) => {
          this.branches = response.data.branches.data ?? [];
          console.log("brach -", this.branches);
          var filterbranch = this.branches.filter(
            (item) => item.id == this.trust.branch_id
          );
          this.branch = filterbranch[0];
        }
      );
    },
    // getOrganizationUsers(branchid) {
    //   let query;
    //   if (!branchid) {
    //     query = `organization/${this.organizationId}/user`;
    //   } else {
    //     query = `organization/${this.organizationId}/user?branch_id=${branchid}`;
    //   }
    //   ApiService.get(query).then((response) => {
    //     this.userAccesses = response.data.user_accesses.data ?? [];
    //     console.log(this.userAccesses);
    //   });
    // },
    getOrganizationUsers() {
      let query = `organization/${this.trust.organization_id}/user?branch_id=${this.trust.branch_id}`;
      ApiService.get(query).then((response) => {
        this.userAccesses = response.data.user_accesses.data ?? [];
        var filters = this.userAccesses.filter(
          (item) => item.user_id == this.trust.agent_id
        );
        this.agent = filters[0];
        console.log("agent", this.userAccesses);
      });
    },
    // async getPricings() {
    //   var organizationId = this.organizationId ?? this.trust.organization_id;
    //   return await ApiService.get(
    //     `/organization/${this.organizationId}/pricing?product=Hibah`
    //   )
    //     .then((response) => {
    //       if (response.data.pricings != null) {
    //         this.pricings = response.data.pricings.data;
    //         this.pricing = this.pricings[0].id;
    //       }
    //     })
    //     .catch((error) => {});
    // },
    // getWasiat() {
    //   ApiService.get(`wasiat/${this.wasiatId}`).then((response) => {
    //     var wasiat = response.data.wasiat;
    //     this.wasiat = wasiat;
    //     this.userId = wasiat.user_id;
    //     this.wasiatType = wasiat.wasiat_type;
    //     this.pricing = wasiat.pricing_id;
    //     // this.getPricings();
    //   });
    // },
    async onSubmit() {
      //   this.$v.$touch();
      //   if (!this.$v.$invalid) {
      this.submit = true;
      // let resultUpdate = await this.updateHibah();
      // if (resultUpdate) {
      // setTimeout(
      //   () =>
      this.$router.push({
        name: "trust.part-d",
        query: {
          trust_id: this.trust_id,
          amendment_id: this.amendmentId,
        },
      });
      //   1000
      // );
      this.submit = false;
      // } else {
      //   this.submit = false;
      // }

      //   } else {
      //     this.$swal.fire({
      //       icon: "error",
      //       html: "Sila isi ruangan yang bertanda (*)",
      //       showCloseButton: true,
      //       showCancelButton: false,
      //       focusConfirm: false,
      //       confirmButtonText: "Tutup",
      //     });
      //   }
    },
    // async updateHibah() {
    //   let hibah = {};
    //   hibah.organization_id = this.organizationId ?? this.hibah.organization_id;
    //   hibah.pricing_id = this.pricing;
    //   hibah.agent_id = this.selectedAgentId;
    //   hibah.branch_id = this.selectedBranchId;
    //   hibah.status = 0;
    //   hibah._method = "PATCH";
    //   console.log("print ", hibah);
    //   return await ApiService.post(`hibah/${this.trust_id}`, hibah)
    //     .then((response) => {
    //       return true;
    //     })
    //     .catch((error) => {
    //       return false;
    //     });
    // },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    // selectBranch(event) {
    //   console.log(event.target.value);
    //   this.getOrganizationUsers(event.target.value);
    // },
  },
};
</script>
<template>
  <!-- <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0"> -->
  <div class="col-lg-12 col-12 mb-4 pb-2">
    <div
      class="card bg-light job-box rounded shadow border-0 overflow-hidden"
      v-if="trust"
    >
      <div class="card-body">
        <h5 class="text-center" style="text-transform: uppercase">
          {{ $t("trust.desc-hibah") }}
        </h5>
        <div class="row" v-if="['Staff'].includes(userRole)">
          <div class="col-md-6 form-group">
            <label for="organization_id">{{ $t("partner-name") }}</label>
            <p class="input-control-static">
              {{ organization ? organization.name : "-" }}
            </p>
            <select
              name=""
              class="form-control"
              v-model="selectedOrganizationId"
              @change="onOrganizationChange"
              v-if="organizations"
              :disabled="true"
            >
              <option value="">-- {{ $t("choose.organization") }} --</option>
              <optgroup
                v-for="(type, index) in Object.entries(this.organizations)"
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
          <div class="col-md-6 form-group">
            <label for="branch_id">{{ $t("org.nav2") }}</label>
            <p class="input-form-static">
              {{ branch ? branch.branch_name : "-" }}
            </p>
            <!-- <select
              name=""
              class="form-control"
              v-model="selectedBranchId"
              @change="selectBranch($event)"
              :disabled="true"
            >
              <option value="">-- {{ $t("choose.branch") }} --</option>
              <option
                :value="branch.id"
                v-for="(branch, index) in branches"
                :key="index"
              >
                {{ branch.branch_name }}
              </option>
            </select> -->
          </div>
          <div class="col-md-6 offset-md-6 form-group">
            <label for="branch_id">{{ $t("agent") }}</label>
            <!-- {{ selectedAgentId }} -->
            <p class="input-form-static">
              {{ agent ? agent.user.name : "-" }}
            </p>
            <!-- <select
              name=""
              class="form-control"
              v-model="selectedAgentId"
              :disabled="true"
            >
              <option value="">-- {{ $t("choose.agent") }} --</option>
              <option
                :value="access.user_id"
                v-for="(access, index) in userAccesses"
                :key="index"
              >
                {{ access.user.name }} ({{ access.user.ic_number }})
              </option>
            </select> -->
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="hibah_type"> {{ $t("trust.type") }}</label>
              <p class="form-control-static">{{ hibahTypeString }}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group" :class="{ 'has-error': $v.pricing.$error }">
              <label for="price">{{ $t("trust.hibah-price") }}</label>

              <!-- <span class="text-danger">*</span> -->
              <p>RM {{ trust.price.toFixed(2) }}</p>
              <!-- <input
                type="text"
                v-uppercase
                class="form-control"
                disabled
                v-model="trust.price"
              />
              <select
                name
                class="form-control"
                v-model.trim="$v.pricing.$model"
                :disabled="true"
              >
                <option value>-- {{ $t("choose.price") }} --</option>
                <option
                  :value="pricing.id"
                  v-for="(pricing, index) in pricings"
                  :key="index"
                >
                  RM {{ pricing.price.toFixed(2) }}
                </option>
              </select> -->
              <div
                class="form-error"
                v-if="$v.pricing.$error && !$v.pricing.required"
              >
                Harga Wasiat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right mt-3">
      <button @click="onSubmit" class="btn btn-primary">
        {{ $t("save-next") }}
      </button>
    </div>
  </div>
  <!-- </div> -->
</template>
