<script>
import ApiPublicService from "@/services/api.service";
import { mapGetters } from "vuex";
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
      name: null,
      ic_number: null,
      form: {
        acknowledged_pdpa: 0,
        acknowledged_confirmation: 0,
      },
      wasiatKonvensional: false,
      wasiat: {},
      submit: false,
      signature: null,
      isShowing_pdpa: false,
      isShowing_confirmation: false,
    };
  },
  components: {},
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    getSignature() {
      ApiPublicService.get(
        `/wasiat/${this.wasiatId}/signature?stream=false`
      ).then((response) => {
        console.log(response.data);
        this.signature = response.data.signature;
      });
    },
    async saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log("Signature data empty: ", isEmpty);
      if (!isEmpty) {
        return await ApiPublicService.post(
          `/wasiat/${this.wasiatId}/signature`,
          {
            is_base64: true,
            document: data,
          }
        )
          .then((response) => {
            return true;
          })
          .catch((error) => {
            this.submit = false;
            return false;
          });
      } else {
        this.$notify({
          group: "foo",
          title: "Sila tandatangan sebelum hantar.",
          type: "error",
        });
        this.submit = false;
        return false;
      }
    },
    getWasiat() {
      ApiPublicService.get(`/wasiat/${this.wasiatId}`).then((response) => {
        var wasiat = response.data.wasiat;
        if (wasiat) {
          this.wasiat = wasiat;
          this.name = wasiat.user.name;
          this.ic_number = wasiat.user.ic_number;
          this.form.acknowledged_pdpa = wasiat.acknowledged_pdpa;
          this.form.acknowledged_confirmation =
            wasiat.acknowledged_confirmation;
          if (wasiat.wasiat_type == 2) {
            this.wasiatKonvensional = true;
          }
          console.log("wasiat", wasiat);
        }
      });
    },
    async updateWasiat() {
      this.form._method = "PATCH";
      return await ApiPublicService.post(`/wasiat/${this.wasiatId}`, this.form)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.submit = false;
          return false;
        });
    },
    async saveForm() {
      if (!this.form.acknowledged_pdpa) {
        this.$swal.fire({
          icon: "error",
          html: "Sila bersetuju dengan Akta Perlindungan Data Peribadi 2010.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      } else if (!this.form.acknowledged_confirmation) {
        this.$swal.fire({
          icon: "error",
          html: "Sila bersetuju dengan pengesahan wasiat.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      this.$router.push({
        name: "verification.success",
        query: { wasiat_id: this.wasiatId },
      });
    },
  },
  mounted() {
    // if (!this.$route.query.wasiat_id) {
    //   this.$router.push({ name: "wasiat.part_a" });
    // }
    // if (this.wasiatId) {
    //   this.getWasiat();
    // } else {
    //   this.$router.push({
    //     name: "wasiat.part_a",
    //   });
    // }
    this.getSignature();
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    ...mapGetters(["userAccess", "userRole", "currentUser"]),
    paymentStatus() {
      return this.$route.query.status;
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
    <section class="section">
      <div class="container" style="margin-top: 100px">
        <div class="bg-overlay bg-overlay-white bg-overlay-img"></div>
        <div class="row justify-content-center" style="margin-bottom: 50px">
          <div
            class="card verification-page bg-white shadow rounded-login border-0"
          >
            <div class="card-body-login">
              <div class="card card-custom gutter-b">
                <div class="card-header">
                  <div class="card-title m-0">
                    <h5 class="card-label m-0">
                      AKTA PERLINDUNGAN DATA PERIBADI 2010
                    </h5>
                  </div>
                </div>
                <div class="card-body">
                  <p class="text-justify">
                    Dengan menyempurnakan permohonan ini anda membenarkan
                    maklumat peribadi anda untuk digunakan oleh Amanah Warisan
                    Berhad untuk memberikan perkhidmatan yang bersesuaian dengan
                    anda. Maklumat peribadi yang diberikan oleh anda akan
                    digunakan untuk pentadbiran dan pengurusan perkhidmatan yang
                    diberikan kepada anda. Maklumat peribadi anda boleh
                    digunakan untuk memberi anda maklumat lanjut mengenai produk
                    dan perkhidmatan yang bersesuaian dengan anda daripada
                    Amanah Warisan Berhad. Maklumat tersebut adalah sulit dan
                    persendirian dan tidak akan dikemukakan oleh pihak ketiga
                    tanpa kebenaran anda. Semua maklumat yang diberikan oleh
                    anda dalam borang ini adalah tepat, lengkap dan terkini.
                    Jika anda ingin mengemaskini maklumat peribadi anda, sila
                    hubungi kami di talian 03-62639990, e-mel kami di:
                    admin@awarisgroup.com.
                  </p>
                  <div class="form-check">
                    <input
                      @click="isShowing_pdpa ^= true"
                      type="checkbox"
                      class="form-check-input"
                      id="exampleCheck1"
                      value="1"
                      :disabled="
                        form.acknowledged_pdpa == 1 && wasiat.status >= 1
                      "
                      v-model="form.acknowledged_pdpa"
                    />
                    <label class="label-agree-term" for="exampleCheck1">
                      <strong>
                        SAYA MEMAHAMI AKTA PERLINDUNGAN DATA PERIBADI 2010
                      </strong>
                    </label>
                  </div>
                </div>
              </div>
              <br />
              <div class="card card-custom gutter-b">
                <div class="card-header">
                  <div class="card-title m-0">
                    <h5 class="card-label m-0">PENGESAHAN WASIAT</h5>
                  </div>
                </div>
                <div class="card-body">
                  <p>
                    Saya,
                    <strong
                      style="text-decoration: underline"
                      v-html="name"
                    ></strong
                    >, No. MyKad
                    <strong
                      style="text-decoration: underline"
                      v-html="ic_number"
                    ></strong>
                  </p>

                  <div class="form-check">
                    <input
                      @click="isShowing_confirmation ^= true"
                      type="checkbox"
                      class="form-check-input"
                      id="exampleCheck2"
                      value="1"
                      :disabled="
                        form.acknowledged_confirmation == 1 &&
                        wasiat.status >= 1
                      "
                      v-model="form.acknowledged_confirmation"
                    />
                    <label class="label-agree-term" for="exampleCheck2">
                      <strong>BERSETUJU DAN MEMAHAMI:</strong>
                    </label>
                  </div>
                  <p>
                    1. Melantik AMANAH WARISAN BERHAD sebagai Wasi dan Pemegang
                    Amanah bagi wasiat saya dengan kadar fi pelaksanaan sebanyak
                    2% daripada jumlah keseluruhan harta Pusaka saya.
                  </p>
                  <p>
                    2. Menarik balik semua wasiat yang terdahulu yang dibuat
                    oleh saya (sekiranya ada) dan sebarang pembayaran di atas
                    wasiat ini tidak akan dikembalikan kepada saya.
                  </p>
                  <p v-if="wasiatKonvensional">
                    3. Saya memberi dan mewasiatkan kesemua aset saya di mana
                    sahaja berada, harta alih atau tak alih yang mana saya
                    punyai kuasa untuk mewasiatkan kepada waris saya yang sah
                    secara SAMA RATA.
                  </p>
                  <img
                    :src="signature.public_path"
                    alt
                    srcset
                    v-if="signature"
                    style="width: 130px"
                    class="mt-3"
                  />
                  <div>
                    [
                    <strong v-html="name"></strong>]
                  </div>
                </div>
              </div>
              <div
                class="row mt-3"
                v-show="isShowing_pdpa && isShowing_confirmation"
              >
                <div class="col-md-12 text-center" v-if="!signature">
                  <div class="card" style="width: 500px; display: inline-block">
                    <div style="position: relative; height: 300px; width: 100%">
                      <VueSignaturePad
                        style="position: absolute; z-index: 1"
                        height="300px"
                        width="500px"
                        ref="signaturePad"
                        :options="{
                          onBegin: () => {
                            $refs.signaturePad.resizeCanvas();
                          },
                        }"
                      />
                      <label
                        style="
                          z-index: 0;
                          position: absolute;
                          right: 0px;
                          left: 0px;
                          top: 45%;
                          color: #b6b6b4;
                        "
                      >
                        Tandatangan disini
                      </label>
                      <a
                        class="btn btn-primary"
                        style="
                          position: absolute;
                          right: 5px;
                          top: 5px;
                          z-index: 2;
                        "
                        @click="undo"
                      >
                        <img src="/images/icon/rubber.svg" height="20" alt />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 text-center mt-4 mt-sm-0">
                  <div class="mt-md-4 mt-3 mt-sm-0">
                    <button @click="saveForm" class="btn btn-primary mr-2">
                      Seterusnya
                    </button>
                  </div>
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
