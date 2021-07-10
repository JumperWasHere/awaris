<script>
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      branch: {},
      organization_type: null,
    };
  },
  mounted() {
    console.log(this.branchId);
    this.getBranchDetails();
    console.log(this.organizationId);
    this.getOrgType();
  },
  methods: {
    getOrgType() {
      var org_type;
      ApiService.get(`organization/${this.organizationId}`).then((response) => {
        this.organization_type = response.data.organization.type;
        console.log(this.organization_type);
      });
    },
    getBranchDetails() {
      ApiService.get(`branch/${this.branchId}/user`).then((response) => {
        this.branch = response.data.branch ?? {};
      });
    },
    back() {
      this.$router.push({
        name: "organization.branch",
        params: { branch_id: this.branchId },
      });
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organization_id;
    },
    branchId() {
      return this.$route.params.branch_id;
    },
    fullAddress() {
      if (!this.branch) {
        return "-";
      }
      return String(this.branch.address ? this.branch.address.concat(", ") : "")
        .concat(
          String(this.branch.postcode ? this.branch.postcode.concat(", ") : "")
        )
        .concat(String(this.branch.city ? this.branch.city.concat(", ") : ""))
        .concat(String(this.branch.state ? this.branch.state.concat(".") : ""));
    },
  },
  props: {
    organization: {
      type: Object,
    },
    userRole: {
      type: String,
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{ $t("phase") }}</label>
        <p class="form-control-static" style="text-transform: uppercase">
          {{ branch.phase ? branch.phase : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("org.branch-name")
        }}</label>
        <p class="form-control-static" style="text-transform: uppercase">
          {{ branch.branch_name }}
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("org.branch-code")
        }}</label>
        <p class="form-control-static" style="text-transform: uppercase">
          {{ branch.code ? branch.code : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("address")
        }}</label>
        <p class="form-control-static" style="text-transform: uppercase">
          {{ fullAddress }}
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("office-no")
        }}</label>
        <p class="form-control-static">
          {{ branch.phone_number ? branch.phone_number : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("website")
        }}</label>
        <p class="form-control-static">
          {{ branch.website ? branch.website : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for>{{ $t("email") }}</label>
        <p class="form-control-static">
          {{ branch.email ? branch.email : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("bank-account")
        }}</label>
        <p class="form-control-static">
          {{ branch.bank_account_number ? branch.bank_account_number : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("acc-holder")
        }}</label>
        <p class="form-control-static" style="text-transform: uppercase">
          {{ branch.bank_account_holder ? branch.bank_account_holder : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("bankname")
        }}</label>
        <p class="form-control-static" style="text-transform: uppercase">
          {{ branch.bank_name ? branch.bank_name : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{ $t("status") }}</label>
        <p class="form-control-static">
          <span class="badge badge-success" v-if="branch.status == 1">{{
            $t("active")
          }}</span>
          <span class="badge badge-warning" v-if="branch.status != 1">{{
            $t("inactive")
          }}</span>
        </p>
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        <i class="mdi mdi-chevron-left"></i>{{ $t("back") }}
      </button>
      <router-link
        v-if="['Staff', 'Super Admin', 'IT'].includes(userRole)"
        :to="{
          name: 'organization.branch.edit',
          params: { organization_id: organizationId, branch_id: branchId },
        }"
        class="btn btn-primary"
        >{{ $t("update") }}</router-link
      >
    </div>
  </div>
</template>
