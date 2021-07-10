<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";

import {
  IS_EKYC_COMPLETE,
  FAILED_COUNT,
  MYKAD_FRONT,
  SELFIE,
} from "@/services/store/wasiat.module";
import "image-capture/src/imagecapture.js";
export default {
  data() {
    return {
      canvas: null,
      alertMessage: null,
      mobileCamera: "Kamera Depan",
      videoDevices: null,
      timeOut: null,
      mediaDevice: {
        video: true,
      },
      countDown: 15000,
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
    async onSubmit() {
      this.$router.push({
        name: "wasiat.part_d",
        query: {
          wasiat_id: this.wasiat.id,
          pengesahan: this.pengesahan,
        },
      });
    },
    async streamVideo() {
      navigator.mediaDevices
        .getUserMedia(this.mediaDevice)
        .then((mediaStream) => {
          this.mediaStream = mediaStream;
          try {
            this.$refs.video.srcObject = mediaStream;
            this.$refs.video.play();
          } catch (error) {}
        })
        .catch((error) => {
          console.log("Stream", error);
          if (String(error) == "NotAllowedError: Permission denied") {
            this.noCamera = true;
            this.$swal.fire({
              icon: "error",
              html: "Sila benarkan penggunaan kamera untuk tujuan e-KYC.",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Okay",
            });
          }
        });
    },
    async getCameraSelection() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      this.videoDevices = videoDevices ?? [];
      console.log("total device -- ", this.videoDevices);
      this.mediaDevice = {
        video: {
          deviceId: videoDevices[0].deviceId,
        },
      };
      this.streamVideo();
    },
    // async getConnectedDevices(type) {
    //   const devices = await navigator.mediaDevices.enumerateDevices();
    //   return devices.filter((device) => device.kind === type);
    // },
    selectCamera(event) {
      this.mediaDevice = {
        video: {
          deviceId: event.target.value,
        },
      };
      try {
        this.streamVideo();
      } catch (error) {
        console.log(error);
      }
    },
    async mobileChangeCamera() {
      try {
        if (this.mobileCamera == "Kamera Depan") {
          this.mediaDevice = {
            video: { facingMode: { exact: "environment" } },
          };
          this.mobileCamera = "Kamera Belakang";
        } else {
          this.mobileCamera = "Kamera Depan";
          this.mediaDevice = {
            video: { facingMode: "user" },
          };
        }
        await this.streamVideo();
      } catch (error) {
        console.log("BTN MOBILE SELECT CAMERA", error);
      }
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
      //  Vue.swal({
      //   icon: "error",
      //   html: errorMessage,
      //   showCloseButton: true,
      //   showCancelButton: false,
      //   focusConfirm: false,
      //   confirmButtonText: "Tutup",
      // });
      return imageCapture.takePhoto().then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          if (type == "selfie") {
            vm.selfie = reader.result.split(",")[1];
            vm.$store.dispatch(SELFIE, vm.selfie);
            console.log("selfie", vm.selfie);
          } else if (type == "mykad") {
            vm.mykad = reader.result.split(",")[1];
            console.log("mykad", vm.mykad);
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
        user_id: this.wasiat.user_id,
        ekycable_id: this.wasiat.id,
        ekycable_type: "Wasiat",
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
            vm.$store.dispatch(IS_EKYC_COMPLETE, true);
            this.$swal
              .fire({
                icon: "success",
                html: "e-KYC berjaya!",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Seterusnya",
                willClose: () => {
                  vm.$router.push({
                    name: "wasiat.part_d",
                    query: { wasiat_id: this.wasiat.id },
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
    skip() {
      if (!this.pengesahan) {
        this.$router.push({
          name: "wasiat.part_d",
          query: {
            wasiat_id: this.wasiat.id,
          },
        });
      } else {
        this.$router.push({
          name: "wasiat.part_d",
          query: { wasiat_id: this.wasiat.id, pengesahan: this.pengesahan },
        });
      }
    },
    manual() {
      clearTimeout(this.timeOut);

      this.$store.dispatch(FAILED_COUNT);
      // this.$router.push({
      //   name: "wasiat.part_c",
      //   query: { wasiat_id: this.wasiat.id },
      // });
    },
    countDownTimer() {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.$swal
          .fire({
            icon: "warning",
            html:
              "Jika anda mengalami kesulitan semasa proses e-KYC, sila lakukan e-KYC secara manual dengan menekan butang Manual e-KYC.",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Manual e-KYC",
            cancelButtonText: "Tutup",
            showCloseButton: true,
          })
          .then((result) => {
            if (result.value) {
              // this.$swal(
              //   "Deleted",
              //   "You successfully deleted this file",
              //   "success"
              // );
              this.manual();
              console.log("manual click");
            } else {
              this.countDownTimer();
            }
          });
        // this.countDownTimer();
      }, 15000);
    },
  },
  unmounted() {
    console.log("unmounted");
    clearTimeout(this.timeOut);
  },
  destroyed() {
    console.log("destroyed");

    clearTimeout(this.timeOut);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeOut);
  },
  mounted() {
    console.log("mouted ekyc");
    clearTimeout(this.timeOut);

    this.getCameraSelection();
    this.countDownTimer();
  },

  computed: {
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "userRole",
      "failedCountWasiat",
      "mykadFrontWasiat",
      "wasiat",
    ]),
    verificationRate() {
      return process.env.VUE_APP_DOT_VERIFICATION_RATE;
    },
    showlistCamera() {
      return this.$route.query.listcamera;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
  destroyed() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
};
</script>

<template>
  <div>
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body" v-if="[0].includes(wasiat.status)">
        <div
          style="position: absolute; top: 0%; right: 0%"
          class="p-3"
          v-if="userRole != 'Client' && wasiat"
        >
          <button @click="skip" class="btn btn-primary" type="button">
            {{ $t("skip") }}
          </button>
        </div>
        <div class="alert alert-success" v-if="alertMessage">
          {{ alertMessage }}
        </div>
        <h5 class="text-center mb-4">Proses eKYC</h5>
        <div class="video-options" v-if="!this.$isMobile() || showlistCamera">
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
        <div class="row mt-4 mb-4">
          <div class="col-md-12">
            <div v-if="this.$isMobile()" class="text-center">
              <b-button class="btn-sm" @click="mobileChangeCamera">
                {{ mobileCamera }}</b-button
              >
            </div>
          </div>
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
        <div class="row">
          <div class="col-md-12 text-center">
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
              Ambil MyKad Depan
            </button>
            <button
              class="btn btn-primary btn-xsm w-100"
              @click="faceVerification"
              v-if="mykad && selfie"
            >
              Sahkan e-KYC
            </button>
          </div>
        </div>

        <div class="text-right mt-4">
          <small>Kiraan gagal: {{ failedCountWasiat }}</small>
        </div>
      </div>
      <div
        class="card-body"
        v-if="
          !this.wasiat.ekyc_verified_at && ![0].includes(this.wasiat.status)
        "
      >
        <h5 class="text-center mb-4">Proses e-KYC</h5>
        <div class="row mt-4 mb-4">
          <div class="col-md-12 text-center">
            <div class="alert alert-info">e-KYC ini telah dilangkau.</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row mt-4"
      v-if="!this.wasiat.ekyc_verified_at && ![0].includes(this.wasiat.status)"
    >
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <button @click="onSubmit" class="btn btn-primary" type="button">
            {{ $t("next") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>