<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  name: "HibahPartA",
  data() {
    return {
      wasiat: null,
      newRelationship: null,
      form: {
        designation: "Encik",
        address: null,
        postcode: null,
        city: null,
        state: null,
        address_2: "",
        city_2: "",
        state_2: "",
        sameAddress: null,
        relationship: null,
      },
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      formPostcode: {},
      postcode: null,
      receiver: {},
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      relationship: {
        required,
      },
      ic_number: {
        required,
      },
      email: {
        required,
      },
      mobile_number: {
        required,
      },
      address: {
        required,
      },
    },
    mykad: {
      frontUrl: {
        required,
      },
      backUrl: {
        required,
      },
    },
  },
  mounted() {
    this.getReceiver();
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
            console.log("postcode:", postcode);
          }
        });
      }
    },
    async submitForm() {
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
      var receiverId = await this.updateHeir();
      if (receiverId) {
        await this.storeDocument(
          this.receiverId,
          this.mykad.front,
          "mykad-front"
        );
        await this.storeDocument(
          this.receiverId,
          this.mykad.back,
          "mykad-back"
        );
        this.$router.push({
          name: "trust.part-f",
          query: {
            trust_id: this.trustId,
            message: "receiver-updated",
            amendment_id: this.amendmentId,
          },
        });
      }
    },
    async storePostcode() {
      await ApiService.post(`postcode`, this.formPostcode).then((response) => {
        this.postcode = this.formPostcode.postcode;
      });
      await this.getPostcode();
      this.formPostcode = {};
      this.$swal.fire({
        icon: "success",
        html: "Poskod baharu telah didaftarkan.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.address = this.trust.user_detail.correspondence_address;
        this.form.city = this.trust.user_detail.correspondence_city;
        this.form.state = this.trust.user_detail.correspondence_state;
        this.form.postcode = this.trust.user_detail.correspondence_postcode;
      } else {
        this.form.address = "";
        this.form.city = "";
        this.form.state = "";
        this.form.postcode = "";
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
      this.form.receiverable_id = this.trustId;
      this.form.receiverable_type = "Hibah";
      this.form._method = "PATCH";
      return await ApiService.post(`/receiver/${this.receiverId}`, this.form)
        .then((response) => {
          return response.data.receiver.id;
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
        return await ApiService.post(`/receiver/${userId}/document`, formData)
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    },
    async getReceiver() {
      return await ApiService.get(`receiver/${this.receiverId}`).then(
        (response) => {
          this.receiver = response.data.receiver;
          this.form = response.data.receiver;
          this.mykad.backUrl = response.data.receiver.mykad_back.public_path;
          this.mykad.frontUrl = response.data.receiver.mykad_front.public_path;
        }
      );
    },
    async changeRelationship(event) {
      if (["Others", "Lain-lain"].includes(event.target.value)) {
        const { value: newRelationship } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Hubungan</label></span>",
          input: "text",
        });
        if (newRelationship) {
          console.log(newRelationship);
          this.newRelationship = newRelationship;
          this.form.relationship = newRelationship;
        } else {
          this.form.relationship = this.relationship[0];
        }
      }
    },
    locale() {
      return this.$i18n.locale;
    },
  },
  computed: {
    ...mapGetters(["trust"]),
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    receiverId() {
      return this.$route.query.receiver_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    relationships() {
      var relationships = this.$t("relationships").split(",");
      if (this.newRelationship) {
        relationships.push(this.newRelationship);
      } else if (!relationships.includes(this.form.relationship)) {
        relationships.push(this.form.relationship);
      }
      return relationships;
    },
  },
  watch: {
    locale: function () {
      if (!this.newRelationship) this.form.relationship = this.relationship[0];
    },
  },
  components: { TheMask },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-md-12">
        <router-link
          class="d-flex align-items-center"
          :to="{
            name: 'trust.part-e',
            query: { trust_id: this.trustId, amendment_id: amendmentId },
          }"
        >
          <img src="/images/icon/left-arrow.png" height="20" alt="" />
          <p
            class="m-0"
            style="padding-left: 10px; padding-top: 2px; display: inline-block"
          >
            Kembali ke Senarai Penerima
          </p>
        </router-link>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2 mt-3">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-0">
              Kemaskini Maklumat Penerima
              <img
                content="Waris yang akan dihubungi jika berlaku kematian"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.name.$error }"
            >
              <label>
                Nama
                <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                v-uppercase
                v-model.trim="$v.form.name.$model"
                class="form-control"
              />
              <div
                class="form-error"
                v-if="$v.form.name.$error && !$v.form.name.required"
              >
                Nama tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.relationship.$error }"
            >
              <label>
                Hubungan
                <span class="text-danger">*</span>
              </label>
              <select
                v-model.trim="$v.form.relationship.$model"
                @change="changeRelationship($event)"
                class="form-control"
              >
                <option value>-- {{ $t("choose.relationship") }} --</option>
                <option
                  v-for="relationship in relationships"
                  :key="relationship"
                  :value="relationship"
                >
                  {{ relationship }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.form.relationship.$error && !$v.form.relationship.required
                "
              >
                Hubungan tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.ic_number.$error }"
                >
                  <label>
                    MyKad
                    <span class="text-danger">*</span>
                  </label>
                  <the-mask
                    id="ic_number"
                    :mask="['######-##-####']"
                    class="form-control"
                    v-model.trim="$v.form.ic_number.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.ic_number.$error && !$v.form.ic_number.required
                    "
                  >
                    No. MyKad tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.email.$error }"
                >
                  <label>
                    Emel
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    v-lowercase
                    class="form-control"
                    name="email"
                    v-model.trim="$v.form.email.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.email.$error && !$v.form.email.required"
                  >
                    Emel tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label> No. Telefon Rumah </label>
                  <input
                    type="text"
                    class="form-control"
                    name="userstate"
                    v-model="form.home_phone_number"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.email.$error }"
                >
                  <label>
                    No. Telefon Bimbit
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    name="mobile_no"
                    v-model.trim="$v.form.mobile_number.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.mobile_number.$error &&
                      !$v.form.mobile_number.required
                    "
                  >
                    No. Telefon Bimbit tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
            </div>
            <hr class="primary" />

            <div class="row">
              <div class="col-md-12">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.address.$error }"
                >
                  <label for="address"
                    >{{ $t("mailing-address")
                    }}<span class="text-danger">*</span></label
                  >
                  <div class="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      id="customCheck1"
                      v-model="form.sameAddress"
                      @change="copyAddress"
                      value="1"
                    />
                    <label class="custom-control-label" for="customCheck1">
                      {{ $t("trust.same-address") }}
                    </label>
                  </div>
                  <textarea
                    v-uppercase
                    class="form-control"
                    id="address_2"
                    rows="2"
                    :readonly="form.sameAddress == 1"
                    v-model.trim="$v.form.address.$model"
                  ></textarea>
                  <div
                    class="form-error"
                    v-if="$v.form.address.$error && !$v.form.address.required"
                  >
                    Alamat tidak boleh dibiarkan kosong.
                  </div>
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
                      <span>{{ $t("postcode") }}</span>
                      <span
                        @click="openpostcode"
                        style="
                          text-decoration: underline;
                          font-size: 11px;
                          color: #333;
                        "
                        >{{ $t("add-new") }}</span
                      >
                    </div>
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    class="form-control"
                    @blur="getPostcode(1)"
                    :readonly="form.sameAddress == 1"
                    v-model.lazy="form.postcode"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="city">{{ $t("city") }}</label>
                  <input
                    type="text"
                    v-uppercase
                    id="city"
                    v-model="form.city"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="state">{{ $t("state") }}</label>
                  <input
                    type="text"
                    v-uppercase
                    class="form-control"
                    id="state"
                    v-model="form.state"
                    readonly
                  />
                </div>
              </div>
            </div>
            <hr class="primary" />
            <div class="row">
              <div
                class="col-md-6 form-group"
                :class="{ 'has-error': $v.mykad.frontUrl.$error }"
              >
                <label for="upload-photo-2">
                  Lampiran Salinan MyKad (Depan)
                  <span class="text-danger">*</span>
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
                <div
                  class="form-error"
                  v-if="$v.mykad.frontUrl.$error && !$v.mykad.frontUrl.required"
                >
                  Dokumen tidak boleh dibiarkan kosong.
                </div>
              </div>
              <div
                class="col-md-6 form-group"
                :class="{ 'has-error': $v.mykad.backUrl.$error }"
              >
                <label for="upload-photo-1">
                  Lampiran Salinan MyKad (Belakang)
                  <span class="text-danger">*</span>
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
                <div
                  class="form-error"
                  v-if="$v.mykad.backUrl.$error && !$v.mykad.backUrl.required"
                >
                  Dokumen tidak boleh dibiarkan kosong.
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
    <b-modal
      ref="modalPostcode"
      class="modal fade"
      v-bind:title="$t('add-newpostcode')"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      @ok="storePostcode"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("postcode") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              class="form-control"
              v-model="formPostcode.postcode"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("city") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.city"
            />
          </div>
          <div class="col-md-6 form-group">
            <label>
              {{ $t("state") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.state"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
