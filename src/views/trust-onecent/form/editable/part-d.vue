<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import { required, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      trust: null,
      user_id: null,
      agent_id: null,
      mykadCamera: null,
      otherHibahPropSource: false,
      otherSourceIncome: false,
      newReligion: null,
      videoDevices: null,
      selfie: null,
      noCamera: false,
      canvas: null,
      mediaStream: null,
      facingMode: "environment",
      newRace: null,
      mobileCamera: "Camera Depan",
      videoDevices: null,
      mediaDevice: {
        video: true,
      },
      form: {
        sameAddress: null,
        address: null,
        postcode: null,
        religion: "Islam",
        race: "Malay",
        city: null,
        state: null,
      },
      formHibah: {
        trust_purpose_type: "Institusi",
        trust_purpose: null,
        income_source: "Gaji",
        income_sourceTemp: "",
        employer_name: "",
        employer_address: "",
        job_title: "",
        yearly_income: "",
        hibah_property_source: null,
        hibah_property_sourceTemp: "",
      },
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      mykadCameraFront: null,
      mykadCameraBack: null,
      pricings: null,
      user: null,
      hibah: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      ic_number: {
        required,
      },
      gender: {
        required,
      },
      religion: {
        required,
      },
      race: {
        required,
      },
      marital_status: {
        required,
      },
      nationality: {
        required,
      },
      email: {
        required,
        email,
      },
      mobile_number: {
        required,
      },
      address: {
        required,
      },
      postcode: {
        required,
      },
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
  mounted() {
    // this.getPricings();
    if (this.trustId == null && this.type === undefined) {
      this.$router.push({
        name: "trust.product-list",
        query: { trust_id: this.trustId, error: 1 },
      });
    }
    if (this.form.income_sourceTemp) {
      if (["Lain-lain"].includes(this.form.income_sourceTemp)) {
        this.form.income_sourceTemp = this.form.relationship;
      }
    }
    this.getHibah();
  },
  methods: {
    getHibah() {
      ApiService.get(`/hibah/${this.trustId}`)
        .then((response) => {
          console.log("hibah", response);
          var vl = response.data.hibah;
          this.trust = response.data.hibah;
          var ud = vl.user_detail;
          this.form = this.trust.user_detail;
          this.formHibah.employer_name = vl.employer_name;
          this.formHibah.employer_address = vl.employer_address;
          this.formHibah.job_title = vl.job_title;
          this.formHibah.employer_name = vl.employer_name;
          this.formHibah.yearly_income = vl.yearly_income;
          this.formHibah.income_source = vl.income_source;
          this.formHibah.hibah_property_source = vl.hibah_property_source;
          this.formHibah.trust_purpose = vl.trust_purpose;
          this.formHibah.trust_purpose_type = vl.trust_purpose_type;
          this.formHibah.is_revocable = vl.is_revocable;
          // this.formHibah.hibah_property_source
          for (const [key, value] of Object.entries(ud)) {
            this.form[key] = value;
          }
          this.form.address = this.form.correspondence_address;
          this.form.postcode = this.form.correspondence_postcode ?? null;
          this.form.city = this.form.correspondence_city;
          this.form.state = this.form.correspondence_state;
          this.form.address_2 = this.form.permanent_address;
          this.form.postcode_2 = this.form.permanent_postcode ?? null;
          this.form.city_2 = this.form.permanent_city;
          this.form.state_2 = this.form.permanent_state;
          for (const [key, value] of Object.entries(this.trustId)) {
            this.formHibah[key] = value;
          }
          // this.formHibah = this.trust;
          this.mykad.frontUrl = vl.mykad_front
            ? vl.mykad_front.public_path
            : null;
          this.mykad.backUrl = vl.mykad_back ? vl.mykad_back.public_path : null;
          this.getDocumentOcr();
          this.checkGenderByIc(vl.user.ic_number);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getHibahRef() {
      ApiService.get(`/hibah/${this.trustId}`)
        .then((response) => {
          var vl = response.data.hibah;
          this.trust = vl;
          this.mykad.frontUrl = vl.mykad_front
            ? vl.mykad_front.public_path
            : null;
          this.mykad.backUrl = vl.mykad_back ? vl.mykad_back.public_path : null;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openEkyc() {
      this.$refs["modalOcrFront"].show();
      this.$refs["modalOcrBack"].show();

      this.getCameraSelection();
      this.streamVideo();
    },
    closeEkyc() {
      this.$refs["modalOcrFront"].hide();
      this.$refs["modalOcrBack"].hide();
      if (this.mediaStream) {
        const tracks = this.mediaStream.getTracks();
        tracks.map((track) => track.stop());
      }
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
          // vm.mykad.backUrl =
          //   "data:image/png;base64," + reader.result.split(",")[1];
          // vm.mykad.back = reader.result.split(",")[1];
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
    selectCamera(event) {
      this.mediaDevice = {
        video: {
          deviceId: event.target.value,
        },
      };
      this.streamVideo();
      console.log(this.mediaDevice);
    },
    async getCameraSelection() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      this.videoDevices = videoDevices ?? [];
      console.log("videoDevices", videoDevices);
    },
    // openmodalcapture() {
    //   this.$refs["modalOcr"].show();
    //   this.getCameraSelection();
    //   this.streamVideo();
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
    openpostcode() {
      this.$refs["modalPostcode"].show();
    },
    hideModal() {
      this.$refs["modalPostcode"].hide();
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
    async submitForm() {
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
      if (!this.trust.mykad_front) {
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
      if (!this.trust.mykad_back) {
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
      this.submit = true;
      // if (this.userId) {
      //   var userId = await this.updateUser();
      // } else {
      //   var userId = await this.createUser();
      // }

      if (this.trustId) {
        var trustId = await this.updateHibah();

        // var result = await this.storeDocumentFront(
        //   this.trust.user_id,
        //   this.mykad.front,
        //   "mykad-front"
        // );

        // result = await this.storeDocumentBack(
        //   this.trust.user_id,
        //   this.mykad.back,
        //   "mykad-back"
        // );

        await this.updateUserDetail(trustId);
        this.$router.push({
          name: "trust-onecent.part-e",
          query: { trust_id: this.trustId, amendment_id: this.amendmentId },
        });
      }
    },
    async storeDocumentFront(document, type) {
      // if (!document) return;
      if (this.mykadCameraFront) {
        return await ApiService.post(
          `/hibah/${this.trustId}/document`,
          this.mykadCameraFront
        )
          .then((response) => {
            this.getHibahRef();
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
          `/hibah/${this.trustId}/document`,
          formData
        )
          .then((response) => {
            this.getHibahRef();
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
          `/hibah/${this.trustId}/document`,
          this.mykadCameraBack
        )
          .then((response) => {
            this.getHibahRef();
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
          `/hibah/${this.trustId}/document`,
          formData
        )
          .then((response) => {
            this.getHibahRef();

            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (!document) {
        return;
      }
    },

    async filesChange(files, type) {
      this.$refs["modalSelect"].hide();
      this.$refs["modalSelectfront"].hide();
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.mykadCameraFront = null;
        console.log("mykad-front", files[0]);

        await this.storeDocumentFront(this.mykad.front, "mykad-front");
      } else {
        console.log("mykad-back fileschange");
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
        this.mykadCameraBack = null;
        console.log("mykad-back", files[0]);
        await this.storeDocumentBack(this.mykad.back, "mykad-back");
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
    // getPricings() {
    //   ApiService.get(
    //     `organization/${this.organizationId}/pricing?product=Hibah`
    //   ).then((response) => {
    //     this.pricings = response.data.pricings.data;
    //     if (this.pricings.length > 0) {
    //       this.formHibah.pricing_id = this.pricings[0].id;
    //     }
    //   });
    // },
    // async createUser() {
    //   var user = this.form;
    //   user.username = this.form.ic_number;
    //   user.role = "Client";
    //   user.face_verified = 1;
    //   user.race = this.form.race;
    //   return await ApiService.post(`/user`, user)
    //     .then((response) => {
    //       this.user = response.data.user;
    //       return response.data.user.id;
    //     })
    //     .catch(() => {
    //       return false;
    //     });
    // },
    async updateUser() {
      var user = this.form;
      user._method = "PATCH";
      user.role = "Client";
      user.face_verified = 1;
      user.race = this.form.race;

      return await ApiService.post(`/user/${this.userId}`, user)
        .then((response) => {
          this.user = response.data.user;
          return response.data.user.id;
        })
        .catch(() => {
          return false;
        });
    },
    async updateUserDetail(trustId) {
      var data = this.form;
      data._method = "PATCH";
      data.mykad_number = data.ic_number;
      data.correspondence_address = data.address;
      data.correspondence_postcode = data.postcode;
      data.correspondence_city = data.city;
      data.correspondence_state = data.state;
      data.permanent_address = data.address_2;
      data.permanent_postcode = data.postcode_2;
      data.permanent_city = data.city_2;
      data.permanent_state = data.state_2;
      return await ApiService.post(`hibah/${trustId}/user-detail`, data)
        .then((response) => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    async createHibah() {
      this.formHibah.user_id = this.userId;
      this.formHibah.agent_id = this.agentId;
      this.formHibah.hibah_type = this.type;
      this.formHibah.organization_id = this.organizationId;
      this.formHibah.branch_id = this.branchId;
      return await ApiService.post(`/hibah`, this.formHibah)
        .then((response) => {
          this.hibah = response.data.hibah;
          return response.data.hibah.id;
        })
        .catch((error) => {
          return false;
        });
    },
    async updateHibah() {
      this.formHibah._method = "PATCH";
      return await ApiService.post(`/hibah/${this.trustId}`, this.formHibah)
        .then((response) => {
          this.hibah = response.data.hibah;
          return response.data.hibah.id;
        })
        .catch((error) => {
          return false;
        });
    },
    async storeDocument(userId, document, type) {
      if (!document) return;
      if (this.mykadCamera) {
        return await ApiService.post(
          `/hibah/${this.trustId}/document`,
          this.mykadCamera
        )
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      } else {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);
        return await ApiService.post(
          `/hibah/${this.trustId}/document`,
          formData
        )
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
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
    async changeHibahPrivate(event) {
      if (["Others", "Lain-lain"].includes(event.target.value)) {
        const { value: newTrustPurpose } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Tujuan Hibah Persendirian</label></span>",
          input: "text",
        });
        if (newTrustPurpose) {
          console.log(newTrustPurpose);
          this.newTrustPurpose = newTrustPurpose;
          this.formHibah.trust_purpose = newTrustPurpose;
        } else {
          this.formHibah.trust_purpose = this.newTrustPurpose[0];
        }
      }
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
    async changeincomeproperty(value) {
      if (
        ["Others", "Lain-lain"].includes(this.formHibah.hibah_property_source)
      ) {
        const { value: newIncomeProperty } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Sumber Harta Hibah</label></span>",
          input: "text",
        });
        if (newIncomeProperty) {
          this.newIncomeProperty = newIncomeProperty;
          this.formHibah.hibah_property_source = newIncomeProperty;
        } else {
          this.formHibah.hibah_property_source = this.newIncomeProperty[0];
        }
      }
    },
    async dropdownSourceIncome(value) {
      if (["Others", "Lain-lain"].includes(this.formHibah.income_source)) {
        const { value: newIncome } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Sumber Pendapatan</label></span>",
          input: "text",
        });
        if (newIncome) {
          this.newIncome = newIncome;
          this.formHibah.income_source = newIncome;
        } else {
          this.formHibah.income_source = this.newIncome[0];
        }
      }
    },
    getDocumentOcr() {
      ApiService.get(`user/${this.trust.user_id}/document-ocr`).then(
        (response) => {
          const ocr = response.data.document_ocr;
          if (ocr) {
            this.form.name = this.form.name ?? ocr.name;
            // this.form.gender = this.form.gender ?? ocr.gender;
            this.form.religion = this.form.religion ?? ocr.religion;
            this.form.address = this.form.address ?? ocr.address;
            this.form.nationality = this.form.nationality ?? ocr.nationality;
            this.form.postcode = this.form.postcode ?? ocr.postcode;
            this.getPostcode(1);
          }
        }
      );
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
    checkGenderByIc(ic_number) {
      var ic_length = ic_number.length;
      var lastChar = ic_number.slice(ic_number.length - 1);
      var value = lastChar % 2;
      if (value == 0) {
        this.form.gender = 2;
        console.log("here even", this.form.gender);
      } else {
        this.form.gender = 1;
        console.log("here odd");
      }
      // console.log("lastChar", value);
    },
  },
  // props: {
  //   trust: {
  //     type: Object,
  //   },
  // },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userAccess",
      "currentUser",
      "userRole",
      "isEkycComplete",
      "failedCount",
    ]),
    type() {
      return this.$route.query.type;
    },
    organizationId: function () {
      if (this.userAccess != null) {
        return this.userAccess.organization_id;
      } else {
        return 1;
      }
    },
    userId() {
      if (this.trust) {
        return this.trust.user_id;
      } else if (this.user) {
        return this.user.id;
      } else {
        return null;
      }
    },
    trustId() {
      if (this.hibah) {
        return this.hibah.id;
      } else if (this.$route.query.trust_id) {
        return this.$route.query.trust_id;
      } else {
        return null;
      }
    },
    branchId() {
      console.log("USerAccess", this.userAccess);
      if (this.userAccess && this.userAccess.accessible) {
        return this.userAccess.accessible.id;
      } else {
        return null;
      }
    },
    agentId() {
      return ["Admin", "Super Admin", "Agent", "Staff"].includes(this.userRole)
        ? this.currentUser.id
        : null;
    },
    genders() {
      return this.$t("genders").split(",");
    },
    income() {
      var incomeVal = this.$t("trust.source-income").split(",");
      if (this.newIncome) {
        incomeVal.push(this.newIncome);
      } else if (!incomeVal.includes(this.formHibah.income_source)) {
        incomeVal.push(this.formHibah.income_source);
      }
      return incomeVal;
    },
    income_property() {
      var incomeproperty = this.$t("trust.property-source").split(",");
      if (this.newIncomeProperty) {
        incomeproperty.push(this.newIncomeProperty);
      } else if (
        !incomeproperty.includes(this.formHibah.hibah_property_source)
      ) {
        incomeproperty.push(this.formHibah.hibah_property_source);
      }
      return incomeproperty;
    },
    hibah_private() {
      var hibahPrivate = this.$t("trust.hibah-private").split(",");
      if (this.newTrustPurpose) {
        hibahPrivate.push(this.newTrustPurpose);
      } else if (!hibahPrivate.includes(this.formHibah.trust_purpose)) {
        hibahPrivate.push(this.formHibah.trust_purpose);
      }
      return hibahPrivate;
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
    religions() {
      var religions = this.$t("religions").split(",");
      if (this.newReligion) {
        religions.push(this.newReligion);
      } else if (!religions.includes(this.form.religion)) {
        religions.push(this.form.religion);
      }
      return religions;
    },
    nationalities() {
      return this.$t("nationalities").split(",");
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
    locale() {
      return this.$i18n.locale;
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  components: {
    TheMask,
  },
  watch: {
    locale: function () {
      if (!this.newDesignation) this.form.designation = this.designations[0];
      if (!this.newReligion) this.form.religion = this.religions[0];
      if (!this.newRace) this.form.race = this.race[0];
      if (!this.newTrustPurpose)
        this.formHibah.trust_purpose = this.hibah_private[0];
    },

    pricing_id: {
      handler: function (val) {
        this.formHibah.pricing_id = val.id;
        this.formHibah.price = val.price;
        console.log(
          "watcher",
          this.formHibah.pricing_id,
          "||",
          this.formHibah.price
        );
      },
    },
  },
};
</script>
<template>
  <div class="col-lg-12 col-12 mb-4 pb-2">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <!-- {{ form }} -->
        <h5 class="text-center">{{ $t("trust.donor-info") }}</h5>
        <div class="form-group" :class="{ 'has-error': $v.form.name.$error }">
          <label for="exampleInputEmail1">
            {{ $t("name") }} <span class="text-danger">*</span></label
          >

          <div class="input-group">
            <div class="input-group-prepend">
              <select
                class="form-control"
                style="
                  border-bottom-right-radius: 0;
                  border-top-right-radius: 0;
                "
                @change="changeDesignation"
                v-model="form.designation"
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
              v-uppercase
              class="form-control"
              id="full_name"
              required
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
        <div class="row">
          <div class="col-md-4">
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
                v-model.trim="$v.form.ic_number.$model"
              />
              <div
                class="form-error"
                v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
              >
                MyKad tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-8">
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
                >{{ $t("religion") }}<span class="text-danger">*</span></label
              >
              <select
                name=""
                class="form-control"
                v-model.trim="$v.form.religion.$model"
                @change="changeReligion"
              >
                <option value="">-- {{ $t("choose.religion") }} --</option>
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
                v-if="$v.form.religion.$error && !$v.form.religion.required"
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
              class="form-group"
              :class="{ 'has-error': $v.form.marital_status.$error }"
            >
              <label for="marital_status">{{ $t("marital-status") }}</label>
              <span class="text-danger">*</span>
              <select
                name=""
                class="form-control"
                v-model.trim="$v.form.marital_status.$model"
              >
                <option value="">
                  -- {{ $t("choose.marital-status") }} --
                </option>
                <option value="Bujang">Bujang</option>
                <option value="Berkahwin">Berkahwin</option>
                <option value="Janda/Duda">Janda/Duda</option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.form.marital_status.$error &&
                  !$v.form.marital_status.required
                "
              >
                Status Perkahwinan tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group position-relative"
              :class="{ 'has-error': $v.form.nationality.$error }"
            >
              <label for="nationality">
                {{ $t("nationality") }}
                <span class="text-danger">*</span>
              </label>
              <select
                name
                id="nationality"
                class="form-control"
                v-model.trim="$v.form.nationality.$model"
              >
                <option value="">-- {{ $t("choose.nationality") }} --</option>
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
                  $v.form.nationality.$error && !$v.form.nationality.required
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
                E-mel tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
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
                v-model.trim="$v.form.mobile_number.$model"
                class="form-control"
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
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="home_phone_number">{{ $t("home-telno") }}</label>
              <input
                type="text"
                id="home_phone_number"
                v-model="form.home_phone_number"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <hr class="primary" />

        <div class="row">
          <div class="col-md-12">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.address.$error }"
            >
              <label for="address">{{ $t("mailing-address") }}</label>
              <span class="text-danger">*</span>
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
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.postcode.$error }"
            >
              <label for="postcode" class="d-block">
                <div class="d-flex justify-content-between align-items-center">
                  <span
                    >{{ $t("postcode")
                    }}<span class="text-danger">*</span></span
                  >

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
                v-model.lazy.trim="$v.form.postcode.$model"
              />
              <div
                class="form-error"
                v-if="$v.form.postcode.$error && !$v.form.postcode.required"
              >
                Poskod tidak boleh dibiarkan kosong.
              </div>
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
            <div class="form-group">
              <label for="address">{{ $t("permanent-address") }}</label>
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
                  {{ $t("same-address") }}
                </label>
              </div>
              <textarea
                class="form-control"
                id="address_2"
                rows="2"
                v-uppercase
                v-model="form.address_2"
                :readonly="form.sameAddress == 1"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="postcode_2" class="d-block">
                <div class="d-flex justify-content-between align-items-center">
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
              <label for="city_2">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="city_2"
                class="form-control"
                readonly
                v-model="form.city_2"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="state_2">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
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
          <div class="form-group col-md-6">
            <label for="">{{ $t("trust.hibah-purpose") }}</label>
            <select
              name=""
              class="form-control"
              v-model="formHibah.trust_purpose_type"
            >
              <option value="Institusi">Institusi</option>
              <option value="Persendirian">Persendirian</option>
            </select>
          </div>
          <div
            class="form-group col-md-12"
            v-if="formHibah.trust_purpose_type == 'Institusi'"
          >
            <textarea
              v-uppercase
              name=""
              cols="30"
              rows="10"
              class="form-control"
              v-model="formHibah.trust_purpose"
            ></textarea>
          </div>
          <div
            class="form-group col-md-12"
            v-if="formHibah.trust_purpose_type == 'Persendirian'"
          >
            <select
              name=""
              class="form-control"
              v-model="formHibah.trust_purpose"
              @change="changeHibahPrivate($event)"
            >
              <option
                :value="hibahPrivate"
                v-for="(hibahPrivate, index) in hibah_private"
                :key="index"
              >
                {{ hibahPrivate }}
              </option>
            </select>
          </div>
        </div>
        <hr class="primary" />
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="upload-photo-2"
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
                  :style="'background-image: url(' + mykad.frontUrl + ');'"
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

            <div
              class="d-flex justify-content-center mt-2"
              v-if="userRole == 'Staff' && trust && trust.status == 2"
            >
              <b-button class="btn-sm btn-primary" @click="showIc('front')">
                {{ $t("view") }}
              </b-button>
            </div>
          </div>
          <div class="col-md-6 form-group">
            <label for="upload-photo-1">
              {{ $t("mykadcopy-back") }}<span class="text-danger">*</span>
            </label>
            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
                @click="openModal('MyKad')"
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

            <div
              class="d-flex justify-content-center mt-2"
              v-if="userRole == 'Staff' && trust && trust.status == 2"
            >
              <b-button class="btn-sm btn-primary" @click="showIc('back')">
                {{ $t("view") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <div class="d-flex justify-content-between"></div>
          <button type="button" @click="submitForm" class="btn btn-primary">
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
      v-bind:ok-title="$t('add')"
      v-bind:cancel-title="$t('cancel')"
    >
      <div class="modal-body">
        <div class="form-group">
          <label>
            {{ $t("postcode") }}
            <span class="text-danger">*</span>
          </label>
          <input type="number" class="form-control" />
        </div>
        <div class="form-group">
          <label>
            {{ $t("city") }}
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label>
            {{ $t("state") }}
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control" />
        </div>
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
  </div>
</template>
