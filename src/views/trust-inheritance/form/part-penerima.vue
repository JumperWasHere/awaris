<script>
import { TheMask } from "vue-the-mask";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { WITNESS_SIGN } from "@/services/store/trust.module";
export default {
  data() {
    return { receivers: null, signature: null };
  },
  components: { TheMask },
  computed: {
    ...mapGetters([
      "userRole",
      "currentUser",
      "trust",
      "amendment",
      "witness_sign",
    ]),
    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id ?? null;
    },
  },
  watch: {
    wasiat: {
      handler: function (val) {
        // console.log("wasiat_watcher", val);
        if (this.wasiat) {
          this.form.ic_number = this.wasiat.user.ic_number;
        }
      },
    },
  },

  mounted() {
    this.getReceivers();
  },
  methods: {
    async submitForm() {
      if (this.amendmentId && this.amendment && this.amendment.status == 3) {
        if (this.witness_sign && this.witness_sign.count != 0) {
          var data = this.witness_sign.receivers.map((item) => item.name);
          this.$swal.fire({
            icon: "error",
            html: "Sila dapatkan tandatangan Penerima: " + data.join(", "),
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        let updateAmendment = this.updateAmendment();
        if (updateAmendment) {
          this.$router.push({
            name: "trust.part-listpindaan",
            query: {
              success: true,
              amendment_id: this.amendmentId,
              trust_id: this.trustId,
            },
          });
        }
      } else if (
        !this.amendmentId &&
        this.trust.status == 3 &&
        this.trust.is_draft_accepted
      ) {
        // var checkSign = await this.checkSign();

        if (this.witness_sign && this.witness_sign.count != 0) {
          console.log("witness_sign", this.witness_sign.receivers);
          var data = this.witness_sign.receivers.map((item) => item.name);

          console.log("rev", data.join(", "));
          this.$swal.fire({
            icon: "error",
            html: "Sila dapatkan tandatangan Penerima: " + data.join(", "),
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        }
        //TODO:x confirm lagi
        let result = await this.updateHibah();
        if (result) {
          this.$router.push({
            name: "dashboard",
            query: {
              statusHibah: "success",
            },
          });
        }
      }
    },
    // async checkSign() {
    //   return await ApiService.get(
    //     `hibah/${this.trustId}/receiver/validate-signature`
    //   )
    //     .then((response) => {
    //       return response.data;
    //     })
    //     .catch((error) => {
    //       return false;
    //     });
    // },
    async updateHibah() {
      return await ApiService.post(`/hibah/${this.trustId}`, {
        _method: "PATCH",
        status: 4,
      })
        .then((response) => {
          console.log(response.data);

          return true;
        })
        .catch((error) => {
          console.log("error update");
          return false;
        });
    },
    async updateAmendment() {
      return await ApiService.post(`/amendment/${this.amendmentId}`, {
        _method: "PATCH",
        status: 4,
      })
        .then((response) => {
          var data_obj = response.data.amendment;
          console.log(data_obj);
          this.amendment_array = data_obj;
          console.log("");
          this.amendment_id = data_obj.id;
          return true;
        })
        .catch((error) => {
          console.log("error");
          return false;
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    getReceivers() {
      ApiService.get(`hibah/${this.trustId}/receiver`).then((response) => {
        this.receivers = response.data.receivers.data ?? [];
      });
    },
    async modalsignature(receiver_id) {
      let signature = await this.getReceiverSign(receiver_id);
      if (signature != null) {
        this.signature = signature.public_path;
      } else {
        this.signature = null;
      }
      this.currentReceiver_id = receiver_id;
      this.$refs["mmodalSign"].show();
    },
    async getReceiverSign(receiver_id) {
      return await ApiService.get(
        `/receiver/${receiver_id}/signature?stream=false`
      )
        .then((response) => {
          console.log(response.data);
          return response.data.signature;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async addsign() {
      if (this.signature) {
        this.signature = null;
        return;
      }
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log("Signature data empty: ", isEmpty);
      if (!isEmpty) {
        return await ApiService.post(
          `/receiver/${this.currentReceiver_id}/signature`,
          {
            // description: "",
            is_base64: true,
            document: data,
          }
        )
          .then((response) => {
            this.$store.dispatch(WITNESS_SIGN, this.trustId);

            this.currentReceiver_id = null;

            this.$swal.fire({
              icon: "success",
              html:
                "Anda telah berjaya mendaftar tandatangan saksi " +
                this.form.email,
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            });
            return true;
          })
          .catch((error) => {
            this.submit = false;
            this.currentReceiver_id = null;

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
    hidemmodalSign() {},
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center">Tandatangan Penerima</h5>
        <div class="row mb-2">
          <div class="col-lg-12">
            <div class="table-responsive p-2 mt-3 mb-4">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>{{ $t("name") }}</th>
                    <th>{{ $t("mykad") }}</th>
                    <th>{{ $t("relationship") }}</th>
                    <th>{{ $t("email") }}</th>
                    <th>{{ $t("mobile-no") }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(receiver, index) in receivers" :key="index">
                    <td>{{ receiver.name }}</td>
                    <td>{{ receiver.ic_number }}</td>
                    <td>{{ receiver.relationship }}</td>
                    <td>{{ receiver.email }}</td>
                    <td>{{ receiver.mobile_number }}</td>
                    <td class="text-right">
                      <div
                        class="btn-group-vertical"
                        role="group"
                        aria-label="Vertical button group"
                      >
                        <!-- <router-link
                          class="btn btn-secondary btn-sm"
                          :to="{
                            name: 'trust.receiver.update',
                            query: {
                              trust_id: trustId,
                              receiver_id: receiver.id,
                            },
                          }"
                          >{{ $t("update") }}</router-link
                        > -->
                        <button
                          @click="modalsignature(receiver.id)"
                          class="btn btn-primary btn-sm"
                        >
                          Signature
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="receivers && receivers.length == 0">
                    <td colspan="6" class="text-center">
                      <h5 class="mt-5 mb-5">{{ $t("no-data") }}</h5>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right mt-3">
      <button @click="submitForm" class="btn btn-primary">
        {{ $t("save-next") }}
      </button>
    </div>
    <b-modal
      ref="mmodalSign"
      id="modal-1"
      title="Tambah Tandatangan Penerima"
      class="modal fade"
      ok-title="Simpan"
      cancel-title="Batal"
      @ok="addsign"
      @cancel="hidemmodalSign"
      :no-enforce-focus="true"
    >
      <div class="row mt-3">
        <div class="col-md-12 text-center">
          <div
            class="card"
            style="width: 400px; display: inline-block"
            v-if="!signature"
          >
            <div style="position: relative; height: 300px; width: 100%">
              <VueSignaturePad
                style="position: absolute; z-index: 1"
                height="300px"
                width="500px"
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
          <!-- <div v-if="signature">
              {{ signature }} -->
          <img :src="signature" alt srcset style="width: 300px" class="mt-3" />
          <!-- </div> -->
        </div>
      </div>
    </b-modal>
  </div>
</template>