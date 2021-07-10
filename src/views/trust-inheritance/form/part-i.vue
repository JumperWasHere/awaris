<script>
import AddSaksi from "@/views/trust/form/asset/add-saksi";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { TheMask } from "vue-the-mask";
export default {
  data() {
    return {
      form: {},
      witnesses: null,
      staffOrgID: null,
      signature: null,
      signatureCheck: null,
      witness_id: null,
      amendment_id: null,
      amendment_status: null,
      formSaksi: [],
      //   wasiat: null,
      submit: false,
      postcode: null,
      users: null,
    };
  },
  components: { AddSaksi, TheMask },
  methods: {
    eventHandler() {
      this.$refs["formAddPostcode"].show();
      this.$refs["modalsaksi"].hide();
    },
    hideModal() {
      this.$refs["modalsaksi"].show();
    },
    openSaksiModal() {
      this.formSaksi.newWitness = false;
      this.form = {};
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
      this.form.witnessable_id = this.trustId;
      this.form.witnessable_type = "Hibah";

      if (this.formSaksi.newWitness) {
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
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
        var resultRegister;
        // resultRegister = await this.registerWitness();

        resultRegister = await this.registerWitness();

        if (resultRegister) {
          await this.saveSignature(isEmpty, data);
        }
      } else {
        await this.registerWitness();
      }

      this.hideModalSaksi();
    },
    async registerWitness() {
      if (this.amendmentId) {
        this.form.witnessable_id = this.amendmentId;
        this.form.witnessable_type = "Amendment";
      }
      return await ApiService.post(`/witness`, this.form)
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
    getUsers() {
      ApiService.get(`/organization/${this.trust.organization_id}/user`)
        .then((response) => {
          this.users = response.data.user_accesses.data;
          console.log("users", this.users);
        })
        .catch((error) => {});
    },
    getAmendmentWitness() {
      ApiService.get(`/amendment/${this.amendmentId}/witness`)
        .then((response) => {
          console.log("amendmentWitness-", response.data);
          if (
            Array.isArray(response.data.witnesses.data) &&
            response.data.witnesses.data.length > 0
          ) {
            this.witnesses = response.data.witnesses.data;
          } else {
            this.witnesses = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getWitnesses() {
      ApiService.get(`/hibah/${this.trustId}/witness`)
        .then((response) => {
          console.log("witnes", response.data.witnesses.data);
          if (
            Array.isArray(response.data.witnesses.data) &&
            response.data.witnesses.data.length > 0
          ) {
            this.witnesses = response.data.witnesses.data;
          } else {
            this.witnesses = [];
          }
        })
        .catch((error) => {
          console.log("error");
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

    // registerAgentWitnesses() {
    //   let obj = {
    //     witnessable_id: this.amendment_id,
    //     witnessable_type: "Amendment",
    //     name: this.currentUser.name,
    //     ic_number: this.currentUser.ic_number,
    //     address: this.currentUser.address,
    //     postcode: this.currentUser.postcode,
    //     city: this.currentUser.city,
    //     state: this.currentUser.state,
    //   };
    //   this.registerWitnes(obj);
    // },
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
          if (filterSuperAdmin.length > 0 && this.userRole == "Staff") {
            this.formSaksi = filterSuperAdmin;
          }
        })
        .catch((error) => {
          console.log("error get superadmin");
        });
    },
    fillSaksiForm() {
      var accessible = this.users[this.form.currentIndex];
      console.log("users", this.users);
      console.log("currentIndex", this.form.currentIndex);
      if (this.form.currentIndex >= 0) {
        console.log("this.form.currentIndex == 0");
        if (accessible.user.signature) {
          this.form.signature_id = accessible.user.signature.id;
        } else {
          this.$notify({
            group: "full-noti",
            title: "Pengguna yang dipilih tiada tandatangan digital.",
            duration: 5000,
            type: "success",
          });
        }
        this.form.name = accessible.user.name;
        this.form.ic_number = accessible.user.ic_number;
        this.form.email = accessible.user.email;
        this.form.address = accessible.user.address;
        this.form.postcode = accessible.user.postcode;
        this.postcode = accessible.postcode;
        this.postcode = accessible.user.postcode;
        this.form.city = accessible.user.city;
        this.form.state = accessible.user.state;
        this.formSaksi.newWitness = false;
      } else if (this.form.currentIndex == -1) {
        console.log("this.form.currentIndex == -1");
        this.form.name = null;
        this.form.ic_number = null;
        this.form.email = null;
        this.form.address = null;
        this.form.postcode = null;
        this.postcode = null;
        this.postcode = null;
        this.form.city = null;
        this.form.state = null;
        this.formSaksi.newWitness = true;
      }
    },
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              this.form.city = postcode.city;
              this.form.state = postcode.state;
            }
          })
          .catch(() => {
            this.form.city = "";
            this.form.state = "";
          });
      }
    },
    async updateAmendment() {
      let obj = {
        _method: "PATCH",
        status: 5,
      };
      return await ApiService.post(`/amendment/${this.amendmentId}`, obj)
        .then((response) => {
          var data_obj = response.data.amendment;
          console.log(data_obj);
          this.amendment_array = data_obj;
          console.log("");
          this.amendment_id = data_obj.id;
          // this.$router.push({
          //   name: "trust.part-a",
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
    async outpage() {
      this.$router.push({ name: "hibah.list-client" });
    },
    async finish() {
      if (this.amendmentId) {
        let updatePindaan = await this.updateAmendment();
        if (updatePindaan) {
          this.$swal.fire({
            icon: "success",
            html: "Proses pengesahan saksi pindaan hibah telah selesai.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$router.push({ name: "dashboard" });
        }
      } else {
        let resultUpdate = await this.updateHibah();
        if (resultUpdate) {
          this.$swal.fire({
            icon: "success",
            html: "Proses hibah telah selesai.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$router.push({ name: "dashboard" });
        }
      }
    },
    async updateHibah() {
      let form = {};
      form._method = "PATCH";
      form.status = 5;
      console.log("form", form);
      return await ApiService.post(`/hibah/${this.trustId}`, form)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "userAccess",
      "userRole",
      "trust",
    ]),
    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          this.getUsers();
        }
      },
    },
    postcode: {
      handler: function (val) {
        this.form.postcode = val;
        this.getPostcode();
      },
    },
  },

  mounted() {
    if (this.amendmentId) {
      this.getAmendmentWitness();
    } else {
      this.getWitnesses();
    }
    this.getAwarisOrg();

    // this.getamendment();
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row" v-if="trust">
      <!-- {{ trust.user_detail }} -->
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-4" style="text-transform: uppercase">
              {{ $t("wasiatasas.witness-desc") }}
            </h5>
            <form class="login-form">
              <div class="row">
                <div class="table-responsive mt-3 mb-4">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col">{{ $t("index") }}</th>
                        <th scope="col">{{ $t("fullname") }}</th>
                        <th scope="col">{{ $t("mykad") }}</th>
                        <th scope="col">
                          {{ $t("action") }}
                        </th>
                      </tr>
                    </thead>
                    <!-- <tbody>
                      <tr>
                        <td colspan="4" class="text-center">
                          <h5 class="mt-5">Tiada saksi</h5>
                        </td>
                      </tr>
                    </tbody> -->
                    <tbody>
                      <tr v-for="(witness, index) in witnesses" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ witness.name }}</td>
                        <td>{{ witness.ic_number }}</td>
                        <td>
                          <b-button
                            class="btn-sm btn-danger"
                            @click="deleteWitness(witness, index)"
                            >{{ $t("remove") }}</b-button
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
              <div
                class="row mt-4"
                v-if="witnesses && witnesses.length < 4 && userRole == 'Staff'"
              >
                <div class="col-lg-12 text-center">
                  <a class="btn btn-primary btn-sm" @click="openSaksiModal">{{
                    $t("add-witness")
                  }}</a>
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
            <!-- <AddSaksi :form="formSaksi" @formAddPostcode="eventHandler" /> -->

            <div class="card-body" id="divCard">
              <div class="form-group">
                <label for="current_user">{{ $t("witnessmodal.title") }}</label>
                <select
                  name
                  id="current_user"
                  class="form-control"
                  v-model="form.currentIndex"
                  @change="fillSaksiForm"
                >
                  <option value="-2"></option>
                  <option value="-1">
                    -- {{ $t("witnessmodal.add-witness") }} --
                  </option>
                  <option
                    :value="index"
                    v-for="(accessible, index) in formSaksi"
                    :key="index"
                  >
                    {{ accessible.user.name }} ({{
                      accessible.accessible_type
                    }})
                  </option>
                </select>
              </div>
              <div v-if="form.currentIndex >= -1">
                <div class="form-group">
                  <label>{{ $t("fullname") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    v-uppercase
                    class="form-control"
                    v-model.trim="form.name"
                  />
                </div>
                <div class="form-group">
                  <label>{{ $t("mykad") }}</label>
                  <span class="text-danger">*</span>
                  <the-mask
                    id="ic_number"
                    :mask="['######-##-####']"
                    class="form-control"
                    v-model.trim="form.ic_number"
                  />
                </div>
                <div class="form-group">
                  <label>E-mel</label>
                  <span class="text-danger">*</span>
                  <the-mask
                    id="email"
                    class="form-control"
                    v-model.trim="form.email"
                  />
                </div>
                <div class="form-group mb-1">
                  <label for="exampleTextarea">
                    {{ $t("address") }}
                    <span class="text-danger">*</span>
                  </label>
                  <textarea
                    class="form-control"
                    v-model.trim="form.address"
                    rows="2"
                    value
                  ></textarea>
                </div>

                <div class="row mt-3">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="postcode" class="d-block">
                        <div class="d-flex align-items-center">
                          <span>{{ $t("postcode") }}</span>
                          <span class="text-danger">*</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        class="form-control"
                        @blur="getPostcode"
                        v-model.lazy.trim="postcode"
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="exampleSelect1"> {{ $t("city") }} </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.city"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="exampleSelect1"> {{ $t("state") }} </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.state"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ....... -->
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
          <b-button class="btn btn-primary" @click="finish">Selesai</b-button>
        </div>
      </div>
    </div>
    <div class="row" v-if="userRole == 'Client'">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <b-button class="btn btn-primary" @click="outpage">Keluar</b-button>
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
  </div>
</template>
