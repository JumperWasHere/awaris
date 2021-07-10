<script>
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
      heir: {},
    };
  },
  mounted() {
    this.getHeir();
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
      var heirId = await this.updateHeir();
      if (heirId) {
        await this.storeDocument(this.heirId, this.mykad.front, "mykad-front");
        await this.storeDocument(this.heirId, this.mykad.back, "mykad-back");
        this.$router.push({
          name: "trust.part-b",
          query: {
            trust_id: this.trustId,
            message: "heir-updated",
            amendment_id: amendmentId,
          },
        });
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
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
      }
    },
    async updateHeir() {
      this.form.heirable_id = this.trustId;
      this.form.heirable_type = "Hibah";
      this.form._method = "PATCH";
      return await ApiService.post(`/heir/${this.heirId}`, this.form)
        .then((response) => {
          return response.data.heir.id;
        })
        .catch((error) => {
          return false;
        });
    },
    async storeDocument(userId, document, type) {
      if (document) {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);
        return await ApiService.post(`/heir/${userId}/document`, formData)
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    },
    async getHeir() {
      return await ApiService.get(`heir/${this.heirId}`).then((response) => {
        this.heir = response.data.heir;
        this.form = response.data.heir;
        this.mykad.backUrl = response.data.heir.mykad_back.public_path;
        this.mykad.frontUrl = response.data.heir.mykad_front.public_path;
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
    heirId() {
      return this.$route.query.heir_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
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
      <div class="col-md-12">
        <router-link
          class="d-flex align-items-center"
          :to="{
            name: 'trust.part-b',
            query: { trust_id: this.trustId, amendment_id: amendmentId },
          }"
        >
          <img src="/images/icon/left-arrow.png" height="20" alt="" />
          <p
            class="m-0"
            style="padding-left: 10px; padding-top: 2px; display: inline-block"
          >
            Kembali ke Senarai Waris
          </p>
        </router-link>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2 mt-3">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-0">
              Kemaskini Maklumat Waris
              <img
                content="Waris yang akan dihubungi jika berlaku kematian"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>
            <div class="form-group">
              <label for="exampleInputEmail1">
                Nama <span class="text-danger">*</span></label
              >
              <div class="input-group">
                <div class="input-group-prepend">
                  <select
                    class="form-control"
                    style="
                      border-bottom-right-radius: 0;
                      border-top-right-radius: 0;
                    "
                    v-model="form.designation"
                  >
                    <option value="Encik">Encik</option>
                    <option value="Puan">Puan</option>
                    <option value="Dato">Dato</option>
                    <option value="Datin">Datin</option>
                  </select>
                </div>
                <input
                  type="text"
                  class="form-control"
                  name
                  id="full_name"
                  required
                  v-model="form.name"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group position-relative">
                  <label for="ic_number">
                    MyKad
                    <span class="text-danger">*</span>
                  </label>
                  <the-mask
                    id="ic_number"
                    :mask="['######-##-####']"
                    class="form-control"
                    v-model="form.ic_number"
                  />
                </div>
              </div>
              <div class="col-md-8">
                <div class="form-group position-relative">
                  <label for="old_ic_number">
                    No. Kad Pengenalan Lama / Polis / Tentera / Passport
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="old_ic_number"
                    v-model="form.other_ic_number"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="relationship"
                    >Hubungan <span class="text-danger">*</span></label
                  >
                  <!-- <input
                    type="text"
                    id="relationship"
                    class="form-control"
                    v-model="form.relationship"
                  /> -->
                  <select
                    v-model.trim="form.relationship"
                    class="form-control custom-select"
                  >
                    <option>- Pilih Hubungan -</option>
                    <option value="Suami">Suami</option>
                    <option value="Isteri">Isteri</option>
                    <option value="Anak">Anak</option>
                    <option value="Penjaga">Penjaga</option>
                    <option value="Adik-Beradik">Adik-Beradik</option>
                    <option value="Bapa">Bapa</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Saudara">Saudara</option>
                    <option value="">Lain-Lain</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="email">Emel</label>
                  <input
                    type="text"
                    id="email"
                    class="form-control"
                    v-model="form.email"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="home_phone_number">No. Telefon Rumah</label>
                  <input
                    type="text"
                    id="home_phone_number"
                    v-model="form.home_phone_number"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="mobile_number">No. Tel Bimbit</label>
                  <input
                    type="text"
                    id="mobile_number"
                    v-model="form.mobile_number"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="office_number">No. Tel Pejabat</label>
                  <input
                    type="text"
                    id="office_number"
                    v-model="form.office_phone_number"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            <hr class="primary" />

            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="address">Alamat Surat Menyurat </label>
                  <textarea
                    class="form-control"
                    id="address"
                    rows="2"
                    v-model="form.address"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="postcode" class="d-block">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span>Poskod</span>
                      <span
                        @click="openpostcode"
                        style="
                          text-decoration: underline;
                          font-size: 11px;
                          color: #333;
                        "
                        >Tambah Baru</span
                      >
                    </div>
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    class="form-control"
                    @blur="getPostcode"
                    v-model.lazy="form.postcode"
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="form-group">
                  <label for="city">Bandar</label>
                  <input
                    type="text"
                    id="city"
                    class="form-control"
                    readonly
                    v-model="form.city"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="state">Negeri</label>
                  <input
                    type="text"
                    id="state"
                    class="form-control"
                    readonly
                    v-model="form.state"
                  />
                </div>
              </div>
            </div>

            <hr class="primary" />
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="upload-photo-2">
                  Lampiran Salinan MyKad (Depan)
                </label>
                <div class="card rounded shadow bg-dark">
                  <div
                    class="d-flex align-items-center justify-content-center bd-highlight"
                    style="height: 150px"
                  >
                    <label
                      v-if="mykad.frontUrl"
                      :style="'background-image: url(' + mykad.frontUrl + ');'"
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
                      v-if="!mykad.frontUrl"
                    >
                      <span>Pilih Salinan</span>
                    </label>
                    <input
                      type="file"
                      name="photo"
                      id="upload-photo-2"
                      class="upload-photo-input"
                      accept="image/*"
                      @change="filesChange($event.target.files, 'mykad-front')"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 form-group">
                <label for="upload-photo-1">
                  Lampiran Salinan MyKad (Belakang)
                </label>
                <div class="card rounded shadow bg-dark">
                  <div
                    class="d-flex align-items-center justify-content-center bd-highlight"
                    style="height: 150px"
                  >
                    <label
                      v-if="mykad.backUrl"
                      :style="'background-image: url(' + mykad.backUrl + ');'"
                      style="
                        border-radius: 5px;
                        margin-bottom: 0;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        height: 100%;
                        width: 100%;
                      "
                      for="upload-photo-1"
                    ></label>
                    <label
                      class="upload-photo-dark text-center"
                      for="upload-photo-1"
                      v-if="!mykad.backUrl"
                    >
                      <span>Pilih Salinan</span>
                    </label>
                    <input
                      type="file"
                      name="photo"
                      id="upload-photo-1"
                      class="upload-photo-input"
                      accept="image/*"
                      @change="filesChange($event.target.files, 'mykad-back')"
                    />
                    <!-- <div class="p-2 bd-highlight">
                      <p href="#" class="text-white text-center m-0">Pilih</p>
                      <input
                        type="file"
                        class="form-control-file"
                        required
                        id="fileupload"
                      />
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <button type="button" @click="submitForm" class="btn btn-primary">
                Simpan & Seterusnya
                <span
                  class="spinner-border spinner-border-sm"
                  v-if="submit"
                ></span>
              </button>
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
