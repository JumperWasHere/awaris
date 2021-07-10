<script>
import AddSaksi from "@/views/pindaan/pindaan-component/add-saksi";
import WitnessDetails from "@/views/pindaan/pindaan-component/witness-details";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      signaturePath: null,
      witnesses: null,
      staffOrgID: null,
      signature: null,
      signatureCheck: null,
      witness_id: null,
      amendment_id: null,
      amendment_status: null,
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
      // this.$v.$reset();
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
      this.formSaksi.signature_id = false;
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
      this.formSaksi.witnessable_id = this.amendment_id;
      this.formSaksi.witnessable_type = "Amendment";
      if (this.formSaksi.newWitness) {
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        this.$refs.addSaksiComponent.checkValidation();
        var errorMessage = "";
        if (!this.formSaksi.name) {
          errorMessage = "Sila masukkan nama saksi terlebih dahulu.";
        } else if (!this.formSaksi.ic_number) {
          errorMessage = "Sila masukkan nombor MyKad saksi terlebih dahulu.";
        } else if (!this.formSaksi.email) {
          errorMessage = "Sila masukkan emel saksi terlebih dahulu.";
        } else if (!this.formSaksi.address) {
          errorMessage = "Sila masukkan alamat saksi terlebih dahulu.";
        } else if (!this.formSaksi.postcode) {
          errorMessage = "Sila masukkan poskod terlebih dahulu.";
        } else if (!this.$refs.signaturePad) {
          errorMessage = "Sila tandatangan terlebih dahulu.";
        } else if (isEmpty) {
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
        if (isEmpty) {
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
      ApiService.get(`/amendment/${this.amendment_id}/witness`)
        .then((response) => {
          console.log(response.data.witnesses.data);
          if (
            Array.isArray(response.data.witnesses.data) &&
            response.data.witnesses.data.length > 0
          ) {
            this.witnesses = response.data.witnesses.data;
          } else {
            this.witnesses = [];
            if (this.currentUser && this.userRole != "Client") {
              this.registerAgentWitnesses();

              // if (["Admin", "Agent"].includes(this.userRole)) {
              //   this.getSuperAdmin();
              //   this.getAwarisOrg();
              // } else if (this.userRole == "Super Admin") {
              //   this.getAdmin();
              // }
              // this.getAwarisOrg();
            }
          }
        })
        .catch((error) => {
          console.log("error");
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
    getamendment() {
      ApiService.get(`/wasiat/${this.wasiatId}/amendment`).then((response) => {
        this.amendment_id = response.data.amendments.data[0].id;
        this.amendment_status = response.data.amendments.data[0].status;
        this.getWitnesses();
      });
    },
    registerAgentWitnesses() {
      var signatureId = this.currentUser.signature
        ? this.currentUser.signature.id
        : null;
      let obj = {
        witnessable_id: this.amendment_id,
        witnessable_type: "Amendment",
        name: this.currentUser.name,
        ic_number: this.currentUser.ic_number,
        address: this.currentUser.address,
        postcode: this.currentUser.postcode,
        city: this.currentUser.city,
        state: this.currentUser.state,
        signature_id: signatureId,
      };

      console.log("obj", obj);
      if (this.currentUser.ic_number && signatureId) {
        this.registerWitnes(obj);
      }
    },
    async registerWitnes(obj) {
      ApiService.post(`/witness`, obj)
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
      ApiService.get(`/organization/${this.staffOrgID}/user`)
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
              witnessable_id: this.amendment_id,
              witnessable_type: "Amendment",
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
      ApiService.get(`/organization/${this.userAccess.organization_id}/user`)
        .then((response) => {
          var user_accesses = response.data.user_accesses.data;
          var filterSuperAdmin = user_accesses.filter(
            (item) => item.role == "Admin" && item.status == "1"
          );
          if (filterSuperAdmin.length > 0) {
            var signatureId = filterSuperAdmin[0].user.signature
              ? filterSuperAdmin[0].user.signature.id
              : null;
            let obj = {
              witnessable_id: this.amendment_id,
              witnessable_type: "Amendment",
              name: filterSuperAdmin[0].user.name,
              ic_number: filterSuperAdmin[0].user.ic_number,
              address: filterSuperAdmin[0].user.address,
              postcode: filterSuperAdmin[0].user.postcode,
              city: filterSuperAdmin[0].user.city,
              state: filterSuperAdmin[0].user.state,
              signature_id: signatureId,
            };
            // console.log(obj);
            this.registerWitnes(obj);
          }
        })
        .catch((error) => {
          console.log("error get superadmin");
        });
    },
    getSuperAdmin() {
      ApiService.get(`/organization/${this.userAccess.organization_id}/user`)
        .then((response) => {
          var user_accesses = response.data.user_accesses.data;
          var filterSuperAdmin = user_accesses.filter(
            (item) => item.role == "Super Admin" && item.status == "1"
          );
          if (filterSuperAdmin.length > 0) {
            var signatureId = filterSuperAdmin[0].user.signature
              ? filterSuperAdmin[0].user.signature.id
              : null;
            let obj = {
              witnessable_id: this.amendment_id,
              witnessable_type: "Amendment",
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
    async submitWitness() {
      let resultUpdate = await this.updateAmendment();
      if (resultUpdate) {
        this.$router.push({ name: "wasiat.pengesahan.list-pindaan-saksi" });
      }
    },
    async updateAmendment() {
      return await ApiService.post(`/amendment/${this.amendment_id}`, {
        _method: "PATCH",
        status: 5,
      })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah mengesahkan saksi pindaan ini.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
  },
  computed: {
    wasiatId() {
      return this.$route.params.wasiat_id;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userAccess", "userRole"]),
  },

  mounted() {
    // this.getWitnesses();
    this.getamendment();
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
            <h5 class="text-center mb-4" style="text-transform: uppercase">
              {{ $t("wasiatasas.witness-desc") }}
            </h5>
            <form class="login-form">
              <div
                class="row mt-4"
                v-if="witnesses && witnesses.length < 4 && userRole != 'Client'"
              >
                <div class="col-lg-12 text-right">
                  <a class="btn btn-primary btn-sm" @click="openSaksiModal">{{
                    $t("add-witness")
                  }}</a>
                </div>
              </div>
              <div class="row">
                <div class="table-responsive mt-3 mb-4">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col">{{ $t("index") }}</th>
                        <th scope="col">{{ $t("fullname") }}</th>
                        <th scope="col">{{ $t("mykad") }}</th>
                        <th scope="col" v-if="userRole == 'Staff'">
                          {{ $t("action") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="amendment_status == 0">
                      <tr>
                        <td colspan="4" class="text-center">
                          <h5 class="mt-5">
                            {{ $t("wasiatasas.witness1") }}
                          </h5>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-if="amendment_status != 0">
                      <tr v-for="(witness, index) in witnesses" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ witness.name }}</td>
                        <td>{{ witness.ic_number }}</td>
                        <td v-if="userRole == 'Staff'">
                          <b-button
                            class="btn-sm btn-primary"
                            @click="viewWitness(witness, index)"
                            >{{ $t("view") }}</b-button
                          >
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
              </div>
            </form>
          </div>

          <b-modal
            ref="modalsaksi"
            id="modal-1"
            v-bind:title="$t('add-witness')"
            class="modal fade"
            v-bind:ok-title="$t('save')"
            v-bind:cancel-title="$t('cancel')"
            @ok="addSaksi"
            @cancel="hideModalSaksi"
            :no-enforce-focus="true"
          >
            <AddSaksi
              ref="addSaksiComponent"
              :form="formSaksi"
              @formAddPostcode="eventHandler"
            />
            <div class="card-body">
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
    <div class="row" v-if="userRole == 'Staff'">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <b-button @click="submitWitness" class="btn btn-primary">{{
            $t("done")
          }}</b-button>
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
    <witness-details
      :isEditable="true"
      :isDeletable="true"
      :signature="signaturePath"
      getWitnessesMethodName="getWitnesses"
      ref="viewWitnessModal"
    />
  </div>
</template>
