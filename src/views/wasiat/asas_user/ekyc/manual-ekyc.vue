<script>
import { mapGetters } from "vuex";
import ApiPublicService from "@/services/api-public.service";

import {
  IS_EKYC_COMPLETE,
  MYKAD_FRONT,
  SELFIE,
} from "@/services/store/wasiat.module";
export default {
  data() {
    return {
      noCamera: false,
      labelSefie: true,
      labelmykad: true,
      mediaDevice: {
        video: true,
      },
      mykad: {
        front: null,
        frontbase64: null,
        frontUrl: null,
        selfie: null,
        selfieUrl: null,
        selfiebase64: null,
      },
      videoDevices: null,
      captureType: "",
      mobileCamera: "Camera Depan",
      mykadCameraFront: null,
      mykadCameraSelfie: null,
    };
  },
  props: {
    wasiat: {
      type: Object,
    },
  },
  computed: {
    // ...mapGetters(["selfieWasiat", "mykadFrontWasiat"]),
    selfiePath() {
      if (this.mykadCameraSelfie) {
        return "data:image/png;base64," + this.selfiebase64;
      } else {
        return this.mykad.selfieUrl;
      }
    },
    mykadFrontPath() {
      if (this.mykadCameraFront) {
        return "data:image/png;base64," + this.frontbase64;
      } else {
        return this.mykad.frontUrl;
      }
    },
  },
  mounted() {
    this.$store.dispatch(SELFIE, "");
  },
  destroyed() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
  methods: {
    openmodalcapture(type) {
      console.log("openmodalcapture", type);
      if (type == "mykad-front") {
        this.$refs["modalOcr"].show();
        this.getCameraSelection();
        this.streamVideo();
      } else {
        this.$refs["modalOcr"].show();
        this.getCameraSelection();
        this.streamVideo();
      }
    },
    async filesChange(files, type) {
      console.log("filesChange - type", type);
      // letak api terus
      this.$refs["modalSelect"].hide();
      this.$refs["modalSelectfront"].hide();

      if (type == "mykad-front") {
        console.log("front");
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.mykadCameraFront = null;
        this.frontbase64 = null;
      } else {
        this.mykad.selfie = files[0];
        this.mykad.selfieUrl = URL.createObjectURL(files[0]);
        this.mykadCameraSelfie = null;
        this.selfiebase64 = null;
      }
    },
    openModal(type) {
      // this.$refs["modalOcr"].show();
      this.captureType = type;
      console.log("openmodal - type", type);
      // this.getCameraSelection();
      // this.streamVideo();
      if (type == "MyKad Depan") {
        this.$refs["modalSelectfront"].show();
        this.$refs["modalSelect"].hide();
      } else {
        this.$refs["modalSelect"].show();
        this.$refs["modalSelectfront"].hide();
      }
    },
    pictureValidate() {
      // console.log(this.selfieWasiat.length);
      // console.log(this.mykadFrontwasiat.length);
      if (this.selfiePath == null) {
        return false;
      } else if (this.mykadFrontPath == null) {
        return false;
      }
      return true;
    },
    async submitForm() {
      if (!this.pictureValidate()) {
             this.$swal.fire({
              icon: "error",
              html: "Sila lengkapkan e-KYC",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Okay",
            });
        return;
      }
      await this.storeAttachmentSelfie(this.mykad.selfie, "selfie");
      await this.storeAttachmentFront(this.mykad.front, "mykad-front");
      const res = await this.updateWasiat();
      if (res) {
        this.$store.dispatch(IS_EKYC_COMPLETE, true);
        this.$router.push({
          name: "wasiat-verification.pdpa",
          params: { wasiat_id: this.wasiat.id },
        });
      }
    },
    async updateWasiat() {
      return await ApiPublicService.post(`wasiat/${this.wasiat.id}`, {
        _method: "PATCH",
        set_ekyc_verified_at: 1,
        ekyc_method: "Manual",
      })
        .then((response) => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    streamVideo() {
      console.log(this.mediaDevice);
      navigator.mediaDevices
        .getUserMedia(this.mediaDevice)
        .then((mediaStream) => {
          console.log(mediaStream);
          this.mediaStream = mediaStream;
          this.$refs.video.srcObject = mediaStream;
          this.$refs.video.play();
        })
        .catch((error) => {
          console.log(error);

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

      vm.$notify({
        group: "foo",
        title: `Gambar ${type} telah berjaya diambil.`,
        duration: 5000,
        type: "success",
      });
      console.log("capture -- type", type);
      return imageCapture.takePhoto().then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          if (type == "Swafoto") {
            var selfie = reader.result.split(",")[1];
            vm.$store.dispatch(SELFIE, selfie);
            vm.selfiebase64 = selfie;
            vm.mykad.selfie = null;
            vm.mykadCameraSelfie = {
              is_base64: "true",
              type: "selfie",
              document: "data:image/png;base64," + selfie,
            };
            console.log(selfie);
          } else if (type == "MyKad Depan") {
            var mykad = reader.result.split(",")[1];
            vm.$store.dispatch(MYKAD_FRONT, mykad);
            vm.frontbase64 = mykad;
            vm.mykad.front = null;
            vm.mykadCameraFront = {
              is_base64: "true",
              type: "mykad-front",
              document: "data:image/png;base64," + mykad,
            };
          }
          vm.closeEkyc();
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
    openModal(type) {
      // this.$refs["modalOcr"].show();
      this.captureType = type;
      console.log("openmodal - type", type);
      // this.getCameraSelection();
      // this.streamVideo();
      if (type == "MyKad Depan") {
        this.$refs["modalSelectfront"].show();
        this.$refs["modalSelect"].hide();
      } else {
        this.$refs["modalSelect"].show();
        this.$refs["modalSelectfront"].hide();
      }
    },
    closeEkyc() {
      this.$refs["modalOcr"].hide();
      this.$refs["modalSelect"].hide();
      this.$refs["modalSelectfront"].hide();
      if (this.mediaStream) {
        const tracks = this.mediaStream.getTracks();
        tracks.map((track) => track.stop());
      }
    },
    // async storeAttachment(type) {
    //   this.$refs["modalOcr"].hide();
    //   this.$refs["modalSelect"].hide();
    //   this.$refs["modalSelectfront"].hide();
    //   if (this.mediaStream) {
    //     const tracks = this.mediaStream.getTracks();
    //     tracks.map((track) => track.stop());
    //   }
    // },
    async storeAttachmentSelfie(document, type) {
      if (this.mykadCameraSelfie) {
        return await ApiPublicService.post(
          `wasiat/${this.wasiat.id}/document`,
          this.mykadCameraSelfie
        )
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (document) {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);

        return await ApiPublicService.post(
          `wasiat/${this.wasiat.id}/document`,
          formData
        )
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (!document) {
        return;
      }
    },

    async storeAttachmentFront(document, type) {
      if (this.mykadCameraFront) {
        return await ApiPublicService.post(
          `wasiat/${this.wasiat.id}/document`,
          this.mykadCameraFront
        )
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (document) {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);

        return await ApiPublicService.post(
          `wasiat/${this.wasiat.id}/document`,
          formData
        )
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (!document) {
        return;
      }
      // var data = {
      //   is_base64: "true",
      //   type: type == "Swafoto" ? "selfie" : "mykad-front",
      // };
      // if (type == "Swafoto") {
      //   data.document = this.selfiePath;
      // } else {
      //   data.document = this.mykadFrontPath;
      // }

      // return await ApiPublicService.post(
      //   `wasiat/${this.wasiat.id}/document`,
      //   data
      // )
      //   .then((response) => {
      //     return true;
      //   })
      //   .catch(() => {
      //     return false;
      //   });
    },
  },
};
</script>

<template>
  <div>
    <div class="alert alert-warning">
      Proses eKYC tidak berjaya. Sila muat naik swafoto bersama MyKad (Depan)
      dan MyKad (Depan) anda untuk verifikasi oleh pihak AWARIS. Anda perlu klik
      di dalam kotak gambar untuk memuat naik.
    </div>
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center">Proses eKYC</h5>
        <div class="row mt-4">
          <div class="col-md-6 form-group">
            <label for="upload-photo-1"> Swafoto bersama MyKad </label>
            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
                @click="openModal('Swafoto')"
              >
                <label
                  v-if="selfiePath"
                  :style="'background-image: url(' + selfiePath + ');'"
                  style="
                    border-radius: 5px;
                    margin-bottom: 0;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    height: 100%;
                    width: 100%;
                  "
                ></label>
                <label class="upload-photo-dark text-center" v-if="!selfiePath">
                  <span>Ambil Gambar</span>
                </label>
              </div>
            </div>
            <div>
              <small>
                <i
                  >(Sila letakkan MyKad bersebelahan muka anda tanpa menutupi
                  muka)</i
                ></small
              >
            </div>
          </div>
          <div class="col-md-6 form-group">
            <label for="upload-photo-1"> MyKad (Depan) </label>
            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
                @click="openModal('MyKad Depan')"
              >
                <label
                  v-if="mykadFrontPath"
                  :style="'background-image: url(' + mykadFrontPath + ');'"
                  style="
                    border-radius: 5px;
                    margin-bottom: 0;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    height: 100%;
                    width: 100%;
                  "
                ></label>
                <label
                  class="upload-photo-dark text-center"
                  v-if="!mykadFrontPath"
                >
                  <span>Ambil Gambar</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right mt-3">
      <button @click="submitForm" class="btn btn-primary">
        Simpan &amp; Seterusnya
      </button>
    </div>
    <b-modal
      id="modalOcr"
      ref="modalOcr"
      class="modal fade"
      title="e-KYC"
      ok-title="Mulakan"
      hide-footer
      @close="closeEkyc"
    >
      <div class="video-options" v-if="!this.$isMobile()">
        <select
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
      <div class="row mt-2 mb-4">
        <div class="col-md-12">
          <div v-if="this.$isMobile()" class="text-center">
            <b-button class="btn-sm" @click="mobileChangeCamera">
              {{ mobileCamera }}</b-button
            >
          </div>
        </div>
      </div>
      <div :id="!noCamera ? 'content' : 'content-ic'">
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
      <button
        class="btn btn-primary btn-xsm w-100"
        @click="capture(captureType)"
      >
        Ambil {{ captureType }}
      </button>
    </b-modal>
    <b-modal
      id="modalSelect"
      ref="modalSelectfront"
      class="modal fade"
      title="Please Select"
      ok-title="Mulakan"
      hide-footer
      @close="closeEkyc"
    >
      <div>
        <label
          class="upload-photo-dark text-center btn-sm btn-primary"
          for="upload-photo-2"
        >
          <span>Upload File</span>
        </label>

        <input
          type="file"
          name="photo"
          id="upload-photo-2"
          class="upload-photo-input"
          accept="image/*"
          @change="filesChange($event.target.files, 'mykad-front')"
        />
      </div>
      <div>
        <label
          class="upload-photo-dark text-center btn-sm btn-primary"
          @click="openmodalcapture('mykad-front')"
        >
          <span>Capture Picture</span>
        </label>
      </div>
    </b-modal>
    <b-modal
      id="modalSelect"
      ref="modalSelect"
      class="modal fade"
      title="Please Select"
      ok-title="Mulakan"
      hide-footer
      @close="closeEkyc"
    >
      <div>
        <label
          class="upload-photo-dark text-center btn-sm btn-primary"
          for="upload-photo-1"
        >
          <span>Upload File</span>
        </label>

        <input
          type="file"
          name="photo"
          id="upload-photo-1"
          class="upload-photo-input"
          accept="image/*"
          @change="filesChange($event.target.files, 'Swafoto')"
        />
      </div>
      <div>
        <label
          class="upload-photo-dark text-center btn-sm btn-primary"
          @click="openmodalcapture('Swafoto')"
        >
          <span>Capture Picture</span>
        </label>
      </div>
    </b-modal>
  </div>
</template>