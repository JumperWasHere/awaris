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
  UserCheckIcon,
  MailIcon,
  KeyIcon,
} from "vue-feather-icons";

export default {
  data() {
    return {
      form: {
        email: null,
      },
      isCondensed: false,
    };
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
  methods: {
    toggleMenu() {
      this.isCondensed = !this.isCondensed;
      if (this.isCondensed) {
        document.getElementById("navigation").style.display = "block";
      } else document.getElementById("navigation").style.display = "none";
    },
    async resetPassword() {
      ApiService.post(`/password/create`, this.form)
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: `Cara menetapkan semula kata laluan telah dihantar ke alamat e-mel (${this.form.email}) jika e-mel berdaftar dengan sistem AWARIS. Sila semak inbox/spam. `,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$router.push({ name: "login" });
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            html: "Emel " + this.form.email + " tiada dalam rekod kami",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  computed: {},
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
                    <div class="form-group position-relative">
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
                        v-model="form.email"
                      />
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
