<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { required } from "vuelidate/lib/validators";
export default {
  name: "EditablePartA",
  data() {
    return {
      pricings: [],
      allOrganization: null,
      wasiatType: "",
      pricing: "",
      userId: null,
      submit: false,
      organizations: null,
      branches: null,
      selectedOrganizationId: "",
      userAccesses: null,
      selectedBranchId: "",
      selectedAgentId: "",
      headquater: null,
    };
  },
  validations() {
    if (this.userRole == "Staff") {
      return {
        selectedOrganizationId: {
          required,
        },
        selectedBranchId: {
          required,
        },
        selectedAgentId: {
          required,
        },
        wasiatType: {
          required,
        },
        pricing: {
          required,
        },
      };
    } else if (this.userRole == "Super Admin") {
      return {
        selectedBranchId: {
          required,
        },
        selectedAgentId: {
          required,
        },
        wasiatType: {
          required,
        },
        pricing: {
          required,
        },
      };
    } else if (this.userRole == "Admin") {
      return {
        selectedAgentId: {
          required,
        },
        wasiatType: {
          required,
        },
        pricing: {
          required,
        },
      };
    } else if (this.userRole == "Agent" || this.userRole == "Client") {
      return {
        wasiatType: {
          required,
        },
        pricing: {
          required,
        },
      };
    }
  },
  mounted() {
    console.log("userAccess", this.userAccess);
    this.getPricings();
    if (this.organizationId != -1) {
      this.getOrgnizations();
    }
    if (this.wasiat) {
      if (this.wasiat.organization_id)
        this.selectedOrganizationId = this.wasiat.organization_id;
      if (this.wasiat.wasiat_type) this.wasiatType = this.wasiat.wasiat_type;
      if (this.wasiat.branch_id) this.selectedBranchId = this.wasiat.branch_id;
      if (this.wasiat.agent_id) this.selectedAgentId = this.wasiat.agent_id;
    } else {
      this.selectedOrganizationId = this.organizationId;
    }
  },
  props: {
    wasiat: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "currentUser"]),
    getorgnamebyindex() {
      var orgId;
      if (this.wasiat.organization_id) {
        orgId = this.wasiat.organization_id;
      } else {
        orgId = this.userAccess.organization_id;
      }
      if (this.allOrganization) {
        var temp = this.allOrganization.filter((item) => item.id == orgId);
        return temp[0].name;
      } else {
        return "-";
      }
    },
    getagentnamebyindex() {
      var agentId;
      if (this.wasiat.agent_id) {
        agentId = this.wasiat.agent_id;
        if (this.userAccesses) {
          var temp = this.userAccesses.filter(
            (item) => item.user_id == agentId
          );
          console.log("temp", agentId, "|| ", temp);
          if (temp.length > 0) {
            return temp[0].user.name;
          }
          return " - ";
        } else {
          return "-";
        }
      } else {
        return this.currentUser.name;
      }
    },
    organizationId: function () {
      if (this.selectedOrganizationId != "") {
        return this.selectedOrganizationId;
      } else if (this.userAccess != null) {
        if (this.userAccess.accessible_type == "Branch") {
          return this.userAccess.organization_id;
        } else {
          return this.userAccess.accessible.id;
        }
      } else {
        return 1;
      }
    },

    wasiatId() {
      return this.$route.query.wasiat_id;
    },
  },
  methods: {
    getOrgnizations() {
      ApiService.get(`organization?allow_wasiat=1&limit=200`).then(
        (response) => {
          this.organizations = response.data.organizations.data ?? [];
          this.allOrganization = response.data.organizations.data ?? [];
          console.log("organization", this.organizations);
          this.organizations = this.organizations.reduce((r, a) => {
            r[a.type] = [...(r[a.type] || []), a];
            return r;
          }, {});
          this.onOrganizationChange();
        }
      );
    },
    onOrganizationChange() {
      this.getBranchesByOrganization();

      this.getPricings();
      this.userAccesses = null;
    },
    getBranchesByOrganization() {
      ApiService.get(
        `organization/${this.organizationId}/branch?limit=1000`
      ).then((response) => {
        this.branches = response.data.branches.data ?? [];
        var headquater = this.branches.filter(
          (item) => item.is_headquarter == 1
        );
        this.headquater = headquater[0].id;
        console.log("BRANCH ID _ HEAD", this.headquater);
        console.log("BRANCH ", this.branches);

        this.getOrganizationUsers(this.branches.id);
      });
    },
    getOrganizationUsers(branchID) {
      var branchid = branchID;
      let query;
      if (this.userRole == "Agent") {
        branchid = this.userAccess.accessible.id;
      }
      if (!branchid) {
        query = `organization/${this.organizationId}/user?limit=1000&status=1`;
      } else {
        query = `organization/${this.organizationId}/user?branch_id=${branchid} &limit=1000&status=1`;
      }
      console.log("getOrganizationUsers", query);
      ApiService.get(query).then((response) => {
        this.userAccesses = response.data.user_accesses.data ?? [];
        console.log("userAccesses", this.userAccesses);
      });
    },
    async getPricings() {
      var organizationId = this.organizationId ?? this.wasiat.organization_id;
      return await ApiService.get(
        `/organization/${organizationId}/pricing?product=Wasiat&status=1`
      )
        .then((response) => {
          if (response.data.pricings != null) {
            this.pricings = response.data.pricings.data;
            if (this.wasiat.pricing_id) {
              this.pricing = this.wasiat.pricing_id;
            } else {
              this.pricing = this.pricings[0].id;
            }
          }
        })
        .catch((error) => {});
    },
    async onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.submit = true;
        let resultUpdate = await this.updateWasiat();
        if (resultUpdate) {
          this.$router.push({
            name: "wasiat.part_payment",
            query: {
              wasiat_id: this.wasiatId,
            },
          });
        }

        this.submit = false;
      } else {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi ruangan yang bertanda (*)",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      }
    },
    async updateWasiat() {
      let wasiatTemp = {};
      if ((this.wasiat.status = -1)) {
        wasiatTemp.status = 0;
      }
      wasiatTemp.organization_id =
        this.organizationId ?? this.wasiat.organization_id;

      wasiatTemp.pricing_id = this.pricing;
      wasiatTemp.wasiat_type = this.wasiatType;
      wasiatTemp.wasiat_id = this.wasiatId;
      wasiatTemp.agent_id = this.selectedAgentId ?? this.wasiat.agent_id;
      if (["Super Admin", "Staff"].includes(this.userRole)) {
        wasiatTemp.branch_id = this.selectedBranchId;
      } else if (["Client"].includes(this.userRole)) {
        wasiatTemp.branch_id = this.headquater;
      } else if (["Admin", "Agent"].includes(this.userRole)) {
        wasiatTemp.branch_id = this.userAccess.accessible.id;
      }
      // else if (["Super Admin"].includes(this.userRole)) {
      //   wasiatTemp.branch_id = this.headquater;
      // }

      wasiatTemp._method = "PATCH";

      console.log("print ", wasiatTemp);
      return await ApiService.post(`wasiat/${this.wasiatId}`, wasiatTemp)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    selectBranch(event) {
      console.log(event.target.value);
      this.getOrganizationUsers(event.target.value);
      this.selectedAgentId = null;
    },
  },
};
</script>
<template>
  <div class="col-lg-12 col-12 mb-4 pb-2">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center" style="text-transform: uppercase">
          {{ $t("wasiatasas.will-desc") }}
        </h5>
        <div class="row" v-if="['Staff'].includes(userRole)">
          <div
            class="col-md-6 form-group"
            :class="{ 'has-error': $v.selectedOrganizationId.$error }"
          >
            <label for="organization_id">{{ $t("partner-name") }}</label>
            <span class="text-danger">*</span>
            <select
              name=""
              id=""
              class="form-control"
              v-model.trim="$v.selectedOrganizationId.$model"
              @change="onOrganizationChange"
              v-if="organizations"
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
            <div
              class="form-error"
              v-if="
                $v.selectedOrganizationId.$error &&
                !$v.selectedOrganizationId.required
              "
            >
              Nama Organisasi tidak boleh dibiarkan kosong.
            </div>
          </div>
          <div
            class="col-md-6 form-group"
            :class="{ 'has-error': $v.selectedBranchId.$error }"
          >
            <label for="branch_id">{{ $t("org.nav2") }}</label>
            <span class="text-danger">*</span>
            <select
              name=""
              id=""
              class="form-control"
              v-model.trim="$v.selectedBranchId.$model"
              @change="selectBranch($event)"
            >
              <option value="">-- {{ $t("choose.branch") }} --</option>
              <option
                :value="branch.id"
                v-for="(branch, index) in branches"
                :key="index"
              >
                {{ branch.branch_name }}
              </option>
            </select>
            <div
              class="form-error"
              v-if="$v.selectedBranchId.$error && !$v.selectedBranchId.required"
            >
              Cawangan tidak boleh dibiarkan kosong.
            </div>
          </div>
          <div
            class="col-md-6 offset-md-6 form-group"
            :class="{ 'has-error': $v.selectedAgentId.$error }"
          >
            <label for="branch_id">{{ $t("agent") }}</label>
            <span class="text-danger">*</span>
            <select
              name=""
              id=""
              class="form-control"
              v-model.trim="$v.selectedAgentId.$model"
            >
              <option value="">-- {{ $t("choose.agent") }} --</option>
              <option
                :value="access.user_id"
                v-for="(access, index) in userAccesses"
                :key="index"
              >
                {{ access.user.name }} ({{ access.user.ic_number }})
              </option>
            </select>
            <div
              class="form-error"
              v-if="$v.selectedAgentId.$error && !$v.selectedAgentId.required"
            >
              Ejen tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <div class="row" v-if="['Agent'].includes(userRole)">
          <div class="col-md-6 form-group">
            <label for="organization_id">{{ $t("partner-name") }}</label>
            <p class="input-form-static">
              {{ getorgnamebyindex }}
            </p>
          </div>
          <div class="col-md-6 form-group">
            <label for="branch_id">{{ $t("org.nav2") }}</label>
            <p class="input-form-static">
              {{ userAccess.accessible.branch_name }}
            </p>
          </div>
          <div class="col-md-6 offset-md-6 form-group">
            <label f>{{ $t("agent") }}</label> <br />
            <p class="input-form-static">
              {{ getagentnamebyindex }}
            </p>
          </div>
        </div>
        <div class="row" v-if="['Super Admin'].includes(userRole)">
          <div class="col-md-6 form-group">
            <label for="organization_id">{{ $t("partner-name") }}</label>
            <p class="input-form-static">
              {{ getorgnamebyindex }}
            </p>
          </div>
          <div
            class="col-md-6 form-group"
            :class="{ 'has-error': $v.selectedBranchId.$error }"
          >
            <label for="branch_id">{{ $t("org.nav2") }}</label>
            <span class="text-danger">*</span>
            <select
              name=""
              id=""
              class="form-control"
              v-model.trim="$v.selectedBranchId.$model"
              @change="selectBranch($event)"
            >
              <option value="">-- {{ $t("choose.branch") }} --</option>
              <option
                :value="branch.id"
                v-for="(branch, index) in branches"
                :key="index"
              >
                {{ branch.branch_name }}
              </option>
            </select>
            <div
              class="form-error"
              v-if="$v.selectedBranchId.$error && !$v.selectedBranchId.required"
            >
              Cawangan tidak boleh dibiarkan kosong.
            </div>
          </div>
          <div
            class="col-md-6 offset-md-6 form-group"
            :class="{ 'has-error': $v.selectedAgentId.$error }"
          >
            <label for="branch_id">{{ $t("agent") }}</label>
            <span class="text-danger">*</span>
            <select
              name=""
              id=""
              class="form-control"
              v-model.trim="$v.selectedAgentId.$model"
            >
              <option value="">-- {{ $t("choose.agent") }} --</option>
              <option
                :value="access.user_id"
                v-for="(access, index) in userAccesses"
                :key="index"
              >
                {{ access.user.name }} ({{ access.user.ic_number }})
              </option>
            </select>
            <div
              class="form-error"
              v-if="$v.selectedAgentId.$error && !$v.selectedAgentId.required"
            >
              Ejen tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <div class="row" v-if="['Admin'].includes(userRole)">
          <div class="col-md-6 form-group">
            <label for="organization_id">{{ $t("partner-name") }}</label>
            <p class="input-form-static">
              {{ getorgnamebyindex }}
            </p>
          </div>
          <div class="col-md-6 form-group">
            <label for="branch_id">{{ $t("org.nav2") }}</label>
            <p class="input-form-static">
              {{ userAccess.accessible.branch_name }}
            </p>
          </div>
          <div
            class="col-md-6 offset-md-6 form-group"
            :class="{ 'has-error': $v.selectedAgentId.$error }"
          >
            <label for="branch_id">{{ $t("agent") }}</label>
            <span class="text-danger">*</span>
            <select
              name=""
              id=""
              class="form-control"
              v-model.trim="$v.selectedAgentId.$model"
            >
              <option value="">-- {{ $t("choose.agent") }} --</option>
              <option
                :value="access.user_id"
                v-for="(access, index) in userAccesses"
                :key="index"
              >
                {{ access.user.name }} ({{ access.user.ic_number }})
              </option>
            </select>
            <div
              class="form-error"
              v-if="$v.selectedAgentId.$error && !$v.selectedAgentId.required"
            >
              Ejen tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.wasiatType.$error }"
            >
              <label for="wasiat_type">{{ $t("wasiatasas.type") }}</label>
              <span class="text-danger">*</span>
              <select
                name="group"
                id="group"
                class="form-control"
                v-model.trim="$v.wasiatType.$model"
              >
                <option value>-- {{ $t("choose.will") }} --</option>
                <option value="1" selected>
                  {{ $t("islamic-will") }}
                </option>
                <option value="2">{{ $t("conventional-will") }}</option>
              </select>
              <div
                class="form-error"
                v-if="$v.wasiatType.$error && !$v.wasiatType.required"
              >
                Jenis Wasiat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group" :class="{ 'has-error': $v.pricing.$error }">
              <label for="price">{{ $t("wasiatasas.price") }}</label>
              <span class="text-danger">*</span>
              <select
                name
                id
                class="form-control"
                v-model.trim="$v.pricing.$model"
                :disabled="wasiat.payment_received_at"
              >
                <option value>-- {{ $t("choose.price") }} --</option>
                <option
                  :value="pricing.id"
                  v-for="(pricing, index) in pricings"
                  :key="index"
                >
                  RM {{ pricing.price.toFixed(2) }} 
                  <span v-if="pricing.description"> ({{ pricing.description }}) </span>
                  <span v-if="!pricing.description"></span>
                </option>
              </select>
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
</template>
