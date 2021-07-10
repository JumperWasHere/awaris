<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import { CREATE_CARETAKER } from "@/services/store/amanah-pusaka.module";

export default {
  data() {
    return {
      caretakers: null,
      newRelationship: null,
      form: {
        name: null,
        ic_number: null,
        mobile_number: null,
        home_phone_number: null,
        relationship: "Suami",
        address_1: null,
        postcode: null,
        city: null,
        state: null,
        email: null,
        bank_account_number: null,
        bank_name: null,
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
  },
  mounted() {},
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
    async submitForm() {
      this.$store.dispatch(CREATE_CARETAKER, {
        hibahId: this.hibah.id,
        payload: this.form,
      });
      this.$router.push({
        name: "trust-inheritance.caretaker",
        query: {
          hibah_id: this.hibah.id,
        },
      });
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.address_1 = this.hibah.user_detail.correspondence_address;
        this.form.city = this.hibah.user_detail.correspondence_city;
        this.form.state = this.hibah.user_detail.correspondence_state;
        this.form.postcode = this.hibah.user_detail.correspondence_postcode;
      } else {
        this.form.address_1 = "";
        this.form.city = "";
        this.form.state = "";
        this.form.postcode = "";
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
    hasAllowanceChange() {},
  },
  computed: {
    ...mapGetters(["hibah"]),
    trustId() {
      return this.$route.query.trust_id;
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
            name: 'trust-inheritance.caretaker',
            query: {},
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
              {{ $t("amendment.guardian-info") }}
              <img
                content="Penerima Amanah Dibawah Umur / OKU"
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
              <label for="name">
                {{ $t("name") }} <span class="text-danger">*</span></label
              >
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
              <div class="col-md-6">
                <div class="form-group">
                  <label for="email">{{ $t("email") }}</label>
                  <input type="text" id="email" class="form-control" />
                </div>
              </div>
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
                    :disabled="form.sameAddress == 1"
                    @blur="getPostcode(1)"
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
              <div class="col-md-6">
                <div class="form-group">
                  <label for="bank_name">Nama Bank</label>
                  <input
                    type="text"
                    id="bank_name"
                    class="form-control"
                    v-model="form.bank_account_number"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="account_no">No. Akaun</label>
                  <input
                    type="text"
                    id="account_no"
                    class="form-control"
                    v-model="form.bank_name"
                  />
                </div>
              </div>
              <div class="col-md-12 mb-3">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="check_has_allowance"
                    v-model="form.has_allowance"
                    @change="hasAllowanceChange"
                    value="1"
                  />
                  <label class="custom-control-label" for="check_has_allowance">
                    Elaun kepada penjaga
                  </label>
                </div>
              </div>
              <div class="col-md-6" v-if="form.has_allowance == 1">
                <div class="form-group">
                  <label for="bank_name">Jumlah</label>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">RM</span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.allowance_amount"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="form.has_allowance == 1">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="allowance_frequency">Kekerapan</label>
                  <select
                    name="allowance_frequency"
                    id="allowance_frequency"
                    class="form-control"
                    v-model="form.allowance_frequency"
                  >
                    <option value="1">Bulanan</option>
                    <option value="2">Suku Tahunan</option>
                    <option value="3">Setengah Tahunan</option>
                    <option value="4">Tahunan</option>
                    <option value="5">Lain-lain</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6" v-if="form.allowance_frequency == 5">
                <div class="form-group">
                  <label for="account_no">Lain-lain Kekerapan</label>
                  <input
                    type="text"
                    name="other_allowance_frequency"
                    id="other_allowance_frequency"
                    v-model="form.other_allowance_frequency"
                    class="form-control"
                  />
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
                {{ $t("save") }}
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
