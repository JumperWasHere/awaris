 <script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import {
  IS_EKYC_COMPLETE,
  FAILED_COUNT,
  MYKAD_FRONT,
  SELFIE,
} from "@/services/store/trust.module";
import "image-capture/src/imagecapture.js";
export default {
  data() {
    return {
      alertMessage: null,
      canvas: null,
      mobileCamera: "Camera Depan",
      videoDevices: null,
      isKoperate: false,
      mediaDevice: {
        video: true,
      },
      video: {},
      ocrMethod: 1,
      noCamera: false,
      ocrResponse: null,
      facingMode: "environment",
      mediaStream: null,
      selfie: null,
      mykad: null,
    };
  },
  methods: {
    streamVideo() {
      navigator.mediaDevices
        .getUserMedia(this.mediaDevice)
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
    },
    async getCameraSelection() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      this.videoDevices = videoDevices ?? [];

      // const options = videoDevices.map(videoDevice => {
      //   return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
      // });
      // cameraOptions.innerHTML = options.join('');
    },
    selectCamera(event) {
      this.mediaDevice = {
        video: {
          deviceId: event.target.value,
        },
      };
      this.streamVideo();
    },
    mobileChangeCamera() {
      if (this.mobileCamera == "Camera Depan") {
        this.mediaDevice = {
          video: { facingMode: { exact: "environment" } },
        };
        this.mobileCamera = "Camera Belakang";
      } else {
        this.mobileCamera = "Camera Depan";
        this.mediaDevice = {
          video: { facingMode: "user" },
        };
      }
      this.streamVideo();
    },
    capture(type) {
      const vm = this;
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(mediaStreamTrack);
      this.alertMessage = `Gambar ${type} telah berjaya diambil.`;

      // vm.$notify({
      //   group: "foo",
      //   title: `Gambar ${type} telah berjaya diambil.`,
      //   duration: 5000,
      //   type: "success",
      // });
      return imageCapture.takePhoto().then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          if (type == "selfie") {
            vm.selfie = reader.result.split(",")[1];
            vm.$store.dispatch(SELFIE, vm.selfie);
          } else if (type == "mykad") {
            vm.mykad = reader.result.split(",")[1];
            vm.$store.dispatch(MYKAD_FRONT, vm.mykad);
          }
        };
      });
    },
    changeCamera() {
      if (this.facingMode == "environment") {
        this.facingMode = "user";
      } else {
        this.facingMode = "environment";
      }
    },
    faceVerification() {
      const vm = this;
      this.alertMessage = null;

      ApiService.post("/face-verification", {
        selfie_image: this.selfie,
        mykad_image: this.mykad,
        user_id: this.trust.user_id,
        ekycable_id: this.trust.id,
        ekycable_type: "Hibah",
      })
        .then((response) => {
          console.log(
            "SCORE: ",
            response.data.face_verification.verification_score
          );
          if (
            response.data.face_verification.verification_score >=
            this.verificationRate
          ) {
            this.$swal
              .fire({
                icon: "success",
                html: "e-KYC berjaya!",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Seterusnya",
                willClose: () => {
                  vm.$store.dispatch(IS_EKYC_COMPLETE, true);
                  vm.$router.push({
                    name: "trust.part-c",
                    query: {
                      trust_id: this.trust.id,
                      amendment_id: this.amendmentId,
                    },
                  });
                },
              })
              .then((response) => {
                // vm.$store.dispatch(IS_EKYC_COMPLETE, true);
              });
            var data_ocr = respone.data.ocr_data;
          } else {
            this.$store.dispatch(FAILED_COUNT);
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
              willClose: () => {
                this.selfie = null;
                this.mykad = null;
              },
            });
          }
        })
        .catch((error) => {
          //   this.failedCount++;
          this.$store.dispatch(FAILED_COUNT);
          this.selfie = null;
          this.mykad = null;
        });
    },
  },
  mounted() {
    this.getCameraSelection();
    this.streamVideo();
  },

  computed: {
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "userRole",
      "failedCount",
      "trust",
      "mykadFront",
    ]),
    verificationRate() {
      return process.env.VUE_APP_DOT_VERIFICATION_RATE;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          if (["1", "2"].includes(val.hibah_type)) {
            this.isKoperate = true;
            console.log("this.isKoperate = true");
          } else {
            this.isKoperate = false;
            console.log("this.isKoperate = false");
          }
        } else {
          this.isKoperate = false;
          console.log("loading trust value...");
        }
      },
    },
  },
  unmounted() {
    const tracks = this.mediaStream.getTracks();
    tracks.map((track) => track.stop());
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
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body" v-if="trust">
        <div class="alert alert-success" v-if="alertMessage">
          {{ alertMessage }}
        </div>
        <div
          style="position: absolute; top: 0%; right: 0%"
          class="p-3"
          v-if="
            ['1', '2'].includes(trust.hibah_type) &&
            [-1, 0].includes(trust.status)
          "
        >
          <router-link
            class="btn-sm btn-primary"
            :to="{
              name: 'trust.part-c',
              query: { trust_id: trustId, amendment_id: amendmentId },
            }"
          >
            {{ $t("skip") }}
          </router-link>
        </div>
        <h5 class="text-center">Proses eKYC</h5>
        <div class="video-options" v-if="!this.$isMobile()">
          <select
            v-if="videoDevices && videoDevices.length > 1"
            name=""
            id=""
            class="form-control"
            @change="selectCamera($event)"
          >
            <option
              :value="device.deviceId"
              v-for="device in videoDevices"
              :key="device.deviceId"
            >
              {{ device.label }}
            </option>
          </select>
        </div>
        <div v-if="this.$isMobile()">
          <b-button class="btn-sm" @click="mobileChangeCamera">
            {{ mobileCamera }}</b-button
          >
        </div>
        <div :id="selfie == null && !noCamera ? 'content' : 'content-ic'">
          <video
            style="
              border-radius: 10px;
              box-shadow: 0 3px 5px 0 rgba(47, 85, 212, 0.3);
              z-index: 0;
              position: relative;
            "
            ref="video"
            playsinline
            autoplay
            width="70%"
            class="camera-stream"
          />
          <canvas style="display: none" ref="canvas"></canvas>

          <p><img /></p>
        </div>
        <!-- </div> -->
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
        <div class="text-right mt-4">
          <small>Kiraan gagal: {{ failedCount }}</small>
        </div>
      </div>
    </div>
  </div>
</template>