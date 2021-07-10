<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { required } from "vuelidate/lib/validators";
export default {
  name: "HibahPartA",
  data() {
    return {
      wasiat: null,
      newDesignation: null,
      newRelationship: null,
      form: {},
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      caretakers: {},
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
      mobile_number: {
        required,
      },
      address_1: {
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
    this.getCaretakers();
    this.getDocuments();
  },
  methods: {
    openpostcode() {
      this.$refs["modalPostcode"].show();
      // modalPostcde;
    },
    hideModal() {
      this.$refs["modalPostcode"].hide();
    },
    getPostcode(type) {
      var postcode = this.form.postcode;
      if (type == 2) {
        postcode = this.form.postcode_2;
      }
      if (this.form.postcode) {
        ApiService.get(`postcode/${postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              if (type == 1) {
                this.form.city = postcode.city;
                this.form.state = postcode.state;
              } else {
                this.form.city_2 = postcode.city;
                this.form.state_2 = postcode.state;
              }
            }
          })
          .catch(() => {
            if (type == 1) {
              this.form.city = "";
              this.form.state = "";
            } else {
              this.form.city_2 = "";
              this.form.state_2 = "";
            }
          });
      }
    },
    getCaretakers() {
      ApiService.get(`hibah/${this.trustId}/caretaker`)
        .then((response) => {
          console.log("test", response.data);
          this.form = response.data.caretakers.data[0];
          // this.mykad.backUrl = response.data.caretakers.mykad_back.public_path;
          // this.mykad.frontUrl =
          //   response.data.caretakers.mykad_front.public_path;
        })
        .catch((error) => {
          console.log("error - catch - caretaker");
        });
    },
    getDocuments(caretakerId) {
      ApiService.get(`/caretaker/${this.caretakerId}/document`)
        .then((response) => {
          console.log("array document");
          var image_array = response.data.documents.data;
          var front = image_array.filter((item) => item.type == "mykad-front");
          var back = image_array.filter((item) => item.type == "mykad-back");
          this.mykad.frontUrl = front[0].public_path;
          this.mykad.backUrl = back[0].public_path;
          // console.log(front[0].public_path);
        })
        .catch((error) => {
          console.log("get document");
        });
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
      var caretakerId = await this.updateCaretaker();
      if (caretakerId) {
        await this.storeDocument(
          this.caretakerId,
          this.mykad.front,
          "mykad-front"
        );
        await this.storeDocument(
          this.caretakerId,
          this.mykad.back,
          "mykad-back"
        );
        this.$router.push({
          name: "trust.part-h",
          query: {
            trust_id: this.trustId,
            amendment_id: this.amendmentId,
          },
        });
      }
    },
    async updateCaretaker() {
      this.form.caretakerable_id = this.trustId;
      this.form.caretakerable_type = "Hibah";
      this.form._method = "PATCH";
      return await ApiService.post(`/caretaker/${this.caretakerId}`, this.form)
        .then((response) => {
          console.log(response.data.caretaker);
          return response.data.caretaker.id;
        })
        .catch((error) => {
          return false;
        });
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.address_2 = this.form.address_1;
        this.form.city_2 = this.form.city_1;
        this.form.state_2 = this.form.state_1;
        this.form.postcode_2 = this.form.postcode_1;
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
      formData.append("description", type);
      formData.append("type", type);
      // console.log(files[0]);
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.fileFront = formData;
        console.log(formData);
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
        this.fileBack = formData;
        console.log(formData);
      }
    },
    async storeDocument(userId, document, type) {
      if (document) {
        const formData = new FormData();
        formData.append("document", document, document.name);
        formData.append("type", type);
        return await ApiService.post(`/caretaker/${userId}/document`, formData)
          .then((response) => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    },
    async changeDesignation() {
      if (["Others", "Lain-lain"].includes(this.form.designation)) {
        const { value: newDesignation } = await this.$swal.fire({
          html:
            "<span style='margin-bottom:.5rem' class='form-group d-block w-100 text-left'><label style='margin-bottom:0px'>Gelaran</label></span>",
          input: "text",
        });
        if (newDesignation) {
          this.newDesignation = newDesignation;
          this.form.designation = newDesignation;
        } else {
          this.form.designation = this.designations[0];
        }
      }
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
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    designations() {
      var designations = this.$t("designations").split(",");
      if (this.newDesignation) designations.push(this.newDesignation);
      return designations;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    caretakerId() {
      return this.$route.query.caretaker_id;
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
      if (!this.newDesignation) this.form.designation = this.designations[0];
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
            name: 'trust.part-g',
            query: { trust_id: this.trustId, amendment_id: this.amendmentId },
          }"
        >
          <img src="/images/icon/left-arrow.png" height="20" alt="" />
          <p
            class="m-0"
            style="padding-left: 10px; padding-top: 2px; display: inline-block"
          >
            {{ $t("trust.returnto-guardianlist") }}
          </p>
        </router-link>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2 mt-3">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-0">
              {{ $t("amendment.update-guardian") }}
              <img
                content="Penerima Hibah Dibawah Umur / OKU"
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
              <label for="name"> {{ $t("name") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                class="form-control"
                name="name"
                v-uppercase
                v-model.trim="$v.form.name.$model"
              />
              <div
                class="form-error"
                v-if="$v.form.name.$error && !$v.form.name.required"
              >
                Nama tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div class="row">
              <div class="col-md-5">
                <div
                  class="form-group position-relative"
                  :class="{ 'has-error': $v.form.ic_number.$error }"
                >
                  <label for="ic_number">
                    {{ $t("mykad") }}
                  </label>
                  <span class="text-danger">*</span>
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
              <div class="col-md-7">
                <div class="form-group position-relative">
                  <label for="old_ic_number">
                    {{ $t("old-ic") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="old_ic_number"
                    v-model="form.old_ic_number"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.relationship.$error }"
                >
                  <label for="relationship">{{ $t("relationship") }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name="relationship"
                    id="relationship"
                    v-model.trim="$v.form.relationship.$model"
                    class="form-control"
                    @change="changeRelationship($event)"
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
                      $v.form.relationship.$error &&
                      !$v.form.relationship.required
                    "
                  >
                    Hubungan tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.mobile_number.$error }"
                >
                  <label for="mobile_number">{{ $t("mobile-no") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    id="mobile_number"
                    v-model.trim="$v.form.mobile_number.$model"
                    class="form-control"
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
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="home_phone_number">{{ $t("home-telno") }}</label>
                  <input
                    type="text"
                    id="home_phone_number"
                    v-model="form.home_phone_number"
                    class="form-control"
                  />
                </div>
              </div>

              <!-- <div class="col-md-6">
                <div class="form-group">
                  <label for="office_number">{{ $t("office-no") }}</label>
                  <input
                    type="text"
                    id="office_number"
                    v-model="form.office_number"
                    class="form-control"
                  />
                </div>
              </div> -->
            </div>
            <hr class="primary" />

            <div class="row">
              <div class="col-md-12">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.address_1.$error }"
                >
                  <label for="address">{{ $t("mailing-address") }}</label>
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
                    id="address"
                    rows="2"
                    :readonly="form.sameAddress == 1"
                    v-model="$v.form.address_1.$model"
                  ></textarea>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.address_1.$error && !$v.form.address_1.required
                    "
                  >
                    Alamat Surat Menyurat tidak boleh dibiarkan kosong.
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
                    v-model="form.postcode"
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
                    class="form-control"
                    readonly
                    v-model="form.city"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="state">{{ $t("state") }}</label>
                  <input
                    type="text"
                    v-uppercase
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
              <div
                class="col-md-6 form-group"
                :class="{ 'has-error': $v.mykad.frontUrl.$error }"
              >
                <label for="upload-photo-2">
                  {{ $t("mykadcopy-front") }}
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
                      <span>{{ $t("choose.mykadfront") }}</span>
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
                  {{ $t("mykadcopy-back") }}
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
                      <span>{{ $t("choose.mykadback") }}</span>
                    </label>
                    <input
                      type="file"
                      name="photo"
                      id="upload-photo-1"
                      class="upload-photo-input"
                      accept="image/*"
                      @change="filesChange($event.target.files, 'mykad-back')"
                    />
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
                {{ $t("update") }}
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
