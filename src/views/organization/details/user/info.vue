<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import ChangePasswordModal from "./change-password-modal.vue";
export default {
  data() {
    return {
      user: {},
      user_accesses: [],
      userRoleData: null,
      accessible_id: null,
      // accessible_type: "Organization",
      // allow_payment_gateway: 0,
      // allow_cash_payment: 0,
      statusAccess: null,
      city: null,
      state: null,
      roles: [],
      branches: [],
    };
  },
  filters: {
    Attended_course: function (value) {
      if (value == 1) {
        return "Ya";
      } else {
        return "Tidak";
      }
    },
  },
  mounted() {
    console.log(this.userId);
    this.getUserDetails();
    this.getUserAccessDetails();
    this.getBranches();
  },
  methods: {
    getUserDetails() {
      ApiService.get(`user/${this.userId}`).then((response) => {
        this.user = response.data.user ?? {};
      });
    },
    getUserAccessDetails() {
      ApiService.get(`user/${this.userId}/access`).then((response) => {
        var user_accesses = response.data.user_accesses.data[0];
        if (user_accesses) {
          this.user_accesses = user_accesses;
          this.statusAccess = user_accesses.status;
        }
      });
    },
    getBranches() {
      var org_type;
      ApiService.get(`organization/${this.organizationId}/branch`).then(
        (response) => {
          this.organization_type = response.data.organization.type;
          console.log(this.organization_type);
          // this.branches = response.data.branches.data;
        }
      );
    },
    back() {
      this.$router.push({
        name: "organization.user",
        params: { organization_id: this.organizationId },
      });
    },
    approveUserAccess() {
      ApiService.post(`/user-access/${this.user_accesses.id}`, {
        _method: "PATCH",
        status: 1,
      }).then((response) => {
        this.statusAccess = 1;
        this.$swal.fire({
          icon: "success",
          html: "Pengguna sudah diluluskan!",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        this.$router.push({
          name: "organization.user",
          params: { organization_id: this.organizationId },
        });
      });
    },
    changePassword() {
      this.$refs.changePasswordModal.showModal();
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),

    organizationType() {
      return this.organization.type;
    },

    userRoleVal() {
      return this.userRole;
    },
    organizationId() {
      return this.$route.params.organization_id;
    },
    userId() {
      return this.$route.params.user_id;
    },
    fullAddress() {
      if (!this.user) {
        return "-";
      }
      return String(this.user.address ? this.user.address.concat(", ") : "")
        .concat(
          String(this.user.postcode ? this.user.postcode.concat(", ") : "")
        )
        .concat(String(this.user.city ? this.user.city.concat(", ") : ""))
        .concat(String(this.user.state ? this.user.state.concat(". ") : ""));
    },
  },
  props: {
    organization: {
      type: Object,
    },
  },
  components: {
    ChangePasswordModal,
  },
};
</script>

<template>
  <div>
    <div class="row" v-if="userRoleVal && userRole == 'Staff'">
      <div class="col-md-12" v-if="statusAccess == 0">
        <div class="alert alert-warning">
          <div class="d-flex justify-content-between align-items-center">
            <span>{{ $t("user.not-approve") }}.</span>
            <button
              type="button"
              @click="approveUserAccess"
              class="btn btn-sm btn-primary"
            >
              {{ $t("user.approve-access") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{ $t("name") }}</label>
        <p class="form-control-static">{{ user.name }}</p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{ $t("gender") }}</label>
        <p class="form-control-static">
          <span v-if="user.gender == 1">{{ $t("male") }}</span>
          <span v-if="user.gender == 2">{{ $t("female") }}</span>
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{ $t("mykad") }}</label>
        <p class="form-control-static">{{ user.ic_number }}</p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("office-no")
        }}</label>
        <p class="form-control-static">
          {{ user.office_phone_number ? user.office_phone_number : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("mobile-no")
        }}</label>
        <p class="form-control-static">{{ user.mobile_number }}</p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("address")
        }}</label>
        <p class="form-control-static">{{ fullAddress }}</p>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-6" v-if="organizationType == 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("bankname")
        }}</label>
        <p class="form-control-static">{{ user.bank_name }}</p>
      </div>
      <div class="form-group col-md-6" v-if="organizationType == 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("bank-account")
        }}</label>
        <p class="form-control-static">{{ user.bank_account_number }}</p>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{ $t("status") }}</label>
        <p class="form-control-static">
          <span class="badge badge-success" v-if="user.status == 1">{{
            $t("active")
          }}</span>
          <span class="badge badge-warning" v-if="user.status != 1">{{
            $t("inactive")
          }}</span>
        </p>
      </div>
      <div class="form-group col-md-6">
        <label for>{{ $t("email") }}</label>
        <p class="form-control-static">{{ user.email }}</p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("username")
        }}</label>
        <p class="form-control-static">{{ user.username }}</p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize"
          >Sudah sertai Kursus Pewarisan AWARIS
        </label>
        <p class="form-control-static">
          {{ user.is_attended_course | Attended_course }}
        </p>
      </div>
    </div>
    <hr />
    <div class="row" v-if="userRoleVal">
      <div class="form-group col-md-6">
        <label
          for
          style="text-transform: capitalize"
          v-if="organizationType == 'Awaris'"
          >{{ $t("position") }}</label
        >
        <label
          for
          style="text-transform: capitalize"
          v-if="organizationType != 'Awaris'"
          >{{ $t("user-role") }}</label
        >
        <p class="form-control-static">{{ user_accesses.role }}</p>
      </div>
      <div class="form-group col-md-6">
        <label for style="text-transform: capitalize">{{
          $t("org.nav2")
        }}</label>
        <p
          class="form-control-static"
          v-if="user_accesses && user_accesses.accessible"
        >
          {{ user_accesses.accessible.branch_name }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="organizationType != 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("staff-id")
        }}</label>
        <p class="form-control-static">
          {{ user.staff_id ? user.staff_id : "-" }}
        </p>
      </div>
      <div class="form-group col-md-6" v-if="user.status == 1">
        <label for style="text-transform: capitalize">{{
          $t("user.status")
        }}</label>
        <p class="form-control-static">
          <span class="badge badge-success" v-if="user_accesses.status == 1">{{
            $t("active")
          }}</span>
          <span class="badge badge-warning" v-if="user_accesses.status != 1">{{
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
      <div>
        <button
          v-if="['IT', 'Staff'].includes(this.userRole)"
          type="button"
          @click="$refs.changePasswordModal.showModal()"
          class="btn btn-primary"
        >
          Tukar Kata Laluan
        </button>
        &nbsp;
        <router-link
          v-if="['Staff', 'Super Admin', 'IT'].includes(userRole)"
          :to="{
            name: 'organization.user.edit',
            params: { organization_id: organizationId, user_id: userId },
          }"
          class="btn btn-primary"
          >{{ $t("update") }}</router-link
        >
      </div>
    </div>
    <ChangePasswordModal ref="changePasswordModal" />
  </div>
</template>
