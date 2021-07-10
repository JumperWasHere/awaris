<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { required, email } from "vuelidate/lib/validators";
import { TheMask } from "vue-the-mask";
export default {
  data() {
    return {
      isSubmit: false,
      logo: null,
      organization_type: null,
      organization: {
        name: "",
        short_name: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
        phone_number: "",
        email: "",
        account_type: "",
        code: "",
        status: "",
        website: "",
        company_registration_number: "",
        founder_name: "",
        pic_phone_number: "",
        mykad_number: "",
        bank_account_number: "",
        bank_account_holder: "",
        bank_name: "",
        allow_payment_gateway: "",
        allow_cash_payment: "",
        allow_direct_payment: "",
        allow_loan_payment: "",
        is_bmmb: null
      },
      form: {
        username: null,
        gender: null,
      },
      username: null,

      postcode: "",
    };
  },
  validations() {
    if (
      this.organizationType == "Koperasi" ||
      this.organizationType == "Kerajaan" ||
      this.organizationType == "Swasta"
    ) {
      return {
        organization: {
          name: {
            required,
          },
          short_name: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          city: {
            required,
          },
          state: {
            required,
          },
          email: {
            required,
            email,
          },
          account_type: {
            required,
          },
          code: {
            required,
          },
          status: {
            required,
          },
          company_registration_number: {
            required,
          },
          bank_account_number: {
            required,
          },
          bank_account_holder: {
            required,
          },
          bank_name: {
            required,
          },
          allow_payment_gateway: {
            required,
          },
          allow_cash_payment: {
            required,
          },
          allow_direct_payment: {
            required,
          },
          founder_name: {
            required,
          },
          pic_phone_number: {
            required,
          },
        },
      };
    } else if (this.organizationType == "Bank") {
      return {
        organization: {
          name: {
            required,
          },
          short_name: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          city: {
            required,
          },
          state: {
            required,
          },
          email: {
            required,
            email,
          },
          account_type: {
            required,
          },
          code: {
            required,
          },
          status: {
            required,
          },
          company_registration_number: {
            required,
          },
          allow_payment_gateway: {
            required,
          },
          allow_cash_payment: {
            required,
          },
          allow_direct_payment: {
            required,
          },
          allow_loan_payment: {
            required,
          },
          founder_name: {
            required,
          },
          pic_phone_number: {
            required,
          },
        },
      };
    } else if (this.organizationType == "Individu") {
      return {
        organization: {
          name: {
            required,
          },
          short_name: {
            required,
          },
          code: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          city: {
            required,
          },
          state: {
            required,
          },
          email: {
            required,
            email,
          },
          status: {
            required,
          },
          mykad_number: {
            required,
          },
          bank_account_number: {
            required,
          },
          bank_account_holder: {
            required,
          },
          bank_name: {
            required,
          },
          allow_payment_gateway: {
            required,
          },
          allow_cash_payment: {
            required,
          },
          allow_direct_payment: {
            required,
          },
        },
        form: {
          username: {
            required,
          },
          gender: {
            required,
          },
        },
      };
    } else if (this.organizationType == "Awaris") {
      return {
        organization: {
          name: {
            required,
          },
          short_name: {
            required,
          },
          account_type: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          city: {
            required,
          },
          state: {
            required,
          },
          email: {
            required,
            email,
          },
          status: {
            required,
          },
          allow_payment_gateway: {
            required,
          },
          allow_cash_payment: {
            required,
          },
          allow_direct_payment: {
            required,
          },
        },
      };
    } else {
      return {
        organization: {
          name: {
            required,
          },
          short_name: {
            required,
          },
          address: {
            required,
          },
          postcode: {
            required,
          },
          city: {
            required,
          },
          state: {
            required,
          },
          email: {
            required,
            email,
          },
          account_type: {
            required,
          },
          code: {
            required,
          },
          status: {
            required,
          },
          company_registration_number: {
            required,
          },
          bank_account_number: {
            required,
          },
          bank_account_holder: {
            required,
          },
          bank_name: {
            required,
          },
          allow_payment_gateway: {
            required,
          },
          allow_cash_payment: {
            required,
          },
          allow_direct_payment: {
            required,
          },
          allow_loan_payment: {
            required,
          },
          founder_name: {
            required,
          },
          pic_phone_number: {
            required,
          },
        },
        form: {
          username: {
            required,
          },
          gender: {
            required,
          },
        },
      };
    }
  },
  mounted() {
    this.getUserDetails();
    // console.log("OrganizationType", this.organization_type);
    console.log("OrgId", this.organizationId);
    if (this.organizationId) {
      this.getOrganization();
      this.getOrganizationLogo();
    }
  },
  computed: {
    userRoleVal() {
      return this.userRole;
    },
    userId() {
      return this.$route.params.user_id;
    },
    genders() {
      return this.$t("genders").split(",");
    },
    organizationId() {
      return this.$route.params.organization_id;
    },
    organizationType() {
      return this.organization.type;
    },
    ...mapGetters(["userRole"]),
  },
  components: {
    TheMask,
  },
  methods: {
    async getUserDetails() {
      ApiService.get(`organization/${this.organizationId}/user`).then(
        (response) => {
          var users = response.data.user_accesses.data[0].user ?? [];
          this.form = users;
          this.user = this.form;
          console.log("single user: ", this.form);
        }
      );
    },
    getOrganization() {
      ApiService.get(`organization/${this.organizationId}`).then((response) => {
        this.organization = response.data.organization ?? {};
        this.organization_type = response.data.organization.type;
        console.log(this.organization_type);
      });
    },
    getOrganizationLogo() {
      ApiService.get(
        `organization/${this.organizationId}/logo?stream=false`
      ).then((response) => {
        if (response.data.logo) {
          this.logo = response.data.logo.public_path;
        }
      });
    },
    filesChange(files) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");
      ApiService.post(
        `organization/${this.organizationId}/logo`,
        formData
      ).then((response) => {
        this.logo = response.data.attachment.public_path;
      });
    },
    getPostcode(type) {
      var postcode = this.organization.postcode;
      if (type == 2) {
        postcode = this.organization.postcode_2;
      }
      if (this.organization.postcode) {
        ApiService.get(`postcode/${postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              if (type == 1) {
                this.organization.city = postcode.city;
                this.organization.state = postcode.state;
              } else {
                this.organization.city_2 = postcode.city;
                this.organization.state_2 = postcode.state;
              }
            }
          })
          .catch(() => {
            if (type == 1) {
              this.organization.city = "";
              this.organization.state = "";
            } else {
              this.organization_2.city = "";
              this.organization_2.state = "";
            }
          });
      }
    },
    async saveOrganization() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.isSubmit = true;
        var organizationId = await this.validate();
        if (organizationId != null) {
          var organizationType = this.organization_type;
          if (organizationType == "Individu") {
            await this.userUpdate();
            this.$swal
              .fire({
                icon: "success",
                html: "Kemaskini Individu berjaya!",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Tutup",
              })
              .then((result) => {
                this.$router.push({
                  name: "organization.info-individual",
                  params: { organization_id: this.organization.id },
                });
              });
          } else {
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
                  name: "organization.info",
                  params: { organization_id: this.organization.id },
                });
              });
          }
        }
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

    async userUpdate() {
      var user = {
        _method: "PATCH",
        gender: this.form.gender,
        username: this.form.username,
      };
      return await ApiService.post(`/user/${this.user.id}`, user)
        .then((response) => {
          console.log("userUpdate", response.data.user);
          return response.data.user.id;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmit = false;
        });
    },
    async validate() {
      var organization;
      this.organization._method = "PATCH";
      organization = {
        name: this.organization.name,
        short_name: this.organization.short_name,
        address: this.organization.address,
        postcode: this.organization.postcode,
        city: this.organization.city,
        state: this.organization.state,
        phone_number: this.organization.phone_number,
        email: this.organization.email,
        website: this.organization.website,
        status: this.organization.status,
        code: this.organization.code,
        account_type: this.organization.account_type,
        allow_payment_gateway: this.organization.allow_payment_gateway,
        allow_cash_payment: this.organization.allow_cash_payment,
        allow_direct_payment: this.organization.allow_direct_payment,
        allow_loan_payment: this.organization.allow_loan_payment,
        company_registration_number: this.organization
          .company_registration_number,
        founder_name: this.organization.founder_name,
        mykad_number: this.organization.mykad_number,
        bank_account_number: this.organization.bank_account_number,
        bank_account_holder: this.organization.bank_account_holder,
        bank_name: this.organization.bank_name,
        pic_phone_number: this.organization.pic_phone_number,
      };
      return await ApiService.post(
        `organization/${this.organization.id}`,
        this.organization
      )
        .then((response) => {
          console.log(response.data);
          return response.data.organization.id;
        })
        .catch((error) => {
          this.isSubmit = false;
          return null;
        });
    },
    back() {
      this.$router.push({
        name: "organization.info",
        params: { organization_id: this.organization.id },
      });
    },
    backIndividu() {
      this.$router.push({
        name: "organization.info-individual",
        params: { organization_id: this.organization.id },
      });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
};
</script>

<template>
  <div>
    <div class="row justify-content-center mb-4">
      <div class="col-lg-12 text-center">
        <div class="page-next-level">
          <div v-if="logo">
            <img :src="logo" alt width="300" style="background: white" />
            <label
              class="upload-photo btn btn-primary upload-btn"
              for="upload-photo"
              >{{ $t("org.logo") }}</label
            >
            <input
              type="file"
              name="photo"
              id="upload-photo"
              accept="image/*"
              @change="filesChange($event.target.files)"
            />
          </div>
          <div v-if="!logo">
            <h4 class="title text-black" style="text-transform: capitalize">
              {{ organization.name }}
            </h4>
            <label
              class="upload-photo btn btn-primary upload-btn"
              for="upload-photo"
              >{{ $t("org.logo") }}</label
            >
            <input
              type="file"
              name="photo"
              id="upload-photo"
              accept="image/*"
              @change="filesChange($event.target.files)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.name.$error }"
      >
        <label for style="text-transform: capitalize">{{ $t("name") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.name.$model"
        />
        <div
          class="form-error"
          v-if="$v.organization.name.$error && !$v.organization.name.required"
        >
          Nama {{ organization.type }} tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.short_name.$error }"
      >
        <label for>{{ $t("shortname") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.short_name.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.short_name.$error &&
            !$v.organization.short_name.required
          "
        >
          Nama Pendek tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>
    <div class="row" v-if="organizationType == 'Awaris'">
      <div
        v-if="organizationType != 'Individu'"
        class="form-group col-md-6"
        :class="{ 'has-error': $v.organization.account_type.$error }"
      >
        <label for="account_type">{{ $t("account-type") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id="account_type"
          class="form-control"
          v-model.trim="$v.organization.account_type.$model"
        >
          <option value>-- {{ $t("choose.account") }} --</option>
          <option value="Biasa">Biasa</option>
          <option value="Financial">Financial</option>
          <option value="Non-financial">Non-financial</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.account_type.$error &&
            !$v.organization.account_type.required
          "
        >
          Jenis Akaun tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.address.$error }"
      >
        <label for>{{ $t("address") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.address.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.address.$error && !$v.organization.address.required
          "
        >
          Alamat tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.postcode.$error }"
      >
        <label for>{{ $t("postcode") }}</label>
        <span class="text-danger">*</span>
        <input
          type="number"
          id="postcode"
          class="form-control"
          @blur="getPostcode(1)"
          v-model.lazy.trim="$v.organization.postcode.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.postcode.$error &&
            !$v.organization.postcode.required
          "
        >
          Poskod tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.city.$error }"
      >
        <label for>{{ $t("city") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.city.$model"
          readonly
        />
        <div
          class="form-error"
          v-if="$v.organization.city.$error && !$v.organization.city.required"
        >
          Bandar tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.state.$error }"
      >
        <label for>{{ $t("state") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.state.$model"
          readonly
        />
        <div
          class="form-error"
          v-if="$v.organization.state.$error && !$v.organization.state.required"
        >
          Negeri tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group">
        <label for v-if="organizationType == 'Individu'">{{
          $t("mobile-no")
        }}</label>
        <label for v-if="organizationType != 'Individu'">{{
          $t("office-no")
        }}</label>
        <input
          type="number"
          class="form-control"
          v-model="organization.phone_number"
        />
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.email.$error }"
      >
        <label for v-if="organizationType == 'Individu'">{{
          $t("email")
        }}</label>
        <label for v-if="organizationType != 'Individu'">{{
          $t("office-email")
        }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-lowercase
          class="form-control"
          v-model.trim="$v.organization.email.$model"
        />
        <div class="form-error" v-if="!$v.organization.email.email">
          Anda telah memasukkan alamat e-mel yang tidak sah!
        </div>
        <div
          class="form-error"
          v-if="$v.organization.email.$error && !$v.organization.email.required"
        >
          E-mel tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType != 'Individu'">
        <label for>{{ $t("website") }}</label>
        <input
          type="text"
          v-lowercase
          class="form-control"
          v-model="organization.website"
        />
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.status.$error }"
      >
        <label for>{{ $t("status") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          class="form-control"
          v-model.trim="$v.organization.status.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.status.$error && !$v.organization.status.required
          "
        >
          Status tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>
    <div class="row" v-if="organizationType != 'Awaris'">
      <div
        class="form-group col-md-6"
        :class="{ 'has-error': $v.organization.code.$error }"
      >
        <label for="code">{{ $t("code") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.code.$model"
        />
        <div
          class="form-error"
          v-if="$v.organization.code.$error && !$v.organization.code.required"
        >
          Kod tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        v-if="organizationType != 'Individu'"
        class="form-group col-md-6"
        :class="{ 'has-error': $v.organization.account_type.$error }"
      >
        <label for="account_type">{{ $t("account-type") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id="account_type"
          class="form-control"
          v-model.trim="$v.organization.account_type.$model"
        >
          <option value>-- {{ $t("choose.account") }} --</option>
          <option value="Biasa">Biasa</option>
          <option value="Financial">Financial</option>
          <option value="Non-financial">Non-financial</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.account_type.$error &&
            !$v.organization.account_type.required
          "
        >
          Jenis Akaun tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.address.$error }"
      >
        <label for>{{ $t("address") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.address.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.address.$error && !$v.organization.address.required
          "
        >
          Alamat tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.postcode.$error }"
      >
        <label for>{{ $t("postcode") }}</label>
        <span class="text-danger">*</span>
        <input
          type="number"
          id="postcode"
          class="form-control"
          @blur="getPostcode(1)"
          v-model.lazy.trim="$v.organization.postcode.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.postcode.$error &&
            !$v.organization.postcode.required
          "
        >
          Poskod tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.city.$error }"
      >
        <label for>{{ $t("city") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.city.$model"
          readonly
        />
        <div
          class="form-error"
          v-if="$v.organization.city.$error && !$v.organization.city.required"
        >
          Bandar tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.state.$error }"
      >
        <label for>{{ $t("state") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.state.$model"
          readonly
        />
        <div
          class="form-error"
          v-if="$v.organization.state.$error && !$v.organization.state.required"
        >
          Negeri tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group">
        <label for v-if="organizationType == 'Individu'">{{
          $t("mobile-no")
        }}</label>
        <label for v-if="organizationType != 'Individu'">{{
          $t("office-no")
        }}</label>
        <input
          type="number"
          class="form-control"
          v-model="organization.phone_number"
        />
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.email.$error }"
      >
        <label for v-if="organizationType == 'Individu'">{{
          $t("email")
        }}</label>
        <label for v-if="organizationType != 'Individu'">{{
          $t("office-email")
        }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-lowercase
          class="form-control"
          v-model.trim="$v.organization.email.$model"
        />
        <div class="form-error" v-if="!$v.organization.email.email">
          Anda telah memasukkan alamat e-mel yang tidak sah!
        </div>
        <div
          class="form-error"
          v-if="$v.organization.email.$error && !$v.organization.email.required"
        >
          E-mel tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType != 'Individu'">
        <label for>{{ $t("website") }}</label>
        <input
          type="text"
          v-lowercase
          class="form-control"
          v-model="organization.website"
        />
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.status.$error }"
      >
        <label for>{{ $t("status") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          class="form-control"
          v-model.trim="$v.organization.status.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.status.$error && !$v.organization.status.required
          "
        >
          Status tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>
    <div class="row" v-if="organizationType != 'Awaris'">
      <div
        class="col-md-6 form-group"
        v-if="organizationType != 'Individu'"
        :class="{
          'has-error': $v.organization.company_registration_number.$error,
        }"
      >
        <label for>{{ $t("org.reg-no") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.company_registration_number.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.company_registration_number.$error &&
            !$v.organization.company_registration_number.required
          "
        >
          No. Pendaftaran tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        v-if="organizationType == 'Individu'"
        :class="{
          'has-error': $v.organization.mykad_number.$error,
        }"
      >
        <label for>{{ $t("mykad") }}</label>
        <span class="text-danger">*</span>
        <the-mask
          id="ic_number"
          :mask="['######-##-####']"
          class="form-control"
          v-model.trim="$v.organization.mykad_number.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.mykad_number.$error &&
            !$v.organization.mykad_number.required
          "
        >
          No. Mykad tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        v-if="organizationType != 'Awaris' && organizationType != 'Individu'"
        :class="{
          'has-error': $v.organization.founder_name.$error,
        }"
      >
        <label for>{{ $t("org.founder") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model.trim="$v.organization.founder_name.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.founder_name.$error &&
            !$v.organization.founder_name.required
          "
        >
          Nama PIC tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        v-if="organizationType != 'Awaris' && organizationType != 'Individu'"
        :class="{
          'has-error': $v.organization.pic_phone_number.$error,
        }"
      >
        <label for>{{ $t("pic-telno") }}</label>
        <span class="text-danger">*</span>
        <input
          type="number"
          class="form-control"
          v-model.trim="$v.organization.pic_phone_number.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.pic_phone_number.$error &&
            !$v.organization.pic_phone_number.required
          "
        >
          No. Telefon PIC tidak boleh dibiarkan kosong.
        </div>
      </div>

      <div
        class="col-md-6 form-group"
        v-if="organizationType != 'Awaris' && organizationType != 'Bank'"
        :class="{ 'has-error': $v.organization.bank_account_number.$error }"
      >
        <label for>{{ $t("bank-account") }}</label>
        <span class="text-danger">*</span>
        <input
          type="number"
          class="form-control"
          v-model.trim="$v.organization.bank_account_number.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.bank_account_number.$error &&
            !$v.organization.bank_account_number.required
          "
        >
          No. Akaun Bank tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType == 'Bank'">
        <label for>{{ $t("bank-account") }}</label>
        <input
          type="number"
          class="form-control"
          v-model="organization.bank_account_number"
        />
      </div>
      <div
        class="col-md-6 form-group"
        v-if="organizationType != 'Awaris' && organizationType != 'Bank'"
        :class="{ 'has-error': $v.organization.bank_account_holder.$error }"
      >
        <label for>{{ $t("acc-holder") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.bank_account_holder.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.bank_account_holder.$error &&
            !$v.organization.bank_account_holder.required
          "
        >
          Pemegang Akaun Bank tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType == 'Bank'">
        <label for>{{ $t("acc-holder") }}</label>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model="organization.bank_account_holder"
        />
      </div>
      <div
        class="col-md-6 form-group"
        v-if="organizationType != 'Awaris' && organizationType != 'Bank'"
        :class="{ 'has-error': $v.organization.bank_name.$error }"
      >
        <label for>{{ $t("bankname") }}</label>
        <span class="text-danger">*</span>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model.trim="$v.organization.bank_name.$model"
        />
        <div
          class="form-error"
          v-if="
            $v.organization.bank_name.$error &&
            !$v.organization.bank_name.required
          "
        >
          Nama Bank tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType == 'Bank'">
        <label for>{{ $t("bankname") }}</label>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model="organization.bank_name"
        />
      </div>
    </div>

    <div class="row" v-if="userRole == 'Staff'">
      <hr />
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.allow_payment_gateway.$error }"
      >
        <label for>{{ $t("org.online") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.organization.allow_payment_gateway.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.allow_payment_gateway.$error &&
            !$v.organization.allow_payment_gateway.required
          "
        >
          Status Pembayaran Atas Talian tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.allow_cash_payment.$error }"
      >
        <label for>{{ $t("org.cash") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.organization.allow_cash_payment.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.allow_cash_payment.$error &&
            !$v.organization.allow_cash_payment.required
          "
        >
          Status Pembayaran Tunai tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group"
        :class="{ 'has-error': $v.organization.allow_direct_payment.$error }"
      >
        <label for>Menerima Pembayaran Langsung</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.organization.allow_direct_payment.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.allow_direct_payment.$error &&
            !$v.organization.allow_direct_payment.required
          "
        >
          Status Pembayaran Langsung tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="col-md-6 form-group" v-if="organization.is_bmmb"
        :class="{ 'has-error': $v.organization.allow_loan_payment.$error }"
      >
        <label for>Menerima Pembiayaan</label>
        <span class="text-danger">*</span>
        <select
          name
          id
          class="form-control"
          v-model.trim="$v.organization.allow_loan_payment.$model"
        >
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
        <div
          class="form-error"
          v-if="
            $v.organization.allow_loan_payment.$error &&
            !$v.organization.allow_loan_payment.required
          "
        >
          Status Pembiayaan tidak boleh dibiarkan kosong.
        </div>
      </div>
    </div>

    <div class="row" v-if="organizationType == 'Individu'">
      <hr />
      <div class="col-md-12 mb-4">
        <h5>{{ $t("user.info-user") }}</h5>
      </div>
      <div
        class="form-group col-md-6"
        :class="{ 'has-error': $v.form.username.$error }"
      >
        <label for="username">{{ $t("username") }}</label>
        <span class="text-danger">*</span>
        <input
          @keydown.space.prevent
          type="text"
          class="form-control"
          v-model.trim="$v.form.username.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.username.$error && !$v.form.username.required"
        >
          Nama Pengguna tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("gender") }}</label>
        <span class="text-danger">*</span>
        <select
          name
          id="gender"
          class="form-control"
          v-model.trim="$v.form.gender.$model"
        >
          <option value>-- {{ $t("choose.gender") }} --</option>
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
      <!-- <div class="col-md-6 form-group" v-if="organizationType == 'Individu'">
        <label for>Sudah mengikuti Kursus Pewarisan AWARIS?</label>
        <span class="text-danger">*</span>
        <div class="form-group position-relative">
          <div class="radio-inline">
            <div>
              <label class="radio">
                <input type="radio" name="radio1" value="1" />
                {{ $t("yes") }}
              </label>
            </div>
            <div>
              <label class="radio">
                <input type="radio" name="radio1" value="2" />
                {{ $t("no") }}
              </label>
            </div>
          </div>
        </div>
      </div> -->
      <!--  -->
    </div>
    <hr />
    <div class="row">
      <div class="col-md-6 text-left" v-if="organizationType != 'Individu'">
        <button type="button" @click="back" class="btn btn-primary">
          {{ $t("cancel") }}
        </button>
      </div>
      <div class="col-md-6 text-left" v-if="organizationType == 'Individu'">
        <button type="button" @click="backIndividu" class="btn btn-primary">
          {{ $t("cancel") }}
        </button>
      </div>
      <div class="col-md-6 text-right">
        <button type="button" @click="saveOrganization" class="btn btn-primary">
          <i class="mdi mdi-file-document"></i>
          {{ $t("save") }}
          <span class="spinner-border spinner-border-sm" v-if="isSubmit"></span>
        </button>
      </div>
    </div>
  </div>
</template>
