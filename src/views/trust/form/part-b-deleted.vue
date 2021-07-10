<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";

export default {
  name: "HibahPartA",
  data() {
    return {
      wasiat: null,
      form: {
        designation: "Encik",
        city: "",
        state: "",
      },
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      postcode: null,
      heirs: null,
    };
  },
  mounted() {
    this.getHeirs();
  },
  methods: {
    openpostcode() {
      this.$refs["modalPostcode"].show();
      // modalPostcde;
    },
    hideModal() {
      this.$refs["modalPostcode"].hide();
    },
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`).then((response) => {
          var postcode = response.data.postcode;
          if (postcode != null) {
            this.form.city = postcode.city;
            this.form.state = postcode.state;
          }
        });
      }
    },
    async submitForm() {
      this.$router.push({
        name: "trust.part-c",
        query: { trust_id: this.hibahId },
      });
    },
    filesChange(files, type) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");
      // console.log(files[0]);
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
      }
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.address_2 = this.form.address;
        this.form.city_2 = this.form.city;
        this.form.state_2 = this.form.state;
        this.form.postcode_2 = this.form.address;
      } else {
        this.form.address_2 = "";
        this.form.city_2 = "";
        this.form.state_2 = "";
        this.form.postcode_2 = "";
      }
    },
    filesChange(files, type) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
      }
    },
    async createHeir() {
      console.log("HIBAH: ", this.hibahId);
      this.form.heirable_id = this.hibahId;
      this.form.heirable_type = "Hibah";
      return await ApiService.post(`/heir`, this.form)
        .then((response) => {
          return response.data.heir.id;
        })
        .catch((error) => {
          return false;
        });
    },
    async storeDocument(userId, document, type) {
      const formData = new FormData();
      formData.append("document", document, "nama file");
      formData.append("type", type);
      return await ApiService.post(`/heir/${userId}/document`, formData)
        .then((response) => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    getHeirs() {
      ApiService.get(`hibah/${this.trustId}/heir`).then((response) => {
        this.heirs = response.data.heirs.data;
        console.log(this.heirs);
      });
    },
    removeHeir(heirId) {
      ApiService.post(`heir/${heirId}`, {
        _method: "DELETE",
      }).then((response) => {
        this.getHeirs();
      });
    },
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    routeMessage() {
      return this.$route.query.message;
    },
    ...mapGetters(["preference"]),
    allowAddHeir() {
      if (this.preference && this.preference.hibah_single_heir == 1) {
        if (this.heirs && this.heirs.length >= 1) {
          return false;
        }
      }
      return true;
    },
  },
  components: { TheMask },
  watch: {
    postcode: {
      handler: function (val) {
        this.form.postcode = val;
        if (val != "") {
          this.getPostcode();
        }
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-md-12" v-if="routeMessage == 'heir-added'">
        <div class="alert alert-success">Maklumat pewaris telah ditambah.</div>
      </div>
      <div class="col-md-12" v-if="routeMessage == 'heir-updated'">
        <div class="alert alert-success">
          Maklumat pewaris telah dikemaskini.
        </div>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-bodyz">
            <h5 class="text-center mt-4 mb-5">
              Maklumat Waris
              <img
                content="Waris yang akan dihubungi jika berlaku kematian"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>
            <div class="text-right mr-2" v-if="allowAddHeir">
              <router-link
                :to="{
                  name: 'trust.add-heir',
                  query: { trust_id: this.trustId },
                }"
                class="btn btn-primary btn-sm"
              >
                Tambah</router-link
              >
            </div>
            <div class="row mb-2">
              <div class="col-lg-12">
                <div class="table-responsive p-2 mt-3 mb-4">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>MyKad</th>
                        <th>Hubungan</th>
                        <th>No. Telefon Bimbit</th>
                        <th class="text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(heir, index) in heirs" :key="index">
                        <td>{{ heir.name }}</td>
                        <td>{{ heir.ic_number }}</td>
                        <td>{{ heir.relationship }}</td>
                        <td>{{ heir.mobile_number }}</td>
                        <td class="text-right">
                          <div
                            class="btn-group-vertical"
                            role="group"
                            aria-label="Vertical button group"
                          >
                            <router-link
                              class="btn btn-secondary btn-sm"
                              :to="{
                                name: 'trust.heir.update',
                                query: {
                                  trust_id: trustId,
                                  heir_id: heir.id,
                                },
                              }"
                              >Kemaskini</router-link
                            >
                            <button
                              @click="removeHeir(heir.id)"
                              class="btn btn-danger btn-sm"
                            >
                              Buang
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="heirs && heirs.length == 0">
                        <td colspan="5" class="text-center">
                          <h6 class="mt-5 mb-5">Tiada Data</h6>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <router-link
                :to="{ name: 'trust.part-c', query: { trust_id: trustId } }"
                class="btn btn-primary"
              >
                Seterusnya
                <span
                  class="spinner-border spinner-border-sm"
                  v-if="submit"
                ></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal ref="modalPostcode" class="modal fade" hide-footer>
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Tambah Poskod</h5>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>
            Poskod
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
            Bandar
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control saveCity" name="userstate" />
        </div>
        <div class="form-group">
          <label>
            Negeri
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control saveState" name="userstate" />
        </div>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal"
        >Close Me</b-button
      >
    </b-modal>
  </div>
</template>
