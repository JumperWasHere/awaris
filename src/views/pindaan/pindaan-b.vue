<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required, numeric, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      newDesignation: null,
      newReligion: null,
      newRace: null,
      user_id: null,
      amendment_id: null,
      amendment_status: null,
      formPostcode: {},
      postcode: null,
      users: null,
      fileFront: null,
      fileBack: null,
      mykad: {
        front: null,
        frontUrl: null,
        frontUrlDisplay: null,
        frontType: null,
        back: null,
        backUrl: null,
        backType: null,
        backUrlDisplay: null,
      },
      doc: {
        description: null,
        document: null,
        type: null,
      },
      genderString: null,
      user_details: {
        gender: null,
        religion: null,
        race: null,
        nationality: null,
        email: null,
        mobile_number: null,
        home_phone_number: null,
        correspondence_address: null,
        correspondence_postcode: null,
        correspondence_city: null,
        correspondence_state: null,
      },

      form: {
        name: null,
        ic_number: null,
        other_ic_number: null,
        postcode: null,
        city: null,
        state: null,
        sameAddress: null,
      },

      // updateAmedment: {
      //   _method: "PATCH",
      //   incharged_by_id: null,
      //   status: 1,
      // },
      designationHide: false,
    };
  },
  validations: {
    user_details: {
      mobile_number: {
        required,
        numeric,
      },
      email: {
        required,
        email,
      },
      gender: {
        required,
      },
      correspondence_address: {
        required,
      },
    },
  },
  components: {},
  methods: {
    getDocuments() {
      ApiService.get(`/amendment/${this.amendment_id}/document`)
        .then((response) => {
          // console.log("array document");
          var image_array = response.data.attachments.data;
          console.log("image_array", image_array);
          var front = image_array.filter((item) => item.type == "mykad-front");
          var back = image_array.filter((item) => item.type == "mykad-back");
          this.mykad.frontUrl = front[0].public_path;
          this.mykad.backUrl = back[0].public_path;
        })
        .catch((error) => {
          console.log("get document");
        });
    },
    async getFilterDocCheck(type) {
      return await ApiService.get(`/amendment/${this.amendment_id}/document`)
        .then((response) => {
          var image_array = response.data.attachments.data;
          var data = image_array.filter((item) => item.type == type);
          console.log("data", data);
          if (data.length != 0) {
            return true;
          } else {
            return false;
          }
        })
        .catch((error) => {
          return false;
        });
    },
    openpostcode() {
      this.$refs["modalPostcode"].show();
    },

    designation(event) {
      console.log(event.target.value);
      this.form.designation = event.target.value;
      if (event.target.value == "") {
        this.designationHide = true;
      } else {
        this.designationHide = false;
      }
    },

    getUsers() {
      ApiService.get(`/organization/${this.userAccess.organization_id}/user`)
        .then((response) => {
          var filter_user = response.data.user_accesses.data.filter(
            (item) => item.role == "Staff"
          );
          this.users = filter_user ?? [];

          console.log("user", this.users);
        })
        .catch((error) => {});
    },
    async updateUserDetails() {
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
      let filterFrontIc = await this.getFilterDocCheck("mykad-front");
      if (!filterFrontIc) {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi maklumat Ic Depan",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      let filterBackIc = await this.getFilterDocCheck("mykad-back");
      if (!filterBackIc) {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi maklumat Ic Belakang",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      const vm = this;
      let responseUserRegister = await this.registerUserDetails();
      if (responseUserRegister) {
        vm.$router.push({
          name: "pindaan.part_c",
          params: {
            wasiat_id: this.wasiat_id,
          },
          query: { pengesahan: this.pengesahan },
        });
      }
    },
    async registerUserDetails() {
      console.log("user_details", this.user_details);
      this.user_details._method = "PATCH";
      return await ApiService.post(
        `/wasiat/${this.wasiat_id}/user-detail`,
        this.user_details
      )
        .then((response) => {
          return true;
          console.log(response.data);
        })
        .catch((error) => {
          return false;
          console.log("error - registerUser");
        });
    },
    async registerDoc(files, type, other) {
      console.log("registerDoc", files, "|", type);
      var temp;
      if (other) {
        temp = other;
      } else {
        const formData = new FormData();
        formData.append("document", files, "nama file");
        formData.append("type", type);
        formData.append("description", type);
        temp = formData;
      }
      return await ApiService.post(
        `/amendment/${this.amendment_id}/document?action=replace`,
        temp
      )
        .then((response) => {
          console.log("register doc");
          return true;
        })
        .catch((error) => {
          console.log("error doc");
          return false;
        });
    },

    async changeDesignation() {
      if (["Others", "Lain-lain"].includes(this.user_details.designation)) {
        const { value: newDesignation } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Gelaran</label></span>",
          input: "text",
        });
        if (newDesignation) {
          this.newDesignation = newDesignation;
          this.user_details.designation = newDesignation;
        } else {
          this.user_details.designation = this.designations[0];
        }
      }
    },
    async changeRace() {
      if (["Others", "Lain-lain"].includes(this.user_details.race)) {
        const { value: newRace } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Bangsa</label></span>",
          input: "text",
        });
        if (newRace) {
          console.log(newRace);
          this.newRace = newRace;
          this.user_details.race = newRace;
        } else {
          this.user_details.race = this.race[0];
        }
      }
    },
    async changeReligion() {
      if (["Others", "Lain-lain"].includes(this.user_details.religion)) {
        const { value: newReligion } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Agama</label></span>",
          input: "text",
        });
        if (newReligion) {
          console.log(newReligion);
          this.newReligion = newReligion;
          this.user_details.religion = newReligion;
        } else {
          this.user_details.religion = this.religion[0];
        }
      }
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.user_details.correspondence_address = this.form.address;
        this.user_details.correspondence_city = this.form.city;
        this.user_details.correspondence_state = this.form.state;
        this.user_details.correspondence_postcode = this.form.postcode;
        this.user_details.correspondence_postcode = this.form.postcode;
      } else {
        this.user_details.correspondence_address = "";
        this.user_details.correspondence_city = "";
        this.user_details.correspondence_state = "";
        this.user_details.correspondence_postcode = "";
        this.user_details.correspondence_postcode = "";
      }
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          console.log("wasiatGetAmendment", data_amendment);
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            // this.updateAmedment.incharged_by_id =
            //   data_amendment[0].incharged_by_id;
            // this.getdoc(data_amendment[0].id);
            this.checkingDocument();
            // console.log("amendmentid", this.amendment_id);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },

    async checkingDocument() {
      let Data = await this.getWasiatDocument();
      this.form = Data.user;
      this.user_details = Data.user_detail;
      if (this.user_details.permanent_address) {
        this.form.sameAddress = 1;
      }
      console.log("user_details", Data.user_detail);

      let filterFrontIc = await this.getFilterDocCheck("mykad-front");
      let filterBackIc = await this.getFilterDocCheck("mykad-back");
      if (filterFrontIc && filterBackIc) {
        //if pindaan dah ada details document
        this.getdoc(this.amendment_id);
      }
      if (!filterFrontIc) {
        var mykadCameraFront = {
          duplicate_from_id: Data.mykad_front.id,
          type: "mykad_front",
        };
        console.log("FormData", mykadCameraFront);

        let frontAutoRegister = await this.registerDoc(
          Data.mykad_front.public_path,
          Data.mykad_front.type,
          mykadCameraFront
        );
        if (frontAutoRegister) {
          this.mykad.frontUrlDisplay = Data.mykad_front.public_path;
          this.mykad.frontUrl = Data.mykad_front.public_path;

          console.log("mykad_front", Data.mykad_front.public_path);
        }
      }
      if (!filterBackIc) {
        var mykadCameraBack = {
          duplicate_from_id: Data.mykad_back.id,
          type: "mykad_back",
        };
        let backAutoRegister = await this.registerDoc(
          Data.mykad_back.public_path,
          Data.mykad_back.type,
          mykadCameraBack
        );
        if (backAutoRegister) {
          this.mykad.backUrlDisplay = Data.mykad_back.public_path;
          this.mykad.backUrl = Data.mykad_back.public_path;

          console.log("mykad_back", Data.mykad_back.public_path);
        }
      }
    },
    async getWasiatDocument() {
      return await ApiService.get(`/wasiat/${this.wasiat_id}`)
        .then((response) => {
          console.log("wasiat", response.data.wasiat);
          return response.data.wasiat;
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    },
    getdoc(amendment_id) {
      //get attachemnt form wasiat
      ApiService.get(`/amendment/${amendment_id}/document`)
        .then((response) => {
          this.doc_array = response.data.attachments.data ?? [];
          console.log("array list", this.doc_array);
          var tempTypeFront = this.doc_array.filter(
            (item) => item.type == "mykad-front"
          );
          var tempTypeBack = this.doc_array.filter(
            (item) => item.type == "mykad-back"
          );
          if (tempTypeFront.length != 0) {
            // this.attachment.front=
            // this.mykad.front = tempTypeFront[0].public_path;
            this.mykad.frontType = tempTypeFront[0].type;
            this.mykad.frontUrl = tempTypeFront[0].public_path;
            if (
              !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
                tempTypeFront[0].mime_type
              )
            ) {
              this.mykad.frontUrlDisplay = "/images/logo/iconAttachement.jpg";
            } else {
              this.mykad.frontUrlDisplay = tempTypeFront[0].public_path;
            }

            console.log(tempTypeFront);
          }
          if (tempTypeBack.length != 0) {
            // this.mykad.back = tempTypeBack[0].public_path;
            this.mykad.backType = tempTypeBack[0].type;
            this.mykad.backUrl = tempTypeBack[0].public_path;
            console.log(this.mykad);
            if (
              !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
                tempTypeBack[0].mime_type
              )
            ) {
              this.mykad.backUrlDisplay = "/images/logo/iconAttachement.jpg";
            } else {
              this.mykad.backUrlDisplay = tempTypeBack[0].public_path;
            }
          }
          // console.log(this.doc_array);
        })
        .catch((error) => {});
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
    async getPostcode(type) {
      var postcode = this.form.postcode;
      if (type == 2) {
        postcode = this.user_details.correspondence_postcode;
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
                this.user_details.correspondence_city = postcode.city;
                this.user_details.correspondence_state = postcode.state;
              }
            }
          })
          .catch(() => {
            if (type == 1) {
              this.form.city = "";
              this.form.state = "";
            } else {
              this.user_details.correspondence_city = "";
              this.user_details.correspondence_state = "";
            }
          });
      }
    },
    openIc(type) {
      if (type == "front") {
        window.open(this.mykad.frontUrl, "_blank");
      } else {
        window.open(this.mykad.backUrl, "_blank");
      }
    },
    async filesChange(files, type) {
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        // this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.mykad.frontType = type;
        // this.fileFront = formData;
        console.log(files[0].type);
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        let frontIc = await this.registerDoc(
          this.mykad.front,
          this.mykad.frontType,
          null
        );
        if (frontIc) {
          if (
            !["image/jpeg", "image/gif", "image/png"].includes(files[0].type)
          ) {
            this.mykad.frontUrlDisplay = "/images/logo/iconAttachement.jpg";
          } else {
            this.mykad.frontUrlDisplay = URL.createObjectURL(files[0]);
          }
        }
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
        this.mykad.backType = type;
        let backIc = await this.registerDoc(
          this.mykad.back,
          this.mykad.backType,
          null
        );
        if (backIc) {
          if (
            !["image/jpeg", "image/gif", "image/png"].includes(files[0].type)
          ) {
            this.mykad.backUrlDisplay = "/images/logo/iconAttachement.jpg";
          } else {
            this.mykad.backUrlDisplay = URL.createObjectURL(files[0]);
          }
        }
      }
    },
    async nextPage() {
      if (this.amendment_status == 2) {
        this.$router.push({
          name: "pindaan.part_c",
          params: {
            wasiat_id: this.wasiat_id,
          },
          query: { pengesahan: this.pengesahan },
        });
      } else if ([0, 1].includes(this.amendment_status)) {
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
        let filterFrontIc = await this.getFilterDocCheck("mykad_front");
        if (!filterFrontIc) {
          this.$swal.fire({
            icon: "error",
            html: "Sila isi maklumat Ic Depan",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        let filterBackIc = await this.getFilterDocCheck("mykad-back");
        if (!filterBackIc) {
          this.$swal.fire({
            icon: "error",
            html: "Sila isi maklumat Ic Belakang",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        const vm = this;
        // let responseRegisterUSer = await this.registerUser();
        // if (responseRegisterUSer) {
        if (this.mykad.front) {
          await this.registerDoc(this.mykad.front, this.mykad.frontType, null);
          console.log(this.mykad.front, "||", this.mykad.frontType);
        }
        if (this.mykad.back) {
          await this.registerDoc(this.mykad.back, this.mykad.backType, null);
          console.log(this.mykad.back, "||", this.mykad.backType);
        }
        let responseUserRegister = await this.registerUserDetails();
        if (responseUserRegister) {
          // vm.$router.push({
          //   name: "pindaan.part_c",
          //   params: {
          //     wasiat_id: this.wasiat_id,
          //   },
          //   query: { pengesahan: this.pengesahan },
          // });
        }
        // }
      }
    },
  },
  watch: {
    locale: function () {
      if (!this.newDesignation)
        this.user_details.designation = this.designations[0];
      if (!this.newReligion) this.user_details.religion = this.religions[0];
      if (!this.newRace) this.user_details.race = this.race[0];
    },
    postcode: {
      handler: function (val) {
        this.form.postcode = val;
        this.getPostcode();
      },
    },
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userAccess", "userRole"]),
    designations() {
      var designations = this.$t("designations").split(",");
      if (this.newDesignation) {
        designations.push(this.newDesignation);
      } else if (!designations.includes(this.user_details.designation)) {
        designations.push(this.user_details.designation);
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
    religions() {
      var religions = this.$t("religions").split(",");
      if (this.newReligion) {
        religions.push(this.newReligion);
      } else if (!religions.includes(this.user_details.religion)) {
        religions.push(this.user_details.religion);
      }
      return religions;
    },
    races() {
      var races = this.$t("races").split(",");
      if (this.newRace) {
        races.push(this.newRace);
      } else if (!races.includes(this.user_details.race)) {
        races.push(this.user_details.race);
      }
      return races;
    },
    nationalities() {
      return this.$t("nationalities").split(",");
    },
    genders() {
      return this.$t("genders").split(",");
    },
  },
  mounted() {
    if (this.wasiat_id) {
      // this.getDocuments();
      this.wasiatGetAmendment();
      if (this.userRole == "Staff") {
        this.getUsers();
      }
    }
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
              {{ $t("wasiatasas.testator-desc") }}
            </h5>
            <form class="login-form">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group position-relative">
                    <label for="full_name">{{ $t("fullname") }}</label>
                    <span class="text-danger">*</span>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <select
                          name
                          id="designation"
                          v-model="user_details.designation"
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
                        v-model="form.name"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group position-relative">
                    <label> {{ $t("mykad") }} </label>
                    <span class="text-danger">*</span>
                    <input
                      type="text"
                      class="form-control"
                      name
                      v-model="form.ic_number"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group position-relative">
                    <label>
                      {{ $t("old-ic") }}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      name
                      disabled
                      v-model="form.other_ic_number"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div
                    class="form-group position-relative"
                    :class="{ 'has-error': $v.user_details.gender.$error }"
                  >
                    <label for="gender">
                      {{ $t("gender") }}
                      <span class="text-danger">*</span>
                    </label>
                    <select
                      name="gender"
                      class="form-control"
                      v-model.trim="$v.user_details.gender.$model"
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
                      v-if="
                        $v.user_details.gender.$error &&
                        !$v.user_details.gender.required
                      "
                    >
                      Jantina tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for>{{ $t("religion") }}</label>
                    <span class="text-danger">*</span>
                    <select
                      name="religion"
                      class="form-control"
                      v-model="user_details.religion"
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
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="race"
                      >{{ $t("race") }}<span class="text-danger">*</span></label
                    >
                    <select
                      name="race"
                      id="race"
                      v-model="user_details.race"
                      class="form-control"
                      @change="changeRace"
                    >
                      <option value>-- {{ $t("choose.race") }} --</option>
                      <option v-for="race in races" :key="race" :value="race">
                        {{ race }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group position-relative">
                    <label> {{ $t("nationality") }} </label>
                    <span class="text-danger">*</span>
                    <select
                      name
                      id="citizenship"
                      class="form-control"
                      v-model="user_details.nationality"
                    >
                      <option value>
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
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.user_details.email.$error }"
                  >
                    <label for>{{ $t("email") }}</label>
                    <span class="text-danger">*</span>
                    <input
                      type="text"
                      v-lowercase
                      v-model.trim="$v.user_details.email.$model"
                      class="form-control"
                    />
                    <div class="form-error" v-if="!$v.user_details.email.email">
                      Anda telah memasukkan alamat E-mel yang tidak sah!
                    </div>
                    <div
                      class="form-error"
                      v-if="
                        $v.user_details.email.$error &&
                        !$v.user_details.email.required
                      "
                    >
                      E-mel tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': $v.user_details.mobile_number.$error,
                    }"
                  >
                    <label for>{{ $t("mobile-no") }}</label>
                    <span class="text-danger">*</span>
                    <input
                      type="text"
                      v-model.trim="$v.user_details.mobile_number.$model"
                      class="form-control"
                    />
                    <div
                      class="form-error"
                      v-if="
                        $v.user_details.mobile_number.$error &&
                        !$v.user_details.mobile_number.numeric
                      "
                    >
                      No. Telefon Bimbit tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for>No. Telefon Rumah / Pejabat</label>
                    <input
                      type="text"
                      v-model="user_details.home_phone_number"
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
                    :class="{
                      'has-error':
                        $v.user_details.correspondence_address.$error,
                    }"
                  >
                    <label for>{{ $t("mailing-address") }}</label>
                    <span class="text-danger">*</span>
                    <textarea
                      v-uppercase
                      class="form-control"
                      v-model.trim="
                        $v.user_details.correspondence_address.$model
                      "
                      rows="2"
                    >
                    </textarea>
                    <div
                      class="form-error"
                      v-if="
                        $v.user_details.correspondence_address.$error &&
                        !$v.user_details.correspondence_address.required
                      "
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
                        Klik Jika Alamat Tetap Sama Seperti Di Atas
                      </label>
                    </div>
                    <textarea
                      class="form-control"
                      v-uppercase
                      :readonly="form.sameAddress == 1"
                      v-model="user_details.correspondence_address"
                      rows="2"
                    >
                    </textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="postcode_2" class="d-block">
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
                      id="postcode_2"
                      :readonly="form.sameAddress == 1"
                      class="form-control"
                      @blur="getPostcode(2)"
                      v-model.lazy="user_details.correspondence_postcode"
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
                      v-model="user_details.correspondence_city"
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
                      v-model="user_details.correspondence_state"
                    />
                  </div>
                </div>
              </div>
              <hr class="primary" />

              <!-- <div class="row">
                <div class="col-md-6" v-if="userRole == 'Staff'">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': $v.updateAmedment.incharged_by_id.$error,
                    }"
                  >
                    <label for="staff">{{ $t("amendment.officer") }}</label>
                    <span class="text-danger">*</span>

                    <select
                      name
                      id="staff"
                      class="form-control"
                      v-model.trim="$v.updateAmedment.incharged_by_id.$model"
                    >
                      <option value>-- Sila Pilih Pegawai --</option>
                      <option
                        :value="user.user.id"
                        v-for="user in users"
                        :key="user.id"
                      >
                        {{ user.user.name }}
                      </option>
                    </select>
                    <div
                      class="form-error"
                      v-if="
                        $v.updateAmedment.incharged_by_id.$error &&
                        !$v.updateAmedment.incharged_by_id.required
                      "
                    >
                      Pegawai Pindaan tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
              </div> -->
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label
                      >{{ $t("mykadcopy-front")
                      }}<span class="text-danger">*</span></label
                    >
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
                      >
                        <label
                          v-if="mykad.frontUrl"
                          :style="
                            'background-image: url(' +
                            mykad.frontUrlDisplay +
                            ');'
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
                          for="upload-photo-1"
                          v-if="!mykad.frontUrl"
                        >
                          <span>{{ $t("choose.mykadfront") }}</span>
                        </label>
                        <input
                          type="file"
                          name="photo"
                          id="upload-photo-1"
                          class="upload-photo-input"
                          accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                          @change="
                            filesChange($event.target.files, 'mykad-front')
                          "
                        />
                      </div>
                    </div>

                    <div
                      class="d-flex justify-content-center"
                      v-if="mykad.frontUrl"
                    >
                      <b-button
                        class="btn-sm btn-primary m-1"
                        @click="openIc('front')"
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
                      >
                        <label
                          v-if="mykad.backUrl"
                          :style="
                            'background-image: url(' +
                            mykad.backUrlDisplay +
                            ');'
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
                          for="upload-photo-2"
                          v-if="!mykad.backUrl"
                        >
                          <span>{{ $t("choose.mykadback") }}</span>
                        </label>
                        <input
                          type="file"
                          name="photo"
                          id="upload-photo-2"
                          class="upload-photo-input"
                          accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                          @change="
                            filesChange($event.target.files, 'mykad-back')
                          "
                        />
                      </div>
                    </div>

                    <div
                      class="d-flex justify-content-center"
                      v-if="mykad.backUrl"
                    >
                      <b-button
                        class="btn-sm btn-primary m-1"
                        @click="openIc('back')"
                      >
                        {{ $t("view") }}
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <b-button
                v-if="[0, 1].includes(amendment_status)"
                class="btn btn-primary"
                @click="updateUserDetails"
              >
                {{ $t("save-next") }}
              </b-button>
            </div>
          </div>
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
              class="form-control"
              v-model="formPostcode.state"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
