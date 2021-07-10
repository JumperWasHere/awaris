<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { TheMask } from "vue-the-mask";
import { required, email, numeric } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      user: {},
      isSubmit: false,
      userRoleData: null,
      form: {
        name: null,
        ic_number: null,
        gender: "",
        branch_id: null,
        email: null,
        office_phone_number: null,
        mobile_number: null,
        address: null,
        postcode: null,
        bank_name: null,
        bank_account_number: null,
        status: null,
        username: null,
        role: null,
        staff_id: null,
        city: null,
        state: null,
      },
      formPostcode: {},
      postcode: null,
      accessible_id: null,
      accessible_type: "Organization",
      allow_payment_gateway: 0,
      allow_cash_payment: 0,
      statusAccess: 0,
      city: null,
      state: null,
      roles: [],
      branches: [],
      user_accesses: [],
      btnSave: true,
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
            numeric,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          status: {
            required,
          },
          email: {
            required,
            email,
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
            numeric,
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
          status: {
            required,
          },
          email: {
            required,
            email,
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
          status: {
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
        },
      };
    }
  },
  mounted() {
    console.log(this.userId);
    this.getBranches();
    this.getUserDetails();
    this.getUserAccessDetails();
  },
  methods: {
    getUserDetails() {
      ApiService.get(`user/${this.userId}`).then((response) => {
        this.user = response.data.user ?? {};
        this.form = this.user;
      });
    },
    getUserAccessDetails() {
      ApiService.get(`user/${this.userId}/access`).then((response) => {
        var user_accesses = response.data.user_accesses.data[0];
        console.log("USER ACCESS", user_accesses);
        if (user_accesses) {
          this.user_accesses = user_accesses;
          this.statusAccess = user_accesses.status;
          this.accessible_type = user_accesses.accessible_type;
          this.allow_payment_gateway =
            user_accesses.allow_payment_gateway ?? null;
          this.allow_cash_payment = user_accesses.allow_cash_payment ?? null;
          this.form.branch_id = user_accesses.accessible.id;
          //TODO: get direct accesible_id if, user do not select the list
          this.accessible_id = user_accesses.accessible.id;
          this.form.role = user_accesses.role;
        }
        this.btnSave = false;
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
    async submitForm() {
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
      this.isSubmit = true;
      var user = {
        _method: "PATCH",
        name: this.form.name,
        ic_number: this.form.ic_number,
        gender: this.form.gender,
        branch_id: this.form.branch_id,
        email: this.form.email,
        office_phone_number: this.form.office_phone_number,
        mobile_number: this.form.mobile_number,
        address: this.form.address,
        postcode: this.form.postcode,
        bank_name: this.form.bank_name,
        bank_account_number: this.form.bank_account_number,
        status: this.form.status,
        // status: 0,
        city: this.form.city,
        state: this.form.state,
        username: this.form.username,
        role: this.form.role,
        staff_id: this.form.staff_id,
        is_attended_course: this.form.is_attended_course,
      };

      if (["Agent", "Admin"].includes(this.form.role)) {
        this.accessible_type = "Branch";
        this.accessible_id = this.form.branch_id;
      } else {
        this.accessible_id = this.organizationId;
      }
      console.log(
        this.accessible_id,
        "||",
        this.form.role,
        "||",
        this.form.branch_id
      );

      ApiService.post(`/user/${this.user.id}`, user)
        .then((response) => {
          this.updateUserAccess();
          // await this.sendEmailCreate();
        })
        .catch((error) => {
          console.log(error);
          this.isSubmit = false;
        });
    },
    updateUserAccess() {
      var user_accesses = {
        _method: "PATCH",
        organization_id: parseInt(this.organizationId),
        accessible_type: this.accessible_type,
        accessible_id: parseInt(this.accessible_id),
        branch_id: parseInt(this.form.branch_id),
        allow_payment_gateway: parseInt(this.allow_payment_gateway),
        allow_cash_payment: parseInt(this.allow_cash_payment),
        role: this.form.role,
        status: parseInt(this.statusAccess),
      };
      // console.log("User to update: ", user_accesses);
      ApiService.post(`/user-access/${this.user_accesses.id}`, user_accesses)
        .then((response) => {
          this.$swal
            .fire({
              icon: "success",
              html: "Kemaskini berjaya!",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            })
            .then((response) => {
              this.$router.push({
                name: "organization.user.info",
                params: {
                  user_id: this.userId,
                },
              });
            });
          this.isSubmit = false;
        })
        .catch((error) => {
          this.isSubmit = false;
        });
    },
    getBranches() {
      ApiService.get(`organization/${this.organizationId}/branch`).then(
        (response) => {
          this.organization_type = response.data.organization.type;
          console.log(this.organization_type);
          if (this.organization_type == "Awaris") {
            this.roles = ["Staff", "Agent"];
          } else {
            this.roles = ["Super Admin", "Admin", "Agent"];
          }
          this.form.role = this.roles[0];
          this.branches = response.data.branches.data;
          this.btnSave = false;
        }
      );
    },
    back() {
      this.$router.push({
        name: "organization.user.info",
        params: { organization_id: this.organizationId },
      });
    },
  },

  computed: {
    organizationType() {
      return this.organization.type;
    },
    organizationId() {
      return this.$route.params.organization_id;
    },
    userId() {
      return this.$route.params.user_id;
    },
    ...mapGetters(["userRole"]),
    userRoleVal() {
      return this.userRole;
    },
    genders() {
      return this.$t("genders").split(",");
    },
  },
  components: { TheMask },
  props: {
    organization: {
      type: Object,
    },
  },
};
</script>

<template>
  <div>
    <div v-if="organizationType != 'Awaris'">
      <h5 class="mb-3">{{ $t("user.update-org") }} - {{ user.name }}</h5>
    </div>
    <div v-if="organizationType == 'Awaris'">
      <h5 class="mb-3">{{ $t("user.update-awaris") }}</h5>
    </div>
    <div class="row" v-if="organizationType == 'Awaris'">
      <div
        class="form-group col-md-8"
        :class="{ 'has-error': $v.form.name.$error }"
      >
        <label for="name">{{ $t("name") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          id="name"
          required
          v-model.trim="$v.form.name.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.name.$error && !$v.form.name.required"
        >
          Nama tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label for="role">{{ $t("position") }}</label>
          <select
            name
            class="form-control"
            v-model="form.role"
            v-if="userRoleVal == 'Staff'"
          >
            <option :value="role" v-for="role in roles" :key="role">
              {{ role }}
            </option>
          </select>
          <p class="form-control-static" v-if="userRoleVal != 'Staff'">
            {{ form.role }}
          </p>
        </div>
      </div>
    </div>
    <div class="row" v-if="organizationType != 'Awaris'">
      <div
        class="form-group col-md-12"
        :class="{ 'has-error': $v.form.name.$error }"
      >
        <label for="name">{{ $t("name") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          id="name"
          required
          v-model.trim="$v.form.name.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.name.$error && !$v.form.name.required"
        >
          Nama tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>
    <div class="row">
      <div
        class="form-group col-md-3"
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
          <option value="">-- {{ $t("choose.gender") }} --</option>
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
        class="form-group col-md-3"
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
      <div class="form-group col-md-3">
        <label for="office_phone_number">{{ $t("office-no") }}</label>
        <input
          v-uppercase
          type="text"
          class="form-control"
          id="office_phone_number"
          v-model="form.office_phone_number"
        />
      </div>
      <div
        class="form-group col-md-3"
        :class="{ 'has-error': $v.form.mobile_number.$error }"
      >
        <label for="mobile_number">{{ $t("mobile-no") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
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
          v-uppercase
          type="text"
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
          <label for="postcode" class="d-block"
            >{{ $t("postcode") }} <span class="text-danger">*</span></label
          >
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
          v-uppercase
          type="text"
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
          v-uppercase
          type="text"
          class="form-control"
          id="state"
          readonly
          v-model="form.state"
        />
      </div>
    </div>
    <div class="row" v-if="organizationType == 'Awaris'">
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.bank_name.$error }"
      >
        <label for="bank_name">{{ $t("bankname") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
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
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.bank_account_number.$error }"
      >
        <label for="bank_account_number">{{ $t("bank-account") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
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
    <hr />
    <div class="row">
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.status.$error }"
      >
        <label for="state">{{ $t("status") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.form.status.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="2">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="$v.form.status.$error && !$v.form.status.required"
        >
          Status tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group col-md-4"
        :class="{ 'has-error': $v.form.email.$error }"
      >
        <label for="state">{{ $t("email") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          class="form-control"
          required
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
      <div class="form-group col-md-4">
        <label for="state">{{ $t("username") }}</label>
        <input
          @keydown.space.prevent
          type="text"
          class="form-control"
          v-model="form.username"
        />
      </div>
      <div class="form-group col-md-4">
        <label for="state">Sudah sertai Kursus Pewarisan AWARIS:</label>
        <select
          name
          id
          class="form-control"
          v-model.trim="form.is_attended_course"
        >
          <option value="1">Ya</option>
          <option value="0">Tidak</option>
        </select>
      </div>
    </div>
    <hr />
    <div v-if="userRoleVal">
      <h5>{{ $t("user.access") }}</h5>
      <div class="row">
        <div class="form-group col-md-4">
          <label for="state">{{ $t("org.nav2") }}</label>
          <input
            type="text"
            v-if="user_accesses && user_accesses.accessible"
            class="form-control-plaintext"
            :value="user_accesses.accessible.branch_name"
          />
        </div>
        <div class="form-group col-md-4" v-if="organizationType != 'Awaris'">
          <label for="role" v-if="organizationType != 'Awaris'">{{
            $t("user-role")
          }}</label>
          <input
            type="text"
            class="form-control-plaintext"
            :value="user_accesses.role"
          />
        </div>
        <div class="form-group col-md-4" v-if="organizationType != 'Awaris'">
          <label for="state">{{ $t("staff-id") }}</label>
          <input
            v-uppercase
            type="text"
            class="form-control"
            v-model="form.staff_id"
          />
        </div>
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        {{ $t("cancel") }}
      </button>
      <button
        type="button"
        @click="submitForm"
        class="btn btn-primary"
        :disabled="btnSave"
      >
        <i class="mdi mdi-file-document"></i>
        {{ $t("save") }}
        <span class="spinner-border spinner-border-sm" v-if="isSubmit"></span>
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
