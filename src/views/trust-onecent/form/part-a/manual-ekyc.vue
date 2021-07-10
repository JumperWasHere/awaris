<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import {
  IS_EKYC_COMPLETE,
  MYKAD_FRONT,
  SELFIE,
} from "@/services/store/trust.module";
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
    };
  },
  computed: {
    ...mapGetters(["trust", "selfie", "mykadFront"]),
    selfiePath() {
      if (this.mykad.selfiebase64) {
        return "data:image/png;base64," + this.mykad.selfiebase64;
      } else if (this.selfie) {
        return "data:image/png;base64," + this.selfie;
      } else {
        return this.mykad.selfieUlrl;
      }
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    mykadFrontPath() {
      if (this.mykad.frontbase64) {
        return "data:image/png;base64," + this.mykad.frontbase64;
      } else if (this.mykadFront) {
        return "data:image/png;base64," + this.mykadFront;
      } else {
        return this.mykad.frontUrl;
      }
    },
  },
  methods: {
    pictureValidate() {
      console.log(this.selfie.length);
      console.log(this.mykadFront.length);
      if (this.selfie == null) {
        return false;
      } else if (this.mykadFront == null) {
        return false;
      }
      return true;
    },
    async submitForm() {
      if (!this.pictureValidate()) {
        return;
      }
      await this.storeAttachment("Swafoto");
      await this.storeAttachment("MyKad");
      const res = await this.updateHibah();
      if (res) {
        this.$store.dispatch(IS_EKYC_COMPLETE, true);
        this.$router.push({
          name: "trust-onecent.part-c",
          query: { trust_id: this.trust.id, amendment_id: this.amendmentId },
        });
      }
    },
    async updateHibah() {
      return await ApiService.post(`hibah/${this.trust.id}`, {
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
      return imageCapture.takePhoto().then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          if (type == "Swafoto") {
            var selfie = reader.result.split(",")[1];
            vm.$store.dispatch(SELFIE, selfie);
            console.log(selfie);
          } else if (type == "MyKad") {
            var mykad = reader.result.split(",")[1];
            vm.$store.dispatch(MYKAD_FRONT, mykad);
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
      this.$refs["modalOcr"].show();
      this.captureType = type;
      this.getCameraSelection();
      this.streamVideo();
    },
    closeEkyc() {
      this.$refs["modalOcr"].hide();
      if (this.mediaStream) {
        const tracks = this.mediaStream.getTracks();
        tracks.map((track) => track.stop());
      }
    },
    async storeAttachment(type) {
      var data = {
        is_base64: "true",
        type: type == "Swafoto" ? "selfie" : "mykad-front",
      };
      if (type == "Swafoto") {
        data.document = this.selfiePath;
      } else {
        data.document = this.mykadFrontPath;
      }

      return await ApiService.post(`hibah/${this.trust.id}/document`, data)
        .then((response) => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
  },
};
</script>

<template>
  <div>
    <div class="alert alert-warning">
      Proses eKYC tidak berjaya. Sila muat naik swafoto bersama MyKad (Depan)
      dan MyKad (Depan) anda untuk verifikasi oleh pihak AWARIS.
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
                  for="upload-photo-2"
                ></label>
                <label
                  class="upload-photo-dark text-center"
                  for="upload-photo-2"
                  v-if="!selfiePath"
                >
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
                @click="openModal('MyKad')"
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
                  for="upload-photo-2"
                ></label>
                <label
                  class="upload-photo-dark text-center"
                  for="upload-photo-2"
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
      <div v-if="this.$isMobile()">
        <b-button class="btn-sm" @click="mobileChangeCamera">
          {{ mobileCamera }}
        </b-button>
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
      <button
        class="btn btn-primary btn-xsm w-100"
        @click="capture(captureType)"
      >
        Ambil {{ captureType }}
      </button>
    </b-modal>
  </div>
</template>
