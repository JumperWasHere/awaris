<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import {
  required,
  minLength,
  maxLength,
  sameAs,
  between,
  numeric,
  email,
  helpers,
} from "vuelidate/lib/validators";

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  HomeIcon,
  UserIcon,
  UserCheckIcon,
  MailIcon,
  KeyIcon,
} from "vue-feather-icons";

const passwordRegex = helpers.regex(
  "passwordRegex",
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
);

export default {
  data() {
    return {
      awarisOrganization: null,
      newDesignation: null,
      form: {
        designation: "Encik",
        fullname: "",
        username: "",
        password: "",
        confirm_password: "",
        notel: "",
        ic_number: "",
        email: "",
        user_type: "Client",
        agreement: 0,
      },
      access: {
        organization_id: 1,
        accessible_type: "Branch",
        accessible_id: 1,
        role: "Client",
        allow_payment_gateway: 1,
        allow_cash_payment: 0,
        status: 0,
      },
      isRegister: false,
    };
  },
  validations: {
    form: {
      designation: {
        required,
      },
      fullname: {
        required,
        minLength: minLength(9),
        maxLength: maxLength(50),
      },
      password: {
        required,
        passwordRegex,
        minLength: minLength(6),
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs(function () {
          return this.form.password;
        }),
      },
      notel: {
        required,
        numeric,
      },
      ic_number: {
        required,
        minLength: minLength(12),
        maxLength: maxLength(12),
        numeric,
      },
      email: {
        required,
        email,
      },
    },
  },
  components: {
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    HomeIcon,
    UserIcon,
    UserCheckIcon,
    MailIcon,
    KeyIcon,
    TheMask,
  },
  methods: {
    async onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (!this.form.agreement) {
          this.$swal.fire({
            icon: "error",
            html: "Sila bersetuju dengan terma dan syarat",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        this.isRegister = true;
        var user_id = await this.registerUser();
        this.$swal.fire({
          icon: "success",
          html:
            "Anda telah berjaya mendaftar akaun AWARIS. Sila buat verifikasi akaun anda di e-mel.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        this.$router.push({
          name: "login",
        });
      }
    },
    async registerUser() {
      var form;
      form = {
        designation: this.form.designation,
        username: this.form.ic_number,
        password: this.form.password,
        name: this.form.fullname,
        ic_number: this.form.ic_number,
        mobile_number: this.form.notel,
        email: this.form.email,
        user_type: this.form.user_type,
        status: 1,
      };
      return await ApiService.post(`register`, form)
        .then((response) => {})
        .catch((error) => {
          this.isRegister = false;
          this.$swal.fire({
            icon: "error",
            html: error.response.message,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          // console.log(error.response);
        });
    },
    async giveAgentAwarisUserAccess(user_id) {
      return await ApiService.post(`/user/${user_id}/access`, this.access)
        .then((response) => {})
        .catch((error) => {});
    },
    getAwarisOrg() {
      ApiService.get(
        `/organization?type=Awaris&load_with=firstBranch&return_first=true`
      )
        .then((response) => {
          this.awarisOrganization = response.data.organizations;
          if (this.awarisOrganization) {
            this.access.organization_id = org.id;
            this.access.accessible_id = org.branch.id;
          }
        })
        .catch((error) => {});
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    async changeDesignation() {
      if (["Others", "Lain-lain"].includes(this.form.designation)) {
        const { value: newDesignation } = await this.$swal.fire({
          html:
            "<span style='margin-bottom:.5rem' class='form-group d-block w-100 text-left'><label style='margin-bottom:0px'>Gelaran</label></span>",
          input: "text",
        });
        if (newDesignation) {
          this.newDesignation = newDesignation;
          this.form.designation = newDesignation;
        } else {
          this.form.designation = this.designations[0];
        }
      }
    },
  },
  mounted() {
    this.getAwarisOrg();
    this.form.designation = this.designations[0];
  },
  computed: {
    designations() {
      var designations = this.$t("designations").split(",");
      if (this.newDesignation) designations.push(this.newDesignation);
      return designations;
    },
    locale() {
      return this.$i18n.locale;
    },
  },
  watch: {
    locale: function () {
      if (!this.newDesignation) this.form.designation = this.designations[0];
    },
  },
  head: {
    script: [
      {
        type: "text/javascript",
        src: "/js/isynergy.js",
        async: true,
        body: true,
      },
    ],
  },
};
</script>

<template>
  <div>
    <section
      class="bg-half bg-primary d-table w-100"
      style="padding: 30px 0 0px"
    >
      <div class="text-white text-right pr-4 btn-hai">
        <p class="p-lang">
          LANGUAGE &nbsp;
          <span class="lang-bg ml-2">
            <span @click="changeLocale('ms')" style="cursor: pointer">
              BM
            </span>
            |
            <span @click="changeLocale('en')" style="cursor: pointer">
              ENG
            </span>
          </span>
        </p>
      </div>
      <img
        class="img-center signup-logo"
        src="/images/logo/AWARIS_Logo_BW.png"
        alt=""
        style="width: 400px"
      />
    </section>
    <section class="bg-home d-flex align-items-center" style="height: auto">
      <div
        class="container"
        style="padding-right: 100px; padding-left: 100px; height: inherit"
      >
        <div class="row align-items-center">
          <div class="col-lg-12 col-md-12">
            <div class="card login_page shadow border-0">
              <div class="card-body-signup">
                <h4 class="card-title text-center">{{ $t("signup.reg") }}</h4>
                <form class="login-form mt-4" @submit.stop.prevent="onSubmit">
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="form-group position-relative"
                        :class="{
                          'has-error':
                            $v.form.fullname.$error &&
                            $v.form.designation.$error,
                        }"
                      >
                        <label>
                          {{ $t("fullname") }}
                          <span class="text-danger">*</span>
                        </label>
                        <user-check-icon
                          class="fea icon-sm icons"
                        ></user-check-icon>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <select
                              name
                              class="form-control"
                              @change="changeDesignation"
                              v-model.trim="$v.form.designation.$model"
                              style="
                                border-bottom-right-radius: 0;
                                border-top-right-radius: 0;
                              "
                            >
                              <option
                                v-for="designation in designations"
                                :key="designation"
                                :value="designation"
                              >
                                {{ designation }}
                              </option>
                            </select>
                          </div>
                          <input
                            type="text"
                            class="form-control"
                            v-bind:placeholder="$t('fullname')"
                            name="fullname"
                            v-uppercase
                            v-model.trim="$v.form.fullname.$model"
                          />
                        </div>
                        <div
                          class="form-error"
                          v-if="!$v.form.fullname.minLength"
                        >
                          Nama hendaklah sekurang kurangnya
                          {{ $v.form.fullname.$params.minLength.min }} karakter.
                        </div>
                        <div
                          class="form-error"
                          v-if="!$v.form.fullname.maxLength"
                        >
                          Nama hendaklah maksimum
                          {{ $v.form.fullname.$params.maxLength.max }} karakter.
                        </div>
                        <div
                          class="form-error"
                          v-if="
                            $v.form.fullname.$error &&
                            !$v.form.fullname.required
                          "
                        >
                          Nama tidak boleh dibiarkan kosong.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="form-group position-relative"
                        :class="{ 'has-error': $v.form.ic_number.$error }"
                      >
                        <label>
                          {{ $t("mykad") }}
                          <span class="text-danger">*</span>
                        </label>
                        <user-check-icon
                          class="fea icon-sm icons"
                        ></user-check-icon>
                        <the-mask
                          id="ic_number"
                          :mask="['######-##-####']"
                          class="form-control pl-5"
                          v-bind:placeholder="$t('mykad')"
                          v-model.trim="$v.form.ic_number.$model"
                        />
                        <div
                          class="form-error"
                          v-if="!$v.form.ic_number.minLength"
                        >
                          No. MyKad hendaklah
                          {{ $v.form.ic_number.$params.minLength.min }}
                          karakter tanpa '-'.
                        </div>
                        <div
                          class="form-error"
                          v-if="!$v.form.ic_number.maxLength"
                        >
                          No. MyKad hendaklah
                          {{ $v.form.ic_number.$params.maxLength.max }}
                          karakter tanpa '-'.
                        </div>
                        <div
                          class="form-error"
                          v-if="
                            $v.form.ic_number.$error &&
                            !$v.form.ic_number.required
                          "
                        >
                          No. MyKad tidak boleh dibiarkan kosong.
                        </div>
                        <div
                          class="form-error"
                          v-if="
                            $v.form.ic_number.$error &&
                            !$v.form.ic_number.numeric
                          "
                        >
                          No. MyKad hendaklah dalam bentuk nombor.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="form-group position-relative"
                        :class="{ 'has-error': $v.form.notel.$error }"
                      >
                        <label>
                          {{ $t("mobile-no") }}
                          <span class="text-danger">*</span>
                        </label>
                        <user-check-icon
                          class="fea icon-sm icons"
                        ></user-check-icon>
                        <input
                          type="text"
                          class="form-control pl-5"
                          v-bind:placeholder="$t('mobile-no')"
                          name="notel"
                          v-model.trim="$v.form.notel.$model"
                        />
                        <div
                          class="form-error"
                          v-if="$v.form.notel.$error && !$v.form.notel.required"
                        >
                          No. Telefon Bimbit tidak boleh dibiarkan kosong.
                        </div>
                        <div
                          class="form-error"
                          v-if="$v.form.notel.$error && !$v.form.notel.numeric"
                        >
                          No. Telefon Bimbit hendaklah dalam bentuk nombor.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group position-relative">
                        <label>
                          {{ $t("username") }}
                          <span class="text-danger">*</span>
                        </label>
                        <user-icon class="fea icon-sm icons"></user-icon>
                        <input
                          readonly
                          type="text"
                          class="form-control pl-5"
                          name="username"
                          v-bind:placeholder="$t('username')"
                          v-model="form.ic_number"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="form-group position-relative"
                        :class="{ 'has-error': $v.form.email.$error }"
                      >
                        <label>
                          {{ $t("email") }}
                          <span class="text-danger">*</span>
                        </label>
                        <mail-icon class="fea icon-sm icons"></mail-icon>
                        <input
                          type="email"
                          class="form-control pl-5"
                          v-bind:placeholder="$t('email')"
                          name="email"
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
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="form-group position-relative"
                        :class="{ 'has-error': $v.form.password.$error }"
                      >
                        <label>
                          {{ $t("password") }}
                          <span class="text-danger">*</span>
                        </label>
                        <key-icon class="fea icon-sm icons"></key-icon>
                        <input
                          type="password"
                          class="form-control pl-5"
                          v-bind:placeholder="$t('password')"
                          v-model.trim="$v.form.password.$model"
                        />
                        <div
                          class="form-error"
                          v-if="!$v.form.password.minLength"
                        >
                          Kata Laluan hendaklah sekurang kurangnya
                          {{ $v.form.password.$params.minLength.min }} karakter.
                        </div>
                        <div
                          class="form-error"
                          v-if="!$v.form.password.passwordRegex"
                        >
                          Kata Laluan hendaklah mengandungi nombor, huruf besar
                          dan huruf kecil.
                        </div>
                        <div
                          class="form-error"
                          v-if="
                            $v.form.password.$error &&
                            !$v.form.password.required
                          "
                        >
                          Kata Laluan tidak boleh dibiarkan kosong.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="form-group position-relative"
                        :class="{
                          'has-error': $v.form.confirm_password.$error,
                        }"
                      >
                        <label>
                          {{ $t("confirm-password") }}
                          <span class="text-danger">*</span>
                        </label>
                        <key-icon class="fea icon-sm icons"></key-icon>
                        <input
                          type="password"
                          class="form-control pl-5"
                          v-bind:placeholder="$t('confirm-password')"
                          v-model="form.confirm_password"
                        />
                        <div
                          class="form-error"
                          v-if="!$v.form.confirm_password.sameAsPassword"
                        >
                          Ulangan Kata Laluan hendaklah sama dengan Kata Laluan
                        </div>
                        <div
                          class="form-error"
                          v-if="
                            $v.form.confirm_password.$error &&
                            !$v.form.confirm_password.required
                          "
                        >
                          Ulang Kata Laluan tidak boleh dibiarkan kosong.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <div class="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            class="custom-control-input"
                            id="customCheck1"
                            value="1"
                            v-model="form.agreement"
                          />
                          <label
                            class="custom-control-label"
                            for="customCheck1"
                          >
                            {{ $t("signup.agree1") }}
                            <a
                              href="https://awarisgroup.com/wp-content/uploads/2021/01/Terms-Conditions.pdf"
                              class="text-primary"
                              style="color: #2f55d4 !important"
                              >{{ $t("signup.agree2") }}</a
                            >
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <button
                        class="btn btn-primary btn-block"
                        :readonly="!awarisOrganization"
                      >
                        {{ $t("register") }}
                        <span
                          class="spinner-border spinner-border-sm"
                          v-if="isRegister"
                        ></span>
                      </button>
                    </div>
                    <div class="mx-auto">
                      <p class="mb-0 mt-3">
                        <small class="text-dark mr-2">{{
                          $t("signup.account")
                        }}</small>
                        <router-link
                          to="/login"
                          class="text-dark font-weight-bold"
                          >{{ $t("log-in") }}</router-link
                        >
                      </p>
                    </div>
                  </div>
                  <div class="row card-signup">
                    <div class="col-md-12">
                      <div class="text-sm-center">
                        <p class="mb-0 text-center">
                          <strong>©2021 AWARIS. {{ $t("copyright") }}.</strong>
                          {{ $t("poweredby") }} <strong>PROOFFICE</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
