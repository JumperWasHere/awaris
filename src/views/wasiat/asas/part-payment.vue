<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      wasiat: {},
      form: {
        is_cash_payment: 0,
      },
      receipt: {
        image: null,
        imageUrl: null,
        imageType: null,
        imageUrlDisplay: null,
      },
      submit: false,
      Url_Generated: null,
      payment_received_at: null,
      acceptPay: false,
      payment_options_id: null,
      is_payment_verified: null,
      is_cash_payment: 0,
      organization: {
        allow_payment_gateway: 0,
        allow_cash_payment: 0,
        allow_direct_payment: 0,
        allow_loan_payment: 0,
      },
      organization_id: null,
      dropdownItems: [],
    };
  },
  components: {},
  props: {
    receiptShow: {
      type: Object,
    },
  },
  methods: {
    async onSubmit() {
      this.$router.push({
        name: "wasiat.part_b",
        query: {
          wasiat_id: this.wasiatId,
          pengesahan: this.pengesahan,
        },
      });
    },
    async getWasiat() {
      return await ApiService.get(`/wasiat/${this.wasiatId}`).then(
        (response) => {
          var wasiat = response.data.wasiat;
          if (wasiat) {
            this.wasiat = wasiat;
            this.organization_id = wasiat.organization_id;
            this.payment_received_at = wasiat.payment_received_at;
            this.payment_options_id = wasiat.payment_options_id;
            console.log("wasiat", wasiat);
          }
          return wasiat;
        }
      );
    },
    async updateWasiat() {
      this.form._method = "PATCH";
      return await ApiService.post(`/wasiat/${this.wasiatId}`, this.form)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.submit = false;
          return false;
        });
    },
    //

    async getOrganization() {
      return await ApiService.get(`organization/${this.organization_id}`).then(
        (response) => {
          this.organization = response.data.organization ?? {};
          this.organization_type = response.data.organization.type;
          console.log("organization_type", this.organization_type);

          this.allow_payment_gateway =
            response.data.organization.allow_payment_gateway;
          this.allow_cash_payment =
            response.data.organization.allow_cash_payment;
          this.allow_direct_payment =
            response.data.organization.allow_direct_payment;
            this.allow_loan_payment =
            response.data.organization.allow_loan_payment;
        }
      );
    },

    // Payment Method 1
    modalPG() {
      this.$refs["modalPG"].show();
    },
    copyPaymentGatewayCode() {
      let urlCodeToCopy = document.querySelector("#url-code");
      urlCodeToCopy.setAttribute("type", "text");
      urlCodeToCopy.select();
      var successful = document.execCommand("copy");
    },
    async paymentGateWay() {
      await this.updatePaymentGateWay();
      var url =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        "/wasiat/part-payment?wasiat_id=" +
        this.wasiatId;
      var pay = {
        user_id: this.wasiat.user_id,
        title: "Register Wasiat Payment",
        amount: this.wasiat.price,
        type: "Wasiat",
        description: "pay wasiat register",
        redirect_url: url,
        paymentable_id: this.wasiat.id,
        paymentable_type: "Wasiat",
        payment_options_id: 1,
      };
      console.log(pay);
      ApiService.post(`payment`, pay)
        .then((response) => {
          var link = response.data.payment.payment_link;
          window.location.replace(link);

          console.log(link);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updatePaymentGateWay() {
      await this.updateWasiat();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        payment_options_id: 1,
      })
        .then((response) => {
          this.payment_received_at = response.data.wasiat.payment_received_at;
        })
        .catch((error) => {
          this.acceptPay = false;
        });
    },

    async generatePaymentGateWayURL() {
      await this.updatePaymentGateWayURL();
      var url =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        "/payment-status";
      var pay = {
        user_id: this.wasiat.user_id,
        title: "Register Wasiat Payment",
        amount: this.wasiat.price,
        type: "Wasiat",
        description: "pay wasiat register",
        redirect_url: url,
        paymentable_id: this.wasiat.id,
        paymentable_type: "Wasiat",
        payment_options_id: 1,
      };
      console.log("generatePaymentGateWayURL", pay);
      ApiService.post(`payment`, pay)
        .then((response) => {
          var link = response.data.payment.payment_link;
          this.Url_Generated = link;
          console.log(link);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updatePaymentGateWayURL() {
      await this.updateWasiat();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        payment_options_id: 1,
      })
        .then((response) => {
          this.payment_received_at = response.data.wasiat.payment_received_at;
        })
        .catch((error) => {
          this.acceptPay = false;
        });
    },
    async emailClientCreate() {
      return await ApiService.get(
        `user/${this.wasiat.user_id}/email-client-created`
      )
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.submit = false;
          return false;
        });
    },
    showReceipt() {
      if (this.wasiat && ![0, 1, 2].includes(this.wasiat.status)) {
        window.open(this.receiptShow.imageUrl, "_blank");
      } else {
        window.open(this.receipt.imageUrl, "_blank");
      }
    },

    // Payment Method 2
    async filesChange(files, type) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");

      this.receipt.image = files[0];
      this.receipt.imageType = type;
      console.log(files[0].type);
      this.receipt.imageUrl = URL.createObjectURL(files[0]);

      if (!["image/jpeg", "image/gif", "image/png"].includes(files[0].type)) {
        this.receipt.imageUrlDisplay = "/images/logo/iconAttachement.jpg";
      } else {
        this.receipt.imageUrlDisplay = URL.createObjectURL(files[0]);
      }
    },
    async registerDoc(files, other) {
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
        `/wasiat/${this.wasiatId}/document?action=replace`,
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
    getDocuments(wasiatId) {
      ApiService.get(`/wasiat/${this.wasiatId}/document`)
        .then((response) => {
          console.log("array document");
          this.receipt = response.data.attachments.data;
          this.receipt.imageUrl = receipt[0].public_path;
        })
        .catch((error) => {
          console.log("get document");
        });
    },
    async receiptSubmit() {
      await this.updateDirectPayment();
      if (this.receipt.image) {
        const formData = new FormData();
        formData.append("type", "payment");
        formData.append("document", this.receipt.image, "nama file");

        return await ApiService.post(
          `/wasiat/${this.wasiatId}/document`,
          formData
        )
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              html:
                "Bukti resit pembayaran telah berjaya dihantar dan sedang menunggu pengesahan AWARIS.",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        return true;
      }
    },
    async getDocument() {
      ApiService.get(`/wasiat/${this.wasiatId}/document`)
        .then((response) => {
          var filter = response.data.attachments.data.filter(
            (item) => item.type == "payment"
          );
          if (
            !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
              filter[0].mime_type
            )
          ) {
            this.receipt.imageUrlDisplay = "/images/logo/iconAttachement.jpg";
          } else {
            this.receipt.imageUrlDisplay = filter[0].public_path;
          }
          this.receipt.imageUrl = filter[0].public_path;

          console.log("getDocument", this.receipt.imageUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateDirectPayment() {
      await this.updateWasiat();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        payment_options_id: 2,
      })
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.acceptPay = false;
        });
    },
    async approveReceipt() {
      await this.updateWasiat();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        is_cash_payment: 1,
        is_payment_verified: 1,
        payment_options_id: 2,
      }).then((response) => {
        this.payment_received_at = response.data.wasiat.payment_received_at;
        console.log("payment_received_at", this.payment_received_at);

        this.$swal.fire({
          icon: "success",
          html: "Anda telah mengesahkan bukti resit pembayaran!",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      });
    },
    openToView() {
      window.open(this.receipt.imageUrl, "_blank");
    },

    // Payment Method 3
    async updateCashPayment() {
      await this.updateWasiat();
      this.acceptPay = true;
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        is_cash_payment: 1,
        is_payment_verified: 1,
        payment_options_id: 3,
      })
        .then((response) => {
          this.payment_received_at = response.data.wasiat.payment_received_at;
          this.$swal.fire({
            icon: "success",
            html: "Pembayaran selesai!",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        })
        .catch((error) => {
          this.acceptPay = false;
        });
    },

    // Payment Method 4
    async updateLoanPayment() {
      await this.updateWasiat();
      this.acceptPay = true;
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        is_cash_payment: 1,
        is_payment_verified: 1,
        payment_options_id: 4,
      })
        .then((response) => {
          this.payment_received_at = response.data.wasiat.payment_received_at;
          this.$swal.fire({
            icon: "success",
            html: "Pembayaran selesai!",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        })
        .catch((error) => {
          this.acceptPay = false;
        });
    },
    showAlert() {
      this.$swal
        .fire({
          icon: "success",
          text:
            "Notifikasi telahpun dihantar, adakah anda ingin menghantar sekali lagi?",
          showDenyButton: true,
          confirmButtonText: `Hantar`,
          denyButtonText: `Batal`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            ApiService.get(`/wasiat/${this.wasiatId}/paid-notification`);
          }
        });
    },
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    userId() {
      return this.$route.params.user_id;
    },
    organizationId() {
      return this.userAccess.organization_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    paymentStatus() {
      return this.$route.query.status;
    },
    userAccessCheck() {
      return this.userAccess;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
  },
  watch: {
    // userAccessCheck: {
    //   handler: function (val) {
    //     console.log("WATCHER", val);
    //     if (val) {
    //       this.getPaymentMethod(val);
    //     } else {
    //       this.paymethod = "online";
    //     }
    //   },
    // },

    wasiat: {
      handler: function (val) {
        if (val.status == -1) {
          this.$router.push({
            name: "wasiat.part_c",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
      },
    },
  },
  async mounted() {
    if (!this.$route.query.wasiat_id) {
      this.$router.push({ name: "wasiat.part_a" });
    }
    if (this.wasiatId) {
      let wasiat = await this.getWasiat();
      await this.getDocument();
      if (wasiat) {
        if (this.userRole == "Client") {
          this.dropdownItems.push({
            id: 1,
            value: "Gerbang Bayaran",
          });
        } else {
          await this.getOrganization();
          if (this.organization.allow_payment_gateway) {
            this.dropdownItems.push({
              id: 1,
              value: "Gerbang Bayaran",
            });
          }
          if (this.organization.allow_direct_payment) {
            this.dropdownItems.push({
              id: 2,
              value: "Bayaran Terus",
            });
          }
          if (this.organization.allow_cash_payment) {
            this.dropdownItems.push({
              id: 3,
              value: "Bayaran Tunai",
            });
          }
          if (this.organization.allow_loan_payment) {
            this.dropdownItems.push({
              id: 4,
              value: "Bayaran Pembiayaan",
            });
          }
        }
      }
    } else {
      this.$router.push({
        name: "wasiat.part_a",
      });
    }
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row" v-if="userRole != 'Client' && [0].includes(wasiat.status)">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("payment") }}
            </h5>
            <!-- Select payment -->
            <div
              class="row mb-2 mt-4"
              v-if="[0].includes(wasiat.status) && payment_received_at == null"
            >
              <div class="col-md-12 form-group text-center" v-if="!pengesahan">
                <label for="organization_id">Cara Pembayaran</label>
                <select id class="form-control" v-model="payment_options_id">
                  <option
                    :value="dropdownItem.id"
                    v-for="(dropdownItem, index) in dropdownItems"
                    :key="index"
                  >
                    {{ dropdownItem.value }}
                  </option>
                </select>
              </div>
            </div>
            <hr />
            <!-- Payment options id=1 -->
            <div
              class="row mb-2 mt-4"
              v-if="
                payment_options_id == '1' && userRole != 'Client' && !pengesahan
              "
            >
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_received_at == null"
              >
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div
                  class="alert alert-info"
                  v-if="[0].includes(wasiat.status)"
                >
                  Sila jana pautan dan kongsikan kepada pewasiat untuk membuat
                  bayaran.
                  <div class="text-center mt-4">
                    <b-button
                      class="btn-sm btn-primary"
                      @click="generatePaymentGateWayURL"
                      >Jana Pautan</b-button
                    >
                  </div>
                  <div class="input-group mt-3">
                    <input
                      type="text"
                      class="form-control"
                      readonly
                      placeholder="Pautan untuk dikongsi"
                      aria-label="Text input with checkbox"
                      v-model.trim="Url_Generated"
                      id="url-code"
                    />
                    <div class="input-group-append">
                      <b-button
                        class="btn-sm btn-secondary"
                        @click="copyPaymentGatewayCode"
                      >
                        Salin
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_received_at"
              >
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
              </div>
              <div class="col-md-12 text-center" v-if="payment_received_at">
                <router-link
                  class="btn btn-primary"
                  target="_blank"
                  :to="{
                    name: 'wasiat.receipt',
                    params: { wasiat_id: this.wasiatId },
                  }"
                  >Cetak Resit</router-link
                >
              </div>
            </div>

            <!-- Payment options id=2 -->
            <div
              class="row mb-2 mt-4"
              v-if="payment_options_id == '2' && wasiat.status == 0"
            >
              <div class="col-md-12 form-group text-center">
                <label for="2 "
                  ><u
                    >Pembayaran Offline 1 (Bayaran Pewasiat kepada AWARIS)</u
                  ></label
                >
                <div class="row" v-if="payment_received_at == null">
                  <div class="col-md-12 text-center">
                    <p>
                      Sila muat naik bukti resit pembayaran sebanyak
                      <strong>RM{{ wasiat.price }}</strong
                      >. <br />
                      Setelah muat naik, sila tekan butang Simpan & Seterusnya.
                    </p>

                    <div class="row d-flex justify-content-center">
                      <div class="form-group">
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
                                'background-image: url(' +
                                receipt.imageUrlDisplay +
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
                              v-if="!receipt.imageUrl"
                            >
                              <span>Pilih Salinan</span>
                            </label>
                            <input
                              type="file"
                              name="photo"
                              id="upload-photo-2"
                              class="upload-photo-input"
                              accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                              @change="
                                filesChange($event.target.files, 'receipt')
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 text-center" v-if="receipt.imageUrl">
                    <div class="d-flex justify-content-center">
                      <b-button
                        class="btn btn-primary m-1"
                        @click="receiptSubmit"
                      >
                        Hantar
                      </b-button>
                      <b-button class="btn btn-primary m-1" @click="openToView">
                        {{ $t("view") }}
                      </b-button>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="payment_received_at">
                  <div class="col-md-12 text-center">
                    <div class="alert alert-info">
                      Pembayaran wasiat bernilai RM{{ wasiat.price }} telah
                      berjaya dibuat.
                    </div>
                  </div>
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment options id=3 -->
            <div
              class="row mb-2 mt-4"
              v-if="[0].includes(wasiat.status) && payment_options_id == '3'"
            >
              <div class="col-md-12 form-group text-center">
                <label for="3"
                  ><u
                    >Pembayaran Offline 2 (Bayaran Pewasiat kepada Agensi, Bank,
                    dan sebagainya)</u
                  ></label
                >
                <div
                  class="row"
                  v-if="
                    [0].includes(wasiat.status) && payment_received_at == null
                  "
                >
                  <div class="col-md-12 text-center">
                    <p>
                      Sila tekan butang dibawah setelah menerima pembayaran.
                    </p>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="
                    [0].includes(wasiat.status) && payment_received_at == null
                  "
                >
                  <div class="col-md-12 text-center">
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
                          SAYA TERIMA WANG RM<span>{{ wasiat.price }}</span>
                        </strong>
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="
                    [0].includes(wasiat.status) && payment_received_at == null
                  "
                >
                  <div class="col-md-12 text-center">
                    <b-button class="btn btn-primary" @click="updateCashPayment"
                      >Terima Bayaran
                      <span
                        class="spinner-border spinner-border-sm"
                        v-if="acceptPay"
                      ></span>
                    </b-button>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="[0].includes(wasiat.status) && payment_received_at"
                >
                  <div class="col-md-12 text-center">
                    <div class="card-body">
                      <div class="alert alert-info">
                        Bayaran telah diterima sebanyak
                        <strong>RM{{ wasiat.price }}</strong>
                      </div>
                      <div class="row">
                        <div
                          class="col-md-12 d-flex justify-content-around"
                          v-if="userRole == 'Staff' && 'Agent'"
                        >
                          <button
                            type="button"
                            @click="showAlert"
                            class="btn btn-primary"
                          >
                            Hantar Notifikasi Pembayaran
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment options id=4 -->
            <div
              class="row mb-2 mt-4"
              v-if="[0].includes(wasiat.status) && payment_options_id == '4'"
            >
              <div class="col-md-12 form-group text-center">
                <label for="3"
                  ><u
                    >Pembayaran Pembiayaan</u
                  ></label
                >
                <div
                  class="row"
                  v-if="
                    [0].includes(wasiat.status) && payment_received_at == null
                  "
                >
                  <div class="col-md-12 text-center">
                    <p>
                      Sila tekan butang di bawah untuk dimasukkan bersama-sama pembiayaan anda.
                    </p>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="
                    [0].includes(wasiat.status) && payment_received_at == null
                  "
                >
                  <div class="col-md-12 text-center">
                    <b-button class="btn btn-primary" @click="updateLoanPayment"
                      >Mohon
                      <span
                        class="spinner-border spinner-border-sm"
                        v-if="acceptPay"
                      ></span>
                    </b-button>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="[0].includes(wasiat.status) && payment_received_at"
                >
                  <div class="col-md-12 text-center">
                    <div class="alert alert-info">
                      Bayaran akan dibiayai sebanyak
                      <strong>RM{{ wasiat.price }}</strong>
                    </div>
                  </div>
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- START ROLE CLIENT -->
    <div class="row" v-if="userRole == 'Client'">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("payment") }}
            </h5>
            <!-- Not making payment yet -->
            <div class="row mb-2 mt-2" v-if="[0].includes(wasiat.status)">
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_received_at == null"
              >
                <label for="organization_id">Cara Pembayaran</label>
                <select
                  id="payment_options"
                  class="form-control"
                  v-model="payment_options_id"
                >
                  <option value="-">-- Sila pilih --</option>
                  <option value="1">{{ $t("payment-gateway") }}</option>
                </select>
              </div>
            </div>
            <hr />
            <!-- Button to make payment -->
            <div
              class="row mb-2 mt-4"
              v-if="[0].includes(wasiat.status) && payment_options_id == 1"
            >
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_received_at == null"
              >
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div class="alert alert-info">
                  Sila tekan butang dibawah untuk membuat bayaran.
                  <div class="col-md-12 text-center mt-4">
                    <b-button class="btn btn-primary" @click="modalPG">{{
                      $t("online-payment")
                    }}</b-button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Status payment gateway success -->
            <div
              class="row mb-2 mt-4"
              v-if="
                [0].includes(wasiat.status) &&
                payment_options_id == 1 &&
                paymentStatus
              "
            >
              <div
                class="col-md-12 form-group text-center"
                v-if="paymentStatus == 1"
              >
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
              </div>
            </div>
            <!-- Status payment gateway failed -->
            <div
              class="row"
              v-if="
                [0].includes(wasiat.status) &&
                payment_options_id == 1 &&
                paymentStatus
              "
            >
              <div class="col-md-12 form-group text-center">
                <div class="alert alert-info" v-if="paymentStatus != 1">
                  Harap maaf. <br />Pembayaran wasiat anda telah gagal. <br />
                  Sila cuba lagi.
                </div>
              </div>
            </div>

            <!-- Wasiat Batal -->
            <div
              class="row mb-2 mt-2"
              v-if="[0].includes(wasiat.status) && payment_received_at"
            >
              <div class="col-md-12 form-group text-center">
                <label for="1" v-if="payment_options_id == 1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <label for="1" v-if="payment_options_id == 2"
                  ><u
                    >Pembayaran Offline 1 (Bayaran Pewasiat kepada AWARIS)</u
                  ></label
                >
                <label for="1" v-if="payment_options_id == 3"
                  ><u
                    >Pembayaran Offline 2 (Bayaran Pewasiat kepada Agensi, Bank,
                    dan sebagainya)</u
                  ></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Wasiat Status=2 & payment_options_id=1 -->
            <div
              class="row mb-2 mt-4"
              v-if="[2].includes(wasiat.status) && payment_options_id == 1"
            >
              <div class="col-md-12 form-group text-center">
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div class="alert alert-info" v-if="payment_received_at">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
                <div class="alert alert-info" v-if="!payment_received_at">
                  Pembayaran wasiat gagal.
                </div>
              </div>
            </div>
            <!-- Wasiat Status=2 & payment_options_id=2 -->
            <div
              class="row"
              v-if="[2].includes(wasiat.status) && payment_options_id == 2"
            >
              <div class="col-md-12 form-group text-center">
                <label for="2"
                  ><u
                    >Pembayaran Offline 1 (Bayaran Pewasiat kepada AWARIS)</u
                  ></label
                >
                <div class="row">
                  <div class="col-md-12 text-center">
                    <div class="row d-flex justify-content-center">
                      <div class="form-group" style="width: 40%">
                        <label for="upload-photo-2"> Bukti Pembayaran </label>
                        <div class="card rounded shadow bg-dark">
                          <div
                            class="d-flex align-items-center justify-content-center bd-highlight"
                            style="height: 150px"
                          >
                            <label
                              v-if="receipt.imageUrl"
                              :style="
                                'background-image: url(' +
                                receipt.imageUrlDisplay +
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
                          </div>
                        </div>
                        <b-button
                          class="mt-2 btn-sm btn-primary"
                          @click="showReceipt"
                        >
                          Lihat
                        </b-button>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <div
                        class="col-md-12 text-center"
                        v-if="payment_received_at"
                      >
                        <router-link
                          class="btn btn-primary"
                          target="_blank"
                          :to="{
                            name: 'wasiat.receipt',
                            params: { wasiat_id: this.wasiatId },
                          }"
                          >Cetak Resit</router-link
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Wasiat Status=2 & payment_options_id=3 -->
            <div
              class="row mb-2 mt-4"
              v-if="[2].includes(wasiat.status) && payment_options_id == 3"
            >
              <div class="col-md-12 form-group text-center">
                <label for="3"
                  ><u
                    >Pembayaran Offline 2 (Bayaran Pewasiat kepada Agensi, Bank,
                    dan sebagainya)</u
                  ></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- Wasiat Status=2 & payment_options_id=4 -->
            <div
              class="row mb-2 mt-4"
              v-if="[2].includes(wasiat.status) && payment_options_id == 4"
            >
              <div class="col-md-12 form-group text-center">
                <label for="3"
                  ><u
                    >Pembayaran Pembiayaan</u
                  ></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} akan dimasukkan dalam pembiayaan anda.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FINISH ROLE CLIENT -->

    <!-- START PENGESAHAN STAFF STATUS=1 -->
    <div class="row" v-if="[1].includes(wasiat.status) && userRole == 'Staff'">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("payment") }}
            </h5>
            <hr />
            <div class="row mb-2 mt-4">
              <!-- Payment options id=1 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 1 && payment_received_at"
              >
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center" v-if="payment_received_at">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 1 && !payment_received_at"
              >
                <div class="alert alert-info">Pembayaran wasiat gagal.</div>
              </div>
              <!-- Payment options id=2 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 2"
              >
                <label for="2"
                  ><u
                    >Pembayaran Offline 1 (Bayaran Pewasiat kepada AWARIS)</u
                  ></label
                >
                <div class="row">
                  <div class="col-md-12 text-center">
                    <div class="row d-flex justify-content-center">
                      <div class="form-group" style="width: 40%">
                        <label for="upload-photo-2"> Bukti Pembayaran </label>
                        <div class="card rounded shadow bg-dark">
                          <div
                            class="d-flex align-items-center justify-content-center bd-highlight"
                            style="height: 150px"
                          >
                            <label
                              v-if="receipt.imageUrl"
                              :style="
                                'background-image: url(' +
                                receipt.imageUrlDisplay +
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
                              v-if="!receipt.imageUrl"
                            >
                              <span>Pilih Salinan</span>
                            </label>
                            <input
                              type="file"
                              name="photo"
                              id="upload-photo-2"
                              class="upload-photo-input"
                              accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                              @change="
                                filesChange($event.target.files, 'receipt')
                              "
                            />
                          </div>
                        </div>
                        <b-button
                          v-if="!payment_received_at"
                          class="m-2 btn btn-sm btn-primary"
                          @click="receiptSubmit"
                        >
                          Hantar
                        </b-button>
                        <b-button
                          class="m-2 btn btn-sm btn-primary"
                          @click="showReceipt"
                        >
                          Lihat
                        </b-button>
                      </div>
                    </div>
                    <div
                      class="row mt-2"
                      v-if="userRole == 'Staff' && pengesahan"
                    >
                      <div
                        class="col-md-12 text-center"
                        v-if="payment_received_at == null"
                      >
                        <b-button
                          class="btn btn-success mr-1"
                          @click="approveReceipt"
                          >Sahkan</b-button
                        >
                      </div>
                    </div>
                    <div class="row d-flex justify-content-center">
                      <div
                        class="col-md-12 text-center"
                        v-if="payment_received_at"
                      >
                        <router-link
                          class="btn btn-primary"
                          target="_blank"
                          :to="{
                            name: 'wasiat.receipt',
                            params: { wasiat_id: this.wasiatId },
                          }"
                          >Cetak Resit</router-link
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Payment options id=3 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 3"
              >
                <label for="3"
                  ><u
                    >Pembayaran Offline 2 (Bayaran Pewasiat kepada Agensi, Bank,
                    dan sebagainya)</u
                  ></label
                >
                <div class="alert alert-info" v-if="payment_received_at">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center" v-if="payment_received_at">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
              <!-- Payment options id=4 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 4"
              >
                <label for="3"
                  ><u
                    >Pembayaran Pembiayaan</u
                  ></label
                >
                <div class="alert alert-info" v-if="payment_received_at">
                  Bayaran akan dibiayai sebanyak RM{{ wasiat.price }}
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center" v-if="payment_received_at">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FINISH PENGESAHAN STAFF STATUS=1 -->

    <!-- START VIEW STAFF STATUS=2 -->
    <div class="row" v-if="[2].includes(wasiat.status) && userRole == 'Staff'">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("payment") }}
            </h5>
            <hr />
            <div class="row mb-2 mt-4">
              <!-- Payment options id=1 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 1 && payment_received_at"
              >
                <label for="1"
                  ><u>{{ $t("payment-gateway") }}</u></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
              <!-- Payment options id=2 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 2"
              >
                <label for="2"
                  ><u
                    >Pembayaran Offline 1 (Bayaran Pewasiat kepada AWARIS)</u
                  ></label
                >
                <div class="row">
                  <div class="col-md-12 text-center">
                    <div class="row d-flex justify-content-center">
                      <div class="form-group" style="width: 40%">
                        <label for="upload-photo-2"> Bukti Pembayaran </label>
                        <div class="card rounded shadow bg-dark">
                          <div
                            class="d-flex align-items-center justify-content-center bd-highlight"
                            style="height: 150px"
                          >
                            <label
                              v-if="receipt.imageUrl"
                              :style="
                                'background-image: url(' +
                                receipt.imageUrlDisplay +
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
                          </div>
                        </div>
                        <b-button
                          class="mt-2 btn-sm btn-primary"
                          @click="showReceipt"
                        >
                          Lihat
                        </b-button>
                      </div>
                    </div>
                    <div class="row d-flex justify-content-center">
                      <div
                        class="col-md-12 text-center"
                        v-if="payment_received_at"
                      >
                        <router-link
                          class="btn btn-primary"
                          target="_blank"
                          :to="{
                            name: 'wasiat.receipt',
                            params: { wasiat_id: this.wasiatId },
                          }"
                          >Cetak Resit</router-link
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Payment options id=3 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 3 && payment_received_at"
              >
                <label for="3"
                  ><u
                    >Pembayaran Offline 2 (Bayaran Pewasiat kepada Agensi, Bank,
                    dan sebagainya)</u
                  ></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} telah berjaya
                  dibuat.
                </div>
                <div class="row d-flex justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
              <!-- Payment options id=4 -->
              <div
                class="col-md-12 form-group text-center"
                v-if="payment_options_id == 4 && payment_received_at"
              >
                <label for="3"
                  ><u
                    >Pembayaran Pembiayaan</u
                  ></label
                >
                <div class="alert alert-info">
                  Pembayaran wasiat bernilai RM{{ wasiat.price }} akan dimasukkan dalam pembiayaan.
                </div>
                <div class="row d-flex justify-content-center">
                  <div class="col-md-12 text-center">
                    <router-link
                      class="btn btn-primary"
                      target="_blank"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiatId },
                      }"
                      >Cetak Resit</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FINISH VIEW STATUS 2 STAFF -->
    <div class="row">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <button @click="onSubmit" class="btn btn-primary" type="button">
            {{ $t("next") }}
          </button>
        </div>
      </div>
    </div>
    <!-- Modal payment gateway -->
    <b-modal
      ref="modalPG"
      title="Jumlah Pembayaran"
      :no-enforce-focus="true"
      hide-footer
    >
      <div class="card-body">
        <div class="d-flex justify-content-center">
          <label class="label-agree-term">
            <strong>SAYA BERSETUJU DENGAN BAYARAN SEBANYAK</strong>
          </label>
        </div>
        <div class="d-flex justify-content-center">
          <label>
            <strong>RM{{ wasiat.price }}</strong>
          </label>
        </div>
      </div>

      <b-button class="btn btn-danger" block @click="paymentGateWay">{{
        $t("agree")
      }}</b-button>
    </b-modal>
  </div>
</template>
