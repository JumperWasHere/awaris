<script>
import ApiService from "@/services/api.service";
import Switcher from "@/components/switcher";
import { LOGIN, LOGOUT } from "@/services/store/auth.module";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

const axios = require("axios").default;
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

export default {
  data() {
    return {
      form: {
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        token: null,
      },
      isCondensed: false,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      username: {
        required,
      },
      password: {
        required,
        minLength: minLength(6),
      },
      password_confirmation: {
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs(function () {
          return this.form.password;
        }),
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
  },
  mounted() {
    this.form.token = this.$route.query.token;
    console.log(this.form.token);
  },
  methods: {
    toggleMenu() {
      this.isCondensed = !this.isCondensed;
      if (this.isCondensed) {
        document.getElementById("navigation").style.display = "block";
      } else document.getElementById("navigation").style.display = "none";
    },
    async resetPassword() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (this.form.password == this.form.password_confirmation) {
        var result = await this.resetPasswordApi();
        if (result) {
          this.$swal.fire({
            icon: "success",
            html: "Anda berjaya menukar kata laluan",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$router.push({
            name: "login",
            query: {
              email: this.email,
              token: this.token,
            },
          });
        }
      }
    },
    async resetPasswordApi() {
      return await ApiService.post(`/password/reset`, this.form)
        .then((response) => {
          return true;
          console.log(response.data);
        })
        .catch((error) => {
          return false;
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  computed: {
    email() {
      return this.$route.query.email;
    },
    token() {
      return this.$route.query.token;
    },
  },
};
</script>

<template>
  <div>
    <header id="topnav-login">
      <!-- <header id="topnav" class="defaultscroll sticky"> -->
      <div class="container">
        <div id="navigation" class="border-bottom-nav">
          <div class="row">
            <div class="col-lg-6">
              <ul
                class="navigation-menu mb-0"
                v-scroll-spy-active="{ selector: 'li.has-submenu' }"
              >
                <li class="has-submenu">
                  <a href="https://awarisgroup.com/"
                    ><i class="mdi mdi-chevron-left mr-1"></i
                    >{{ $t("navbar.homepage") }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="col-lg-6">
              <div
                class="text-white text-right"
                style="padding: 20px 70px 20px"
              >
                <span @click="changeLocale('ms')" style="cursor: pointer">
                  MY
                </span>
                |
                <span @click="changeLocale('en')" style="cursor: pointer">
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-extras">
        <div class="menu-item">
          <!-- Mobile menu toggle-->
          <a
            class="navbar-toggle"
            @click="toggleMenu()"
            :class="{ open: isCondensed === true }"
          >
            <div class="lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </a>
          <!-- End mobile menu toggle-->
        </div>
      </div>
    </header>
    <section class="bg-home d-flex align-items-center">
      <div class="bg-overlay bg-overlay-white bg-overlay-img"></div>
      <div class="container" style="margin-top: 100px">
        <div class="row justify-content-center" style="margin-bottom: 50px">
          <div class="card login-page bg-white shadow rounded-login border-0">
            <div class="card-body-login">
              <div class="login-img">
                <img
                  class="img-center"
                  src="/images/logo/AWARIS_Logo_Col.png"
                  alt=""
                />
              </div>
              <form class="login-form mt-4">
                <div class="row">
                  <div class="col-lg-12">
                    <div
                      class="form-group position-relative"
                      :class="{ 'has-error': $v.form.email.$error }"
                    >
                      <label>
                        {{ $t("email") }}
                        <span class="text-danger">*</span>
                      </label>
                      <key-icon class="fea icon-sm icons"></key-icon>
                      <input
                        type="text"
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

                  <div class="col-lg-12">
                    <div
                      class="form-group position-relative"
                      :class="{ 'has-error': $v.form.username.$error }"
                    >
                      <label>
                        {{ $t("username") }}
                        <span class="text-danger">*</span>
                      </label>
                      <user-icon class="fea icon-sm icons"></user-icon>
                      <input
                        type="text"
                        class="form-control pl-5"
                        v-bind:placeholder="$t('username')"
                        name="username"
                        autocomplete="username"
                        v-model.trim="$v.form.username.$model"
                        required
                      />
                      <div
                        class="form-error"
                        v-if="
                          $v.form.username.$error && !$v.form.username.required
                        "
                      >
                        Nama Pengguna tidak boleh dibiarkan kosong.
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-12">
                    <div
                      class="form-group position-relative"
                      :class="{ 'has-error': $v.form.password.$error }"
                    >
                      <label>
                        {{ $t("new.password") }}
                        <span class="text-danger">*</span>
                      </label>
                      <key-icon class="fea icon-sm icons"></key-icon>
                      <input
                        type="password"
                        class="form-control pl-5"
                        v-bind:placeholder="$t('new.password')"
                        required
                        name="new-password"
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
                        v-if="
                          $v.form.password.$error && !$v.form.password.required
                        "
                      >
                        Kata Laluan Baru tidak boleh dibiarkan kosong.
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-12">
                    <div
                      class="form-group position-relative"
                      :class="{
                        'has-error': $v.form.password_confirmation.$error,
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
                        required
                        name="password_confirmation"
                        v-model="form.password_confirmation"
                      />
                      <div
                        class="form-error"
                        v-if="!$v.form.password_confirmation.minLength"
                      >
                        Kata Laluan hendaklah sekurang kurangnya
                        {{
                          $v.form.password_confirmation.$params.minLength.min
                        }}
                        karakter.
                      </div>
                      <div
                        class="form-error"
                        v-if="!$v.form.password_confirmation.sameAsPassword"
                      >
                        Sahkan Kata Laluan hendaklah sama dengan Kata Laluan
                      </div>
                      <div
                        class="form-error"
                        v-if="
                          $v.form.password_confirmation.$error &&
                          !$v.form.password_confirmation.required
                        "
                      >
                        Ulang Kata Laluan tidak boleh dibiarkan kosong.
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 mb-0">
                    <b-button
                      @click="resetPassword"
                      class="btn btn-primary btn-block spinner spinner-light spinner-right"
                    >
                      {{ $t("login.reset") }}
                    </b-button>
                  </div>

                  <div class="col-12 text-center">
                    <p class="mb-0 mt-3">
                      <router-link
                        to="/login"
                        class="text-dark font-weight-bold"
                        >{{ $t("log-in") }}</router-link
                      >
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <footer class="footer-login footer-bar">
        <div class="container text-center">
          <div class="row">
            <div class="col-sm-12 mb-3">
              <div class="text-sm-center">
                <p class="mb-0">
                  <strong>©2021 AWARIS. {{ $t("copyright") }}.</strong><br />
                  {{ $t("poweredby") }} <strong>PROOFFICE</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
