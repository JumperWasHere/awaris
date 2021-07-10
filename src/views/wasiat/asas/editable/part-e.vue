<script>
import ApiService from "@/services/api.service";
import { required } from "vuelidate/lib/validators";
export default {
  name: "EditablePartC",
  data() {
    return {
      wasiat_userdetails: null,
      newRelationship: null,
      form: {
        name: null,
        relationship: "Suami",
        mobile_number: null,
        home_phone_number: null,
        address: null,
        postcode: null,
        city: null,
        state: null,
        address_2: "",
        city_2: "",
        state_2: "",
        sameAddress: null,
      },
      submit: false,
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
      mobile_number: {
        required,
      },
      address: {
        required,
      },
    },
  },
  components: {},
  methods: {
    copyAddress() {
      if (this.form.sameAddress == 1) {
        console.log("");
        this.form.address = this.wasiat_userdetails.correspondence_address;
        this.form.city = this.wasiat_userdetails.correspondence_city;
        this.form.state = this.wasiat_userdetails.correspondence_state;
        this.form.postcode = this.wasiat_userdetails.correspondence_postcode;
        this.postcode = this.wasiat_userdetails.correspondence_postcode;
      } else {
        this.form.address = "";
        this.form.city = "";
        this.form.state = "";
        this.form.postcode = "";
        this.postcode = "";
      }
    },
    openpostcode() {
      this.$refs["modalPostcode"].show();
    },
    hideModal() {
      this.$refs["modalPostcode"].hide();
    },
    submitHeirForm() {
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
      this.submit = true;
      this.form.wasiat_id = this.wasiatId;
      if (this.heirId) {
        if (this.pengesahan) {
          this.form._method = "PATCH";
          ApiService.post(`heir/${this.wasiatId}`, this.form)
            .then((response) => {
              this.$router.push({
                name: "wasiat.part_f",
                query: {
                  wasiat_id: this.wasiatId,
                  pengesahan: this.pengesahan,
                },
              });
            })
            .catch((error) => {
              this.submit = false;
            });
        } else {
          this.form._method = "PATCH";
          ApiService.post(`heir/${this.wasiatId}`, this.form)
            .then((response) => {
              this.$router.push({
                name: "wasiat.part_f",
                query: { wasiat_id: this.wasiatId },
              });
            })
            .catch((error) => {
              this.submit = false;
            });
        }
      } else {
        if (this.pengesahan) {
          this.form.heirable_type = "Wasiat";
          this.form.heirable_id = this.wasiatId;
          ApiService.post(`heir`, this.form)
            .then((response) => {
              this.$router.push({
                name: "wasiat.part_f",
                query: {
                  wasiat_id: this.wasiatId,
                  pengesahan: this.pengesahan,
                },
              });
            })
            .catch((error) => {
              this.submit = false;
            });
        } else {
          this.form.heirable_type = "Wasiat";
          this.form.heirable_id = this.wasiatId;
          ApiService.post(`heir`, this.form)
            .then((response) => {
              this.$router.push({
                name: "wasiat.part_f",
                query: { wasiat_id: this.wasiatId },
              });
            })
            .catch((error) => {
              this.submit = false;
            });
        }
      }
    },
    getWasiat() {
      ApiService.get(`wasiat/${this.wasiatId}`).then((response) => {
        var wasiat = response.data.wasiat;
        this.wasiat_userdetails = wasiat.user_detail;

        console.log("wasiatDetails", this.wasiat_userdetails);
        if (wasiat.heir) {
          this.form = wasiat.heir;
          console.log(this.form);
          // this.form.relationshipTemp = wasiat.heir.relationship;
        }
      });
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
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
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
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    heirId() {
      return this.form.heir ? this.form.heir.id : null;
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
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
  mounted() {
    if (!this.$route.query.wasiat_id) {
      this.$router.push({ name: "wasiat.part_a" });
    }
    if (this.wasiatId) {
      this.getWasiat();
    }
  },
  watch: {
    locale: function () {
      if (!this.newRelationship) this.form.relationship = this.relationship[0];
    },
  },
};
</script>

<template>
  <div class="col-lg-12 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <div class="row d-flex justify-content-center">
              <h5 class="text-center mr-2" style="text-transform: uppercase">
                {{ $t("wasiatasas.heir-desc") }}
              </h5>
              <div id="tooltip-target-1">
                <b-icon
                  icon="exclamation-circle-fill"
                  variant="secondary"
                ></b-icon>
                <b-tooltip
                  target="tooltip-target-1"
                  triggers="hover"
                  placement="right"
                >
                  <label>
                    Maklumat Waris untuk dihubungi selepas kematian
                    Pewasiat.</label
                  >
                </b-tooltip>
              </div>
            </div>
            <form class="login-form">
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group position-relative"
                    :class="{ 'has-error': $v.form.name.$error }"
                  >
                    <label for="name">
                      {{ $t("fullname") }}
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      v-uppercase
                      class="form-control"
                      placeholder="Nama Penuh"
                      id="name"
                      v-model.trim="$v.form.name.$model"
                    />
                    <div
                      class="form-error"
                      v-if="$v.form.name.$error && !$v.form.name.required"
                    >
                      Nama Penuh tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{ 'has-error': $v.form.relationship.$error }"
                  >
                    <label for="relationship"
                      >{{ $t("relationship")
                      }}<span class="text-danger">*</span></label
                    >
                    <select
                      name="relationship"
                      id="relationship"
                      v-model.trim="$v.form.relationship.$model"
                      class="form-control"
                      @change="changeRelationship($event)"
                    >
                      <option value>
                        -- {{ $t("choose.relationship") }} --
                      </option>
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
                    <label for="mobile_number"
                      >{{ $t("mobile-no")
                      }}<span class="text-danger">*</span></label
                    >
                    <input
                      type="tel"
                      name="mobile_number"
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
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="home_phone_number">{{
                      $t("homeoffice-no")
                    }}</label>
                    <input
                      type="text"
                      id="home_phone_number"
                      v-model="form.home_phone_number"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <hr class="primary" />

              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': $v.form.address.$error,
                    }"
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
                        {{ $t("same-addresstestator") }}
                      </label>
                    </div>
                    <textarea
                      v-uppercase
                      class="form-control"
                      id="address_2"
                      rows="2"
                      :readonly="form.sameAddress == 1"
                      v-model="form.address"
                    ></textarea>
                    <div
                      class="form-error"
                      v-if="$v.form.address.$error && !$v.form.address.required"
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
                      id="postcode_2"
                      :readonly="form.sameAddress == 1"
                      class="form-control"
                      @blur="getPostcode(2)"
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
                      id="city_2"
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
                      id="state_2"
                      v-model="form.state"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <button @click="submitHeirForm" class="btn btn-primary" type="button">
            {{ $t("save-next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
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
