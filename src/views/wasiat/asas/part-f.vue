<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      name: null,
      ic_number: null,
      Url_Generated: null,
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
    copyTestingCode() {
      let testingCodeToCopy = document.querySelector("#testing-code");
      testingCodeToCopy.setAttribute("type", "text"); // 不是 hidden 才能複製
      testingCodeToCopy.select();
      var successful = document.execCommand("copy");
    },
    generateUrl() {
      ApiService.post(`/route-token`, {
        user_id: this.wasiat.user_id,
        model_id: this.wasiat.id,
        model_type: "Wasiat",
      })
        .then((response) => {
          var token = response.data.route_token.token;
          var id = response.data.route_token.id;
          this.Url_Generated =
            this.UrlBase +
            this.wasiat.id +
            "?token=" +
            token +
            "&token_id=" +
            id;
          console.log(response.data.route_token.token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSignature() {
      ApiService.get(`/wasiat/${this.wasiatId}/signature?stream=false`).then(
        (response) => {
          console.log(response.data);
          this.signature = response.data.signature;
        }
      );
    },
    async saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log("Signature data empty: ", isEmpty);
      if (!isEmpty) {
        return await ApiService.post(`/wasiat/${this.wasiatId}/signature`, {
          is_base64: true,
          document: data,
        })
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
      ApiService.get(`/wasiat/${this.wasiatId}`).then((response) => {
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
      return await ApiService.post(`/wasiat/${this.wasiatId}`, this.form)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.submit = false;
          return false;
        });
    },
    async emailClientCreate() {
      return await ApiService.get(
        `user/${this.wasiat.user_id}/email-client-created`
      )
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.submit = false;
          return false;
        });
    },
    async saveFormNoSignature() {
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
      await this.updateWasiat();
      if (!this.pengesahan) {
        this.$router.push({
          name: "wasiat.part_g",
          query: {
            wasiat_id: this.wasiatId,
          },
        });
      } else {
        this.$router.push({
          name: "wasiat.part_g",
          query: { wasiat_id: this.wasiatId, pengesahan: this.pengesahan },
        });
      }
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
      if (this.wasiat.status != 1) {
        // await this.emailClientCreate();
      }
      var result;
      if (this.signature == null) {
        result = await this.saveSignature();
        if (!result) {
          return;
        }
      }
      await this.updateWasiat();
      this.$router.push({
        name: "wasiat.part_g",
        query: { wasiat_id: this.wasiatId, pengesahan: this.pengesahan },
      });
    },

    nextPage() {
      this.submit = true;
      this.$router.push({
        name: "wasiat.part_g",
        query: { wasiat_id: this.wasiatId, pengesahan: this.pengesahan },
      });
    },
  },
  watch: {
    wasiat: {
      handler: function (val) {
        if (val.status == -1) {
          this.$router.push({
            name: "wasiat.part_c",
            query: {
              wasiat_id: this.wasiatId,
            },
          });
        }
        if (!val.user.name) {
          this.$router.push({
            name: "wasiat.part_d",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
        if (!val.heir) {
          console.log("heir");
          this.$router.push({
            name: "wasiat.part_e",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
      },
    },
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
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    UrlBase() {
      return window.location.host + "/public/wasiat/";
    },
  },
  mounted() {
    if (!this.$route.query.wasiat_id) {
      this.$router.push({ name: "wasiat.part_a" });
    }
    if (this.wasiatId) {
      this.getWasiat();
    } else {
      this.$router.push({
        name: "wasiat.part_a",
      });
    }
    this.getSignature();
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <form class="login-form">
              <div class="form-group mt-1 mb-2" v-if="userRole != 'Client'">
                <div
                  class="alert alert-info"
                  v-if="[0, 1].includes(wasiat.status)"
                >
                  Jika pewasiat tidak bersama anda sewaktu pendaftaran wasiat
                  asas, sila jana pautan dan kongsikan kepada pewasiat untuk
                  eKYC dan pengesahan.

                  <div class="input-group mt-3">
                    <div class="input-group-prepend">
                      <b-button class="btn-sm" @click="generateUrl">
                        Jana Pautan
                      </b-button>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      readonly
                      placeholder="Pautan untuk dikongsi"
                      aria-label="Text input with checkbox"
                      v-model.trim="Url_Generated"
                      id="testing-code"
                    />
                    <div class="input-group-append">
                      <b-button class="btn-sm" @click="copyTestingCode">
                        Salin
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
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
                  <div
                    class="col-md-12 text-center"
                    v-if="!signature && ![0].includes(this.wasiat.status)"
                  >
                    <div class="alert alert-info">
                      Tandatangan ini telah dilangkau.
                    </div>
                  </div>
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
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-lg-12 text-right">
        <div class="form-group" v-if="userRole == 'Staff'">
          <button
            @click="saveFormNoSignature"
            class="btn btn-primary"
            type="button"
            v-if="[0, 1, 3].includes(wasiat.status)"
          >
            Simpan & Seterusnya Tanpa Tandatangan Digital
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
        <div class="form-group">
          <button
            @click="saveForm"
            class="btn btn-primary"
            type="button"
            v-if="[0, 1, 3].includes(wasiat.status)"
          >
            {{ $t("save-next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
          <button
            @click="nextPage"
            class="btn btn-primary"
            type="button"
            v-if="[2].includes(wasiat.status)"
          >
            {{ $t("next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
