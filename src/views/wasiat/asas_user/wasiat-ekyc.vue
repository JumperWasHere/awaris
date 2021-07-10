<script>
import ApiPublicService from "@/services/api-public.service";
import { mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import eKYC from "@/views/wasiat/asas_user/ekyc/ekyc";
import ManualeKYC from "@/views/wasiat/asas_user/ekyc/manual-ekyc";
import eKYCComplete from "@/views/wasiat/asas_user/ekyc/ekyc-complete";
import { VERIFY_AUTH } from "@/services/store/auth.module";
import store from "@/services/store";

export default {
  data() {
    return {
      wasiat: null,
      ekyc_verified_at: null,
      witness: null,
      amendment_status: null,
      amendment_id: null,
      printWasiat_id: null,
      amendment_array: null,
      amendment_index_status: null,
      face_verification_count: null,
      ekyc_fail: null,
      btnPrint: false,
    };
  },
  components: {
    PulseLoader,
    ekyc: eKYC,
    "manual-ekyc": ManualeKYC,
    "ekyc-complete": eKYCComplete,
  },
  unmounted() {
    const tracks = this.mediaStream.getTracks();
    tracks.map((track) => track.stop());
  },
  methods: {
    back() {
      this.$router.push({
        name: "wasiat.list",
        query: { wasiat_id: this.wasiatId },
      });
    },
    getWaisat() {
      ApiPublicService.get(`/wasiat/${this.wasiatId}`)
        .then((response) => {
          this.wasiat = response.data.wasiat;
          this.ekyc_verified_at = response.data.wasiat.ekyc_verified_at;
          this.ekyc_fail = response.data.wasiat.ekyc_fail;
          console.log("wasiat user_id--", this.wasiat);
        })
        .catch((error) => {
          console.log("ERROR -- ", error);
        });
    },
    updatefail() {
      ApiPublicService.post(`/wasiat/${this.wasiat.id}`, {
        _method: "PATCH",
        ekyc_fail: 1,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    eventHandler() {
      console.log("updatefail", +1);
      this.ekyc_fail = 1;
      this.updatefail();
    },
  },
  mounted() {
    if (this.wasiatId) {
      this.getWaisat();
    }
  },
  watch: {
    wasiatDetails: {
      handler: function (val) {
        console.log(val);
      },
    },
  },
  computed: {
    ...mapGetters([
      "userAccess",
      "userRole",
      "currentUser",
      "failedCountWasiat",
    ]),
    wasiatId() {
      return this.$route.params.wasiat_id;
    },
    wasiatDetails() {
      return this.wasiat;
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
    <section class="section">
      <div class="container" style="margin-top: 100px">
        <div class="bg-overlay bg-overlay-white bg-overlay-img"></div>
        <div class="row justify-content-center" style="margin-bottom: 50px">
          <div
            class="card verification-page bg-white shadow rounded-login border-0"
          >
            <div class="card-body-login">
              {{ face_verification_count }}
              <div class="row" v-if="wasiat">
                <div
                  class="col-lg-12 col-12 mb-4 pb-2"
                  v-if="!ekyc_verified_at && ekyc_fail <= 0"
                >
                  <ekyc :wasiat="wasiat" @failcount="eventHandler"> </ekyc>
                </div>
                <div
                  class="col-lg-12 col-12 mb-4 pb-2"
                  v-if="!ekyc_verified_at && ekyc_fail > 0"
                >
                  <manual-ekyc :wasiat="wasiat"> </manual-ekyc>
                </div>
                <div class="col-lg-12 col-12 mb-4 pb-2" v-if="ekyc_verified_at">
                  <ekyc-complete :wasiat="wasiat"> </ekyc-complete>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
</template>
