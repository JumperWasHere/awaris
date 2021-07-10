<script>
import ApiService from "@/services/api.service";
import { required, email } from "vuelidate/lib/validators";
export default {
  props: ["userRole"],
  data() {
    return {
      branch: {},
      isSubmit: false,
      organization_type: null,
      form: {
        type_name: "Branch",
        state: "",
        phase: "",
        branch_name: "",
        status: 1,
        code: "",
        address: "",
        postcode: "",
        city: "",
        phone_number: "",
        website: "",
        email: "",
        bank_account_number: "",
        bank_account_holder: "",
        bank_name: "",
      },
      formPostcode: {},
      postcode: null,
    };
  },
  validations() {
    if (
      this.organization_type == "Koperasi" ||
      this.organization_type == "Kerajaan" ||
      this.organization_type == "Bank" ||
      this.organization_type == "Swasta"
    ) {
      return {
        form: {
          branch_name: {
            required,
          },
          phase: {
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
          email: {
            required,
            email,
          },
        },
      };
    } else if (this.organization_type == "Awaris") {
      return {
        form: {
          branch_name: {
            required,
          },
          phase: {
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
        },
      };
    } else {
      return {
        form: {
          branch_name: {
            required,
          },
          phase: {
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
          email: {
            required,
            email,
          },
        },
      };
    }
  },
  mounted() {
    console.log(this.branchId);
    this.getBranchDetails();

    console.log("Organization", this.organization_type);
    if (this.organizationId) {
      this.getOrganization();
    }
  },
  methods: {
    getOrganization() {
      ApiService.get(`organization/${this.organizationId}`).then((response) => {
        this.organization_type = response.data.organization.type;
        console.log(this.organization_type);
      });
    },
    getPostcode(type) {
      var postcode = this.form.postcode;
      if (type == 2) {
        postcode = this.form.postcode_2;
      }
      if (this.form.postcode) {
        ApiService.get(`postcode/${postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              if (type == 1) {
                this.form.city = postcode.city;
                this.form.state = postcode.state;
              } else {
                this.form.city_2 = postcode.city;
                this.form.state_2 = postcode.state;
              }
            }
          })
          .catch(() => {
            if (type == 1) {
              this.form.city = "";
              this.form.state = "";
            } else {
              this.form.city_2 = "";
              this.form.state_2 = "";
            }
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
    getBranchDetails() {
      ApiService.get(`branch/${this.branchId}/user`).then((response) => {
        this.branch = response.data.branch ?? {};
        this.form = this.branch;
        console.log(this.form);
      });
    },
    async submitForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.isSubmit = true;
        var branchId = await this.validate();
        this.isSubmit = false;
      }
      if (branchId != null) {
        this.$swal
          .fire({
            icon: "success",
            html: "Kemaskini berjaya!",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          })
          .then((result) => {
            this.$router.push({
              name: "organization.branch.info",
              params: { branch_id: this.branchId },
            });
          });
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
    async validate() {
      // this.isSubmit = true;
      var branch = {
        _method: "PATCH",
        type_name: "Branch",
        state: this.form.state,
        phase: this.form.phase,
        status: this.form.status,
        branch_name: this.form.branch_name,
        code: this.form.code,
        address: this.form.address,
        postcode: this.form.postcode,
        city: this.form.city,
        phone_number: this.form.phone_number,
        website: this.form.website,
        email: this.form.email,
        bank_account_number: this.form.bank_account_number,
        bank_account_holder: this.form.bank_account_holder,
        bank_name: this.form.bank_name,
      };
      console.log("Branch to update: ", branch);
      return await ApiService.post(`/branch/${this.branch.id}`, branch)
        .then((response) => {
          console.log(response.data);
          return response.data.branch.id;
        })
        .catch((error) => {
          this.isSubmit = false;
          return null;
        });
    },
    back() {
      this.$router.push({
        name: "organization.branch.info",
        params: { organization_id: this.organizationId },
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
      if (!this.form) {
        return "-";
      }
      return String(this.form.address ? this.form.address.concat(", ") : "")
        .concat(
          String(this.form.postcode ? this.form.postcode.concat(", ") : "")
        )
        .concat(String(this.form.city ? this.form.city.concat(", ") : ""))
        .concat(String(this.form.state ? this.form.state.concat(". ") : ""));
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div
        class="form-group col-md-6"
        :class="{ 'has-error': $v.form.phase.$error }"
      >
        <label for="phase">{{ $t("phase") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.form.phase.$model"
        >
          <option value>- {{ $t("choose.phase") }} -</option>
          <option value="Region">Region</option>
          <option value="Branch">Branch</option>
          <option value="Kiosk">Kiosk</option>
        </select>
        <div
          class="form-error"
          v-if="$v.form.phase.$error && !$v.form.phase.required"
        >
          Peringkat tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group col-md-6"
        :class="{ 'has-error': $v.form.branch_name.$error }"
      >
        <label for="branch_name">{{ $t("org.branch-name") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model.trim="$v.form.branch_name.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.branch_name.$error && !$v.form.branch_name.required"
        >
          Nama Cawangan tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-6">
        <label for="code">{{ $t("org.branch-code") }}</label>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model="form.code"
        />
      </div>
      <div
        class="form-group col-md-6"
        :class="{ 'has-error': $v.form.address.$error }"
      >
        <label for="address">{{ $t("address") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
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
        class="form-group col-md-6"
        :class="{ 'has-error': $v.form.postcode.$error }"
      >
        <div class="d-flex justify-content-between align-items-center">
          <label for="postcode"
            >{{ $t("postcode") }}<span class="text-danger">*</span></label
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
          @blur="getPostcode(1)"
          v-model.lazy.trim="$v.form.postcode.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.postcode.$error && !$v.form.postcode.required"
        >
          Poskod tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-6">
        <label for="city">{{ $t("city") }}</label>
        <input
          type="text"
          v-uppercase
          class="form-control"
          readonly
          v-model="form.city"
        />
      </div>
      <div class="form-group col-md-6">
        <label for="state">{{ $t("state") }}</label>
        <input
          type="text"
          v-uppercase
          class="form-control"
          readonly
          v-model="form.state"
        />
      </div>
      <div class="form-group col-md-6">
        <label for="office-no">{{ $t("office-no") }}</label>
        <input type="text" class="form-control" v-model="form.phone_number" />
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for="website">{{ $t("website") }}</label>
        <input
          type="text"
          v-lowercase
          class="form-control"
          v-model="form.website"
        />
      </div>
      <div
        class="form-group col-md-6"
        v-if="organization_type != 'Awaris'"
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
          Anda telah memasukkan alamat email yang tidak sah!
        </div>
        <div
          class="form-error"
          v-if="$v.form.email.$error && !$v.form.email.required"
        >
          E-mel tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for="bank-account">{{ $t("bank-account") }}</label>
        <input
          type="text"
          class="form-control"
          v-model="form.bank_account_number"
        />
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for="acc-holder">{{ $t("acc-holder") }}</label>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model="form.bank_account_holder"
        />
      </div>
      <div class="form-group col-md-6" v-if="organization_type != 'Awaris'">
        <label for="bankname">{{ $t("bankname") }}</label>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model="form.bank_name"
        />
      </div>
      <div
        class="form-group col-md-6"
        :class="{ 'has-error': $v.form.status.$error }"
      >
        <label for="status">{{ $t("status") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.form.status.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="$v.form.status.$error && !$v.form.status.required"
        >
          Status tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        {{ $t("cancel") }}
      </button>
      <button type="button" @click="submitForm" class="btn btn-primary">
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
