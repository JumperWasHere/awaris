<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { ArrowUpIcon } from "vue-feather-icons";
import { required, email } from "vuelidate/lib/validators";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      form: {
        account_type: "Biasa",
        code: "",
        status: "1",
        name: "",
        short_name: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
        phone_number: "",
        email: "",
        website: "",
        company_registration_number: "",
        founder_name: "",
        mykad_number: "",
        bank_account_number: "",
        bank_account_holder: "",
        bank_name: "",
        allow_payment_gateway: "",
        allow_cash_payment: "",
        allow_direct_payment: "",
        username: "",
        gender: "1",
        branch_id: null,
        role: null,
      },
      postcode: null,
      submit: false,
      organization_type: null,
      user_id: null,
      organization: null,
      organizationId: null,
      userId: null,
    };
  },
  validations() {
    if (
      this.organizationType == "Koperasi" ||
      this.organizationType == "Kerajaan" ||
      this.organizationType == "Swasta"
    ) {
      return {
        form: {
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
    } else if (this.organizationType == "Individu") {
      return {
        form: {
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
          username: {
            required,
          },
          gender: {
            required,
          },
        },
      };
    } else if (this.organizationType == "Bank") {
      return {
        form: {
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
          founder_name: {
            required,
          },
          pic_phone_number: {
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
        form: {
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
          founder_name: {
            required,
          },
          pic_phone_number: {
            required,
          },
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
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
    TheMask,
  },
  methods: {
    openpostcode() {
      // this.$refs["modalPostcode"].show();
    },
    hideModal() {
      // this.$refs["modalPostcode"].hide();
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
    async onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.submit = true;

        var organizationId = await this.storeOrganization(); //create org
        // this.submit = false;
        if (organizationId != null) {
          var organizationType = this.organization_type;
          if (organizationType == "Individu") {
            this.form.role = "Super Admin";
            var branchId = await this.createHeadquarter(organizationId); //create branch head
            if (branchId) {
              this.form.organization_id = this.organizationId;
              this.form.username =
                this.organization.code + this.form.username.toString();
              var userId = await this.saveUser();
              if (userId) {
                var userAccess = await this.saveUserAccess(userId, branchId);
                if (userAccess) {
                  this.$swal.fire({
                    icon: "success",
                    html: "Anda telah berjaya menambah organisasi Individu.",
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText: "Tutup",
                  });
                  this.$router.push({
                    name: "organization.info-individual",
                    params: {
                      organization_id: this.organizationId,
                      user_id: this.userId,
                    },
                  });
                }
              }
            }
          } else {
            await this.createHeadquarter(organizationId);
            this.$swal
              .fire({
                icon: "success",
                html: "Anda telah berjaya menambah organisasi.",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Tutup",
              })
              .then((result) => {
                this.$router.push({
                  name: "organization.info",
                  params: { organization_id: organizationId },
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
    async storeOrganization() {
      var form;
      this.form.type = this.organizationType;
      form = {
        name: this.form.name,
        short_name: this.form.short_name,
        address: this.form.address,
        postcode: this.form.postcode,
        city: this.form.city,
        state: this.form.state,
        phone_number: this.form.phone_number,
        status: this.form.status,
        email: this.form.email,
        website: this.form.website,
        code: this.form.code,
        account_type: this.form.account_type,
        allow_payment_gateway: this.form.allow_payment_gateway,
        allow_cash_payment: this.form.allow_cash_payment,
        allow_direct_payment: this.form.allow_direct_payment,
        company_registration_number: this.form.company_registration_number,
        founder_name: this.form.founder_name,
        mykad_number: this.form.mykad_number,
        bank_account_number: this.form.bank_account_number,
        bank_account_holder: this.form.bank_account_holder,
        bank_name: this.form.bank_name,
        pic_phone_number: this.form.pic_phone_number,
      };
      return await ApiService.post(`organization`, this.form)
        .then((response) => {
          console.log(response.data);
          this.organization = response.data.organization ?? {};
          this.organization_type = response.data.organization.type;
          console.log(this.organization);
          this.organizationId = response.data.organization.id;
          return response.data.organization.id;
        })
        .catch((error) => {
          this.submit = false;
          return null;
        });
    },
    async createHeadquarter(organizationId) {
      return await ApiService.post(`branch`, {
        organization_id: organizationId,
        is_headquarter: 1,
        branch_name: "Headquarter",
        phase: "Branch",
        // code: "HQ",
        type_name: "Branch",
        status: 1,
      })
        .then((response) => {
          this.form.branch_id = response.data.branch.id;
          return response.data.branch.id;
        })
        .catch((error) => {
          return null;
        });
    },
    async saveUser(user) {
      var user = this.form;
      user.status = 1;
      user.ic_number = this.form.mykad_number;
      user.mobile_number = this.form.phone_number;
      return await ApiService.post(`user`, user)
        .then((response) => {
          console.log("User create success");
          this.user = response.data.user;
          this.userId = response.data.user.id;
          return response.data.user.id;
        })
        .catch((error) => {
          console.log("User create failed");
        });
    },
    async saveUserAccess(userId) {
      this.form.status = 1;
      this.form.accessible_id = this.form.branch_id;
      this.form.accessible_type = "Branch";
      this.form.organization_id = this.organization.id;
      ApiService.post(`user/${userId}/access`, this.form)
        .then(() => {
          this.$router.push({
            name: "organization.info-individual",
            params: {
              organization_id: this.organization.id,
              user_id: userId,
            },
          });
          console.log("User access success");
        })
        .catch(() => {
          console.log("User access failed");
        });
    },
    // async sendUserCreatedNotification() {
    //   return await ApiService.get(
    //     `user/${this.newUser.id}/email-user-created`
    //   ).then(() => {
    //     return true;
    //   });
    // },
  },
  mounted() {
    console.log("Organization", this.organizationType);
  },
  computed: {
    ...mapGetters(["userRole"]),

    organizationType() {
      return this.$route.query.type;
    },
    genders() {
      return this.$t("genders").split(",");
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
            <div class="page-next-level" v-if="organizationType != 'Individu'">
              <h4 class="title text-white">{{ $t("org.add-organization") }}</h4>
            </div>
            <div class="page-next-level" v-if="organizationType == 'Individu'">
              <h4 class="title text-white">{{ $t("org.add-individu") }}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <form @submit.prevent="onSubmit">
            <div class="card-body">
              <div class="row">
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.name.$error }"
                >
                  <label for="name">{{ $t("name") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    id="name"
                    v-model.trim="$v.form.name.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.name.$error && !$v.form.name.required"
                  >
                    Nama {{ organizationType }} tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.short_name.$error }"
                >
                  <label for="short_name">{{ $t("shortname") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    id="short_name"
                    v-model.trim="$v.form.short_name.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.short_name.$error && !$v.form.short_name.required
                    "
                  >
                    Nama Pendek tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  v-if="organizationType != 'Awaris'"
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.code.$error }"
                >
                  <label for="code">{{ $t("code") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    id="code"
                    v-model.trim="$v.form.code.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.code.$error && !$v.form.code.required"
                  >
                    Kod tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  v-if="
                    organizationType != 'Awaris' &&
                    organizationType != 'Individu'
                  "
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.account_type.$error }"
                >
                  <label for="account_type">{{ $t("account-type") }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name
                    id="account_type"
                    class="form-control"
                    v-model.trim="$v.form.account_type.$model"
                  >
                    <option value="">-- {{ $t("choose.account") }} --</option>
                    <option value="Biasa">Biasa</option>
                    <option value="Financial">Financial</option>
                    <option value="Non-financial">Non-financial</option>
                  </select>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.account_type.$error &&
                      !$v.form.account_type.required
                    "
                  >
                    Jenis Akaun tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
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
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.postcode.$error }"
                >
                  <label for="postcode" class="d-block">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {{ $t("postcode") }}
                        <span class="text-danger">*</span>
                      </span>
                      <span
                        @click="openpostcode"
                        style="
                          text-decoration: underline;
                          font-size: 11px;
                          color: #333;
                        "
                        >Tambah Baru</span
                      >
                    </div>
                  </label>
                  <input
                    type="number"
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
                  <div class="form-error" v-if="$v.form.postcode.$error">
                    Poskod mesti dalam karakter nombor.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.city.$error }"
                >
                  <label for="city">{{ $t("city") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    id="city"
                    class="form-control"
                    readonly
                    v-model.trim="$v.form.city.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.city.$error && !$v.form.city.required"
                  >
                    Bandar tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.state.$error }"
                >
                  <label for="state">{{ $t("state") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    id="state"
                    class="form-control"
                    readonly
                    v-model.trim="$v.form.state.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.state.$error && !$v.form.state.required"
                  >
                    Negeri tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <label
                    for="phone_number"
                    v-if="organizationType == 'Individu'"
                    >{{ $t("mobile-no") }}</label
                  >
                  <label
                    for="phone_number"
                    v-if="organizationType != 'Individu'"
                    >{{ $t("office-no") }}</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="phone_number"
                    v-model="form.phone_number"
                  />
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.email.$error }"
                >
                  <label for="email" v-if="organizationType == 'Individu'">{{
                    $t("email")
                  }}</label>
                  <label for="email" v-if="organizationType != 'Individu'">{{
                    $t("office-email")
                  }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    v-lowercase
                    class="form-control"
                    id="email"
                    v-model.trim="$v.form.email.$model"
                  />
                  <div class="form-error" v-if="!$v.form.email.email">
                    Anda telah memasukkan alamat e-mel yang tidak sah!
                  </div>
                  <div
                    class="form-error"
                    v-if="$v.form.email.$error && !$v.form.email.required"
                  >
                    E-mel tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="organizationType != 'Individu'"
                >
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
                  :class="{ 'has-error': $v.form.status.$error }"
                >
                  <label for="status">{{ $t("status") }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name
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
                <div
                  class="form-group col-md-6"
                  v-if="organizationType != 'Individu'"
                  :class="{
                    'has-error': $v.form.company_registration_number.$error,
                  }"
                >
                  <label for="status">{{ $t("org.reg-no") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    v-model.trim="$v.form.company_registration_number.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.company_registration_number.$error &&
                      !$v.form.company_registration_number.required
                    "
                  >
                    No. Pendaftaran tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="organizationType == 'Individu'"
                  :class="{
                    'has-error': $v.form.mykad_number.$error,
                  }"
                >
                  <label for="status">{{ $t("mykad") }}</label>
                  <span class="text-danger">*</span>
                  <the-mask
                    id="ic_number"
                    :mask="['######-##-####']"
                    class="form-control"
                    v-model.trim="$v.form.mykad_number.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.mykad_number.$error &&
                      !$v.form.mykad_number.required
                    "
                  >
                    No. Mykad tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="
                    organizationType != 'Awaris' &&
                    organizationType != 'Individu'
                  "
                  :class="{
                    'has-error': $v.form.founder_name.$error,
                  }"
                >
                  <label for="status">{{ $t("org.founder") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    v-model.trim="$v.form.founder_name.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.founder_name.$error &&
                      !$v.form.founder_name.required
                    "
                  >
                    Nama PIC tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="
                    organizationType != 'Awaris' &&
                    organizationType != 'Individu'
                  "
                  :class="{
                    'has-error': $v.form.pic_phone_number.$error,
                  }"
                >
                  <label for="pic_phone_number">{{ $t("pic-telno") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="number"
                    class="form-control"
                    id="pic_phone_number"
                    v-model="form.pic_phone_number"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.pic_phone_number.$error &&
                      !$v.form.pic_phone_number.required
                    "
                  >
                    No. Telefon PIC tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="
                    organizationType != 'Awaris' && organizationType != 'Bank'
                  "
                  :class="{
                    'has-error': $v.form.bank_account_number.$error,
                  }"
                >
                  <label for="status">{{ $t("bank-account") }}</label>
                  <span class="text-danger" v-if="organizationType != 'Bank'"
                    >*</span
                  >
                  <input
                    type="number"
                    class="form-control"
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
                <div
                  class="form-group col-md-6"
                  v-if="organizationType == 'Bank'"
                >
                  <label for="status">{{ $t("bank-account") }}</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="form.bank_account_number"
                  />
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="
                    organizationType != 'Awaris' && organizationType != 'Bank'
                  "
                  :class="{
                    'has-error': $v.form.bank_account_holder.$error,
                  }"
                >
                  <label for="status">{{ $t("acc-holder") }}</label>
                  <span class="text-danger" v-if="organizationType != 'Bank'"
                    >*</span
                  >
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    v-model.trim="$v.form.bank_account_holder.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.bank_account_holder.$error &&
                      !$v.form.bank_account_holder.required
                    "
                  >
                    Pemegang Akaun Bank tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="organizationType == 'Bank'"
                >
                  <label for="status">{{ $t("acc-holder") }}</label>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    v-model="form.bank_account_holder"
                  />
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="
                    organizationType != 'Awaris' && organizationType != 'Bank'
                  "
                  :class="{
                    'has-error': $v.form.bank_name.$error,
                  }"
                >
                  <label for="status">{{ $t("bankname") }}</label>
                  <span class="text-danger" v-if="organizationType != 'Bank'"
                    >*</span
                  >
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    v-model.trim="$v.form.bank_name.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.bank_name.$error && !$v.form.bank_name.required
                    "
                  >
                    Nama Bank tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  v-if="organizationType == 'Bank'"
                >
                  <label for="status">{{ $t("bankname") }}</label>
                  <input
                    v-uppercase
                    type="text"
                    class="form-control"
                    v-model="form.bank_name"
                  />
                </div>
              </div>
              <hr />
              <div class="row">
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.allow_payment_gateway.$error }"
                >
                  <label for="status">{{ $t("org.online") }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name
                    class="form-control"
                    v-model.trim="$v.form.allow_payment_gateway.$model"
                  >
                    <option value="1">{{ $t("active") }}</option>
                    <option value="0">{{ $t("inactive") }}</option>
                  </select>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.allow_payment_gateway.$error &&
                      !$v.form.allow_payment_gateway.required
                    "
                  >
                    Status Pembayaran Atas Talian tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.allow_cash_payment.$error }"
                >
                  <label for="status">{{ $t("org.cash") }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name
                    class="form-control"
                    v-model.trim="$v.form.allow_cash_payment.$model"
                  >
                    <option value="1">{{ $t("active") }}</option>
                    <option value="0">{{ $t("inactive") }}</option>
                  </select>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.allow_cash_payment.$error &&
                      !$v.form.allow_cash_payment.required
                    "
                  >
                    Status Pembayaran Tunai tidak boleh dibiarkan kosong.
                  </div>
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.allow_direct_payment.$error }"
                >
                  <label for>Menerima Pembayaran Langsung</label>
                  <span class="text-danger">*</span>
                  <select
                    name
                    class="form-control"
                    v-model.trim="$v.form.allow_direct_payment.$model"
                  >
                    <option value="1">{{ $t("active") }}</option>
                    <option value="0">{{ $t("inactive") }}</option>
                  </select>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.allow_direct_payment.$error &&
                      !$v.form.allow_direct_payment.required
                    "
                  >
                    Status Pembayaran Langsung tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <hr />
              <div class="row" v-if="organizationType == 'Individu'">
                <div class="col-md-12 mb-4">
                  <h5>{{ $t("user.info-user") }}</h5>
                </div>
                <div
                  class="form-group col-md-6"
                  :class="{ 'has-error': $v.form.username.$error }"
                >
                  <label for="username">{{ $t("username") }}</label>
                  <span class="text-danger">*</span>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">{{
                        form.code
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
                <!-- <div class="col-md-6 form-group">
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
              <div class="row">
                <hr />
                <div class="form-group col-md-12 text-right">
                  <button type="submit" class="btn btn-primary">
                    {{ $t("save") }}
                    <span
                      class="spinner-border spinner-border-sm"
                      v-if="submit"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </form>
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
