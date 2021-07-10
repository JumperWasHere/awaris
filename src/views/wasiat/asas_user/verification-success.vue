<script>
import ApiPublicService from "@/services/api-public.service";
import { mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  data() {
    return {
      wasiat: {},
    };
  },
  components: { PulseLoader },
  methods: {},
  mounted() {},
  computed: {
    ...mapGetters(["userAccess", "userRole", "currentUser"]),
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    userAccessCheck() {
      return this.userAccess;
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
              <div class="card card-custom gutter-b">
                <div class="card-body">
                  <p class="text-center">
                    e-KYC dan Pengesahan Wasiat telah berjaya.
                    <br />
                    SMS dan e-mel telah dihantar kepada ejen anda.
                  </p>
                  <br />
                  <p class="text-center">Terima kasih.</p>
                </div>
              </div>
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
