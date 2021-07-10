<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      signature: {
        public_path: null,
      },
      amendment_id: null,
      amendment_status: null,
      amendments_draft: null,
      is_staff_created: 0,
      phone_number: null,
      btnotptext: "MOHON OTP",
      btnSetujuOTP: false,
      btnSetujuSign: false,
      otpSent: false,

      form: {
        no_wasiat: "-",
        wasiat_type: null,
        code_niaga: null,
        wasiat_date: null,
        organization_id: null,
        wasiat_data_accept: null,
        branch_id: "-",
        account_type: "-",
        amendment_date: null,
        amendment_count: null,
      },
      update: {
        _method: "PATCH",
        status: null,
      },
    };
  },
  components: {},
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
  },
  mounted() {
    this.getlistPindaan();
  },
  methods: {
    async getlistPindaan() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var user_id = response.data.wasiat.user_id;
          this.getUser(user_id);
          var data_array = response.data.amendments.data;

          // if (Array.isArray(data_array) && data_array.length > 0) {
          this.amendment_status = data_array[0].status;
          this.amendment_id = data_array[0].id;
          this.amendments_draft = data_array[0].public_path;
          this.is_staff_created = data_array[0].is_staff_created ?? 0;

          // }
          console.log(data_array[0]);
        })
        .catch((error) => {
          console.log("error");
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
    async getWasiatDetails() {
      ApiService.get(`/wasiat?id=${this.wasiat_id}`)
        .then((response) => {
          var data_obj = response.data.wasiats.data[0];
          console.log(data_obj);

          console.log(data_obj);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    async selesai() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log("Signature data empty: ", isEmpty);

      if (isEmpty) {
        this.$swal.fire({
          icon: "error",
          html: "Sila masukkan tandatangan terlebih dahulu.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      var resultSign = await this.saveSignature();
      if (resultSign) {
        this.update.status = 4;
        this.updateAmendment();
      }
    },
    //FIXME: draft wasiat
    viewDraff() {
      // window.open(this.amendments_draft.public_path, "_blank");
      window.open(
        process.env.VUE_APP_API_URL +
          `/amendment/${this.amendment_id}/certificate/comprehensive`,
        "_blank"
      );
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(isEmpty);
      console.log(data);
      // this.$router.push({ name: "wasiat.part_e" });
    },
    async acceptDraff() {
      this.btnSetujuOTP = true;
    },
    async requestOtp() {
      if (this.btnotptext == "MOHON OTP") {
        //kelaur swal
        ApiService.post(`/sms/code`, { phone_number: this.phone_number })
          .then((response) => {
            console.log(response.data);
            this.otpSent = true;
            this.btnotptext = "SAHKAN OTP";
          })
          .catch((error) => {});
      } else if (this.btnotptext == "SAHKAN OTP") {
        await this.verifyOtp();
      }
    },
    async verifyOtp() {
      return ApiService.post(`/sms/verify`, {
        phone_number: this.phone_number,
        code: this.otpcode,
      })
        .then((response) => {
          console.log(response.data);
          this.btnSetujuSign = true;
          this.closeOTP = true;
          this.$swal.fire({
            icon: "success",
            html: "Anda berjaya mengesahkan kod OTP.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
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
    async saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log("Signature data empty: ", isEmpty);
      if (!isEmpty) {
        return await ApiService.post(
          `/amendment/${this.amendment_id}/signature`,
          {
            description: "amendment",
            is_base64: true,
            document: data,
          }
        )
          .then((response) => {
            console.log("Signature success");
            return true;
          })
          .catch((error) => {
            console.log("Signature failed");
            this.submit = false;
            return false;
          });
      } else {
        this.$notify({
          group: "foo",
          title: "Sila tandatangan sebelum hantar.",
          type: "error",
        });
        this.submit = false;
        return false;
      }
    },
    rejectDraff() {
      this.update.status = 0;
      this.updateAmendment();
    },
    async updateAmendment() {
      ApiService.post(`/amendment/${this.amendment_id}`, this.update)
        .then((response) => {
          console.log(response.data);
          if (this.is_staff_created == 1) {
            if (this.userRole == "Client") {
              this.$router.push({ name: "pindaan" });
            } else {
              this.$router.push({
                name: "wasiat.details",
                params: { wasiat_id: this.wasiat_id },
              });
            }
          } else {
            this.$router.push({ name: "pindaan" });
          }
        })
        .catch((error) => {
          console.log("error update");
        });
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
          <div class="card-body">
            <h5 class="text-center">Draf Wasiat</h5>
            <p>
              Pindaan wasiat anda telah diluluskan oleh pihak AWARIS. Sila buat
              semakan pindaan anda dengan menekan butang
              <strong>"Lihat Draf Wasiat"</strong>. Anda dikehendaki untuk
              mengesahkan pindaan anda dalam masa 14 hari.
            </p>
            <div class="d-flex justify-content-center">
              <b-button class="btn btn-primary" @click="viewDraff"
                >Lihat Draf Wasiat</b-button
              >
            </div>
            <hr class="primary" />
            <div
              class="d-flex justify-content-around mt-3"
              v-if="!btnSetujuOTP && !btnSetujuSign"
            >
              <b-button class="btn btn-danger" @click="rejectDraff">
                Saya Tidak Setuju
              </b-button>
              <b-button class="btn btn-success" @click="acceptDraff">
                Saya Setuju
              </b-button>
            </div>
            <div v-if="btnSetujuOTP && !btnSetujuSign">
              <div class="d-flex justify-content-center m-4">
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
              <div class="row d-flex justify-content-center">
                <b-btn class="btn-sm btn-warning m-2" @click="requestOtp">{{
                  btnotptext
                }}</b-btn>
              </div>
              <div class="row d-flex justify-content-center">
                <span v-if="otpSent"
                  ><small
                    >OTP telah dihantar ke nombor telefon bimbit anda.</small
                  ></span
                >
              </div>
            </div>
            <div class="row mt-3">
              <div
                class="col-md-12 text-center"
                v-if="amendment_status == 2 && btnSetujuSign"
              >
                <div class="table-responsive">
                  <table class="table table-hover table-sm">
                    <tbody>
                      <div class="shadow signature-pad" style="width: 400px">
                        <VueSignaturePad
                          style="position: absolute; z-index: 1"
                          height="300px"
                          width="100%"
                          ref="signaturePad"
                          :options="{
                            onBegin: () => {
                              $refs.signaturePad.resizeCanvas();
                            },
                          }"
                        />
                        <label
                          style="
                            z-index: 0;
                            position: absolute;
                            right: 0%;
                            left: 0%;
                            top: 45%;
                            color: #b6b6b4;
                            text-align: center;
                          "
                        >
                          Tandatangan disini
                        </label>
                        <a
                          class="btn btn-primary"
                          style="
                            position: absolute;
                            right: 5px;
                            top: 5px;
                            z-index: 2;
                          "
                          @click="undo"
                        >
                          <img src="/images/icon/rubber.svg" height="20" alt />
                        </a>
                      </div>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              class="d-flex justify-content-center"
              v-if="amendment_status == 2 && btnSetujuSign"
            >
              <b-button class="btn btn-success" @click="selesai"
                >Selesai</b-button
              >
            </div>
          </div>
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
