<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { TheMask } from "vue-the-mask";
import { required, numeric, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      newUser: null,
      form: {
        gender: 1,
        branch_id: null,
        role: "",
        name: null,
        ic_number: null,
        email: null,
        office_phone_number: null,
        mobile_number: null,
        address: null,
        postcode: null,
        bank_name: null,
        bank_account_number: null,
        username: null,
        staff_id: null,
        city: null,
        state: null,
      },
      formPostcode: {},
      postcode: null,
      city: null,
      state: null,
      branches: [],
      roles: [],
    };
  },
  validations() {
    if (this.organizationType != "Awaris") {
      return {
        form: {
          name: {
            required,
          },
          gender: {
            required,
          },
          ic_number: {
            required,
          },
          mobile_number: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          email: {
            required,
            email,
          },
          role: {
            required,
          },
          username: {
            required,
          },
        },
      };
    } else if (this.organizationType == "Awaris") {
      return {
        form: {
          name: {
            required,
          },
          gender: {
            required,
          },
          ic_number: {
            required,
          },
          mobile_number: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          role: {
            required,
          },
          bank_name: {
            required,
          },
          bank_account_number: {
            required,
          },
          email: {
            required,
            email,
          },
          username: {
            required,
          },
        },
      };
    } else {
      return {
        form: {
          name: {
            required,
          },
          gender: {
            required,
          },
          ic_number: {
            required,
          },
          mobile_number: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          bank_name: {
            required,
          },
          bank_account_number: {
            required,
          },
          email: {
            required,
            email,
          },
          role: {
            required,
          },
          username: {
            required,
          },
        },
      };
    }
  },
  methods: {
    selectRole(event) {
      // var role = event.target.value;
      this.getBranches(event.target.value);
    },
    async saveOrganizationUser() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi ruangan yang bertanda (*)",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      this.form.organization_id = this.organizationId;
      this.form.username = this.organization.code + this.form.username;
      console.log(this.form.branch_id);
      var status = await this.saveUser();
      console.log("status user: ", status);
      if (status) {
        status = await this.saveUserAccess();
        // if (status) {
        // status = this.sendUserCreatedNotification();
        if (status) {
          this.$router.push({
            name: "organization.user",
            params: { organization_id: this.organizationId },
          });
        }
        // }
      }
    },
    async saveUser() {
      this.form.status = 0;
      return await ApiService.post(`user`, this.form)
        .then((response) => {
          this.newUser = response.data.user;
          console.log("User post success");
          return true;
        })
        .catch((error) => {
          console.log("User post failed");
          return false;
        });
    },
    async saveUserAccess() {
      if (["IT"].includes(this.form.role)) {
        this.form.status = 1;
      } else {
        this.form.status = 0;
      }
      //   this.form.status = 0;
      // this.form.accessible_id = this.form.branch_id;
      // this.form.accessible_type = "Branch";
      // }

      this.form.accessible_id = this.form.branch_id;
      this.form.accessible_type = "Branch";
      this.form.organization_id = this.organizationId;
      return await ApiService.post(`user/${this.newUser.id}/access`, this.form)
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    async sendUserCreatedNotification() {
      return await ApiService.get(
        `user/${this.newUser.id}/email-user-created`
      ).then(() => {
        return true;
      });
    },
    back() {
      this.$router.push({
        name: "organization.user",
        params: { user_id: this.userId },
      });
    },
    getBranches(role) {
      let query;
      if (role == "Admin") {
        query = `organization/${this.organizationId}/branch?is_headquarter=0?limit=500`;
      } else if (["Super Admin", "IT"].includes(role)) {
        query = `organization/${this.organizationId}/branch?is_headquarter=1?limit=500`;
      } else {
        query = `organization/${this.organizationId}/branch?limit=500`;
      }
      console.log(role);
      ApiService.get(query).then((response) => {
        this.branches = response.data.branches.data;
        if (this.branches && this.branches.length > 0) {
          this.form.branch_id = this.branches[0].id;
        }
      });
    },
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              this.form.city = postcode.city;
              this.form.state = postcode.state;
            }
          })
          .catch(() => {
            this.form.city = "";
            this.form.state = "";
          });
      }
    },
    openpostcode() {
      this.$refs["modalPostcode"].show();
    },
    async storePostcode() {
      await ApiService.post(`postcode`, this.formPostcode).then((response) => {
        this.postcode = this.formPostcode.postcode;
      });
      await this.getPostcode();
      this.formPostcode = {};
      this.$swal.fire({
        icon: "success",
        html: "Poskod baharu telah didaftarkan.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    },
    setRoles() {
      if (this.organizationType == "Awaris") {
        this.roles = ["Staff", "Agent"];
      } else {
        if (["IT"].includes(this.userRole)) {
          this.roles = ["Admin", "Agent"];
        } else if (this.userRole == "Admin") {
          this.roles = ["Agent"];
        } else if (
          this.userRole == "Super Admin" &&
          this.organizationId != 11
        ) {
          this.roles = ["Admin", "Agent"];
        } else if (this.userRole == "Staff") {
          if (this.organizationId == 11) {
            this.roles = ["Super Admin", "Admin", "Agent", "IT"];
          } else {
            this.roles = ["Super Admin", "Admin", "Agent"];
          }
        }
      }
      this.form.role = this.roles[0];
      this.onRoleChange();
    },
    onRoleChange() {
      console.log("ASD");
      if (["Super Admin", "Staff"].includes(this.form.role)) {
        this.getBranches("Super Admin");
      } else if (this.form.role == "Admin") {
        this.getBranches("Admin");
      } else if (this.form.role == "Agent") {
        this.getBranches(null);
      } else if (this.form.role == "IT") {
        this.getBranches("IT");
      }
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole"]),
    organizationId() {
      return this.$route.params.organization_id;
    },
    organizationType() {
      return this.organization.type;
    },
    genders() {
      return this.$t("genders").split(",");
    },
  },
  components: { TheMask },

  mounted() {},
  watch: {
    organizationType: [
      {
        handler: "setRoles",
      },
    ],
  },
  props: {
    organization: {
      type: Object,
    },
  },
};
</script>

<template>
  <div>
    <h5 class="mb-3">{{ $t("user.add-new") }}</h5>
    <div class="row">
      <div
        class="form-group col-md-8"
        :class="{ 'has-error': $v.form.name.$error }"
      >
        <label for="name">{{ $t("name") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          class="form-control"
          id="name"
          v-uppercase
          v-model.trim="$v.form.name.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.name.$error && !$v.form.name.required"
        >
          Nama tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.gender.$error }"
      >
        <label for="gender">{{ $t("gender") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id="gender"
          class="form-control"
          v-model.trim="$v.form.gender.$model"
        >
          <option
            v-for="(gender, index) in genders"
            :key="index"
            :value="gender.split(':')[0]"
          >
            {{ gender.split(":")[1] }}
          </option>
        </select>
        <div
          class="form-error"
          v-if="$v.form.gender.$error && !$v.form.gender.required"
        >
          Jantina tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.ic_number.$error }"
      >
        <label for="ic_number">{{ $t("mykad") }}</label>
        <span class="text-danger">*</span>
        <the-mask
          id="ic_number"
          :mask="['######-##-####']"
          class="form-control"
          v-model.trim="$v.form.ic_number.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
        >
          No. MyKad tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="office_phone_number">{{ $t("office-no") }}</label>
        <input
          type="text"
          class="form-control"
          id="office_phone_number"
          v-model="form.office_phone_number"
        />
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.mobile_number.$error }"
      >
        <label for="mobile_number">{{ $t("mobile-no") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          class="form-control"
          id="mobile_number"
          v-model.trim="$v.form.mobile_number.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.mobile_number.$error && !$v.form.mobile_number.required"
        >
          No. Telefon Bimbit tidak boleh dibiarkan kosong.
        </div>
        <div
          class="form-error"
          v-if="$v.form.mobile_number.$error && !$v.form.mobile_number.numeric"
        >
          No. Telefon Bimbit hendaklah dalam bentuk nombor.
        </div>
      </div>
      <div
        class="form-group col-md-12"
        :class="{ 'has-error': $v.form.address.$error }"
      >
        <label for="address">{{ $t("address") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          id="address"
          v-model.trim="$v.form.address.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.address.$error && !$v.form.address.required"
        >
          Alamat tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.postcode.$error }"
      >
        <div class="d-flex justify-content-between align-items-center">
          <label for="postcode"
            >{{ $t("postcode") }}
            <span class="text-danger">*</span>
          </label>
          <span
            @click="openpostcode"
            style="text-decoration: underline; font-size: 11px; color: #333"
            >{{ $t("add-new") }}</span
          >
        </div>
        <input
          type="text"
          id="postcode"
          class="form-control"
          @blur="getPostcode"
          v-model.lazy.trim="$v.form.postcode.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.postcode.$error && !$v.form.postcode.required"
        >
          Poskod tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="city">{{ $t("city") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          id="city"
          readonly
          v-model="form.city"
        />
      </div>
      <div class="form-group col-md-4">
        <label for="state">{{ $t("state") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          id="state"
          readonly
          v-model="form.state"
        />
      </div>
    </div>
    <div class="row">
      <div
        v-if="organizationType == 'Awaris'"
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.bank_name.$error }"
      >
        <label for="bank_name">{{ $t("bankname") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model.trim="$v.form.bank_name.$model"
          id="bank_name"
        />
        <div
          class="form-error"
          v-if="$v.form.bank_name.$error && !$v.form.bank_name.required"
        >
          Nama Bank tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        v-if="organizationType == 'Awaris'"
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.bank_account_number.$error }"
      >
        <label for="bank_account_number">{{ $t("bank-account") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          class="form-control"
          id="bank_account_number"
          v-model.trim="$v.form.bank_account_number.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.form.bank_account_number.$error &&
            !$v.form.bank_account_number.required
          "
        >
          No. Akaun Bank tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>
    <hr class="primary" />
    <div class="row">
      <!-- <div class="form-group col-md-4">
        <label for="state">{{ $t("status") }}</label>
        <select name id class="form-control" v-model="form.status">
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
      </div> -->
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.role.$error }"
      >
        <label for="role" v-if="organizationType == 'Awaris'">{{
          $t("position")
        }}</label>
        <label for="role" v-if="organizationType != 'Awaris'">{{
          $t("user-role")
        }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.form.role.$model"
          @change="onRoleChange"
        >
          <option :value="role" v-for="role in roles" :key="role">
            {{ role }}
          </option>
        </select>
        <div
          class="form-error"
          v-if="$v.form.role.$error && !$v.form.role.required"
        >
          Jawatan tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="branch">{{ $t("org.nav2") }}</label>
        <span class="text-danger">*</span>
        <select name class="form-control" v-model="form.branch_id">
          <option
            :value="branch.id"
            v-for="(branch, index) in branches"
            :key="index"
          >
            {{ branch.branch_name }}
          </option>
          <option value="" selected disabled v-if="branches.length == 0">
            Tiada Cawangan
          </option>
        </select>
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.email.$error }"
      >
        <label for="email">{{ $t("email") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-lowercase
          class="form-control"
          v-model.trim="$v.form.email.$model"
        />
        <div class="form-error" v-if="!$v.form.email.email">
          Anda telah memasukkan alamat emel yang tidak sah!
        </div>
        <div
          class="form-error"
          v-if="$v.form.email.$error && !$v.form.email.required"
        >
          E-mel tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.username.$error }"
      >
        <label for="username">{{ $t("username") }}</label>
        <span class="text-danger">*</span>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">{{
              organization.code
            }}</span>
          </div>
          <input
            type="number"
            class="form-control"
            aria-describedby="basic-addon1"
            v-model.trim="$v.form.username.$model"
          />
        </div>
        <div
          class="form-error"
          v-if="$v.form.username.$error && !$v.form.username.required"
        >
          Nama Pengguna tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-4" v-if="organizationType != 'Awaris'">
        <label for="staff-id">{{ $t("staff-id") }}</label>
        <input type="text" class="form-control" v-model="form.staff_id" />
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        {{ $t("cancel") }}
      </button>
      <button
        type="button"
        @click="saveOrganizationUser"
        class="btn btn-primary"
      >
        <i class="mdi mdi-file-document"></i>{{ $t("save") }}
      </button>
    </div>
    <b-modal
      ref="modalPostcode"
      class="modal fade"
      v-bind:title="$t('add-newpostcode')"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      @ok="storePostcode"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("postcode") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              class="form-control"
              v-model="formPostcode.postcode"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("city") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.city"
            />
          </div>
          <div class="col-md-6 form-group">
            <label>
              {{ $t("state") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.state"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
