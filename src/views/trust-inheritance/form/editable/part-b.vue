<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import {
  UPDATE_USER_DETAIL,
  UPDATE_HIBAH,
} from "@/services/store/amanah-pusaka.module";
import { required, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      wasiat: null,
      user_id: null,
      agent_id: null,
      mykadCamera: null,
      otherHibahPropSource: false,
      otherSourceIncome: false,
      newReligion: null,
      newRace: null,
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
      pricings: null,
      // user: null,
      // hibah: null,
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
      correspondence_address: {
        required,
      },
      correspondence_postcode: {
        required,
      },
    },
  },
  mounted() {
    this.form = this.$store.getters.userDetail;
    this.formHibah = this.$store.getters.hibah;
  },
  methods: {
    // getHibah() {
    //   ApiService.get(`/hibah/${this.trustId}`)
    //     .then((response) => {
    //       console.log("hibah", response);
    //       var vl = response.data.hibah;
    //       var ud = vl.user_detail;
    //       this.form = this.trust.user_detail;
    //       this.formHibah.employer_name = vl.employer_name;
    //       this.formHibah.employer_address = vl.employer_address;
    //       this.formHibah.job_title = vl.job_title;
    //       this.formHibah.employer_name = vl.employer_name;
    //       this.formHibah.yearly_income = vl.yearly_income;
    //       this.formHibah.income_source = vl.income_source;
    //       this.formHibah.hibah_property_source = vl.hibah_property_source;
    //       this.formHibah.trust_purpose = vl.trust_purpose;
    //       this.formHibah.trust_purpose_type = vl.trust_purpose_type;
    //       this.formHibah.is_revocable = vl.is_revocable;
    //       // this.formHibah.hibah_property_source
    //       for (const [key, value] of Object.entries(ud)) {
    //         this.form[key] = value;
    //       }
    //       this.form.address = this.form.correspondence_address;
    //       this.form.postcode = this.form.correspondence_postcode ?? null;
    //       this.form.city = this.form.correspondence_city;
    //       this.form.state = this.form.correspondence_state;
    //       this.form.permanent_address = this.form.permanent_address;
    //       this.form.permanent_postcode = this.form.permanent_postcode ?? null;
    //       this.form.permanent_city = this.form.permanent_city;
    //       this.form.permanent_state = this.form.permanent_state;
    //       for (const [key, value] of Object.entries(this.trustId)) {
    //         this.formHibah[key] = value;
    //       }
    //       this.getDocumentOcr();
    //       this.checkGenderByIc(vl.user.ic_number);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    openpostcode() {
      this.$refs["modalPostcode"].show();
    },
    hideModal() {
      this.$refs["modalPostcode"].hide();
    },
    async getPostcode(type) {
      var postcode = this.form.correspondence_postcode;
      if (type == 2) {
        postcode = this.form.permanent_postcode;
      }
      if (postcode) {
        ApiService.get(`postcode/${postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              if (type == 1) {
                this.form.correspondence_city = postcode.city;
                this.form.correspondence_state = postcode.state;
              } else {
                this.form.permanent_city = postcode.city;
                this.form.permanent_state = postcode.state;
              }
            }
          })
          .catch(() => {
            if (type == 1) {
              this.form.correspondence_city = "";
              this.form.correspondence_state = "";
            } else {
              this.form.permanent_city = "";
              this.form.permanent_state = "";
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

      var vm = this;
      var payloadUser = this.form;
      payloadUser._method = "PATCH";
      await vm.$store.dispatch(UPDATE_USER_DETAIL, {
        hibahId: this.hibah.id,
        payload: payloadUser,
      });

      var payloadHibah = this.formHibah;
      payloadHibah._method = "PATCH";
      await vm.$store.dispatch(UPDATE_HIBAH, {
        hibahId: this.hibah.id,
        payload: payloadHibah,
      });

      this.$router.push({
        name: "trust-inheritance.caretaker",
        query: {
          hibah_id: this.hibah.id,
        },
      });
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.permanent_address = this.form.correspondence_address;
        this.form.permanent_city = this.form.correspondence_city;
        this.form.permanent_state = this.form.correspondence_state;
        this.form.permanent_postcode = this.form.correspondence_postcode;
        this.postcode = this.form.correspondence_postcode;
      } else {
        this.form.permanent_address = "";
        this.form.permanent_city = "";
        this.form.permanent_state = "";
        this.form.permanent_postcode = "";
        this.postcode = "";
      }
    },
    async createUser() {
      var user = this.form;
      user.username = this.form.ic_number;
      user.role = "Client";
      user.face_verified = 1;
      user.race = this.form.race;
      return await ApiService.post(`/user`, user)
        .then((response) => {
          this.user = response.data.user;
          return response.data.user.id;
        })
        .catch(() => {
          return false;
        });
    },
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
    // async createHibah() {
    //   this.formHibah.user_id = this.userId;
    //   this.formHibah.agent_id = this.agentId;
    //   this.formHibah.hibah_type = this.type;
    //   this.formHibah.organization_id = this.organizationId;
    //   this.formHibah.branch_id = this.branchId;
    //   return await ApiService.post(`/hibah`, this.formHibah)
    //     .then((response) => {
    //       this.hibah = response.data.hibah;
    //       return response.data.hibah.id;
    //     })
    //     .catch((error) => {
    //       return false;
    //     });
    // },
    // async updateHibah() {
    //   this.formHibah._method = "PATCH";
    //   return await ApiService.post(`/hibah/${this.trustId}`, this.formHibah)
    //     .then((response) => {
    //       this.hibah = response.data.hibah;
    //       return response.data.hibah.id;
    //     })
    //     .catch((error) => {
    //       return false;
    //     });
    // },
    async changeRace() {
      if (["Others", "Lain-lain"].includes(this.form.race)) {
        const { value: newRace } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Bangsa</label></span>",
          input: "text",
        });
        if (newRace) {
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
            this.form.permanent_address =
              this.form.permanent_address ?? ocr.address;
            this.form.nationality = this.form.nationality ?? ocr.nationality;
            this.form.postcode = this.form.postcode ?? ocr.postcode;
            this.getPostcode(1);
          }
        }
      );
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
    },
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userAccess",
      "currentUser",
      "userRole",
      "user",
      "hibah",
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
        
      },
    },
  },
};
</script>
<template>
  <div class="col-lg-12 col-12 mb-4 pb-2">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
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
                readonly
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
            <div class="form-group">
              <label for="dob"
                >Tarikh Lahir<span class="text-danger">*</span></label
              >
              <input
                type="date"
                class="form-control"
                v-model="form.date_of_birth"
                id="dob"
                required
              />
            </div>
          </div>
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
              :class="{ 'has-error': $v.form.correspondence_address.$error }"
            >
              <label for="correspondence_address">{{
                $t("mailing-address")
              }}</label>
              <span class="text-danger">*</span>
              <textarea
                v-uppercase
                class="form-control"
                id="correspondence_address"
                rows="2"
                v-model.trim="$v.form.correspondence_address.$model"
              ></textarea>
              <div
                class="form-error"
                v-if="
                  $v.form.correspondence_address.$error &&
                  !$v.form.correspondence_address.required
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
              <label for="correspondence_postcode" class="d-block">
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
                id="correspondence_postcode"
                class="form-control"
                @blur="getPostcode(1)"
                v-model.lazy.trim="$v.form.correspondence_postcode.$model"
              />
              <div
                class="form-error"
                v-if="
                  $v.form.correspondence_postcode.$error &&
                  !$v.form.correspondence_postcode.required
                "
              >
                Poskod tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-group">
              <label for="correspondence_city">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="correspondence_city"
                class="form-control"
                readonly
                v-model="form.correspondence_city"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="correspondence_state">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
                id="correspondence_state"
                class="form-control"
                readonly
                v-model="form.correspondence_state"
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
                id="permanent_address"
                rows="2"
                v-uppercase
                v-model="form.permanent_address"
                :readonly="form.sameAddress == 1"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="permanent_postcode" class="d-block">
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
                id="permanent_postcode"
                :readonly="form.sameAddress == 1"
                class="form-control"
                @blur="getPostcode(2)"
                v-model.lazy="form.permanent_postcode"
              />
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-group">
              <label for="permanent_city">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="permanent_city"
                class="form-control"
                readonly
                v-model="form.permanent_city"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="permanent_state">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
                id="permanent_state"
                class="form-control"
                readonly
                v-model="form.permanent_state"
              />
            </div>
          </div>
        </div>
        <div>
          <hr class="primary" />
          <div class="form-group position-relative">
            <label for="employer_name">{{ $t("employers-name") }}</label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              id="employer_name"
              v-model="formHibah.employer_name"
              required
            />
          </div>

          <div class="form-group position-relative">
            <label for="employer_address">{{ $t("employers-address") }}</label>

            <textarea
              v-uppercase
              name=""
              class="form-control"
              cols="30"
              rows="10"
              v-model="formHibah.employer_address"
            ></textarea>
          </div>

          <div class="row">
            <div class="form-group position-relative col-md-6">
              <label for="job_title"> {{ $t("position") }} </label>
              <input
                type="text"
                v-uppercase
                class="form-control"
                id="job_title"
                v-model="formHibah.job_title"
                required
              />
            </div>
            <div class="form-group position-relative col-md-6">
              <label for="yearly_income">{{ $t("yearly-income") }}</label>
              <input
                type="text"
                class="form-control"
                id="yearly_income"
                v-model="formHibah.yearly_income"
                required
              />
            </div>
          </div>
        </div>
        <hr class="primary" />
        <div class="row">
          <div class="form-group position-relative col-md-6">
            <label for="income_source">{{ $t("source-income") }}</label>
            <select
              name=""
              class="form-control"
              v-model="formHibah.income_source"
              @change="dropdownSourceIncome($event)"
            >
              <option
                v-for="incomeVal in income"
                :key="incomeVal"
                :value="incomeVal"
              >
                {{ incomeVal }}
              </option>
            </select>
          </div>
          <div
            class="form-group position-relative col-md-6"
            v-if="otherSourceIncome"
          >
            <label for="income_source">{{ $t("othersource-income") }}</label>
            <input
              type="text"
              v-uppercase
              name="income_source"
              placeholder="Sila nyatakan"
              v-model="form.income_source"
              class="form-control"
            />
          </div>
          <div class="form-group position-relative col-md-6">
            <label for="hibah_property_source">Sumber Harta Amanah</label>
            <select
              name="hibah_property_source"
              class="form-control"
              v-model="formHibah.hibah_property_source"
              @change="changeincomeproperty($event)"
            >
              <option
                v-for="incomeproperty in income_property"
                :key="incomeproperty"
                :value="incomeproperty"
              >
                {{ incomeproperty }}
              </option>
              <!-- <option value="Pendapatan Perniagaan">
                Pendapatan Perniagaan
              </option>
              <option value="Pendapatan Pekerjaan">Pendapatan Pekerjaan</option>
              <option value="Pendapatan Pelaburan">Pendapatan Pelaburan</option>
              <option value="Hadiah Warisan">Hadiah Warisan</option>
              <option value="Lain-lain">Lain-lain</option> -->
            </select>
          </div>
          <div class="col-md-6" v-if="otherHibahPropSource">
            <div class="form-group">
              <label for="hibah_property_source">Sumber Harta Hibah Lain</label>
              <input
                type="text"
                name="hibah_property_source"
                id="hibah_property_source"
                placeholder="Sila nyatakan"
                v-model="form.hibah_property_source"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group col-md-12">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                id="check_revocable"
                v-model="formHibah.is_revocable"
                value="1"
              />
              <label class="custom-control-label" for="check_revocable">
                {{ $t("trust.can-revoked") }}
              </label>
            </div>
          </div>
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
  </div>
</template>
