<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      phone_number: null,
      btnotptext: "MOHON OTP",
      name: null,
      ic_number: null,
      acknowledged_pdpa: false,
      acknowledged_confirmation: false,
      otpcode: null,
      btnSendTOAwaris: false,
      amendment_id: null,
      amendment_status: null,
      signature: null,
      signatureCheck: null,
      updateStatus: {
        _method: "PATCH",
        status: 1,
      },
      signature: {
        public_path: null,
      },
      otpSent: false,
      is_staff_created: 0,
    };
  },
  components: {},
  mounted() {
    this.wasiatGetAmendment();
  },
  methods: {
    handleOnComplete(value) {
      this.otpcode = value;
      console.log("OTP completed: ", value);
    },
    handleOnChange(value) {
      this.otpcode = value;
      console.log("OTP changed: ", value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
    // requestOtp() {
    //   this.$refs["modalRequestOtp"].show();
    // },
    requestOtp() {
      if (!this.acknowledged_pdpa) {
        this.$swal.fire({
          icon: "error",
          html: "Sila bersetuju dengan Akta Perlindungan Data Peribadi 2010.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }

      if (!this.acknowledged_confirmation) {
        this.$swal.fire({
          icon: "error",
          html: "Sila bersetuju dengan pengesahan wasiat.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }

      if (this.btnotptext == "MOHON OTP") {
        ApiService.post(`/sms/code`, { phone_number: this.phone_number })
          .then((response) => {
            console.log(response.data);
            this.otpSent = true;
          })
          .catch((error) => {});
      } else {
      }
    },
    hideModal() {
      this.$refs["modalRequestOtp"].hide();
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var user_id = response.data.wasiat.user_id;
          this.getUser(user_id);

          var data_amendment = response.data.amendments.data;
          console.log("wasiatGetAmendment", data_amendment);
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            this.is_staff_created = data_amendment[0].is_staff_created ?? 0;
            console.log("amendment_id", this.amendment_id);
            this.getSignature();
          }
        })
        .catch((error) => {
          console.log("ERROR - wasiat Amendment");
        });
    },
    getSignature() {
      ApiService.get(`/amendment/${this.amendment_id}/signature?stream=false`)
        .then((response) => {
          console.log("getSignature", response.data);
          this.signature = response.data.signature;
          return true;
        })
        .catch((error) => {
          console.log("Signature failed");
          return false;
        });
    },
    getUser(user_id) {
      ApiService.get(`/user/${user_id}`)
        .then((response) => {
          var data = response.data.user;
          this.name = data.name ?? "-";
          this.phone_number = data.mobile_number;
          console.log("phone", this.phone_number);
          this.ic_number = data.ic_number ?? "-";
        })
        .catch((error) => {});
    },
    awarisVerified() {
      this.updateStatus.status = 2; //awaris approve
      this.$swal
        .fire({
          icon: "info",
          html: "Semua maklumat pindaan adalah benar?",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Benar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            ApiService.post(
              `/amendment/${this.amendment_id}`,
              this.updateStatus
            )
              .then((response) => {
                this.$swal.fire({
                  icon: "success",
                  html: "Anda telah mengesahkan pindaan ini.",
                  showCloseButton: true,
                  showCancelButton: false,
                  focusConfirm: false,
                  confirmButtonText: "Tutup",
                });
                if (this.is_staff_created === 1) {
                  this.$router.push({
                    name: "wasiat.details",
                    params: { wasiat_id: this.wasiat_id },
                  });
                } else {
                  this.$router.push({ name: "wasiat.pengesahan.list-pindaan" });
                }
                console.log(response.data);
              })
              .catch((error) => {});
          }
        });
    },
    awarisCancel() {
      this.updateStatus.status = 0;
      this.$swal
        .fire({
          icon: "info",
          html: "Anda ingin membatalkan pindaan ini?",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Benar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            ApiService.post(
              `/amendment/${this.amendment_id}`,
              this.updateStatus
            )
              .then((response) => {
                console.log(response.data);
                this.$swal.fire({
                  icon: "success",
                  html: "Anda telah membatalkan pindaan ini.",
                  showCloseButton: true,
                  showCancelButton: false,
                  focusConfirm: false,
                  confirmButtonText: "Tutup",
                });
                if (this.is_staff_created === 1) {
                  this.$router.push({
                    name: "wasiat.details",
                    params: { wasiat_id: this.wasiat_id },
                  });
                } else {
                  this.$router.push({ name: "wasiat.pengesahan.list-pindaan" });
                }
              })
              .catch((error) => {});
          }
        });
    },

    async verifyOtp() {
      return ApiService.post(`/sms/verify`, {
        phone_number: this.phone_number,
        code: this.otpcode,
      })
        .then((response) => {
          console.log(response.data);
          this.btnSendTOAwaris = true;
          return;
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            html: "Kod OTP anda salah. Sila cuba lagi.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
        });
    },
    async updateAmendmentStatus() {
      if (!this.acknowledged_pdpa) {
        this.$swal.fire({
          icon: "error",
          html: "Sila bersetuju dengan Akta Perlindungan Data Peribadi 2010.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }

      if (!this.acknowledged_confirmation) {
        this.$swal.fire({
          icon: "error",
          html: "Sila bersetuju dengan pengesahan wasiat.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }

      if (!this.otpcode) {
        this.$swal.fire({
          icon: "error",
          html: "Sila mohon dan masukkan OTP terlebih dahulu.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      await this.verifyOtp();
      if (this.btnSendTOAwaris) {
        // 1.check if pdpa dah check or not
        ApiService.post(`/amendment/${this.amendment_id}`, this.updateStatus)
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              html:
                "Pindaan anda telah di hantar ke pihak AWARIS untuk pengesahan.",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
              onClose: () => {
                if (this.is_staff_created === 1) {
                  this.$router.push({
                    name: "wasiat.details",
                    params: { wasiat_id: this.wasiat_id },
                  });
                } else {
                  this.$router.push({ name: "pindaan" });
                }
              },
            });

            console.log(response.data);
          })
          .catch((error) => {});
      } else {
        this.$swal.fire({
          icon: "error",
          html: "Sila mohon OTP terlebih dahulu dan semak pengesahan.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      }
    },
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userAccess", "userRole"]),
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
  watch: {
    currentUser: {
      handler: function (val) {
        // console.log("val", val);
        if (this.pengesahan) {
          this.acknowledged_pdpa = true;
          this.acknowledged_confirmation = true;
        }
      },
    },
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
          <div class="card-body" v-if="amendment_status == 2">
            <h5 class="text-center">{{ $t("verification") }}</h5>
            <p>
              Pindaan wasiat anda telah diluluskan oleh pihak AWARIS. Sila pergi
              ke draf wasiat akhir untuk buat semakan pindaan.
            </p>
            <hr class="primary" v-if="amendment_status != 2" />
          </div>
          <div class="card-body">
            <form class="login-form">
              <div class="card card-custom gutter-b">
                <div class="card-header">
                  <div class="card-title m-0">
                    <h5 class="card-label m-0">
                      AKTA PERLINDUNGAN DATA PERIBADI 2010
                    </h5>
                  </div>
                </div>
                <div class="card-body">
                  <p class="text-justify">
                    Dengan menyempurnakan borang ini anda membenarkan maklumat
                    peribadi anda untuk digunakan oleh Amanah Warisan Berhad
                    untuk memberikan anda perkhidmatan Amanah Warisan Berhad
                    yang bersesuaian dengan anda. Maklumat peribadi yang
                    diberikan oleh anda akan digunakan untuk pentadbiran dan
                    pengurusan perkhidmatan yang diberikan kepada anda. Maklumat
                    peribadi anda boleh digunakan untuk memberi anda maklumat
                    lanjut mengenai produk dan perkhidmatan yang sesuai dengan
                    anda daripada Amanah Warisan Berhad. Maklumat tersebut
                    adalah sulit dan persendirian dan tidak akan dikemukakan
                    oleh pihak ketiga tanpa kebenaran anda. Semua maklumat yang
                    diberikan oleh anda dalam borang ini adalah tepat, lengkap
                    dan terkini. Jika anda ingin mengemaskini maklumat peribadi
                    anda, sila hubungi kami di talian 03-62639990, email:
                    admin@awarisgroup.com .
                  </p>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      name="checkPdpa"
                      id="checkPdpa"
                      value="1"
                      class="form-check-input"
                      v-model="acknowledged_pdpa"
                    />

                    <label class="label-agree-term" for="checkPdpa">
                      <strong>
                        SAYA MEMAHAMI AKTA PERLINDUNGAN DATA PERIBADI 2010
                      </strong>
                    </label>
                  </div>
                </div>
              </div>
              <br />
              <div class="card card-custom gutter-b">
                <div class="card-header">
                  <div class="card-title m-0">
                    <h5 class="card-label m-0">PENGESAHAN WASIAT</h5>
                  </div>
                </div>
                <div class="card-body">
                  <p>
                    Saya,
                    <strong
                      style="text-decoration: underline"
                      v-html="name"
                    ></strong
                    >, bernombor kad pengenalan
                    <strong
                      style="text-decoration: underline"
                      v-html="ic_number"
                    ></strong>
                  </p>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="exampleCheck2"
                      value="1"
                      v-model="acknowledged_confirmation"
                    />
                    <label class="label-agree-term" for="exampleCheck2">
                      <strong>BERSETUJU DAN MEMAHAMI:</strong>
                    </label>
                  </div>
                  <p>
                    1. Melantik AMANAH WARISAN BERHAD sebagai Wasi dan Pemegang
                    Amanah bagi wasiat saya dengan kadar fi pelaksanaan sebanyak
                    2% daripada jumlah keseluruhan harta Pusaka saya.
                  </p>
                  <p>
                    2. Menarik balik semua wasiat yang terdahulu yang dibuat
                    oleh saya (sekiranya ada) dan sebarang pembayaran di atas
                    wasiat ini tidak akan dikembalikan kepada saya.
                  </p>
                  <div v-if="amendment_status == 4">
                    <img
                      :src="signature.public_path"
                      alt
                      srcset
                      v-if="signature"
                      style="width: 130px"
                      class="mt-3"
                    />
                  </div>
                  <div v-if="amendment_status == 4">
                    [
                    <strong v-html="name"></strong>]
                  </div>
                </div>
              </div>
              <div v-if="!btnSendTOAwaris">
                <div
                  class="row d-flex justify-content-center m-4"
                  v-if="amendment_status == 0"
                >
                  <div style="display: flex; flex-direction: row">
                    <v-otp-input
                      ref="otpInput"
                      input-classes="otp-input"
                      separator="-"
                      :num-inputs="6"
                      :should-auto-focus="true"
                      :is-input-num="true"
                      @on-change="handleOnChange"
                      @on-complete="handleOnComplete"
                    />
                  </div>
                </div>
                <div
                  class="row d-flex justify-content-center"
                  v-if="amendment_status == 0"
                >
                  <b-btn
                    v-if="!otpSent"
                    class="btn-sm btn-warning m-2"
                    @click="requestOtp"
                    >{{ btnotptext }}</b-btn
                  >
                  <span v-if="otpSent"
                    ><small
                      >OTP telah dihantar ke nombor telefon bimbit anda.</small
                    ></span
                  >
                </div>
              </div>
              <div
                v-if="userRole == 'Staff' && amendment_status == 1"
                class="d-flex justify-content-center"
              >
                <h5>Anda bersetuju dengan maklumat pindaan</h5>
              </div>
              <div class="row mt-2">
                <div class="col-lg-12 text-center">
                  <div class="form-group">
                    <b-button
                      v-if="pengesahan && amendment_status == 1"
                      class="btn btn-success m-1"
                      @click="awarisVerified"
                    >
                      Sahkan</b-button
                    >
                    <b-button
                      v-if="pengesahan && amendment_status == 1"
                      class="btn btn-danger m-1"
                      @click="awarisCancel"
                    >
                      Batal</b-button
                    >
                  </div>
                </div>
              </div>
            </form>

            <b-modal ref="modalRequestOtp" title="Mohon OTP" hide-footer>
              <div class="card-body">
                <span
                  >No OTP anda akan di hantar ke No Telefon +6018-9581443</span
                >
              </div>
              <div class="d-flex justify-content-center">
                <b-button
                  class="mt-3"
                  variant="primary"
                  block
                  @click="hideModal"
                  >Tutup</b-button
                >
              </div>
            </b-modal>
          </div>
        </div>
        <div class="text-right mt-3">
          <b-button
            v-if="amendment_status == 0"
            class="btn btn-primary m-1"
            type="button"
            @click="updateAmendmentStatus"
          >
            Hantar Permohonan
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style >
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
