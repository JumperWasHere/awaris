<script>
import ApiService from "@/services/api.service";
import { ArrowUpIcon } from "vue-feather-icons";
import { mapGetters } from "vuex";
import { WASIAT } from "@/services/store/wasiat.module";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      form: {
        rejected_reason: null,
      },
      is_bmmb: false,
      optionDelete: null,
      part_a: true,
      part_b: true,
      part_c: true,
      part_d: true,
      part_e: true,
      part_f: true,
      part_g: true,
      part_h: true,
    };
  },
  watch: {
    wasiat: {
      handler: function (val) {
        console.log("watch", val);
        if (val) {
          if (val.organization_id) {
            this.CheckOrganization(val.organization_id);
            console.log("val.organization_id", val.organization_id);
          }
          console.log("val.organization_id", val.organization_id);

          if (val.status == -1) {
            this.part_a = true;
            this.part_b = true;
            this.part_c = false;
            this.part_d = false;
            this.part_e = false;
            this.part_f = false;
            this.part_g = false;
            this.part_h = false;
            return;
          }
          if (!val.payment_received_at && !val.payment_options_id) {
            this.part_a = true;
            this.part_b = true;
            this.part_c = true;
            this.part_d = false;
            this.part_e = false;
            this.part_f = false;
            this.part_g = false;
            this.part_h = false;
            return;
          }
          if (!val.payment_options_id) {
            this.part_a = true;
            this.part_b = true;
            this.part_c = true;
            this.part_d = true;
            this.part_e = false;
            this.part_f = false;
            this.part_g = false;
            this.part_h = false;
            return;
          }
          if (!val.user.name) {
            this.part_a = true;
            this.part_b = true;
            this.part_c = true;
            this.part_d = true;
            this.part_e = true;
            this.part_f = false;
            this.part_g = false;
            this.part_h = false;
            return;
          }
          if (!val.heir) {
            this.part_a = true;
            this.part_b = true;
            this.part_c = true;
            this.part_d = true;
            this.part_e = true;
            this.part_f = true;
            this.part_g = false;
            this.part_h = false;
            return;
          }
          this.part_a = true;
          this.part_b = true;
          this.part_c = true;
          this.part_d = true;
          this.part_e = true;
          this.part_f = true;
          this.part_g = true;
          this.part_h = true;
        }
      },
    },
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
  },
  computed: {
    ...mapGetters(["userRole", "wasiat"]),
    optionDeleteDisplay() {
      return this.wasiat.option_delete_id;
    },
    wasiatPart() {
      if (this.$route.name == "wasiat.part_a") {
        return 1;
      } else if (this.$route.name == "wasiat.part_c") {
        return 2;
      } else if (this.$route.name == "wasiat.part_payment") {
        return 3;
      } else if (this.$route.name == "wasiat.part_b") {
        return 4;
      } else if (this.$route.name == "wasiat.part_d") {
        return 5;
      } else if (this.$route.name == "wasiat.part_e") {
        return 6;
      } else if (this.$route.name == "wasiat.part_f") {
        return 7;
      } else if (this.$route.name == "wasiat.part_g") {
        return 8;
      }
    },

    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    certUrl() {
      return (
        process.env.VUE_APP_API_URL +
        `/wasiat/${this.wasiatId}/certificate/final`
      );
    },
  },
  mounted() {
    if (this.wasiatId) {
      console.log("mounted");

      console.log("wasiatId", this.wasiatId);
      this.$store.dispatch(WASIAT, this.wasiatId);
      console.log("sidebar ");
      this.part_b = false;
      this.part_c = false;
      this.part_d = false;
      this.part_e = false;
      this.part_f = false;
      this.part_g = false;
      this.part_h = false;
    }
    if (!this.wasiatId) {
      this.part_b = false;
      this.part_c = false;
      this.part_d = false;
      this.part_e = false;
      this.part_f = false;
      this.part_g = false;
      this.part_h = false;
    }
  },
  methods: {
    async CheckOrganization(organizationId) {
      ApiService.get(`/organization/${organizationId}`)
        .then((response) => {
          console.log("CheckOrganization", response.data.organization);
          if (response.data.organization.is_bmmb == 1) {
            this.is_bmmb = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async resetPdPa() {
      var changePada = await this.updateWasiatPdpa();
      if (changePada) {
        await this.deleteSignature();
      }
    },
    async updateWasiatPdpa() {
      return await ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        acknowledged_pdpa: 0,
        acknowledged_confirmation: 0,
      })
        .then((response) => {
          return true;
          console.log(response);
        })
        .catch((error) => {
          return false;
          console.log(error);
        });
    },
    async deleteSignature() {
      return await ApiService.post(`wasiat/${this.wasiatId}/signature`, {
        _method: "DELETE",
      })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya tetapkan semula PDPA",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$router.go();
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onNavigate() {
      window.open(this.certUrl, "_blank");
    },
    getWasiat() {
      ApiService.get(`/wasiat/${this.wasiatId}`)
        .then((response) => {
          this.wasiat = response.data.wasiat ?? {};
        })
        .catch((error) => {});
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    async approveWasiat() {
      if (!this.wasiat.wasiat_type) {
        this.$swal
          .fire({
            icon: "error",
            html: "Sila buat pemilihan jenis wasiat.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Ke Bahagian B",
          })
          .then((result) => {
            if (result.value) {
              this.$router.push({
                name: "wasiat.part_c",
                query: {
                  pengesahan: this.pengesahan,
                  wasiat_id: this.wasiatId,
                },
              });
            }
          });
        return;
      }
      await this.emailClientCreate();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        status: 2,
      }).then((response) => {
        this.$swal
          .fire({
            icon: "success",
            html: "Pengesahan wasiat berjaya!",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          })
          .then((result) => {
            this.$router.push({
              name: "wasiat.pengesahan.list-pendaftaran",
              query: { organization_id: this.wasiat.organization_id },
            });
          });
      });
    },
    async approveWasiatBMMB() {
      if (!this.wasiat.wasiat_type) {
        this.$swal
          .fire({
            icon: "error",
            html: "Sila buat pemilihan jenis wasiat.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Ke Bahagian B",
          })
          .then((result) => {
            if (result.value) {
              this.$router.push({
                name: "wasiat.part_c",
                query: {
                  pengesahan: this.pengesahan,
                  wasiat_id: this.wasiatId,
                },
              });
            }
          });
        return;
      }
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        status: 2,
        bmmb_loan_status: 1
      }).then((response) => {
        this.$swal
          .fire({
            icon: "success",
            html: "Pengesahan wasiat berjaya!",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          })
          .then((result) => {
            this.$router.push({
              name: "wasiat.pengesahan.list-pendaftaran",
              query: { organization_id: this.wasiat.organization_id },
            });
          });
      });
      await this.emailClientCreate();
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

    async declineWasiat() {
      await this.emailClientCreate();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        status: 0,
      }).then((response) => {
        this.$router.push({
          name: "wasiat.pengesahan.list-pendaftaran",
          query: { organization_id: this.wasiat.organization_id },
        });
        this.$swal.fire({
          icon: "success",
          html: "Anda telah berjaya membatalkan wasiat.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      });
    },
    async rejectWasiatBMMB() {
      await this.emailClientCreate();
      let successDeleteWasiat = await this.deleteWasiat();
      console.log("successDeleteWasiat", successDeleteWasiat);

      if (!successDeleteWasiat) {
        return;
      }
      let successDeleteUser = await this.deleteUser();
      console.log("successDeleteUser", successDeleteUser);
      if (!successDeleteUser) {
        return;
      }
      this.$router.push({
        name: "wasiat.pengesahan.list-pendaftaran",
        query: { organization_id: this.wasiat.organization_id },
      });
      this.$swal.fire({
          icon: "success",
          html: "Anda telah berjaya menolak wasiat.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
    },
    async deleteWasiat() {
      return await ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "DELETE",
      })
        .then((response) => {
          return true;
          // this.$router.push({
          //   name: "wasiat.pengesahan.list-pendaftaran",
          //   query: { organization_id: this.wasiat.organization_id },
          // });
        })
        .catch((error) => {
          return false;
        });
    },
    async deleteUser() {
      return await ApiService.post(`user/${this.wasiat.user_id}`, {
        _method: "DELETE",
      })
        .then((response) => {
          return true;
          // this.$router.push({
          //   name: "wasiat.pengesahan.list-pendaftaran",
          //   query: { organization_id: this.wasiat.organization_id },
          // });
        })
        .catch((error) => {
          return false;
        });
    },
    async declineWasiatEKYC() {
      await this.emailClientCreate();
      ApiService.post(`wasiat/${this.wasiatId}?ekyc_verified_at=`, {
        _method: "PATCH",
        status: 0,
      }).then((response) => {
        this.$router.push({
          name: "wasiat.pengesahan.list-pendaftaran",
          query: { organization_id: this.wasiat.organization_id },
        });
        this.$swal.fire({
          icon: "success",
          html: "Anda telah berjaya membatalkan wasiat.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      });
    },
    cancelWasiat() {
      // this.$refs["modalCancelWasiat"].show();
      this.$refs["modalCancelWasiatNew"].show();
    },
    async rejectWasiat() {
      this.$refs["modalRejectWasiatBMMB"].show();
    },
    async submitModalRejectWasiat() {
      await this.rejectWasiatBMMB();
    },
    async submitModalCancelWasiat() {
      console.log("optionDelete", this.optionDelete);
      if (!this.optionDelete) {
        //message here if no select

        return;
      }
      if (this.optionDelete == 1) {
        await this.updateReason();
        await this.declineWasiatEKYC();
      } else if (this.optionDelete == 2) {
        //when pewasiat not complete the details

        await this.updateReason();
        await this.declineWasiat();
        // console.log("form", this.form);
      } else if (this.optionDelete == 3) {
        //when delete dummby data -> add softdelete
        let Reason = await this.updateReason();
        if (Reason) {
          ApiService.post(`wasiat/${this.wasiatId}`, {
            _method: "DELETE",
          }).then((response) => {
            this.$router.push({
              name: "wasiat.pengesahan.list-pendaftaran",
              query: { organization_id: this.wasiat.organization_id },
            });
          });
        }
      }
    },
    async updateReason() {
      this.form.wasiat_id = this.wasiatId;
      this.form.option_delete_id = this.optionDelete;
      this.form._method = "PATCH";
      return await ApiService.post(`wasiat/${this.wasiatId}`, this.form).then(
        (response) => {
          return true;
        }
      );
    },
    hideModalCancelWasiat() {},
  },
};
</script>

<template>
  <div>
    <Navbar :nav-light="true" />

    <section class="bg-half bg-primary d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title text-white" v-if="!pengesahan">
                {{ $t("wasiatsidebar.header") }}
              </h4>
              <h4 class="title text-white" v-if="pengesahan">
                {{ $t("wasiatasas.confirmation") }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div
              class="alert alert-warning"
              v-if="wasiat && wasiat.status == 0 && wasiat.rejected_reason"
            >
              <h5
                v-if="[1, 2].includes(optionDeleteDisplay)"
                class="text-center"
              >
                Wasiat ini tidak lengkap.
              </h5>
              <h5 v-if="optionDeleteDisplay == 3" class="text-center">
                Wasiat ini telah dibatalkan.
              </h5>
              <h5 v-if="optionDeleteDisplay == 4" class="text-center">
                Wasiat ini ditolak disebabkan oleh pembiayaan oleh pihak bank
                tidak diluluskan
              </h5>
              <hr />
              <p>Komen daripada pihak AWARIS:</p>
              <p>{{ wasiat.rejected_reason }}</p>
              <p>Sila kemas kini wasiat.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-12">
            <div class="sidebar sticky-bar p-4 rounded shadow bg-light">
              <div class="widget mb-4 pb-4 border-bottom">
                <div id="jobkeywords" class="widget-search mt-4 mb-0"></div>
                <router-link
                  :disabled="!part_a"
                  :event="part_a ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_a',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 1 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} A
                  </span>
                  <span class="d-block">{{ $t("account") }}</span>
                </router-link>
                <router-link
                  :disabled="!part_b"
                  :event="part_b ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_c',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 2 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} B
                  </span>
                  <span class="d-block">{{ $t("navbar.testament") }}</span>
                </router-link>
                <router-link
                  :disabled="!part_c"
                  :event="part_c ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_payment',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 3 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} C
                  </span>
                  <span class="d-block">{{ $t("payment") }}</span>
                </router-link>
                <router-link
                  :disabled="!part_d"
                  :event="part_d ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_b',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 4 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} D
                  </span>
                  <span class="d-block">eKYC</span>
                </router-link>
                <router-link
                  :disabled="!part_e"
                  :event="part_e ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_d',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 5 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} E
                  </span>
                  <span class="d-block">{{ $t("testator") }}</span>
                </router-link>
                <router-link
                  :disabled="!part_f"
                  :event="part_f ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_e',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 6 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} F
                  </span>
                  <span class="d-block">{{ $t("heir") }} </span>
                </router-link>
                <router-link
                  :disabled="!part_g"
                  :event="part_g ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_f',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 7 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} G
                  </span>
                  <span class="d-block">{{ $t("verification") }} </span>
                </router-link>
                <router-link
                  :disabled="!part_h"
                  :event="part_h ? 'click' : ''"
                  :to="{
                    name: 'wasiat.part_g',
                    query: { wasiat_id: wasiatId, pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="wasiatPart >= 8 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    {{ $t("part") }} H
                  </span>
                  <span class="d-block">{{ $t("witness") }}</span>
                </router-link>
              </div>
              <div class="text-center" v-if="wasiat && wasiat.status == 2">
                <button @click="onNavigate" class="btn btn-info btn-sm">
                  {{ $t("print-wasiat") }}
                </button>
              </div>
              <hr class="primary" v-if="userRole == 'Staff' && pengesahan" />
              <div
                class="row d-flex justify-content-center"
                v-if="userRole == 'Staff' && pengesahan && !is_bmmb"
              >
                <button
                  type="button"
                  @click="approveWasiat"
                  class="btn btn-success mr-1"
                >
                  {{ $t("confirm") }}
                </button>
                <button
                  type="button"
                  @click="cancelWasiat"
                  class="btn btn-danger ml-1"
                >
                  Tidak Lengkap
                </button>
              </div>
              <div
                class="row d-flex justify-content-center mt-3"
                v-if="userRole == 'Staff' && pengesahan && is_bmmb"
              >
                <!-- //only bank muamallat -->
                <button
                  type="button"
                  @click="approveWasiatBMMB"
                  class="btn btn-success mr-1"
                >
                  {{ $t("confirm") }}
                </button>
                <button
                  type="button"
                  @click="cancelWasiat"
                  class="btn btn-danger ml-1"
                >
                  Tidak Lengkap
                </button>
                <button
                  type="button"
                  @click="rejectWasiat"
                  class="btn btn-danger ml-1 mt-2"
                >
                  Ditolak
                </button>
              </div>
              <div
                class="row d-flex justify-content-center"
                v-if="
                  userRole != 'Client' &&
                  wasiat &&
                  wasiat.acknowledged_pdpa &&
                  wasiat.status == 0
                "
              >
                <button
                  type="button"
                  @click="resetPdPa"
                  class="btn btn-danger ml-1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <router-view> </router-view>
        </div>
      </div>
    </section>

    <!-- REJECTED REASON -->
    <b-modal
      ref="modalCancelWasiat"
      title="Batal Wasiat"
      @ok="submitModalCancelWasiat"
      @cancel="hideModalCancelWasiat"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      :no-enforce-focus="true"
    >
      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Komen kepada Agent:</label>
              <textarea
                class="form-control"
                id="address"
                rows="2"
                v-model="form.rejected_reason"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      ref="modalCancelWasiatNew"
      title="Batal Wasiat"
      hide-footer
      :no-enforce-focus="true"
    >
      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <label class="radio">
              <input
                type="radio"
                name="radio1"
                value="1"
                v-model="optionDelete"
              />
              Wasiat ini perlu dibatalkan disebabkan oleh eKYC tidak menepati
              terma dan syarat AWARIS
            </label>
          </div>
        </div>
        <hr class="primary" />
        <div class="row">
          <div class="col-md-12">
            <label class="radio">
              <input
                type="radio"
                name="radio1"
                value="2"
                v-model="optionDelete"
              />
              Wasiat ini perlu dibatalkan disebabkan oleh informasi tidak
              menepati terma dan syarat AWARIS
            </label>
          </div>
        </div>
        <hr class="primary" />
        <div class="row">
          <div class="col-md-12">
            <label class="radio">
              <input
                type="radio"
                name="radio1"
                value="3"
                v-model="optionDelete"
              />
              Wasiat ini perlu dibatalkan disebabkan oleh data dummy yang
              dimasukkan oleh RN
            </label>
          </div>
        </div>
        <hr class="primary" />
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Masukkan Sebab Batal:</label>
              <textarea
                class="form-control"
                id="address"
                rows="2"
                v-model="form.rejected_reason"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <button class="btn btn-danger" @click="submitModalCancelWasiat">
            BATAL
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal
      ref="modalRejectWasiatBMMB"
      title="Tolak Wasiat"
      hide-footer
      :no-enforce-focus="true"
    >
      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <label>
              Adakah anda yakin untuk MENOLAK permohonan wasiat asas {{ wasiat ? wasiat.user_detail.name : '-'}} (No. MyKad: {{ wasiat ? wasiat.user_detail.ic_number : '-'}})?
            </label>
          </div>
        </div>
        <hr class="primary" />

        <div class="row justify-content-center">
          <button class="btn btn-danger" @click="submitModalRejectWasiat">
            DITOLAK
          </button>
        </div>
      </div>
    </b-modal>
    <Footer />
    <a
      href="javascript: void(0);"
      class="btn btn-icon btn-soft-primary back-to-top"
      id="back-to-top"
      v-scroll-to="'#topnav'"
    >
      <arrow-up-icon class="icons"></arrow-up-icon>
    </a>
  </div>
</template>
