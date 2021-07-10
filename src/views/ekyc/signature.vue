<script>
import ApiService from "@/services/api.service";
import { SIGNATURE, LOGOUT } from "@/services/store/auth.module";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { mapGetters } from "vuex";
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
        username: "staff",
        password: "abc123",
      },
      isLogin: false,
      video: {},
      canvas: {},
      captures: [],
      mediaStream: null,
      selfie: null,
      mykad: null,
      noCamera: false,
      totalVerification: 0,
    };
  },
  components: {
    PulseLoader,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    HomeIcon,
    UserIcon,
    KeyIcon,
  },
  methods: {
    logout() {
      const vm = this;
      vm.$store.dispatch(LOGOUT).then(() => {
        setTimeout(() => {
          if (this.$route.name != "Home") {
            vm.$router.push({ name: "Home" });
          }
        }, 500);
      });
    },
    undo() {
      this.$refs.signaturePad.clearSignature();
    },
    async saveSignature(bvModalEvt) {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (isEmpty) {
        this.$notify({
          group: "full-noti",
          text: "Sila tandatangan terlebih dahulu",
          duration: 5000,
          type: "success",
        });
        return;
      }
      await ApiService.post(`/user/${this.currentUser.id}/signature`, {
        is_base64: true,
        document: data,
      }).then((response) => {
        const vm = this;
        vm.$store.dispatch(SIGNATURE, response.data.attachment).then(() => {
          vm.$router.push({ name: "dashboard" });
        });
      });
    },
  },
  mounted() {
    if (this.signature != null) {
      this.$router.push({ name: "dashboard" });
    }
  },
  watch: {
    signature: {
      handler: function (val) {
        console.log("SS", val);
        if (val) {
          this.$router.push({ name: "dashboard" });
        }
      },
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "signature"]),
  },
};
</script>

<template>
  <div>
    <div class="back-to-home rounded d-none d-sm-block">
      <button
        @click="logout"
        type="button"
        class="btn btn-icon btn-soft-primary"
      >
        <key-icon class="icons"></key-icon>
      </button>
    </div>

    <section class="bg-home d-flex align-items-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7 col-md-6">
            <div class="mr-lg-5">
              <img
                src="/images/logo-awaris.png"
                class="img-fluid d-block mx-auto"
                alt
              />
            </div>
          </div>
          <div class="col-lg-5 col-md-6">
            <div class="card login-page bg-white shadow rounded border-0">
              <div class="card-body">
                <div>
                  <p class="text-justify">
                    Selamat Datang ke Sistem AWARIS Online! Sila kemukakan
                    tandatangan anda secara digital. Tandatangan tersebut akan
                    digunapakai pada dokumen-dokumen atas talian AWARIS.<br /><br />
                    “AWARIS SENTIASA BERSAMA ANDA”
                  </p>
                  <p class="text-justify">
                    <i>
                      Welcome to AWARIS Online System! Kindly provide us your
                      digital signature. Your signature will be used in AWARIS
                      online documents. <br /><br />
                      “AWARIS ALWAYS WITH YOU”</i
                    >
                  </p>
                  <div class="shadow signature-pad">
                    <VueSignaturePad
                      style="position: absolute; z-index: 1"
                      height="300px"
                      width="100%"
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
                        text-align: center;
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
                  <button @click="saveSignature" class="btn btn-primary w-100">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.camera-modal {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background-color: white;
  z-index: 10;
}
.camera-stream {
  width: 100%;
  max-height: 100%;
}
.camera-modal-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: center;
  margin-bottom: 24px;
}
.take-picture-button {
  display: flex;
}
</style>