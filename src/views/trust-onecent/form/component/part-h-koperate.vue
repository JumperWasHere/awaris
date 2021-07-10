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
      signature: {
        public_path: null,
      },
      otpcomplete: false,
      amendment_id: null,
      acceptPdpa: false,
      checkPdpa: false,
      btnotptext: "MOHON OTP",
      btnSetujuSign: false,
      btnSendTOAwaris: false,
      isKoperate: null,
      submit: false,
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
      },
      updateStatus: {
        _method: "PATCH",
        status: 1,
        amendmentable_type: "Hibah",
      },
      verificationSent: false,
    };
  },
  mounted() {
    // if (this.amendmentId && this.amendment) {
    //   this.amendment_status = this.amendment[0].status;
    //   this.amendment_id = this.amendment[0].id;
    // }
    if (
      this.trust &&
      ![0, 1].includes(this.trust.status) &&
      !this.amendmentId
    ) {
      this.acceptPdpa = true;
    } else if (this.amendment && this.amendment.status != 0) {
      this.acceptPdpa = true;
    }
    this.getSignature();
  },

  methods: {
    // getamendment() {
    //   ApiService.get(`/amendment?hibah_id=${this.trustId}`)
    //     .then((response) => {
    //       // if(Array.isArray(response.data.amendments.data) && )
    //       var data_amendment = response.data.amendments.data;
    //       if (Array.isArray(data_amendment) && data_amendment.length > 0) {
    //         this.amendment_status = data_amendment[0].status;
    //         this.amendment_id = data_amendment[0].id;
    //         console.log("data_amendment", data_amendment);
    //       }

    //       // console.log(response.data.amendments.data);
    //     })
    //     .catch((error) => {});
    // },
    acceptPdpaFunc() {
      if (this.acceptPdpa == 1) {
        this.checkPdpa = true;
      } else {
        this.checkPdpa = false;
      }
    },
    backButton() {
      this.$router.push({
        name: "trust-onecent.part-listpindaan",
        query: { trust_id: this.trustId },
      });
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
      // if (this.userRole != "Client" && this.trust && this.trust.status == 1) {
      //   this.$swal.fire({
      //     icon: "error",
      //     html: "Hanya Penghibah sahaja boleh selesaikan proses ini.",
      //     showCloseButton: true,
      //     showCancelButton: false,
      //     focusConfirm: false,
      //     confirmButtonText: "Tutup",
      //   });
      //   return;
      // }
      if (!this.trust.status == 0) {
        this.$router.push({
          name: "dashboard",
        });
      } else if (this.trust.status == 0) {
        //if client yang open
        if (this.acceptPdpa != 1) {
          //check pdpa
          this.$swal.fire({
            icon: "error",
            html: "Sila tekan butang Deklarasi oleh Pemberi terlebih dahulu.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
        } else {
          if (!this.otpcomplete) {
            this.$swal.fire({
              icon: "error",
              html: "Sila masukkan OTP.",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
            return;
          }
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
            if (resultSign) {
              if (resultSign && this.trust.status == 0) {
                this.form.status = 2;
                this.form.is_cash_payment = 1;

                let resultHibah = await this.updateHibah();
                if (resultHibah) {
                  this.$router.push({
                    name: "dashboard",
                    query: {
                      statusHibah: "success",
                    },
                  });
                } else {
                  this.$swal.fire({
                    icon: "error",
                    html: "fail update",
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText: "Tutup",
                  });
                }
              }
            }
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
    async getSignature() {
      return await ApiService.get(
        `/hibah/${this.trustId}/signature?stream=false`
      )
        .then((response) => {
          console.log("getSignature", response.data);
          this.signature = response.data.signature;
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    async requestOtp() {
      if (this.btnotptext == "MOHON OTP") {
        //kelaur swal
        ApiService.post(`/sms/code`, {
          phone_number: this.trust.user.mobile_number,
        })
          .then((response) => {
            console.log(response.data);
            if (this.amendmentId) {
              this.otpSent = true;
            }
            this.btnotptext = "SAHKAN OTP";
          })
          .catch((error) => {});
      } else if (!this.amendmentId && this.btnotptext == "SAHKAN OTP") {
        await this.verifyOtp();
        this.otpSent = false;
      }
    },
    async verifyOtp() {
      return await ApiService.post(`/sms/verify`, {
        phone_number: this.trust.user.mobile_number,
        code: this.otpcode,
      })
        .then((response) => {
          console.log(response.data);
          this.btnSetujuSign = true;
          this.closeOTP = true;
          this.otpcomplete = true;
          this.btnSendTOAwaris = true;

          // this.$swal.fire({
          //   icon: "success",
          //   html: "Anda telah berjaya mengesahkan kod OTP.",
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
      this.otpcomplete = false;

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
          console.log(response.data);
          this.payment_received_at = response.data.hibah.payment_received_at;
          return true;
        })
        .catch((error) => {
          this.acceptPay = false;
          return false;
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
        ApiService.post(`/amendment/${this.amendmentId}`, this.updateStatus)
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
                this.$router.push({
                  name: "trust-onecent.part-listpindaan",
                  query: {
                    trust_id: this.trustId,
                    amendment_id: this.amendmentId,
                  },
                });
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

    amendmentId() {
      return this.$route.query.amendment_id;
    },
    displayAgreement() {
      // if (this.userRole == "Client") {
      //   return true;
      // } else if (this.trust && this.trust.status == 1 && !this.amendmentId) {
      //   return true;
      // } else if (
      //   this.trust &&
      //   this.trust.status == 2 &&
      //   this.userRole == "Client" &&
      //   !this.amendmentId
      // ) {
      //   return true;
      // } else if (
      //   this.trust &&
      //   [3, 4, 5].includes(this.trust.status)
      // ) {
      //   return true;

      // } else {
      return true;
      // }
    },
    checkBoxdisable() {
      if (this.amendment && this.amendment.status != 0) {
        return true;
      } else if (
        this.trust &&
        ![0, 1].includes(this.trust.status) &&
        !this.amendment
      ) {
        return true;
      } else {
        return false;
      }
    },
    displaySign() {
      if (
        this.trust &&
        this.userRole != "Client" &&
        this.amendment &&
        this.amendment.status == 1
      ) {
        return true;
      } else if (
        this.trust &&
        this.userRole == "Client" &&
        this.amendment &&
        [3, 4, 5].includes(this.amendment.status)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    amendment: {
      handler: function (val) {
        if (val && this.amendmentId) {
          console.log("amendment", val);
          this.amendment_status = val.status;
          this.amendment_id = val.id;
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
  },
};
</script>

<template>
  <div class="row">
    <div class="col-lg-12 col-12 mb-4 pb-2" v-if="displayAgreement">
      <div
        class="card bg-light job-box rounded shadow border-0 overflow-hidden"
      >
        <div class="card-body">
          <h5 class="text-center mb-0">Deklarasi oleh Pemberi</h5>
          <div class="box-body mt-4" style="font-size: 10pt">
            <b>
              A. SAYA DENGAN INI BERSETUJU DAN MENGAKU BAHAWA, SAYA PERCAYA DAN
              FAHAM PERKARA TERSEBUT:
            </b>
            <br /><br />
            <table width="100%">
              <tbody>
                <tr>
                  <td width="2%" valign="top">a)</td>
                  <td width="98%" style="text-align: justify">
                    Butiran dan maklumat yang diberikan oleh saya dalam borang
                    permohonan ini bagi penubuhan Amanah, setelah membuat semua
                    pertanyaan yang munasabah, benar, lengkap dan betul; saya
                    akan memaklumkan Amanah Warisan Berhad secara bertulis
                    dengan serta-merta jika apa-apa maklumat yang terkandung
                    dalam permohonan ini tidak tepat atau berubah dalam apa jua
                    keadaan. Saya mengakui dan mengesahkan Amanah Warisan Berhad
                    boleh mempercayai semua deklarasi ke atas identiti dan semua
                    maklumat yang berkenaan untuk penubuhan akaun amanah melalui
                    deklarasi.
                  </td>
                </tr>
                <tr>
                  <td valign="top">b)</td>
                  <td style="text-align: justify">
                    Saya bersetuju untuk memaklumkan Amanah Warisan Berhad semua
                    perubahan ke atas kediaman saya dan/atau kewarganegaraan
                    dan/atau Benefisiari dan mana-mana pihak yang berkaitan
                    Amanah.
                  </td>
                </tr>
                <tr>
                  <td valign="top">c)</td>
                  <td style="text-align: justify">
                    Saya mengesahkan apa-apa wang dan/atau lain-lain aset yang
                    dipindahkan sekarang atau pada bila-bila pada masa akan
                    datang ke dalam Amanah atau mana-mana syarikat adalah milik
                    saya atau akan menjadi milik saya.
                  </td>
                </tr>
                <tr>
                  <td valign="top">d)</td>
                  <td style="text-align: justify">
                    Saya mengesahkan bahawa apa-apa wang dan/atau aset lain di
                    dalam Amanah oleh Pemberi adalah bebas daripada apa-apa
                    tanggungjawab, caj atau bebanan.
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
                    Saya faham bahawa dengan memindahkan wang dan/atau lain-lain
                    aset ke dalam Tabung Amanah, saya memindahkan pemilikan wang
                    dan/atau aset lain kepada sesiapa yang dilantik sebagai
                    Pemegang Amanah untuk manfaat Benefisiari.
                  </td>
                </tr>
                <tr>
                  <td valign="top">g)</td>
                  <td style="text-align: justify">
                    Saya beraku janji akan memberitahu Pemegang Amanah melalui
                    notis bertulis secepat mungkin dalam apa jua cara, jika ada
                    perubahan yang boleh menjejaskan struktur Amanah.
                  </td>
                </tr>
                <tr>
                  <td valign="top">h)</td>
                  <td style="text-align: justify">
                    Saya faham bahawa Perancang Harta Islam adalah untuk
                    memudahkan urusan Amanah Warisan Berhad untuk menjadi
                    pemegang amanah berkenaan suatu amanah dinyatakan dan saya
                    dengan ini bersetuju dan memberi keizinan kepada Amanah
                    Warisan Berhad untuk mendapatkan butiran dan maklumat saya
                    dari Perancang Harta Islam (jika berkenaan) mengenai semua
                    aspek permohonan Amanah sehingga permohonan selesai.
                  </td>
                </tr>
              </tbody>
            </table>
            <br />

            <b style="text-align: justify">
              B. DEKLARASI AKTA PENCEGAHAN PENGUBAHAN WANG HARAM, PENCEGAHAN
              PEMBIAYAAN KEGANASAN DAN HASIL DARIPADA AKTIVITI HARAM 2001 (AMLA
              2001) </b
            ><br /><br />
            <p class="text-justify">
              Ia adalah polisi AMANAH WARISAN BERHAD untuk mematuhi Program
              Pencegahan Pengubahan Wang Haram &amp; Pencegahan Pembiayaan
              Keganasan (AML/CFT) di bawah Akta Pencegahan Pengubahan Wang
              Haram, Pencegahan Pembiayaan Keganasan dan Hasil Daripada Aktiviti
              Haram 2001 (AMLA 2001), kaedah dan peraturan yang diselia oleh
              Bank Negara Malaysia di bawah Garis Panduan AML/CFT – Designated
              Non-Financial Business and Professions (DNFBPs) &amp; Other
              Non-Financial Sectors (Sector 5).
            </p>
            <br />
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
                    i) Tidak melibatkan dana daripada hasil jenayah sama ada
                    secara langsung atau tidak langsung, dan
                  </td>
                </tr>
                <tr>
                  <td valign="top"></td>
                  <td style="text-align: justify">
                    ii) Tidak akan melanggar mana-mana undang-undang atau
                    peraturan dibawah AMLA 2001.
                  </td>
                </tr>
                <tr>
                  <td valign="top">b)</td>
                  <td style="text-align: justify">
                    Saya faham dan bersetuju bahawa Amanah termasuk dana dan
                    aset yang ditubuhkan dalam Amanah bukan dari dan tidak akan
                    digunakan untuk sebarang aktiviti yang menyalahi
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
                    sebagai saluran untuk pengubahan wang haram atau pembiayaan
                    keganasan. Saya memberi jaminan kepada Amanah Warisan Berhad
                    bahawa saya akan berhati-hati agar tidak membenarkan dana
                    dan / atau mana-mana aset lain daripada hasil aktiviti haram
                    disalurkan melalui akaun amanah saya.
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <b>C. AKTA PERLINDUNGAN DATA PERIBADI 2010</b><br /><br />
            <p style="text-align: justify">
              Dengan menyempurnakan borang ini anda membenarkan maklumat
              peribadi anda untuk digunakan oleh Amanah Warisan Berhad untuk
              memberikan anda perkhidmatan Amanah Warisan Berhad yang
              bersesuaian dengan anda. Maklumat peribadi yang diberikan oleh
              anda akan digunakan untuk pentadbiran dan pengurusan perkhidmatan
              yang diberikan kepada anda. Maklumat peribadi anda boleh digunakan
              untuk memberi anda maklumat lanjut mengenai produk dan
              perkhidmatan yang sesuai dengan anda daripada Amanah Warisan
              Berhad.Maklumat tersebut adalah sulit dan persendirian dan tidak
              akan dikemukakan kepada pihak ketiga tanpa kebenaran anda Semua
              maklumat yang diberikan oleh anda dalam borang ini adalah tepat,
              lengkap dan terkini.
            </p>
            <br />
            <div
              class="custom-control custom-checkbox text-center"
              v-if="!amendmentId || (amendment && amendment.status != 0)"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="customCheck1"
                v-model="acceptPdpa"
                :disabled="checkBoxdisable"
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
                v-if="(trust && [0, 1].includes(trust.status)) || amendmentId"
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
                v-if="(trust && [0, 1].includes(trust.status)) || amendmentId"
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
                    >OTP telah dihantar ke nombor telefon bimbit anda.</small
                  ></span
                >
              </div>
            </div>
            <div class="text-center" v-if="btnSetujuSign && !amendmentId">
              <div class="card" style="width: 100%; display: inline-block">
                <div style="position: relative; height: 300px; width: 100%">
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
                    style="position: absolute; right: 5px; top: 5px; z-index: 2"
                    @click="undo"
                  >
                    <img src="/images/icon/rubber.svg" height="20" alt />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-if="trust && trust.status != 0">
            <img
              :src="signature.public_path"
              alt
              srcset
              v-if="checkBoxdisable && signature.public_path"
              style="width: 130px"
              class="mt-3"
            />
            <div v-if="checkBoxdisable">
              [
              <strong v-html="trust.user_detail.name"></strong>]
            </div>
          </div>
        </div>
      </div>

      <div
        class="row mt-4"
        v-if="!amendmentId && trust && [0, 1].includes(trust.status)"
      >
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
        v-if="amendmentId && !checkPdpa && amendment && amendment.status == 0"
        class="d-flex justify-content-around"
      >
        <b-button class="btn btn-primary m-1" @click="backButton">
          Kembali
        </b-button>
        <b-button class="btn btn-primary m-1" type="button" @click="openotp">
          Hantar Permohonan
        </b-button>
      </div>
      <div v-if="amendmentId && otpSent" class="d-flex justify-content-center">
        <b-button class="btn btn-primary m-1" @click="updateAmendmentStatus">
          Hantar
        </b-button>
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