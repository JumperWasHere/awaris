<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { mapGetters } from "vuex";
import { TRUST } from "@/services/store/trust.module";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      amendment_id: null,
      acceptPdpa: false,
      payment_received_at: null,
      paymethod: null,
      checkPdpa: false,
      btnotptext: "MOHON OTP",
      btnSetujuSign: false,
      btnSendTOAwaris: false,
      // form: {},
      isKoperate: null,
      submit: false,
      acceptPay: false,
      btnNotification: false,
      otpSent: false,

      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      form: {
        acknowledged_pdpa: 0,
        acknowledged_confirmation: 0,
        is_cash_payment: 0,
      },
      receipt: {
        image: null,
        imageUrl: null,
      },
      updateStatus: {
        _method: "PATCH",
        status: 1,
      },
      verificationSent: false,
    };
  },
  validations: {
    receipt: {
      imageUrl: {
        required,
      },
    },
  },
  mounted() {
    if (this.amendmentId) {
      this.getamendment();
    }
  },

  methods: {
    getamendment() {
      ApiService.get(`/amendment?hibah_id=${this.trustId}`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            console.log("data_amendment", data_amendment);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
    acceptPdpaFunc() {
      if (this.acceptPdpa == 1) {
        this.checkPdpa = true;
      } else {
        this.checkPdpa = false;
      }
    },
    filesChange(files, type) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");

      this.receipt.image = files[0];
      this.receipt.imageUrl = URL.createObjectURL(files[0]);
      // }
    },
    async receiptSubmit() {
      if (this.receipt.image) {
        const formData = new FormData();
        formData.append("type", "payment");
        formData.append("document", this.receipt.image, "nama file");
        return await ApiService.post(
          `/hibah/${this.trustId}/document`,
          formData
        )
          .then((response) => {
            return true;
            console.log(response);
          })
          .catch((error) => {
            return false;
            console.log(error);
          });
      } else {
        return true;
      }
    },
    async saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log("Signature data empty: ", isEmpty);
      if (!isEmpty) {
        return await ApiService.post(`/hibah/${this.trustId}/signature`, {
          description: "hibah",
          is_base64: true,
          document: data,
        })
          .then((response) => {
            return true;
          })
          .catch((error) => {
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
    async paymentGateWay() {
      // var result;
      // if (this.signature == null) {
      //   result = await this.saveSignature();
      //   if (!result) {
      //     return;
      //   }
      // }

      var url = window.location.href;
      var pay = {
        user_id: this.trustDetails.user_id,
        title: "Register Habiah Payment",
        amount: this.trustDetails.price,
        type: "Wasiat",
        description: "pay hibah register",
        redirect_url: url,
        paymentable_id: this.wasiat.id,
        paymentable_type: "Hibah",
      };
      console.log(pay);
      var resultPay = await this.toyepPya();
      if (resultPay) {
        await this.emailClientCreated();
        window.location.replace(resultPay);
      }
      this.form.status = 1;
      await this.updateHibah();
    },
    async toyepPya() {
      return await ApiService.post(`payment`, pay)
        .then((response) => {
          var link = response.data.payment.payment_link;
          // this.$router.push(link);
          return link;
          // this.$router.push({ link });
        })
        .catch((error) => {
          // this.acceptPay = false;
          return false;
          console.log(error);
          // this.submit = false;
        });
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    async sendVerification() {
      console.log(this.trust);
      await this.emailClientCreated();
      this.verificationSent = true;
    },
    async emailClientCreated() {
      return await ApiService.get(
        `user/${this.trust.user_id}/email-client-created?product=Hibah`
      )
        .then((response) => {
          this.$store.dispatch(TRUST, this.trustId);
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    async finish() {
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
      if (this.isKoperate) {
        //if koperate
        if (this.trust.status == 0) {
          //if not pindaan
          let receiptSave = await this.receiptSubmit();
          if (receiptSave) {
            this.form.status = 1;
            let resultHibah = await this.updateHibah();
            console.log("resultHibah", resultHibah);
            if (resultHibah) {
              await this.emailClientCreated();
              this.$notify({
                group: "full-noti",
                title: "Amanah/Hibah telah berjaya dijana",
                duration: 5000,
                type: "success",
              });

              this.$router.push({
                name: "dashboard",
                query: {
                  statusHibah: "success",
                },
              });
            }
          }
        } else if (!this.trust.status == 0) {
          //if client yang open
          if (this.acceptPdpa != 1) {
            //check pdpa
            if (this.userRole == "Client" && this.trust.status == 1) {
              this.$router.push({
                name: "dashboard",
                query: {
                  statusHibah: "success",
                },
              });
            }
            if (this.userRole != "Client" && this.trust.status == 1) {
              this.$swal.fire({
                icon: "error",
                html: "hanya penghibah sahaja boleh update",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Tutup",
              });
              return;
            }
            this.$swal.fire({
              icon: "error",
              html: "Sila memahami deklarasi",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
          } else {
            //pdpa is true
            const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
            console.log("Signature data empty: ", isEmpty);
            if (isEmpty) {
              //check signature
              this.$swal.fire({
                icon: "error",
                html: "Sila tingalkan tandatangan",
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Tutup",
              });
            } else {
              //if signature not empty
              var resultSign = await this.saveSignature();
              //client userrole and pindaan
              if (resultSign) {
                // if (this.trust.status == 4 && this.amendmentId) {
                //   // if pindaan
                //   let resultUpdate = await this.updateAmendment();
                //   if (resultUpdate) {
                //     console.log("resultUpdate -- success");
                //   }
                // } else
                if (
                  //penghibah update
                  resultSign &&
                  this.trust.status == 1 &&
                  !this.amendmentId
                ) {
                  this.form.status = 2;
                  let resultHibah = await this.updateHibah();
                  if (resultHibah) {
                    this.$router.push({
                      name: "dashboard",
                      query: {
                        statusHibah: "success",
                      },
                    });
                  }
                }
              }
            }
          }
        }
      } else if (!this.isKoperate) {
        if (this.acceptPdpa != 1) {
          if (this.userRole == "Client") {
            this.$router.push({
              name: "dashboard",
              query: {
                statusHibah: "success",
              },
            });
          }
          if (this.userRole != "Client") {
            this.$swal.fire({
              icon: "error",
              html: "hanya penghibah sahaja boleh update",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
            return;
          }
          this.$swal.fire({
            icon: "error",
            html: "Sila memahami deklarasi",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
        } else {
          const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
          console.log("Signature data empty: ", isEmpty);
          if (isEmpty) {
            this.$swal.fire({
              icon: "error",
              html: "Sila tingalkan tandatangan",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
          } else {
            var resultSign = await this.saveSignature();
            if (resultSign && this.trust.status == 1 && !this.amendmentId) {
              this.form.status = 2;
              let resultHibah = await this.updateHibah();
              if (resultHibah) {
                this.$router.push({
                  name: "dashboard",
                  query: {
                    statusHibah: "success",
                  },
                });
              }
            }
            // else if (this.trust.status == 4 && this.amendmentId) {

            // }
          }
        }
      }
    },
    async updateAmendment() {
      let obj = {
        _method: "PATCH",
        // amendmentable_type: "Hibah",
        // amendmentable_id: this.trustId,
        // notes: null,
        status: 1,
      };

      return await ApiService.post(`/amendment/${this.amendmentId}`, obj)
        .then((response) => {
          var data_obj = response.data.amendment;
          console.log(data_obj);
          this.amendment_array = data_obj;
          console.log("");
          this.amendment_id = data_obj.id;
          // this.$router.push({
          //   name: "trust-onecent.part-a",
          //   query: {
          //     trust_id: this.trustId,
          //     amendment_id: this.amendment_id,
          //   },
          // });

          // pindaan.part_a
          return true;
        })
        .catch((error) => {
          console.log("error");
          return false;
        });
    },
    getPaymentMethod(val) {
      // console.log(val);
      ApiService.get(`/organization/${val.organization_id}`)
        .then((response) => {
          console.log("ORG=", response.data);
          let allow_cash_payment =
            response.data.organization.allow_cash_payment;
          let allow_payment_gateway =
            response.data.organization.allow_payment_gateway;
          if (allow_cash_payment == 1 && allow_payment_gateway == 1) {
            this.paymethod = "both";
          } else {
            this.paymethod = "cash";
          }
        })
        .catch((error) => {});
    },
    async updateCashPayment() {
      this.form.status = 1;
      this.form.is_cash_payment = 1;
      await this.updateHibah();
      await this.emailClientCreated();

      // this.acceptPay = true;
      // ApiService.post(`hibah/${this.trustId}`, {
      //   _method: "PATCH",
      //   is_cash_payment: 1,
      // })
      //   .then((response) => {
      //     this.payment_received_at = response.data.wasiat.payment_received_at;
      //   })
      //   .catch((error) => {
      //     this.acceptPay = false;
      //     // this.submit = false;
      //   });
    },
    showReceipt() {
      window.open(this.receipt.imageUrl, "_blank");
    },
    async requestOtp() {
      if (this.btnotptext == "MOHON OTP") {
        //kelaur swal
        ApiService.post(`/sms/code`, {
          phone_number: this.trust.user.mobile_number,
        })
          .then((response) => {
            console.log(response.data);
            this.otpSent = true;
            this.btnotptext = "SAHKAN OTP";
          })
          .catch((error) => {});
      }
    },
    async verifyOtp() {
      return ApiService.post(`/sms/verify`, {
        phone_number: this.trust.user.mobile_number,
        code: this.otpcode,
      })
        .then((response) => {
          console.log(response.data);
          this.btnSetujuSign = true;
          this.closeOTP = true;
          this.btnSendTOAwaris = true;

          // this.$swal.fire({
          //   icon: "success",
          //   html: "Anda berjaya mengesahkan kod OTP.",
          //   showCloseButton: true,
          //   showCancelButton: false,
          //   focusConfirm: false,
          //   confirmButtonText: "Tutup",
          // });
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
    async updateHibah() {
      this.form._method = "PATCH";
      console.log("form", this.form);
      return await ApiService.post(`/hibah/${this.trustId}`, this.form)
        .then((response) => {
          // console.log(response.data);
          this.payment_received_at = response.data.hibah.payment_received_at;
          return true;
        })
        .catch((error) => {
          this.acceptPay = false;
          return false;
        });
    },
    modalPG() {
      this.$refs["modalPG"].show();
    },
    async getDocument() {
      ApiService.get(`/hibah/${this.trustId}/document`)
        .then((response) => {
          var filter = response.data.attachments.data.filter(
            (item) => item.type == "payment"
          );
          this.receipt.imageUrl = filter[0].public_path;
          console.log("getDocument", this.receipt.imageUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateAmendmentStatus() {
      if (!this.otpcode) {
        this.$swal.fire({
          icon: "error",
          html: "Sila mohon dan masukkan OTP terlebih dahulu",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      await this.verifyOtp();
      if (this.btnSendTOAwaris) {
        ApiService.post(`/amendment/${this.trustId}`, this.updateStatus)
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
                  // this.$router.push({
                  //   name: "hibah.list-client",
                  //   params: { wasiat_id: this.wasiat_id },
                  // });
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
    openotp() {
      // this.acceptPdpa = true;
      this.checkPdpa = true;
      this.btnSetujuSign = false;
    },
  },
  computed: {
    ...mapGetters(["userRole", "userAccess", "preference"]),
    trustId() {
      return this.$route.query.trust_id;
    },
    userAccessCheck() {
      return this.userAccess;
    },
    trustDetails() {
      return this.trust;
    },
    checkTrustType() {
      return this.trust;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  watch: {
    userAccessCheck: {
      handler: function (val) {
        if (val) {
          this.getPaymentMethod(val);
        } else {
          this.paymethod = "online";
        }
      },
    },
    trust: {
      handler: function (val) {
        if (val && ![0, 1].includes(val.status) && !this.amendmentId) {
          this.acceptPdpa = true;
        }
      },
    },
    checkTrustType: {
      handler: function (val) {
        if (val) {
          if (["1", "2"].includes(val.hibah_type)) {
            this.isKoperate = true;
            // console.log("upload", this.paymethod);
            this.getDocument();
          } else {
            this.isKoperate = false;
          }
        } else {
          this.isKoperate = false;
        }
      },
    },
  },
  components: { TheMask },
  props: {
    trust: {
      type: Object,
    },
    amendment: {
      type: Object,
    },
    paymethod: {
      type: String,
    },
  },
};
</script>

<template>
  <div class="col-lg-12 col-12 mb-4 pb-2">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body text-center" v-if="trust">
            <h5 class="text-center mb-5">Pengesahan</h5>
            <div v-if="trust.user && trust.status == 1">
              Pengesahan telahpun dihantar kepada Penghibah.
            </div>

            <div
              class="row d-flex justify-content-center mt-3"
              v-if="trust && trust.status == 1"
            >
              <div
                class="form-group"
                style="width: 40%"
                v-if="userRole != 'Client'"
              >
                <label for="upload-photo-2"> Bukti Pembayaran </label>
                <div class="card rounded shadow bg-dark">
                  <div
                    class="d-flex align-items-center justify-content-center bd-highlight"
                    style="height: 150px"
                  >
                    <label
                      v-if="receipt.imageUrl"
                      :style="
                        'background-image: url(' + receipt.imageUrl + ');'
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
                  </div>
                </div>
                <b-button class="mt-2 btn btn-primary" @click="showReceipt">
                  Lihat
                </b-button>
              </div>
            </div>

            <div v-if="trust && trust.status == 0">
              <p v-if="!isKoperate">
                Hibah telah diisi dengan jayanya dan Penghibah perlu
                mengesahkannya.
              </p>
              <div class="card card-custom gutter-b" v-if="checkTrustType">
                <div class="card-header">
                  <div class="card-title m-0">
                    <h5 class="card-label m-0">PEMBAYARAN</h5>
                  </div>
                </div>
                <div
                  class="card-body"
                  v-if="isKoperate && userRole != 'Client'"
                >
                  <p>
                    Sila muat naik bukti resit pembayaran sebanyak
                    <strong>RM {{ trust.price }}</strong>
                  </p>
                  <div class="row d-flex justify-content-center">
                    <div
                      class="form-group"
                      :class="{ 'has-error': $v.receipt.imageUrl.$error }"
                    >
                      <label for="upload-photo-2">
                        Muat Naik Bukti Pembayaran
                        <span class="text-danger">*</span>
                      </label>
                      <div class="card rounded shadow bg-dark">
                        <div
                          class="d-flex align-items-center justify-content-center bd-highlight"
                          style="height: 150px"
                        >
                          <label
                            v-if="receipt.imageUrl"
                            :style="
                              'background-image: url(' + receipt.imageUrl + ');'
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
                            v-if="!receipt.imageUrl"
                          >
                            <span>Pilih Salinan</span>
                          </label>
                          <input
                            type="file"
                            name="photo"
                            id="upload-photo-2"
                            class="upload-photo-input"
                            accept="image/*"
                            @change="
                              filesChange($event.target.files, 'receipt')
                            "
                          />
                        </div>
                      </div>
                      <div
                        class="form-error"
                        v-if="
                          $v.receipt.imageUrl.$error &&
                          !$v.receipt.imageUrl.required
                        "
                      >
                        Bukti resit tidak boleh dibiarkan kosong.
                      </div>
                      <!-- <b-button
                        class="mt-2 btn btn-primary"
                        @click="receiptSubmit"
                      >
                        Hantar
                      </b-button> -->
                    </div>
                  </div>
                </div>
                <div class="card-body" v-if="payment_received_at">
                  <p>
                    Bayaran telah diterima sebanyak
                    <strong>RM {{ trustDetails.price }}</strong>
                  </p>
                  <div class="row">
                    <div
                      class="col-md-6 d-flex justify-content-around"
                      v-if="userRole == 'Staff' && 'Agent'"
                    >
                      <button type="button" class="btn btn-primary">
                        Hantar Notifikasi
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="card-body"
                  v-if="payment_received_at == null && !isKoperate"
                >
                  <div v-if="paymethod == 'cash' || paymethod == 'both'">
                    <p class="text-justify">
                      Saya terima wang sejumlah
                      <strong>RM {{ trustDetails.price }}</strong>
                      daripada
                      <strong>{{
                        trustDetails.user ? trustDetails.user.name : ""
                      }}</strong>
                    </p>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="is_cash_payment"
                        value="1"
                        v-model="form.is_cash_payment"
                      />
                      <label class="label-agree-term" for="is_cash_payment">
                        <strong>
                          SAYA TERIMA WANG RM
                          <span>{{ trustDetails.price }}</span>
                        </strong>
                      </label>
                    </div>
                  </div>
                  <div class="d-flex justify-content-around">
                    <div
                      v-if="paymethod == 'cash' || paymethod == 'both'"
                      class="d-flex justify-content-center"
                    >
                      <button
                        class="btn btn-primary"
                        type="button"
                        @click="updateCashPayment"
                      >
                        Terima Pembayaran
                        <span
                          class="spinner-border spinner-border-sm"
                          v-if="acceptPay"
                        ></span>
                      </button>
                    </div>
                    <div
                      v-if="paymethod == 'online' || paymethod == 'both'"
                      class="d-flex justify-content-center"
                    >
                      <b-btn class="btn btn-primary" @click="modalPG"
                        >Pembayaran Atas Talian</b-btn
                      >
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="btn btn-primary mb-4"
                @click="sendVerification"
                v-if="btnNotification"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <span>
                    Hantar pengesahan kepada Penghibah
                    <small class="d-block" style="font-size: 8pt">
                      SMS: 0148220679</small
                    >
                    <small class="d-block" style="font-size: 8pt">
                      Email: penghibah1@yahoo.com</small
                    >
                  </span>
                  <img
                    src="/images/icon/direct.png"
                    alt=""
                    height="20"
                    class="pl-4"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="col-lg-12 col-12 mb-4 pb-2" v-if="userRole == 'Client'">
          <div
            class="card bg-light job-box rounded shadow border-0 overflow-hidden"
          >
            <div class="card-body">
              <h5 class="text-center mb-0">Deklarasi oleh Pemberi</h5>
              <div class="box-body mt-4" style="font-size: 10pt">
                <b>
                  A. SAYA DENGAN INI BERSETUJU DAN MENGAKU BAHAWA, SAYA PERCAYA
                  DAN FAHAM PERKARA TERSEBUT:
                </b>
                ><br />
                <table width="100%">
                  <tbody>
                    <tr>
                      <td width="2%" valign="top">a)</td>
                      <td width="98%" style="text-align: justify">
                        Butiran dan maklumat yang diberikan oleh saya dalam
                        borang permohonan ini bagi penubuhan Amanah, setelah
                        membuat semua pertanyaan yang munasabah, benar, lengkap
                        dan betul; saya akan memaklumkan Amanah Warisan Berhad
                        secara bertulis dengan serta-merta jika apa-apa maklumat
                        yang terkandung dalam permohonan ini tidak tepat atau
                        berubah dalam apa jua keadaan. Saya mengakui dan
                        mengesahkan Amanah Warisan Berhad boleh mempercayai
                        semua deklarasi ke atas identiti dan semua maklumat yang
                        berkenaan untuk penubuhan akaun amanah melalui
                        deklarasi.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">b)</td>
                      <td style="text-align: justify">
                        Saya bersetuju untuk memaklumkan Amanah Warisan Berhad
                        semua perubahan ke atas kediaman saya dan/atau
                        kewarganegaraan dan/atau Benefisiari dan mana-mana pihak
                        yang berkaitan Amanah.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">c)</td>
                      <td style="text-align: justify">
                        Saya mengesahkan apa-apa wang dan/atau lain-lain aset
                        yang dipindahkan sekarang atau pada bila-bila pada masa
                        akan datang ke dalam Amanah atau mana-mana syarikat
                        adalah milik saya atau akan menjadi milik saya.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">d)</td>
                      <td style="text-align: justify">
                        Saya mengesahkan bahawa apa-apa wang dan/atau aset lain
                        di dalam Amanah oleh Pemberi adalah bebas daripada
                        apa-apa tanggungjawab, caj atau bebanan.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">e)</td>
                      <td style="text-align: justify">
                        Saya mengesahkan bahawa saya tidak bankrap dan tidak ada
                        prosiding untuk pengisytiharan saya bankrap.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">f)</td>
                      <td style="text-align: justify">
                        Saya faham bahawa dengan memindahkan wang dan/atau
                        lain-lain aset ke dalam Tabung Amanah, saya memindahkan
                        pemilikan wang dan/atau aset lain kepada sesiapa yang
                        dilantik sebagai Pemegang Amanah untuk manfaat
                        Benefisiari.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">g)</td>
                      <td style="text-align: justify">
                        Saya beraku janji akan memberitahu Pemegang Amanah
                        melalui notis bertulis secepat mungkin dalam apa jua
                        cara, jika ada perubahan yang boleh menjejaskan struktur
                        Amanah.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">h)</td>
                      <td style="text-align: justify">
                        Saya faham bahawa Perancang Harta Islam adalah untuk
                        memudahkan urusan Amanah Warisan Berhad untuk menjadi
                        pemegang amanah berkenaan suatu amanah dinyatakan dan
                        saya dengan ini bersetuju dan memberi keizinan kepada
                        Amanah Warisan Berhad untuk mendapatkan butiran dan
                        maklumat saya dari Perancang Harta Islam (jika
                        berkenaan) mengenai semua aspek permohonan Amanah
                        sehingga permohonan selesai.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />

                <b>
                  B. DEKLARASI AKTA PENCEGAHAN PENGUBAHAN WANG HARAM, PENCEGAHAN
                  PEMBIAYAAN KEGANASAN DAN HASIL DARIPADA AKTIVITI HARAM 2001
                  (AMLA 2001) </b
                ><br />
                Ia adalah polisi AMANAH WARISAN BERHAD untuk mematuhi Program
                Pencegahan Pengubahan Wang Haram &amp; Pencegahan Pembiayaan
                Keganasan (AML/CFT) di bawah Akta Pencegahan Pengubahan Wang
                Haram, Pencegahan Pembiayaan Keganasan dan Hasil Daripada
                Aktiviti Haram 2001 (AMLA 2001), kaedah dan peraturan yang
                diselia oleh Bank Negara Malaysia di bawah Garis Panduan AML/CFT
                – Designated Non-Financial Business and Professions (DNFBPs)
                &amp; Other Non-Financial Sectors (Sector 5).<br />
                <table width="100%">
                  <tbody>
                    <tr>
                      <td width="2%" valign="top">a)</td>
                      <td width="98%" style="text-align: justify">
                        Saya mengesahkan bahawa penubuhan Amanah ini:
                      </td>
                    </tr>
                    <tr>
                      <td valign="top"></td>
                      <td style="text-align: justify">
                        i) tidak melibatkan dana daripada hasil jenayah sama ada
                        secara langsung atau tidak langsung, dan
                      </td>
                    </tr>
                    <tr>
                      <td valign="top"></td>
                      <td style="text-align: justify">
                        ii) tidak akan melanggar mana-mana undang-undang atau
                        peraturan dibawah AMLA 2001.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">b)</td>
                      <td style="text-align: justify">
                        Saya faham dan bersetuju bahawa Amanah termasuk dana dan
                        aset yang ditubuhkan dalam Amanah bukan dari dan tidak
                        akan digunakan untuk sebarang aktiviti yang menyalahi
                        undang-undang seperti:
                      </td>
                    </tr>
                    <tr>
                      <td valign="top"></td>
                      <td style="text-align: justify">
                        i) Menerima dan/atau mengedarkan hasil dari pengedaran
                        dadah, rasuah atau apa-apa aktiviti jenayah lain; dan
                      </td>
                    </tr>
                    <tr>
                      <td valign="top"></td>
                      <td style="text-align: justify">
                        ii) Melibatkan diri dalam apa-apa bentuk pengubahan wang
                        haram dan / atau pembiayaan keganasan.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">c)</td>
                      <td style="text-align: justify">
                        Saya memahami bahawa mengikut AMLA 2001, Amanah Warisan
                        Berhad tidak akan membenarkan kemudahan mereka digunakan
                        sebagai saluran untuk pengubahan wang haram atau
                        pembiayaan keganasan. Saya memberi jaminan kepada Amanah
                        Warisan Berhad bahawa saya akan berhati-hati agar tidak
                        membenarkan dana dan / atau mana-mana aset lain daripada
                        hasil aktiviti haram disalurkan melalui akaun amanah
                        saya.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <b>C. AKTA PERLINDUNGAN DATA PERIBADI 2010</b><br />
                <p style="text-align: justify">
                  Dengan menyempurnakan borang ini anda membenarkan maklumat
                  peribadi anda untuk digunakan oleh Amanah Warisan Berhad untuk
                  memberikan anda perkhidmatan Amanah Warisan Berhad yang
                  bersesuaian dengan anda. Maklumat peribadi yang diberikan oleh
                  anda akan digunakan untuk pentadbiran dan pengurusan
                  perkhidmatan yang diberikan kepada anda. Maklumat peribadi
                  anda boleh digunakan untuk memberi anda maklumat lanjut
                  mengenai produk dan perkhidmatan yang sesuai dengan anda
                  daripada Amanah Warisan Berhad.Maklumat tersebut adalah sulit
                  dan persendirian dan tidak akan dikemukakan kepada pihak
                  ketiga tanpa kebenaran anda Semua maklumat yang diberikan oleh
                  anda dalam borang ini adalah tepat, lengkap dan terkini.
                </p>
                <br />
                <div
                  class="custom-control custom-checkbox text-center"
                  v-if="!amendmentId"
                >
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck1"
                    v-model="acceptPdpa"
                    value="1"
                    @change="acceptPdpaFunc"
                  />
                  <label class="custom-control-label" for="customCheck1">
                    <strong>SAYA MEMAHAMI DEKLARASI DI ATAS</strong>
                  </label>
                </div>
                <div v-if="checkPdpa && !btnSetujuSign && trust">
                  <div
                    class="d-flex justify-content-center m-4"
                    v-if="[0, 1].includes(trust.status) || amendmentId"
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
                    v-if="[0, 1].includes(trust.status) || amendmentId"
                  >
                    <b-btn
                      v-if="!otpSent"
                      class="btn-sm btn-warning m-2"
                      @click="requestOtp"
                      >{{ btnotptext }}</b-btn
                    >
                  </div>
                  <div class="row d-flex justify-content-center">
                    <span v-if="otpSent"
                      ><small
                        >OTP telah dihantar ke nombor telefon bimbit
                        anda.</small
                      ></span
                    >
                  </div>
                </div>
                <div class="text-center" v-if="btnSetujuSign && !amendmentId">
                  <div class="card" style="width: 400px; display: inline-block">
                    <div class="signature-pad">
                      <VueSignaturePad
                        style="position: absolute; z-index: 1"
                        height="300px"
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
                          right: 0px;
                          left: 0px;
                          top: 45%;
                          color: #b6b6b4;
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4" v-if="!amendmentId">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <button @click="finish" type="button" class="btn btn-primary">
                Selesai
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="amendmentId && !checkPdpa"
          class="d-flex justify-content-around"
        >
          <b-button class="btn btn-primary m-1"> kembali </b-button>
          <b-button class="btn btn-primary m-1" type="button" @click="openotp">
            Hantar Permohonan
          </b-button>
        </div>
        <div
          v-if="amendmentId && otpSent"
          class="d-flex justify-content-center"
        >
          <b-button class="btn btn-primary m-1" @click="updateAmendmentStatus">
            Hantar
          </b-button>
        </div>
      </div>
    </div>
    <b-modal ref="modalPG" title="Jumlah Pembayaran" hide-footer>
      <div class="card-body">
        <div class="d-flex justify-content-center">
          <label class="label-agree-term" for="is_cash_payment">
            <strong>SAYA BERSETUJU DENGAN BAYARAN SEBANYAK</strong>
          </label>
        </div>
        <div class="d-flex justify-content-center">
          <label v-if="trustDetails">
            <strong>RM {{ trustDetails.price }}</strong>
          </label>
        </div>
      </div>

      <b-button class="btn btn-danger" block @click="paymentGateWay"
        >Setuju</b-button
      >
    </b-modal>
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