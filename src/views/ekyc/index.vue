<script>
import ApiService from "@/services/api.service";
import Switcher from "@/components/switcher";
import { LOGIN, LOGOUT } from "@/services/store/auth.module";
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

/**
 * Auth-login component
 */
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
    relaodPage() {
      location.reload();
    },
    capture(type) {
      const vm = this;
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(mediaStreamTrack);
      vm.$notify({
        group: "foo",
        title: `Gambar ${type} telah berjaya diambil.`,
        duration: 5000,
        type: "success",
      });
      return imageCapture.takePhoto().then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          // console.log(base64data);
          if (type == "selfie") {
            vm.selfie = reader.result.split(",")[1];
          } else if (type == "mykad") {
            vm.mykad = reader.result.split(",")[1];
          }
        };
      });
    },
    faceVerification() {
      if (this.totalVerification >= 2) {
        return;
      }
      ApiService.post("/face-verification", {
        selfie_image: this.selfie,
        mykad_image: this.mykad,
        user_id: this.currentUser.id,
      })
        .then((response) => {
          if (response.data.face_verification.verification_score >= 70) {
            this.$swal
              .fire({
                icon: "success",
                html: "e-KYC berjaya!",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Seterusnya",
              })
              .then((response) => {
                this.$router.push({
                  name: "ekyc.validation",
                });
              });
          } else {
            var score = parseInt(
              response.data.face_verification.verification_score
            );
            this.$swal.fire({
              icon: "warning",
              html:
                "e-KYC tidak berjaya. Skor persamaan antara swafoto dan MyKad hanya " +
                score +
                "%",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Cuba Lagi",
              onClose: () => {
                this.selfie = null;
                this.mykad = null;
                this.totalVerification++;
              },
            });
          }
        })
        .catch((error) => {
          this.selfie = null;
          this.mykad = null;
        });
    },
    totalVerifications() {
      ApiService.get(`user/${this.currentUser.id}/face-verification`).then(
        (response) => {
          this.totalVerification = response.data.count;
          if (response.data.count < 3) {
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then((mediaStream) => {
                this.mediaStream = mediaStream;
                this.$refs.video.srcObject = mediaStream;
                this.$refs.video.play();
              })
              .catch((error) => {
                if (String(error) == "NotAllowedError: Permission denied") {
                  this.noCamera = true;
                  this.$swal.fire({
                    icon: "error",
                    html: "Sila benarkan penggunaan camera untuk tujuan e-KYC",
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText: "Okay",
                  });
                }
              });
          } else {
            if (response.data.user.face_verified == 1) {
              this.$router.push({ name: "dashboard" });
            }
          }
        }
      );
    },
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
  },
  mounted() {
    this.totalVerifications();
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole"]),
  },
  destroyed() {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.map((track) => track.stop());
    }
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
                src="/images/user/login.svg"
                class="img-fluid d-block mx-auto"
                alt
              />
            </div>
          </div>
          <div class="col-lg-5 col-md-6">
            <div class="card login-page bg-white shadow rounded border-0">
              <div class="card-body">
                <h4 class="card-title text-center">e-KYC</h4>
                <div v-if="totalVerification < 2">
                  <div
                    v-if="noCamera"
                    class="text-center d-flex align-items-center justify-content-center"
                    style="height: 200px"
                  >
                    <div>
                      <h6>Tiada Camera. Sila aktifkan camera anda</h6>
                      <a href="#" class="d-block" @click="relaodPage"
                        >Muat semula halaman</a
                      >
                    </div>
                    <br />
                  </div>
                  <video
                    style="
                      border-radius: 10px;
                      box-shadow: 0 3px 5px 0 rgba(47, 85, 212, 0.3);
                    "
                    ref="video"
                    class="camera-stream"
                    v-if="!noCamera"
                  />
                  <button
                    class="btn btn-primary btn-xsm w-100"
                    @click="capture('selfie')"
                    v-if="selfie == null && !noCamera"
                  >
                    Ambil Swafoto
                  </button>
                  <button
                    class="btn btn-primary btn-xsm w-100"
                    @click="capture('mykad')"
                    v-if="mykad == null && selfie != null"
                  >
                    Ambil MyKad
                  </button>
                  <button
                    class="btn btn-primary btn-xsm w-100"
                    @click="faceVerification"
                    v-if="mykad && selfie"
                  >
                    Sahkan e-KYC
                  </button>
                </div>
                <div v-if="totalVerification >= 2">
                  <p>
                    Anda telah mencapai had maksima untuk eKYC. Sila hubungi
                    pihak AWARIS untuk tindakan selanjutnya. Terima kasih.
                  </p>
                  <ul>
                    <li>+603 - 6263 9990</li>
                    <li>admin@awarisgroup.com</li>
                  </ul>
                  <div class="text-center mt-5">
                    <button @click="logout" class="btn btn-primary">
                      Log Keluar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Switcher />
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