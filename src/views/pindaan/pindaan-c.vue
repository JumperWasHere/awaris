<script>
import ApiService from "@/services/api.service";
import TambahPenerima from "@/views/pindaan/pindaan-component/tambah-penerima";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      receiver_array: [],
      titleModal: null,
      mobileCamera: "Camera Depan",
      videoDevices: null,
      mediaDevice: {
        video: true,
      },
      video: {},
      noCamera: false,
      facingMode: "environment",
      mykadCameraFront: null,
      mykadCameraBack: null,
      mediaStream: null,
      selfie: null,

      formReceiver: {
        _method: null,
        wasiat_id: null,
        name: null,
        receivable_type: "Wasiat",
        receivable_id: null,
        ic_number: null,
        relationship: null,
        relationshipTemp: null,
        address: null,
        postcode: null,
        city: null,
        state: null,
        otherRelationship: null,
      },
      mykad: {
        front: null,
        frontUrl: null,
        frontUrlDisplay: null,
        back: null,
        backUrl: null,
        backUrlDisplay: null,
      },
      delete: {
        _method: "DELETE",
      },
      saveFile: {
        type: "mykad",
        document: null,
      },
      fileFront: null,
      fileBack: null,
      buttonModal: null,
      receiver_index_id: null,
      index_penerima: null,
      amendment_status: null,
      amendment_id: null,
      isbase64Back: false,
      isbase64Front: false,
    };
  },
  components: { TambahPenerima },
  methods: {
    closeEkyc() {
      this.$refs["modalOcrFront"].hide();
      this.$refs["modalOcrBack"].hide();

      if (this.mediaStream) {
        const tracks = this.mediaStream.getTracks();
        tracks.map((track) => track.stop());
      }
    },
    openModal(type) {
      console.log("openModal", type);
      if (type == "mykad-front") {
        this.$refs["modalSelectfront"].show();
        this.$refs["modalSelect"].hide();
      } else {
        this.$refs["modalSelect"].show();
        this.$refs["modalSelectfront"].hide();
      }
    },
    openmodalcapture(type) {
      console.log("openmodalcapture", type);
      if (type == "mykad-back") {
        this.$refs["modalOcrFront"].hide();
        this.$refs["modalOcrBack"].show();
        this.getCameraSelection();
        this.streamVideo();
      } else {
        this.$refs["modalOcrFront"].show();
        this.$refs["modalOcrBack"].hide();
        this.getCameraSelection();
        this.streamVideo();
      }
    },
    async getCameraSelection() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      this.videoDevices = videoDevices ?? [];

      console.log("videoDevices", videoDevices);
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
    eventHandler() {
      this.$refs["formAddPostcode"].show();
      this.$refs["modalpenerima"].hide();
      this.mykad.front = null;
      this.mykad.back = null;
      this.mykadCameraFront = null;
      this.mykadCameraBack = null;
      this.fileBack = null;
      this.fileFront = null;
      this.isbase64Front = false;
      this.isbase64Back = false;
    },
    closeModalPostcode() {
      this.$refs["modalpenerima"].show();
      this.$refs["formAddPostcode"].hide();
      this.mykad.front = null;
      this.mykad.back = null;
      this.mykadCameraFront = null;
      this.mykadCameraBack = null;
      this.fileBack = null;
      this.fileFront = null;
      this.isbase64Front = false;
      this.isbase64Back = false;
    },
    hideModalReceiver() {},

    async buttonModalRes() {
      if (this.buttonModal == "Simpan") {
        this.formReceiver._method = null;
        await this.SavePenerima();
      } else if (this.buttonModal == "Kemas Kini") {
        this.formReceiver._method = "PATCH";
        await this.updatePenerima();
      }
    },
    async saveIc_imageFront(id, data) {
      if (this.mykadCameraFront) {
        return await ApiService.post(
          `/receiver/${id}/document`,
          this.mykadCameraFront
        )
          .then((response) => {
            return true;
            console.log(response.data);
          })
          .catch((error) => {
            return false;
          });
      } else if (data) {
        return await ApiService.post(`/receiver/${id}/document`, data)
          .then((response) => {
            console.log(response.data);
            return true;
          })
          .catch((error) => {
            return false;
          });
      } else if (!data) {
        return;
      }
    },
    async saveIc_imageBack(id, data) {
      if (this.mykadCameraBack) {
        return await ApiService.post(
          `/receiver/${id}/document`,
          this.mykadCameraBack
        )
          .then((response) => {
            console.log(response.data);
            return true;
          })
          .catch((error) => {
            return false;
          });
      } else if (data) {
        return await ApiService.post(`/receiver/${id}/document`, data)
          .then((response) => {
            console.log(response.data);
            return true;
          })
          .catch((error) => {
            return false;
          });
      } else if (!data) {
        return;
      }
    },
    //TODO:savePenerima
    async SavePenerima() {
      this.formReceiver.receivable_id = this.wasiat_id;
      ApiService.post(`/receiver`, this.formReceiver)
        .then((response) => {
          var data_receiver = response.data.receiver;
          this.receiver_array.push(data_receiver);

          this.saveIc_imageFront(data_receiver.id, this.fileFront);

          this.saveIc_imageBack(data_receiver.id, this.fileBack);
        })
        .catch((error) => {});
      // console.log(this.formReceiver);

      this.$refs["modalpenerima"].hide();
    },
    async updatePenerima() {
      this.formReceiver.receivable_id = this.wasiat_id;
   
      ApiService.post(`/receiver/${this.receiver_index_id}`, this.formReceiver)
        .then((response) => {
          var data_receiver = response.data.receiver;
          this.receiver_array.splice(this.index_penerima, 1, data_receiver);

          this.saveIc_imageFront(data_receiver.id, this.fileFront);

          this.saveIc_imageBack(data_receiver.id, this.fileBack);

          // this.receiver_array.push(data_receiver);
        })
        .catch((error) => {});
      // console.log(this.formReceiver);

      this.$refs["modalpenerima"].hide();
    },
    OpenPenerimaModal() {
      this.buttonModal = "Simpan";
      this.formReceiver.name = null;
      this.formReceiver.ic_number = null;
      this.formReceiver.relationship = null;
      this.formReceiver.address = null;
      this.formReceiver.postcode = null;
      this.formReceiver.city = null;
      this.formReceiver.state = null;
      this.mykad.frontUrl = null;
      this.mykad.backUrl = null;
      this.mykad.frontUrlDisplay = null;
      this.mykad.backUrlDisplay = null;
      this.titleModal = "Tambah Penerima";
      this.$refs["modalpenerima"].show();
    },
    getListReceiver() {
      ApiService.get(`/wasiat/${this.wasiat_id}/receiver`)
        .then((response) => {
          this.receiver_array = response.data.receivers.data ?? [];
          console.log(response.data.receivers.data);
        })
        .catch((error) => {});
    },
    deleteReceiver(id, index) {
      ApiService.post(`/receiver/${id}`, this.delete)
        .then((response) => {
          this.receiver_array.splice(index, 1);
          // console.log(response.data.receivers.data);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    openIcFront(type) {
      if (type == "front") {
        window.open(this.mykad.frontUrl, "_blank");
        console.log("openIcFront", this.mykad.frontUrl);
      } else {
        window.open(this.mykad.backUrl, "_blank");
        console.log("openIcFront", this.mykad.backUrl);
      }
    },
    async editReceiver(item, index) {
      if (
        [
          "Suami",
          "Isteri",
          "Anak",
          "Penjaga",
          "Adik-Beradik",
          "Saudara",
        ].includes(item.relationship)
      ) {
        this.formReceiver.relationshipTemp = item.relationship;
        this.formReceiver.otherRelationship = false;
      } else {
        this.formReceiver.relationshipTemp = "";
        this.formReceiver.otherRelationship = true;
      }
      this.buttonModal = "Kemas Kini";
      this.titleModal = "Maklumat Penerima";
      this.receiver_index_id = item.id;
      this.index_penerima = index;
      console.log(item);
      this.formReceiver.name = item.name;
      this.formReceiver.ic_number = item.ic_number;
      this.formReceiver.relationship = item.relationship;
      this.formReceiver.address = item.address;
      this.formReceiver.postcode = item.postcode;
      this.formReceiver.city = item.city;
      this.formReceiver.state = item.state;
      await this.getreceiverIC(item.id);
      this.$refs["modalpenerima"].show();
    },
    async getreceiverIC(receiver_id) {
      return await ApiService.get(`/receiver/${receiver_id}/document`)
        .then((response) => {
          var image_array = response.data.documents.data;
          console.log(image_array);
          var front = image_array.filter((item) => item.type == "mykad-front");
          var back = image_array.filter((item) => item.type == "mykad-back");
          this.mykad.frontUrl = front[0].public_path;
          this.mykad.backUrl = back[0].public_path;
          if (front.length != 0) {
            if (
              !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
                front[0].mime_type
              )
            ) {
              this.mykad.frontUrlDisplay = "/images/logo/iconAttachement.jpg";
            } else {
              this.mykad.frontUrlDisplay = front[0].public_path;
            }
          }
          if (back.length != 0) {
            if (
              !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
                back[0].mime_type
              )
            ) {
              this.mykad.backUrlDisplay = "/images/logo/iconAttachement.jpg";
            } else {
              this.mykad.backUrlDisplay = back[0].public_path;
            }
            // console.log(front[0].public_path);
          }
        })
        .catch((error) => {
          console.log("error");
        });
    },
    filesChange(files, type) {
      this.$refs["modalSelect"].hide();
      this.$refs["modalSelectfront"].hide();
      const formData = new FormData();
      formData.append("document", files[0], "nama file");
      formData.append("type", type);
      // console.log(files[0]);
      if (type == "mykad-front") {
        this.isbase64Front = false;

        this.mykadCameraFront = null;
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.fileFront = formData;
        if (!["image/jpeg", "image/gif", "image/png"].includes(files[0].type)) {
          this.mykad.frontUrlDisplay = "/images/logo/iconAttachement.jpg";
        } else {
          this.mykad.frontUrlDisplay = URL.createObjectURL(files[0]);
        }
        console.log(formData);
      } else {
        this.isbase64Back = false;

        this.mykadCameraBack = null;
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
        this.fileBack = formData;
        if (!["image/jpeg", "image/gif", "image/png"].includes(files[0].type)) {
          this.mykad.backUrlDisplay = "/images/logo/iconAttachement.jpg";
        } else {
          this.mykad.backUrlDisplay = URL.createObjectURL(files[0]);
        }
        console.log(formData);
      }
    },
    async capture(type) {
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
          if (type == "mykad-front") {
            var byteCharacters = atob(reader.result.split(",")[1]);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var file = new Blob([byteArray], {
              type: "data:image/png;base64",
            });
            var fileURL = URL.createObjectURL(file);
            vm.mykad.frontUrl = fileURL;

            var imgFront =
              "data:image/png;base64," + reader.result.split(",")[1];
            vm.mykad.front = reader.result.split(",")[1];
            vm.mykad.frontUrlDisplay = imgFront;
            vm.mykadCameraFront = {
              is_base64: "true",
              type: "mykad-front",
              document: imgFront,
            };
            vm.mykad.front = null;
            vm.fileFront = null;
            vm.isbase64Front = true;
            //vm.storeDocumentFront(vm.mykad.front, "mykad-front");
          } else {
            vm.mykad.backUrl =
              "data:application/pdf;base64, " + reader.result.split(",")[1];
            var imgBack =
              "data:image/png;base64," + reader.result.split(",")[1];
            vm.mykad.back = reader.result.split(",")[1];
            vm.mykad.backUrlDisplay = imgBack;

            vm.mykadCameraBack = {
              is_base64: "true",
              type: "mykad-back",
              document: imgBack,
            };
            vm.mykad.back = null;
            vm.fileBack = null;
            vm.isbase64Back = true;

            // vm.storeDocumentBack(vm.mykad.back, "mykad-back");
          }

          vm.$refs["modalOcrFront"].hide();
          vm.$refs["modalOcrBack"].hide();
          vm.$refs["modalSelectfront"].hide();
          vm.$refs["modalSelect"].hide();

          if (vm.mediaStream) {
            const tracks = vm.mediaStream.getTracks();
            tracks.map((track) => track.stop());
          }

          // }
        };
      });
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            console.log("amendmentid", this.amendment_id);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getListReceiver();
    this.formReceiver.wasiat_id = parseInt(this.wasiat_id);
    this.wasiatGetAmendment();
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "currentUser"]),
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
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("amendment.receiver-desc") }}
            </h5>
            <form class="login-form mt-4">
              <div class="row">
                <div class="col-lg-12 text-right">
                  <b-btn
                    class="btn-sm btn-primary btn"
                    @click="OpenPenerimaModal"
                    v-if="[0, 1].includes(amendment_status)"
                    >{{ $t("amendment.add-receiver") }}</b-btn
                  >
                </div>
              </div>
              <div class="row mt-2">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">{{ $t("index") }}</th>
                      <th scope="col">{{ $t("fullname") }}</th>
                      <th scope="col">{{ $t("mykad") }}</th>
                      <th scope="col">{{ $t("relationship") }}</th>
                      <th
                        scope="col"
                        v-if="[0, 1, 4, 5].includes(amendment_status)"
                      >
                        {{ $t("action") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in receiver_array" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.ic_number }}</td>
                      <td>{{ item.relationship }}</td>
                      <td
                        class="text-left"
                        v-if="[0, 1, 4, 5].includes(amendment_status)"
                      >
                        <div
                          class="btn-group-vertical"
                          role="group"
                          aria-label="Vertical button group"
                        >
                          <b-button
                            tag="button"
                            v-if="[0, 1, 4, 5].includes(amendment_status)"
                            class="btn btn-secondary btn-sm"
                            @click="editReceiver(item, index)"
                          >
                            {{ $t("update") }}
                          </b-button>
                          <b-button
                            tag="button"
                            v-if="[0, 1, 4].includes(amendment_status)"
                            class="btn btn-danger btn-sm"
                            @click="deleteReceiver(item.id, index)"
                          >
                            {{ $t("remove") }}
                          </b-button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="receiver_array && receiver_array.length == 0">
                      <td colspan="5" class="text-center">
                        <h5 class="mt-5 mb-5">{{ $t("no-data") }}</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <router-link
                v-if="[0, 1].includes(amendment_status)"
                :to="{
                  name: 'pindaan.part_d-tidakalih',
                  params: {
                    wasiat_id: this.wasiat_id,
                  },
                  query: {
                    pengesahan: pengesahan,
                  },
                }"
                class="btn btn-primary"
                >{{ $t("save-next") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      ref="modalpenerima"
      v-bind:title="titleModal"
      class="modal fade"
      @ok="buttonModalRes"
      @cancel="hideModalReceiver"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      :no-enforce-focus="true"
    >
      <TambahPenerima
        @formAddPostcode="eventHandler"
        :form="formReceiver"
        :doc="saveFile"
      />
      <div class="row pr-3 pl-3">
        <div class="col-md-6">
          <div class="form-group">
            <label
              >{{ $t("mykadcopy-front")
              }}<span class="text-danger">*</span></label
            >

            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
                @click="openModal('mykad-front')"
              >
                <label
                  v-if="mykad.frontUrl"
                  :style="
                    'background-image: url(' + mykad.frontUrlDisplay + ');'
                  "
                  style="
                    border-radius: 5px;
                    margin-bottom: 0;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    height: 100%;
                    width: 100%;
                  "
                  for="upload-photo-1"
                ></label>
                <label
                  class="upload-photo-dark text-center"
                  v-if="!mykad.frontUrl"
                >
                  <span>{{ $t("choose.mykadfront") }}</span>
                </label>
                <!-- <input
                  type="file"
                  name="photo"
                  id="upload-photo-1"
                  class="upload-photo-input"
                  accept="image/*,application/pdf"
                  @change="filesChange($event.target.files, 'mykad-front')"
                /> -->
              </div>
            </div>
            <div class="d-flex justify-content-center" v-if="mykad.frontUrl">
              <b-button
                v-if="!isbase64Front"
                class="btn-sm btn-success m-1"
                @click="openIcFront('front')"
              >
                {{ $t("view") }}
              </b-button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label
              >{{ $t("mykadcopy-back")
              }}<span class="text-danger">*</span></label
            >

            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
                @click="openModal('mykad-back')"
              >
                <label
                  v-if="mykad.backUrl"
                  :style="
                    'background-image: url(' + mykad.backUrlDisplay + ');'
                  "
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
                  v-if="!mykad.backUrl"
                >
                  <span>{{ $t("choose.mykadback") }}</span>
                </label>
                <!-- <input
                  type="file"
                  name="photo"
                  id="upload-photo-2"
                  class="upload-photo-input"
                  accept="image/*,application/pdf"
                  @change="filesChange($event.target.files, 'mykad-back')"
                /> -->
              </div>
            </div>
            <div class="d-flex justify-content-center" v-if="mykad.backUrl">
              <b-button
                v-if="!isbase64Back"
                class="btn-sm btn-success m-1"
                @click="openIcFront('back')"
              >
                {{ $t("view") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <!-- <b-button
              class="mt-3"
              variant="outline-primary"
              block
              @click="buttonModalRes"
              v-if="amendment_status == 0"
              >{{ buttonModal }}</b-button
            > -->
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
          @change="filesChange($event.target.files, 'mykad-back')"
        />
      </div>
      <div>
        <label
          class="upload-photo-dark text-center btn-sm btn-primary"
          @click="openmodalcapture('mykad-back')"
        >
          <span>Capture Picture</span>
        </label>
      </div>
    </b-modal>
    <b-modal
      id="modalOcrFront"
      ref="modalOcrFront"
      class="modal fade"
      title="Capture Camera"
      ok-title="Mulakan"
      hide-footer
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

      <button
        class="btn btn-primary btn-xsm w-100"
        @click="capture('mykad-front')"
      >
        Ambil MyKad Depan
      </button>
    </b-modal>
    <b-modal
      id="modalOcrBack"
      ref="modalOcrBack"
      class="modal fade"
      title="Capture Camera"
      ok-title="Mulakan"
      hide-footer
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

      <button
        class="btn btn-primary btn-xsm w-100"
        @click="capture('mykad-back')"
      >
        Ambil MyKad Belakang
      </button>
    </b-modal>
  </div>
</template>
