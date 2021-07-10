<script>
import ApiService from "@/services/api.service";
import Switcher from "@/components/switcher";
import { LOGIN, LOGOUT } from "@/services/store/auth.module";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
const axios = require("axios").default;
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  HomeIcon,
  UserIcon,
  KeyIcon,
} from "vue-feather-icons";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      passVisible: true,
      passwordFieldType: "password",
      isLogin: false,
      isCondensed: false,
    };
  },
  components: {
    PulseLoader,
    Switcher,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    HomeIcon,
    UserIcon,
    KeyIcon,
  },
  methods: {
    switchVisibility() {
      if (this.passVisible) {
        this.passVisible = false;
      } else {
        this.passVisible = true;
      }
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    toggleMenu() {
      this.isCondensed = !this.isCondensed;
      if (this.isCondensed) {
        document.getElementById("navigation").style.display = "block";
      } else document.getElementById("navigation").style.display = "none";
    },
    onSubmit() {
      this.isLogin = true;
      const username = this.form.username;
      const password = this.form.password;

      this.$store.dispatch(LOGOUT);
      const vm = this;
      const role = "Admin";
      vm.$store
        .dispatch(LOGIN, { username, password, role })
        .then((response) => {
          this.$notify({
            group: "foo",
            title: "Log masuk berjaya.",
            // text: data.message,
            type: "success",
          });
          vm.$router.push({ name: "dashboard" });

          this.isLogin = false;
        })
        .catch((error) => {
          this.isLogin = false;
        });
    },
    setPassword() {
      if (["local", "development"].includes(this.environment)) {
        this.form.password = "abc123";
      }
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.setPassword();
  },
  computed: {
    registerCompleted() {
      return this.$route.query.status == "register-completed";
    },
    userStatus() {
      return this.$route.query.user_status;
    },
    environment() {
      return process.env.VUE_APP_ENVI;
    },
  },
};
</script>

<template>
  <div>
    <header id="topnav-login">
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
              <div class="alert alert-success" v-if="registerCompleted">
                Akaun anda telah berjaya disahkan.
                {{
                  userStatus == "0"
                    ? "Sila tunggu pengesahan AWARIS sebelum log masuk."
                    : "Sila log masuk."
                }}
              </div>
              <div class="login-img">
                <img
                  class="img-center"
                  src="/images/logo/AWARIS_Logo_Col.png"
                  alt=""
                />
              </div>
              <form class="login-form mt-4" @submit.stop.prevent="onSubmit">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group position-relative">
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
                        v-model="form.username"
                        required
                      />
                    </div>
                  </div>

                  <div class="col-lg-12">
                    <div class="form-group position-relative">
                      <label style="text-transform: capitalize">
                        {{ $t("password") }}
                        <span class="text-danger">*</span>
                      </label>
                      <key-icon class="fea icon-sm icons"></key-icon>

                      <input
                        :type="passwordFieldType"
                        class="form-control pl-5"
                        required
                        v-bind:placeholder="$t('password')"
                        name="current-password"
                        autocomplete="current-password"
                        v-model="form.password"
                      />
                      <div>
                        <div
                          style="position: absolute; top: 0%; right: 15%"
                          @click="switchVisibility"
                        >
                          <b-icon-eye
                            class="fea icon-sm icons"
                            v-if="passVisible"
                          ></b-icon-eye>
                          <b-icon-eye-slash
                            class="fea icon-sm icons"
                            v-if="!passVisible"
                          ></b-icon-eye-slash>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-12">
                    <div class="text-right">
                      <p class="forgot-pass mb-3">
                        <router-link
                          :to="{ name: 'password-create' }"
                          class="text-dark font-weight-bold"
                          >{{ $t("login.forgot-password") }}</router-link
                        >
                      </p>
                    </div>
                  </div>
                  <div class="col-lg-12 mb-0">
                    <button
                      class="btn btn-primary btn-block spinner spinner-light spinner-right"
                    >
                      {{ $t("log-in") }}
                      <span
                        class="spinner-border spinner-border-sm"
                        v-if="isLogin"
                      ></span>
                    </button>
                  </div>

                  <div class="col-12 text-center">
                    <p class="mb-0 mt-3">
                      <small class="text-dark mr-2">{{
                        $t("login.account")
                      }}</small>
                      <router-link
                        to="/sign-up"
                        class="text-dark font-weight-bold"
                        >{{ $t("register") }}</router-link
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
                <p class="mb-3">
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
