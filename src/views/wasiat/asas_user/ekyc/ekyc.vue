<script>
import { mapGetters } from "vuex";
import ApiPublicService from "@/services/api-public.service";

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
      mobileCamera: "Camera Depan",
      videoDevices: null,
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
  props: {
    wasiat: {
      type: Object,
    },
  },
  destroyed() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
  methods: {
    async streamVideo() {
      navigator.mediaDevices
        .getUserMedia(this.mediaDevice)
        .then((mediaStream) => {
          this.noCamera = false;
          this.mediaStream = mediaStream;
          try {
            this.$refs.video.srcObject = mediaStream;
            this.$refs.video.play();
          } catch (error) {}
        })
        .catch((error) => {
          console.log("Stream", error);
          this.noCamera = true;
          if (String(error) == "NotAllowedError: Permission denied") {
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
    async faceVerification() {
      const vm = this;
      this.alertMessage = null;
      ApiPublicService.post("/face-verification", {
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
                    name: "wasiat-verification.pdpa",
                    query: { wasiat_id: this.wasiat.id },
                  });
                },
              })
              .then((response) => {
                // vm.$store.dispatch(IS_EKYC_COMPLETE, true);
              });
            var data_ocr = respone.data.ocr_data;
          } else {
            // this.$store.dispatch(FAILED_COUNT);
            this.$emit("failcount");
            // this.updatefail();
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
          this.$emit("failcount");
          // this.$store.dispatch(FAILED_COUNT);
          // this.updatefail();
          this.selfie = null;
          this.mykad = null;
        });
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
            showLoaderOnConfirm: true,
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
    manual() {
      // this.$store.dispatch(FAILED_COUNT);
      this.$emit("failcount");
    },
  },
  mounted() {
    clearTimeout(this.timeOut);
    this.getCameraSelection();
    this.countDownTimer();
  },
  unmounted() {
    clearTimeout(this.timeOut);
  },
  beforeDestroy() {
    clearTimeout(this.timeOut);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
  destroyed() {
    clearTimeout(this.timeOut);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "userRole",
      "failedCountWasiat",
      "mykadFrontWasiat",
      // "wasiat",
    ]),
    verificationRate() {
      return process.env.VUE_APP_DOT_VERIFICATION_RATE;
    },
    showlistCamera() {
      return this.$route.query.listcamera;
    },
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
      <div class="card-body">
        <div class="alert alert-success" v-if="alertMessage">
          {{ alertMessage }}
        </div>
        <h5 class="text-center">Proses eKYC</h5>
        <div
          class="bg-primary d-flex justify-content-center m-2 mr-3 ml-3 pt-2"
          style="
            border-radius: 10px;
            box-shadow: 0 3px 5px 0 rgba(47, 85, 212, 0.3);
            z-index: 0;
            position: relative;
            bac
          "
        >
          <h3 v-if="selfie == null" class="justify-content-center text-light">
            Ambil Swafoto
          </h3>
          <h3
            v-if="selfie != null && mykad == null"
            class="justify-content-center text-light"
          >
            Ambil MyKad Depan
          </h3>
          <h3 v-if="mykad && selfie" class="justify-content-center text-light">
            Sahkan e-KYC
          </h3>
        </div>
        <!-- <h3 v-if="noCamera" class="justify-content-center text-light">
          CAMERA NOT AVAILABLE
        </h3> -->
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
        <button
          class="btn btn-primary btn-xsm w-100"
          @click="capture('selfie')"
          v-if="selfie == null && !noCamera"
          :disabled="noCamera"
        >
          Ambil Swafoto
        </button>

        <button
          class="btn btn-primary btn-xsm w-100"
          @click="capture('mykad')"
          v-if="mykad == null && selfie != null && !noCamera"
          :disabled="noCamera"
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
        <!-- <span class="d-flex justify-content-center" v-if="noCamera">
          CAMERA NOT AVAILABLE
        </span> -->
        <!-- <div class="text-right mt-4">
          <small>Kiraan gagal: {{ failedCountWasiat }}</small>
        </div> -->
      </div>
    </div>
  </div>
</template>