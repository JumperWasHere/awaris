<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { WASIAT } from "@/services/store/wasiat.module";
import { mapGetters } from "vuex";

import {
  required,
  minLength,
  maxLength,
  numeric,
  email,
} from "vuelidate/lib/validators";
import "image-capture/src/imagecapture.js";

export default {
  name: "EditablePartB",
  data() {
    return {
      newDesignation: null,
      wasiatDetails: null,
      newReligion: null,
      canvas: null,
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
      mykadCameraFront: null,
      mykadCameraBack: null,

      form: {
        designation: "Encik",
        name: null,
        ic_number: null,
        other_ic_number: null,
        gender: "1",
        religion: "Islam",
        citizenship: "",
        email: null,
        home_phone_number: null,
        mobile_number: null,
        address: null,
        address_2: null,
        postcode: null,
        city: null,
        state: null,
        role: "Client",
        race: null,
      },
      user_details: {
        _method: "PATCH",
        designation: null,
        name: null,
        mobile_number: null,
        home_phone_number: null,
        nationality: null,
        religion: null,
        race: null,
        email: null,
        gender: null,
        ic_number: null,
        other_ic_number: null,
        correspondence_address: null,
        correspondence_postcode: null,
        correspondence_city: null,
        correspondence_state: null,
        permanent_address: null,
        permanent_postcode: null,
        permanent_city: null,
        permanent_state: null,
      },
      formPostcode: {},
      postcode: null,
      userId: null,
      submit: false,
      selfie: null,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      mediaStream: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      mobile_number: {
        required,
        numeric,
      },
      ic_number: {
        required,
        minLength: minLength(12),
        maxLength: maxLength(12),
        numeric,
      },
      email: {
        required,
        email,
      },
      citizenship: {
        required,
      },
      religion: {
        required,
      },
      race: {
        required,
      },
      gender: {
        required,
      },
      address: {
        required,
      },
      address_2: {
        required,
      }
    },
    // mykad: {
    //   frontUrl: {
    //     required,
    //   },
    //   backUrl: {
    //     required,
    //   },
    // },
  },
  destroyed() {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.map((track) => track.stop());
    }
  },
  mounted() {
    if (!this.$route.query.wasiat_id) {
      if (!this.$route.query.pricing) {
        this.$router.push({ name: "wasiat.part_a" });
      }
    }
    if (this.$isMobile()) {
      this.mediaDevice = {
        video: { facingMode: "user" },
      };
    } else {
      this.mediaDevice = {
        video: true,
      };
    }
    if (this.wasiatId) {
      this.getWasiat();
      this.getDocuments();
      // this.getMykadFront();
    }

    if (this.userRole == "Client") {
      this.form.name = this.currentUser.name;
      this.form.ic_number = this.currentUser.ic_number;
      this.form.other_ic_number = this.currentUser.other_ic_number;
      this.form.mobile_number = this.currentUser.mobile_number;
      this.form.email = this.currentUser.email;
      this.form.address = this.currentUser.address;
      this.form.postcode = this.currentUser.postcode;
      this.form.city = this.currentUser.city;
      this.form.state = this.currentUser.state;
    }
  },
  components: { TheMask },
  methods: {
    // async showIc(type) {
    //   var url;
    //   if (type == "front") {
    //     url = this.mykad.frontUrl;
    //   } else {
    //     url = this.mykad.backUrl;
    //   }
    //   console.log("url", url);
    //   window.open(url, "_blank");
    // },

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
    openpostcode() {
      this.$refs["modalPostcode"].show();
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
      // this.captureType = type;
      // this.getCameraSelection();
      // this.streamVideo();
    },
    // getDocumentOcr() {
    //   ApiService.get(`user/${this.currentUser.id}/document-ocr`).then(
    //     (response) => {
    //       if (response.data.document_ocr) {
    //         var documentOcr = response.data.document_ocr ?? {};
    //         this.form.name = documentOcr.name;
    //         this.form.ic_number = documentOcr.ic_number;
    //         this.form.address = documentOcr.address;
    //         this.form.nationality = documentOcr.nationality;
    //         this.form.gender =
    //           documentOcr.gender == "LELAKI" ? "Male" : "Female";
    //         this.form.religion = documentOcr.religion;
    //       }
    //     }
    //   );
    // },
    // openEkyc() {
    //   this.$refs["modalOcr"].show();
    //   this.getCameraSelection();
    //   this.streamVideo();
    // },
    // openEkyc() {
    //   this.$refs["modalOcr"].show();
    //   this.getCameraSelection();
    //   this.streamVideo();
    // },
    closeEkyc() {
      this.$refs["modalOcrFront"].hide();
      this.$refs["modalOcrBack"].hide();

      if (this.mediaStream) {
        const tracks = this.mediaStream.getTracks();
        tracks.map((track) => track.stop());
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
    selectCamera(event) {
      this.mediaDevice = {
        video: {
          deviceId: event.target.value,
        },
      };
      this.streamVideo();
      console.log(this.mediaDevice);
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
    async storePostcode() {
      await ApiService.post(`postcode`, this.formPostcode).then((response) => {
        this.postcode = this.formPostcode.postcode;
      });
      await this.getPostcode();
      this.formPostcode = {};
      this.$swal.fire({
        icon: "success",
        html: "Poskod baharu telah didaftarkan.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    },
    faceVerification() {
      // if (this.totalVerification >= 2) {
      //   return;
      // }
      ApiService.post("/face-verification", {
        selfie_image: this.selfie,
        mykad_image: this.mykad,
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.face_verification.verification_score >= 70) {
            this.$swal
              .fire({
                icon: "success",
                html: "e-KYC berjaya!",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Seterusnya",
                onClose: () => {
                  this.closeEkyc();
                },
              })
              .then((response) => {
                this.closeEkyc();
              });
            var data_ocr = respone.data.ocr_data;
            //TODO: get the response and assign this value
            this.form.name = data_ocr.name;
            this.form.ic_number = data_ocr.ic_number;
            this.form.address = data_ocr.address;
            this.form.citizenship = data_ocr.nationality;
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
                this.closeEkyc();
              },
            });
          }
        })
        .catch((error) => {
          this.selfie = null;
          this.mykad = null;
          this.closeEkyc();
        });
    },
    async submitForm() {
      if (this.userRole == "Staff" && this.wasiat.status == 2) {
        var wasiat = {
          pricing_id: this.$route.query.pricing,
          organization_id: this.$route.query.organization,
          wasiat_type: this.$route.query.type,
        };
      } else {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.$swal.fire({
            icon: "error",
            html: "Sila isi ruangan yang bertanda (*)",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        if (!this.wasiat.mykad_front) {
          this.$swal.fire({
            icon: "error",
            html: "Sila isi lampiran mykad depan",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        if (!this.wasiat.mykad_back) {
          this.$swal.fire({
            icon: "error",
            html: "Sila isi lampiran mykad belakang",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        var wasiat = {
          pricing_id: this.$route.query.pricing,
          organization_id: this.$route.query.organization,
          wasiat_type: this.$route.query.type,
          status: 0,
        };
      }
      this.submit = true;
      var vm = this;
      var wasiatId = this.wasiatId;

      var user = this.form;

      if (this.wasiatId) {
        if (this.userId) {
          var userId = await this.updateUser(user, this.userId);
        }

        // if (wasiatId) {
        //   var result = await this.storeDocumentFront(
        //     userId,
        //     this.mykad.front,
        //     "mykad-front"
        //   );
        //   // console.log("mykad-back", this.mykad.back);
        //   result = await this.storeDocumentBack(
        //     userId,
        //     this.mykad.back,
        //     "mykad-back"
        //   );
        // }

        if (wasiat.pricing_id) {
          await this.updateWasiat(wasiat);
        }
        await this.registerUserDetails(this.wasiatId);
      }
      // else {
      //   if (this.userRole == "Client") {
      //     wasiat.user_id = this.currentUser.id;
      //     console.log("CurrentUser", this.currentUser.id);
      //     await this.updateUser(user, this.currentUser.id);
      //     var newWasiat = await this.createWasiat(wasiat);
      //     if (newWasiat) {
      //       await this.registerUserDetails(newWasiat.id);
      //     }
      //   } else {
      //     user.status = 1;
      //     user.face_verified = 1;
      //     user.username = user.ic_number;
      //     var newUser = await this.createUser(user);
      //     wasiat.user_id = newUser.id;
      //     wasiat.agent_id = this.agentId ?? this.currentUser.id;
      //     console.log("WASIAT TO CREATE: ", wasiat);
      //     var newWasiat = await this.createWasiat(wasiat);
      //     if (newWasiat) {
      //       await this.registerUserDetails(newWasiat.id);
      //     }
      //   }
      //   wasiatId = newWasiat.id;
      // }
      if (!this.pengesahan) {
        vm.$router.push({
          name: "wasiat.part_e",
          query: { wasiat_id: wasiatId },
        });
      } else {
        vm.$router.push({
          name: "wasiat.part_e",
          query: { wasiat_id: wasiatId, pengesahan: this.pengesahan },
        });
      }
    },
    async createUser(user) {
      var user = this.form;
      user.race = this.form.race;
      return await ApiService.post(`user`, user).then((response) => {
        this.user = response.data.user;
        return response.data.user.id;
      });
    },
    async updateUser(user, userId) {
      var user = this.form;
      user._method = "PATCH";
      user.race = this.form.race;

      return await ApiService.post(`/user/${userId}`, user)
        .then((response) => {
          this.user = response.data.user;
          return response.data.user.id;
        })
        .catch(() => {
          return false;
        });
    },
    async createWasiat(wasiat) {
      return await ApiService.post(`wasiat`, wasiat).then((response) => {
        return response.data.wasiat;
      });
    },
    async updateWasiat(wasiat) {
      console.log("updateWasiat");
      wasiat._method = "PATCH";
      return await ApiService.post(
        `wasiat/${this.wasiatId}`,
        wasiat
      ).then((response) => {});
    },
    async registerUserDetails(wasiat_id) {
      this.user_details.designation = this.form.designation;
      this.user_details.name = this.form.name;
      this.user_details.mobile_number = this.form.mobile_number;
      this.user_details.home_phone_number = this.form.home_phone_number;
      this.user_details.nationality = this.form.citizenship;
      this.user_details.religion = this.form.religion;
      this.user_details.race = this.form.race;
      this.user_details.email = this.form.email;
      this.user_details.gender = this.form.gender;
      this.user_details.ic_number = this.form.ic_number;
      this.user_details.other_ic_number = this.form.other_ic_number;

      this.user_details.correspondence_address = this.form.address;
      this.user_details.correspondence_postcode = this.form.postcode;
      this.user_details.correspondence_city = this.form.city;
      this.user_details.correspondence_state = this.form.state;

      this.user_details.permanent_address = this.form.address_2;
      this.user_details.permanent_postcode = this.form.postcode_2;
      this.user_details.permanent_city = this.form.city_2;
      this.user_details.permanent_state = this.form.state_2;

      return await ApiService.post(
        `/wasiat/${wasiat_id}/user-detail`,
        this.user_details
      )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error - registerUser");
        });
    },
    async getPostcode(type) {
      var postcode = this.form.postcode;
      if (type == 2) {
        postcode = this.form.postcode_2;
      }
      if (this.form.postcode) {
        ApiService.get(`postcode/${postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              if (type == 1) {
                this.form.city = postcode.city;
                this.form.state = postcode.state;
              } else {
                this.form.city_2 = postcode.city;
                this.form.state_2 = postcode.state;
              }
            }
          })
          .catch(() => {
            if (type == 1) {
              this.form.city = "";
              this.form.state = "";
            } else {
              this.form.city_2 = "";
              this.form.state_2 = "";
            }
          });
      }
    },
    getWasiat() {
      ApiService.get(`wasiat/${this.wasiatId}`)
        .then((response) => {
          var wasiat = response.data.wasiat;
          console.log("wasiat", wasiat.user_detail);
          this.userId = wasiat.user_id;
          this.form.designation = wasiat.user.designation;
          this.form.name = wasiat.user.name;
          this.form.ic_number = wasiat.user.ic_number;
          this.form.other_ic_number = wasiat.user.other_ic_number;
          this.form.gender = wasiat.user_detail.gender;
          this.form.race = wasiat.user_detail.race;
          this.form.religion = wasiat.user_detail.religion;
          this.form.citizenship = wasiat.user_detail.nationality;
          this.form.email = wasiat.user_detail.email;
          this.form.home_phone_number = wasiat.user_detail.home_phone_number;
          this.form.mobile_number = wasiat.user_detail.mobile_number;
          this.form.address = wasiat.user_detail.correspondence_address;
          this.form.postcode = wasiat.user_detail.correspondence_postcode;
          this.form.city = wasiat.user_detail.correspondence_city;
          this.form.state = wasiat.user_detail.correspondence_state;
          this.form.address_2 = wasiat.user_detail.permanent_address;
          this.form.postcode_2 = wasiat.user_detail.permanent_postcode;
          this.form.city_2 = wasiat.user_detail.permanent_city;
          this.form.state_2 = wasiat.user_detail.permanent_state;
          this.checkGenderByIc(wasiat.user.ic_number);
        })
        .catch((error) => {
          this.submit = false;
        });
    },
    async showIc(type) {
      var url;
      if (type == "front") {
        url = this.mykad.frontUrl;
      } else {
        url = this.mykad.backUrl;
      }
      console.log("url", url);
      window.open(url, "_blank");
    },
    getDocuments(wasiatId) {
      ApiService.get(`/wasiat/${this.wasiatId}/document`)
        .then((response) => {
          console.log("array document");
          var image_array = response.data.attachments.data;
          var front = image_array.filter((item) => item.type == "mykad-front");
          var back = image_array.filter((item) => item.type == "mykad-back");
          this.mykad.frontUrl = front[0].public_path;
          this.mykad.backUrl = back[0].public_path;
          console.log("getDocuments", image_array);
        })
        .catch((error) => {
          console.log("get document");
        });
    },
    async storeDocumentFront(document, type) {
      // if (!document) return;
      if (this.mykadCameraFront) {
        return await ApiService.post(
          `/wasiat/${this.wasiatId}/document`,
          this.mykadCameraFront
        )
          .then((response) => {
            this.$store.dispatch(WASIAT, this.wasiatId);

            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (document) {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);

        return await ApiService.post(
          `/wasiat/${this.wasiatId}/document`,
          formData
        )
          .then((response) => {
            this.$store.dispatch(WASIAT, this.wasiatId);

            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (!document) {
        return;
      }
    },
    async storeDocumentBack(document, type) {
      // if (!document) return;
      if (this.mykadCameraBack) {
        return await ApiService.post(
          `/wasiat/${this.wasiatId}/document`,
          this.mykadCameraBack
        )
          .then((response) => {
            this.$store.dispatch(WASIAT, this.wasiatId);

            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (document) {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);

        return await ApiService.post(
          `/wasiat/${this.wasiatId}/document`,
          formData
        )
          .then((response) => {
            this.$store.dispatch(WASIAT, this.wasiatId);

            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (!document) {
        return;
      }
    },
    checkGenderByIc(ic_number) {
      var ic_length = ic_number.length;
      var lastChar = ic_number.slice(ic_number.length - 1);
      var value = lastChar % 2;
      if (value == 0) {
        this.form.gender = 2;
      } else {
        this.form.gender = 1;
      }
      console.log("lastChar", value);
    },
    async filesChange(files, type) {
      // letak api terus
      this.$refs["modalSelect"].hide();
      this.$refs["modalSelectfront"].hide();

      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.mykadCameraFront = null;
        await this.storeDocumentFront(this.mykad.front, "mykad-front");
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
        this.mykadCameraBack = null;
        await this.storeDocumentBack(this.mykad.back, "mykad-back");
      }
    },
    processDocumentOcr() {
      const formData = new FormData();
      formData.append("document", this.mykad.object, this.mykad.object.name);
      ApiService.post(`document-ocr`, formData).then((response) => {
        console.log(response.data);
        var ocr = response.data.response;
        this.ocrResponse = response.data.response;
        if (ocr) {
          this.form.name = ocr.name;
          this.form.ic_number = ocr.ic_number;
          this.form.address = ocr.address;
          if (ocr.gender == "PEREMPUAN") {
            this.form.gender = "Female";
          } else {
            this.form.gender = "Male";
          }
          if (ocr.religion == "ISLAM") {
            this.form.religion = "Islam";
          } else {
            this.form.religion = ocr.religion;
          }
          if (ocr.nationality == "WARGANEGARA") {
            this.form.nationality = "Warganegara";
          } else {
            this.form.nationality = ocr.nationality;
          }
        }
      });
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
          // console.log(reader.result.split(",")[1]);
          // if (type == "selfie") {
          //   vm.selfie = reader.result.split(",")[1];
          // } else if (type == "mykad") {
          // vm.mykad = reader.result.split(",")[1];
          if (type == "mykad-front") {
            vm.mykad.frontUrl =
              "data:image/png;base64," + reader.result.split(",")[1];
            vm.mykad.front = reader.result.split(",")[1];
            vm.mykadCameraFront = {
              is_base64: "true",
              type: "mykad-front",
              document: vm.mykad.frontUrl,
            };
            vm.mykad.front = null;
            vm.storeDocumentFront(vm.mykad.front, "mykad-front");
          } else {
            vm.mykad.backUrl =
              "data:image/png;base64," + reader.result.split(",")[1];
            vm.mykad.back = reader.result.split(",")[1];
            vm.mykadCameraBack = {
              is_base64: "true",
              type: "mykad-back",
              document: vm.mykad.backUrl,
            };
            vm.mykad.back = null;
            vm.storeDocumentBack(vm.mykad.back, "mykad-back");
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
    changeCamera() {
      if (this.facingMode == "environment") {
        this.facingMode = "user";
      } else {
        this.facingMode = "environment";
      }
      console.log(this.facingMode);
    },
    async changeDesignation() {
      if (["Others", "Lain-lain"].includes(this.form.designation)) {
        const { value: newDesignation } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Gelaran</label></span>",
          input: "text",
        });
        if (newDesignation) {
          this.newDesignation = newDesignation;
          this.form.designation = newDesignation;
        } else {
          this.form.designation = this.designations[0];
        }
      }
    },
    async changeRace() {
      if (["Others", "Lain-lain"].includes(this.form.race)) {
        const { value: newRace } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Bangsa</label></span>",
          input: "text",
        });
        if (newRace) {
          console.log(newRace);
          this.newRace = newRace;
          this.form.race = newRace;
        } else {
          this.form.race = this.race[0];
        }
      }
    },
    async changeReligion() {
      if (["Others", "Lain-lain"].includes(this.form.religion)) {
        const { value: newReligion } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Agama</label></span>",
          input: "text",
        });
        if (newReligion) {
          console.log(newReligion);
          this.newReligion = newReligion;
          this.form.religion = newReligion;
        } else {
          this.form.religion = this.religion[0];
        }
      }
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.address_2 = this.form.address;
        this.form.city_2 = this.form.city;
        this.form.state_2 = this.form.state;
        this.form.postcode_2 = this.form.postcode;
        this.postcode_2 = this.form.postcode;
      } else {
        this.form.address_2 = "";
        this.form.city_2 = "";
        this.form.state_2 = "";
        this.form.postcode_2 = "";
        this.postcode_2 = "";
      }
    },
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userAccess",
      "userRole",
      "currentUser",
      "wasiat",
    ]),
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    agentId() {
      return this.$route.query.agent_id == ""
        ? this.currentUser.id
        : this.$route.query.agent_id;
    },
    organizationId() {
      return this.$route.query.organization == ""
        ? this.userAccess.organization_id
        : this.$route.query.organization;
    },
    designations() {
      var designations = this.$t("designations").split(",");
      if (this.newDesignation) {
        designations.push(this.newDesignation);
      } else if (!designations.includes(this.form.designation)) {
        designations.push(this.form.designation);
      }
      return designations;
    },
    religions() {
      var religions = this.$t("religions").split(",");
      if (this.newReligion) {
        religions.push(this.newReligion);
      } else if (!religions.includes(this.form.religion)) {
        religions.push(this.form.religion);
      }
      return religions;
    },
    races() {
      var races = this.$t("races").split(",");
      if (this.newRace) {
        races.push(this.newRace);
      } else if (!races.includes(this.form.race)) {
        races.push(this.form.race);
      }
      return races;
    },
    locale() {
      return this.$i18n.locale;
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    nationalities() {
      return this.$t("nationalities").split(",");
    },
    genders() {
      return this.$t("genders").split(",");
    },
  },
  watch: {
    locale: function () {
      if (!this.newDesignation) this.form.designation = this.designations[0];
      if (!this.newReligion) this.form.religion = this.religions[0];
      if (!this.newRace) this.form.race = this.race[0];
    },
    wasiat: {
      handler: function (val) {
        this.wasiatDetails = val;
      },
    },
  },
};
</script>

<template>
  <div class="">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <div
              style="position: absolute; right: 2%; top: 2%"
              v-if="userRole != 'Client'"
            ></div>
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("wasiatasas.testator-desc") }}
            </h5>
            <form class="login-form">
              <div class="row">
                <div
                  class="col-md-12 text-right mt-2"
                  v-if="userRole == 'Staff' && pengesahan"
                >
                  <b-button
                    class="btn-sm btn-primary m-1"
                    @click="showIc('front')"
                  >
                    {{ $t("view-mykad") }}
                  </b-button>
                </div>
                <div class="col-md-12">
                  <div
                    class="form-group position-relative"
                    :class="{ 'has-error': $v.form.name.$error }"
                  >
                    <label for="full_name">{{ $t("fullname") }}</label>
                    <span class="text-danger">*</span>
                    <i
                      class="mdi mdi-information"
                      v-b-tooltip.hover
                      title="Nama Penuh mestilah sama seperti ejaan MyKad"
                    ></i>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <select
                          name
                          id="designation"
                          v-model="form.designation"
                          class="form-control"
                          style="
                            border-bottom-right-radius: 0;
                            border-top-right-radius: 0;
                          "
                          @change="changeDesignation"
                        >
                          <option
                            v-for="designation in designations"
                            :key="designation"
                            :value="designation"
                          >
                            {{ designation }}
                          </option>
                        </select>
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Nama Penuh"
                        name="fullname"
                        v-uppercase
                        v-model.trim="$v.form.name.$model"
                      />
                    </div>
                    <div
                      class="form-error"
                      v-if="$v.form.name.$error && !$v.form.name.required"
                    >
                      Nama tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-5">
                  <div
                    class="form-group position-relative"
                    :class="{ 'has-error': $v.form.ic_number.$error }"
                  >
                    <label for="ic_number">
                      {{ $t("mykad") }}
                      <span class="text-danger">*</span>
                    </label>

                    <the-mask
                      id="ic_number"
                      :mask="['######-##-####']"
                      class="form-control"
                      readonly="true"
                      v-model.trim="$v.form.ic_number.$model"
                    />
                    <div class="form-error" v-if="!$v.form.ic_number.minLength">
                      No. MyKad hendaklah
                      {{ $v.form.ic_number.$params.minLength.min }}
                      karakter tanpa '-'.
                    </div>
                    <div class="form-error" v-if="!$v.form.ic_number.maxLength">
                      No. MyKad hendaklah
                      {{ $v.form.ic_number.$params.maxLength.max }}
                      karakter tanpa '-'.
                    </div>
                    <div
                      class="form-error"
                      v-if="
                        $v.form.ic_number.$error && !$v.form.ic_number.required
                      "
                    >
                      No. MyKad tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-7">
                  <div class="form-group position-relative">
                    <label for="other_ic_number">
                      {{ $t("old-ic") }}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="other_ic_number"
                      v-model="form.other_ic_number"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div
                    class="form-group position-relative"
                    :class="{ 'has-error': $v.form.gender.$error }"
                  >
                    <label for="gender">
                      {{ $t("gender") }}
                      <span class="text-danger">*</span>
                    </label>
                    <select
                      name
                      id="gender"
                      class="form-control"
                      v-model.trim="$v.form.gender.$model"
                    >
                      <option value="">-- {{ $t("choose.gender") }} --</option>
                      <option
                        v-for="(gender, index) in genders"
                        :key="index"
                        :value="gender.split(':')[0]"
                      >
                        {{ gender.split(":")[1] }}
                      </option>
                    </select>
                    <div
                      class="form-error"
                      v-if="$v.form.gender.$error && !$v.form.gender.required"
                    >
                      Jantina tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.form.religion.$error }"
                  >
                    <label for="religion"
                      >{{ $t("religion")
                      }}<span class="text-danger">*</span></label
                    >
                    <select
                      name=""
                      class="form-control"
                      v-model.trim="$v.form.religion.$model"
                      @change="changeReligion"
                    >
                      <option value>-- {{ $t("choose.religion") }} --</option>
                      <option
                        v-for="religion in religions"
                        :key="religion"
                        :value="religion"
                      >
                        {{ religion }}
                      </option>
                    </select>
                    <div
                      class="form-error"
                      v-if="
                        $v.form.religion.$error && !$v.form.religion.required
                      "
                    >
                      Agama tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.form.race.$error }"
                  >
                    <label for="race"
                      >{{ $t("race") }}<span class="text-danger">*</span></label
                    >
                    <select
                      name
                      id="race"
                      v-model.trim="$v.form.race.$model"
                      class="form-control"
                      @change="changeRace"
                    >
                      <option value>-- {{ $t("choose.race") }} --</option>
                      <option v-for="race in races" :key="race" :value="race">
                        {{ race }}
                      </option>
                    </select>
                    <div
                      class="form-error"
                      v-if="$v.form.race.$error && !$v.form.race.required"
                    >
                      Bangsa tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group position-relative"
                    :class="{ 'has-error': $v.form.citizenship.$error }"
                  >
                    <label for="citizenship">
                      {{ $t("nationality") }}
                      <span class="text-danger">*</span>
                    </label>
                    <select
                      name
                      id="citizenship"
                      class="form-control"
                      v-model.trim="$v.form.citizenship.$model"
                    >
                      <option value="">
                        -- {{ $t("choose.nationality") }} --
                      </option>
                      <option
                        v-for="(nationality, index) in nationalities"
                        :key="index"
                        :value="nationality.split(':')[0]"
                      >
                        {{ nationality.split(":")[1] }}
                      </option>
                    </select>
                    <div
                      class="form-error"
                      v-if="
                        $v.form.citizenship.$error &&
                        !$v.form.citizenship.required
                      "
                    >
                      Warganegara tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.form.email.$error }"
                  >
                    <label for="email">{{ $t("email") }}</label>
                    <span class="text-danger">*</span>
                    <input
                      type="text"
                      v-lowercase
                      id="email"
                      class="form-control"
                      v-model.trim="$v.form.email.$model"
                    />
                    <div class="form-error" v-if="!$v.form.email.email">
                      Anda telah memasukkan alamat emel yang tidak sah!
                    </div>
                    <div
                      class="form-error"
                      v-if="$v.form.email.$error && !$v.form.email.required"
                    >
                      Emel tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.form.mobile_number.$error }"
                  >
                    <label for="mobile_number">{{ $t("mobile-no") }}</label>
                    <span class="text-danger">*</span>
                    <input
                      type="text"
                      id="mobile_number"
                      class="form-control"
                      v-model.trim="$v.form.mobile_number.$model"
                    />
                    <div
                      class="form-error"
                      v-if="
                        $v.form.mobile_number.$error &&
                        !$v.form.mobile_number.required
                      "
                    >
                      No. Telefon Bimbit tidak boleh dibiarkan kosong.
                    </div>
                    <div
                      class="form-error"
                      v-if="
                        $v.form.mobile_number.$error &&
                        !$v.form.mobile_number.numeric
                      "
                    >
                      No. Telefon Bimbit hendaklah dalam bentuk nombor.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="home_phone_number">{{
                      $t("home-telno")
                    }}</label>
                    <input
                      type="text"
                      id="home_phone_number"
                      v-model="form.home_phone_number"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.form.address.$error }"
                  >
                    <label for="address"
                      >{{ $t("mailing-address")
                      }}<span class="text-danger">*</span></label
                    >
                    <textarea
                      v-uppercase
                      class="form-control"
                      id="address"
                      rows="2"
                      v-model.trim="$v.form.address.$model"
                    ></textarea>
                    <div
                      class="form-error"
                      v-if="$v.form.address.$error && !$v.form.address.required"
                    >
                      Alamat Surat Menyurat tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="postcode" class="d-block">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <span>{{ $t("postcode") }}</span>
                        <span
                          @click="openpostcode"
                          style="
                            text-decoration: underline;
                            font-size: 11px;
                            color: #333;
                          "
                          >{{ $t("add-new") }}</span
                        >
                      </div>
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      class="form-control"
                      @blur="getPostcode(1)"
                      v-model.lazy="form.postcode"
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <label for="city">{{ $t("city") }}</label>
                    <input
                      type="text"
                      v-uppercase
                      id="city"
                      class="form-control"
                      readonly
                      v-model="form.city"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="state">{{ $t("state") }}</label>
                    <input
                      type="text"
                      v-uppercase
                      id="state"
                      class="form-control"
                      readonly
                      v-model="form.state"
                    />
                  </div>
                </div>
              </div>
              <hr class="primary" />
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': $v.form.address_2.$error }">
                    <label for="city">{{ $t("permanent-address") }}<span class="text-danger">*</span></label>
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="customCheck1"
                        v-model="form.sameAddress"
                        @change="copyAddress"
                        value="1"
                      />
                      <label class="custom-control-label" for="customCheck1">
                        Klik Jika Alamat Tetap Sama Seperti Di Atas
                      </label>
                    </div>
                    <textarea
                      class="form-control"
                      id="address_2"
                      rows="2"
                      v-uppercase
                      v-model.trim="$v.form.address_2.$model"
                      :readonly="form.sameAddress == 1"
                    ></textarea>
                    <div
                      class="form-error"
                      v-if="$v.form.address_2.$error && !$v.form.address_2.required"
                    >
                      Alamat Tetap tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="postcode" class="d-block">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <span>Poskod</span>
                        <span
                          @click="openpostcode"
                          style="
                            text-decoration: underline;
                            font-size: 11px;
                            color: #333;
                          "
                          >Tambah Baru</span
                        >
                      </div>
                    </label>
                    <input
                      type="text"
                      id="postcode_2"
                      :readonly="form.sameAddress == 1"
                      class="form-control"
                      @blur="getPostcode(2)"
                      v-model.lazy="form.postcode_2"
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <label for="city">Bandar</label>
                    <input
                      type="text"
                      style="text-transform: uppercase"
                      id="city_2"
                      class="form-control"
                      readonly
                      v-model="form.city_2"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="state">Negeri</label>
                    <input
                      type="text"
                      style="text-transform: uppercase"
                      id="state_2"
                      class="form-control"
                      readonly
                      v-model="form.state_2"
                    />
                  </div>
                </div>
              </div>
              <hr class="primary" />
              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="upload-photo-2"
                    >{{ $t("mykadcopy-front") }}
                    <span class="text-danger">*</span>
                  </label>
                  <div>
                    <small>
                      <i
                        >(Sila asingkan fail Salinan MyKad Depan dan
                        Belakang)</i
                      ></small
                    >
                  </div>
                  <div class="card rounded shadow bg-dark">
                    <div
                      class="d-flex align-items-center justify-content-center bd-highlight"
                      style="height: 150px"
                      @click="openModal('mykad-front')"
                    >
                      <label
                        v-if="mykad.frontUrl"
                        :style="
                          'background-image: url(' + mykad.frontUrl + ');'
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
                      ></label>
                      <label
                        class="upload-photo-dark text-center"
                        v-if="!mykad.frontUrl"
                      >
                        <span>{{ $t("choose.mykadfront") }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="d-flex justify-content-center mt-2">
                    <b-button
                      class="btn-sm btn-primary m-1"
                      @click="showIc('front')"
                    >
                      {{ $t("view") }}
                    </b-button>
                  </div>
                </div>
                <div class="col-md-6 form-group">
                  <label for="upload-photo-1">
                    {{ $t("mykadcopy-back") }}<span class="text-danger">*</span>
                  </label>
                  <div>
                    <small>
                      <i
                        >(Sila asingkan fail Salinan MyKad Depan dan
                        Belakang)</i
                      ></small
                    >
                  </div>
                  <div class="card rounded shadow bg-dark">
                    <div
                      class="d-flex align-items-center justify-content-center bd-highlight"
                      style="height: 150px"
                      @click="openModal('mykad-back')"
                    >
                      <label
                        v-if="mykad.backUrl"
                        :style="'background-image: url(' + mykad.backUrl + ');'"
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
                        v-if="!mykad.backUrl"
                      >
                        <span>{{ $t("choose.mykadback") }}</span>
                      </label>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center mt-2">
                    <b-button
                      class="btn-sm btn-primary m-1"
                      @click="showIc('back')"
                    >
                      {{ $t("view") }}
                    </b-button>
                    <!-- <b-button
                      class="btn-sm btn-primary m-1"
                      @click="showIc('back')"
                    >
                      Capture
                    </b-button> -->
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <div class="d-flex justify-content-between"></div>
          <button
            type="button"
            @click="submitForm"
            class="btn btn-primary"
            v-if="wasiat"
          >
            {{ $t("save-next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
    <b-modal
      ref="modalPostcode"
      class="modal fade"
      v-bind:title="$t('add-newpostcode')"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      @ok="storePostcode"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("postcode") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              class="form-control"
              v-model="formPostcode.postcode"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("city") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.city"
            />
          </div>
          <div class="col-md-6 form-group">
            <label>
              {{ $t("state") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.state"
            />
          </div>
        </div>
      </div>
    </b-modal>
    <!-- modal camera front -->
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
    <!-- modal camera front -->
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
    <!-- modal camera back -->
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
  </div>
</template>
