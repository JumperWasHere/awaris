<script>
import AddSaksi from "@/views/wasiat/asas/add-saksi";
import WitnessDetails from "./readonly/witness-details";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      signaturePath: null,
      witnesses: null,
      staffOrgID: null,
      signature: null,
      signatureCheck: null,
      witness_id: null,
      formSaksi: {
        name: null,
        ic_number: null,
        email: null,
        address: null,
        postcode: null,
        city: null,
        state: null,
        newWitness: false,
      },
      wasiat: null,
      submit: false,
      postcode: null,
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
      email: {
        required,
      },
      address: {
        required,
      },
      postcode: {
        required,
      },
    },
  },
  components: { AddSaksi, WitnessDetails },
  methods: {
    eventHandler() {
      this.$refs["formAddPostcode"].show();
      this.$refs["modalsaksi"].hide();
    },
    hideModal() {
      this.$refs["modalsaksi"].show();
    },
    openSaksiModal() {
      this.$v.$reset();
      this.formSaksi.name = null;
      this.formSaksi.ic_number = null;
      this.formSaksi.email = null;
      this.formSaksi.address = null;
      this.formSaksi.postcode = null;
      this.formSaksi.city = null;
      this.formSaksi.state = null;
      this.formSaksi.newWitness = null;
      this.witness_id = null;
      this.signaturePath = null;
      this.formSaksi.newWitness = false;
      this.formSaksi.signature_id = null;
      this.$refs["modalsaksi"].show();
    },
    hideModalSaksi() {
      this.$refs["modalsaksi"].hide();
      this.formSaksi.currentIndex = -2;
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    async saveSignature(isEmpty, data) {
      if (!isEmpty) {
        return await ApiService.post(`/witness/${this.witness_id}/signature`, {
          description: "witness",
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
    async addSaksi(val) {
      val.preventDefault();
      console.log("Saksi Form", this.formSaksi);
      this.formSaksi.wasiat_id = this.wasiatId;
      this.formSaksi.witnessable_type = "Wasiat";
      this.formSaksi.witnessable_id = this.wasiatId;

      if (this.formSaksi.newWitness) {
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        this.$refs.addSaksiComponent.checkValidation();
        var errorMessage = "";
        if (!this.formSaksi.name) {
          errorMessage = "Sila masukkan nama saksi terlebih dahulu.";
        } else if (!this.formSaksi.ic_number) {
          errorMessage = "Sila masukkan nombor MyKad saksi terlebih dahulu.";
        } else if (!this.formSaksi.email && this.userRole != "Staff") {
          errorMessage = "Sila masukkan emel saksi terlebih dahulu.";
        } else if (!this.formSaksi.address) {
          errorMessage = "Sila masukkan alamat saksi terlebih dahulu.";
        } else if (!this.formSaksi.postcode) {
          errorMessage = "Sila masukkan poskod terlebih dahulu.";
        } else if (!this.$refs.signaturePad && this.userRole != "Staff") {
          errorMessage = "Sila tandatangan terlebih dahulu.";
        } else if (isEmpty && this.userRole != "Staff") {
          errorMessage = "Sila masukkan tandatangan terlebih dahulu.";
        }

        if (errorMessage != "") {
          this.$swal.fire({
            icon: "error",
            html: errorMessage,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        var resultRegister = await this.registerWitness();

        if (resultRegister) {
          await this.saveSignature(isEmpty, data);
        }
      } else {
        if (this.userRole != "Staff") {
          if (!this.formSaksi.signature_id) {
            this.$swal.fire({
              icon: "error",
              html: "Pengguna yang dipilih tiada tandatangan digital.",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
            return;
          }
        }
        await this.registerWitness();
      }

      this.hideModalSaksi();
    },
    async registerWitness() {
      return await ApiService.post(`/witness`, this.formSaksi)
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya menambah Saksi.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.witness_id = response.data.witness.id;

          this.witnesses.push(response.data.witness);
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    getWitnesses() {
      ApiService.get(`/wasiat/${this.wasiatId}/witness`).then((response) => {
        if (
          Array.isArray(response.data.witnesses.data) &&
          response.data.witnesses.data.length > 0
        ) {
          this.witnesses = response.data.witnesses.data;
        } else {
          this.witnesses = [];
          if (this.currentUser && this.userRole != "Client") {
            if (this.wasiat == null || this.wasiat.is_witness_added) {
              return;
            }
            this.wasiat.is_witness_added = 1;
            this.registerAgentWitnesses();
            if (["Admin", "Agent"].includes(this.userRole)) {
              this.getSuperAdmin();
            } else if (this.userRole == "Super Admin") {
              this.getAdmin();
            }
          }
        }
      });
    },
    deleteWitness(witness, index) {
      ApiService.post(`/witness/${witness.id}`, { _method: "DELETE" })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya memadam Saksi.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.witnesses.splice(index, 1);
          console.log(response.data);
        })
        .catch((error) => {});
    },
    async getWasiat() {
      await ApiService.get(`/wasiat/${this.wasiatId}`).then((response) => {
        var wasiat = response.data.wasiat;
        if (wasiat) {
          if (wasiat.organization_id == null) {
            this.$router.push({ name: "wasiat.part_d" });
          }
          this.wasiat = wasiat;
        }
      });
    },
    nextPage() {
      this.$router.push({
        name: "dashboard",
      });
    },
    async onSubmitStaffOnly() {
      if (this.wasiat && this.wasiat.status == 1) {
        this.submit = true;

        setTimeout(
          () =>
            this.$router.push({
              name: "dashboard",
            }),
          1500
        );
      } else if (this.wasiat && this.wasiat.status != 1) {
        // status = 0
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
        if (!this.wasiat.payment_options_id) {
          this.$swal.fire({
            icon: "error",
            html: "Sila buat pembayaran.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });

          return;
        }

        var wasiatResult = await this.updateWasiat();
        if (wasiatResult) {
          this.$router.push({
            name: "dashboard",
            query: { status: "verified" },
          });
        }
      }
    },
    async onsubmit() {
      if (this.wasiat && this.wasiat.status == 1) {
        this.submit = true;

        setTimeout(
          () =>
            this.$router.push({
              name: "dashboard",
            }),
          1500
        );
      } else if (this.wasiat && this.wasiat.status != 1) {
        // status = 0
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
        if (!this.wasiat.payment_options_id) {
          this.$swal.fire({
            icon: "error",
            html: "Sila buat pembayaran.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });

          return;
        }
        if (!this.wasiat.ekyc_verified_at) {
          this.$swal.fire({
            icon: "error",
            html: "Sila lengkapkan proses e-KYC.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }

        var wasiatResult = await this.updateWasiat();
        if (wasiatResult) {
          this.$router.push({
            name: "dashboard",
            query: { status: "verified" },
          });
        }
      }
    },

    async updateWasiat() {
      return await ApiService.post(`/wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        status: 1,
      })
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.submit = false;
          return false;
        });
    },
    registerAgentWitnesses() {
      var signatureId = this.currentUser.signature
        ? this.currentUser.signature.id
        : null;
      let obj = {
        witnessable_id: this.wasiatId,
        witnessable_type: "Wasiat",
        name: this.currentUser.name,
        ic_number: this.currentUser.ic_number,
        address: this.currentUser.address,
        postcode: this.currentUser.postcode,
        city: this.currentUser.city,
        state: this.currentUser.state,
        signature_id: signatureId,
      };
      if (this.currentUser.ic_number && signatureId) {
        this.registerWitnes(obj);
      }
    },
    async registerWitnes(obj) {
      return await ApiService.post(`/witness`, obj)
        .then((response) => {
          this.witnesses.push(response.data.witness);
        })
        .catch((error) => {});
    },
    getAwarisOrg() {
      ApiService.get(`/organization?type=Awaris`)
        .then((response) => {
          this.staffOrgID = response.data.organizations.data[0].id;
          this.getStaff();
          console.log("get awaris", response.data);
        })
        .catch((error) => {});
    },
    async getStaff() {
      ApiService.get(`/organization/${this.staffOrgID}/user?limit=500`)
        .then((response) => {
          var user_accesses = response.data.user_accesses.data;
          var filterSuperAdmin = user_accesses.filter(
            (item) => item.role == "Staff" && item.status == "1"
          );
          if (filterSuperAdmin.length > 0) {
            var signatureId = filterSuperAdmin[0].user.signature
              ? filterSuperAdmin[0].user.signature.id
              : null;
            let obj = {
              witnessable_id: this.wasiatId,
              witnessable_type: "Wasiat",
              name: filterSuperAdmin[0].user.name,
              ic_number: filterSuperAdmin[0].user.ic_number,
              address: filterSuperAdmin[0].user.address,
              postcode: filterSuperAdmin[0].user.postcode,
              city: filterSuperAdmin[0].user.city,
              state: filterSuperAdmin[0].user.state,
              signature_id: signatureId,
            };
            this.registerWitnes(obj);
          }
        })
        .catch((error) => {
          console.log("error get superadmin");
        });
    },
    async getAdmin() {
      ApiService.get(`/organization/${this.userAccess.organization_id}/user?limit=500`)
        .then((response) => {
          var user_accesses = response.data.user_accesses.data;
          var filterSuperAdmin = user_accesses.filter(
            (item) =>
              item.role == "Admin" &&
              item.status == "1" &&
              item.user.signature != null &&
              item.user.ic_number != null
          );
          if (filterSuperAdmin.length > 0) {
            var signatureId = filterSuperAdmin[0].user.signature
              ? filterSuperAdmin[0].user.signature.id
              : null;
            let obj = {
              witnessable_id: this.wasiatId,
              witnessable_type: "Wasiat",
              name: filterSuperAdmin[0].user.name,
              ic_number: filterSuperAdmin[0].user.ic_number,
              address: filterSuperAdmin[0].user.address,
              postcode: filterSuperAdmin[0].user.postcode,
              city: filterSuperAdmin[0].user.city,
              state: filterSuperAdmin[0].user.state,
              signature_id: signatureId,
            };
            this.registerWitnes(obj);
          }
        })
        .catch((error) => {
          console.log("error get superadmin");
        });
    },
    getSuperAdmin() {
      ApiService.get(`/organization/${this.userAccess.organization_id}/user?limit=500`)
        .then((response) => {
          var user_accesses = response.data.user_accesses.data;
          var filterSuperAdmin = user_accesses.filter(
            (item) =>
              item.role == "Super Admin" &&
              item.status == "1" &&
              item.user.signature != null &&
              item.user.ic_number != null
          );
          if (filterSuperAdmin.length > 0) {
            var signatureId = filterSuperAdmin[0].user.signature
              ? filterSuperAdmin[0].user.signature.id
              : null;
            let obj = {
              witnessable_id: this.wasiatId,
              witnessable_type: "Wasiat",
              name: filterSuperAdmin[0].user.name,
              ic_number: filterSuperAdmin[0].user.ic_number,
              address: filterSuperAdmin[0].user.address,
              postcode: filterSuperAdmin[0].user.postcode,
              city: filterSuperAdmin[0].user.city,
              state: filterSuperAdmin[0].user.state,
              signature_id: signatureId,
            };
            // if (this.currentUser.ic_number && signatureId) {
            this.registerWitnes(obj);
            // }
          }
        })
        .catch((error) => {
          console.log("error get superadmin");
        });
    },
    async viewWitness(witness, index) {
      this.$refs.viewWitnessModal.openModal(witness);
      let result = await this.getSignature(witness.id);
      if (result) {
        this.signaturePath = result;
      } else {
        this.signaturePath = null;
      }
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    async getSignature(witness_id) {
      return await ApiService.get(
        `/witness/${witness_id}/signature?stream=false`
      )
        .then((response) => {
          console.log(response.data);
          return response.data.signature.public_path;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
  },

  async mounted() {
    if (!this.$route.query.wasiat_id) {
      this.$router.push({ name: "wasiat.part_a" });
    } else {
      await this.getWasiat();
      this.getWitnesses();
    }

    // this.getAwarisOrg();
  },
  watch: {
    wasiat: {
      handler: function (val) {
        if (val.status == -1) {
          this.$router.push({
            name: "wasiat.part_c",
            query: {
              wasiat_id: this.wasiatId,
            },
          });
        }
        if (!val.user.name) {
          this.$router.push({
            name: "wasiat.part_d",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
        if (!val.heir) {
          this.$router.push({
            name: "wasiat.part_e",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
        // if (!val.payment_received_at) {
        //   this.$router.push({
        //     name: "wasiat.part_f",
        //     query: {
        //       wasiat_id: this.wasiatId,
        //       pengesahan: this.pengesahan,
        //     },
        //   });
        // }
        console.log("wasiat", val);
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
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("wasiatasas.witness-desc") }}
            </h5>
            <div
              class="row mb-2 mt-4"
              v-if="witnesses && witnesses.length < 4 && userRole != 'Client'"
            >
              <div class="col-lg-12 text-right">
                <a class="btn btn-primary btn-sm" @click="openSaksiModal">{{
                  $t("add-witness")
                }}</a>
              </div>
            </div>
            <form class="">
              <div class="table-responsive mt-3 mb-4">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col">{{ $t("index") }}</th>
                      <th scope="col">{{ $t("fullname") }}</th>
                      <th scope="col">{{ $t("mykad") }}</th>
                      <th
                        class="text-right"
                        scope="col"
                        v-if="
                          ['Staff', 'Super Admin', 'Admin', 'Agent'].includes(
                            userRole
                          )
                        "
                      >
                        {{ $t("action") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="userRole == 'Client'">
                    <tr v-if="witnesses && witnesses.length == 0">
                      <td colspan="4" class="text-center">
                        <h5 class="mt-5">
                          {{ $t("wasiatasas.witness1") }}
                        </h5>
                      </td>
                    </tr>
                    <tr v-for="(witness, index) in witnesses" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ witness.name }}</td>
                      <td>{{ witness.ic_number }}</td>
                    </tr>
                  </tbody>

                  <tbody v-if="userRole != 'Client'">
                    <tr v-for="(witness, index) in witnesses" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ witness.name }}</td>
                      <td>{{ witness.ic_number }}</td>
                      <td
                        class="text-right"
                        v-if="
                          ['Staff', 'Super Admin', 'Admin', 'Agent'].includes(
                            userRole
                          )
                        "
                      >
                        <div class="btn-group-vertical">
                          <b-button
                            class="btn-sm btn-primary"
                            @click="viewWitness(witness, index)"
                            >{{ $t("view") }}</b-button
                          >
                        </div>
                      </td>
                    </tr>
                    <tr v-if="witnesses && witnesses.length == 0">
                      <td colspan="4" class="text-center">
                        <h5 class="mt-5">{{ $t("wasiatasas.witness2") }}</h5>
                        <p v-if="userRole == 'Client'">
                          <small>
                            <i>
                              {{ $t("wasiatasas.witness3") }}
                            </i>
                          </small>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </div>

          <b-modal
            ref="modalsaksi"
            id="modal-1"
            title="Tambah Saksi"
            class="modal fade"
            ok-title="Simpan"
            cancel-title="Batal"
            @ok="addSaksi"
            @cancel="hideModalSaksi"
            :no-enforce-focus="true"
          >
            <AddSaksi
              ref="addSaksiComponent"
              :form="formSaksi"
              @formAddPostcode="eventHandler"
            />
            <div class="pl-3 pr-3">
              <div v-if="formSaksi.newWitness" class="form-group">
                <label for="exampleSelect1">
                  {{ $t("profile.signature") }}
                </label>
                <span class="text-danger">*</span>
                <div class="card" style="width: 100%; display: inline-block">
                  <div style="position: relative; height: 300px; width: 100%">
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
                        right: 0px;
                        left: 0px;
                        top: 45%;
                        color: #b6b6b4;
                        text-align: center;
                      "
                    >
                      {{ $t("sign-here") }}
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
          </b-modal>
        </div>
      </div>
    </div>
    <div class="row" v-if="!pengesahan">
      <div class="col-lg-12 text-right">
        <div class="form-group" v-if="userRole == 'Staff'">
          <button
            class="btn btn-primary"
            @click="onSubmitStaffOnly"
            v-if="wasiat && wasiat.status != 2"
          >
            Selesai Tanpa Tandatangan Digital
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
        <div class="form-group">
          <!-- 1.wasiat status = 2 -> finish 
               2.wasiat status = 1 -> wait for staff approval
               3.wasiat status = 0 -> in progress
               4.wasiat status = -1 -> create account wasiat without organization    
          -->
          <button
            class="btn btn-primary"
            @click="onsubmit"
            v-if="wasiat && wasiat.status != 2"
          >
            {{ $t("done") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
          <button
            class="btn btn-primary"
            @click="nextPage"
            v-if="wasiat && wasiat.status == 2"
          >
            {{ $t("done") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
    <b-modal
      ref="formAddPostcode"
      class="modal fade"
      id="formAddPostcode"
      hide-footer
    >
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">
          {{ $t("add-postcode") }}
        </h5>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>
            {{ $t("postcode") }}
            <span class="text-danger">*</span>
          </label>
          <input
            type="number"
            class="form-control savePostcode"
            name="userstate"
          />
        </div>
        <div class="form-group">
          <label>
            {{ $t("city") }}
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control saveCity" name="userstate" />
        </div>
        <div class="form-group">
          <label>
            {{ $t("state") }}
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control saveState" name="userstate" />
        </div>
      </div>
      <b-button
        class="mt-3"
        variant="outline-danger"
        block
        @click="hideModal"
        >{{ $t("close") }}</b-button
      >
    </b-modal>
    <!-- <div
      class="row d-flex justify-content-center"
      v-if="userRole == 'Staff' && pengesahan"
    >
      <button type="button" @click="approveWasiat" class="btn btn-success mr-1">
        Sahkan
      </button>
      <button type="button" @click="declineWasiat" class="btn btn-danger ml-1">
        Batal
      </button>
    </div> -->
    <witness-details
      :isEditable="true"
      :isDeletable="true"
      :signature="signaturePath"
      getWitnessesMethodName="getWitnesses"
      ref="viewWitnessModal"
    />
  </div>
</template>
