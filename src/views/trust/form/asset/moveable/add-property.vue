<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { mapGetters } from "vuex";
import banks from "utility/banks.json";

export default {
  // name: "HibahPartA",
  data() {
    return {
      banks: banks,
      wasiat: null,
      hibah_type: null,
      // form: {
      //   moveable_type: "Hibah",
      //   property_type: "",
      // },
      selectPropertyArray: null,
      submit: false,
      loader: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      moveableProperty: {
        _method: null,
        wasiat_id: null,
        bank_type: null,
        bank_branch: null,
        bank_account_no: null,
        property_type: null,
        transport_type: null,
        transport_manufacturer: null,
        transport_model: null,
        transport_registration_number: null,
        moveable_id: null, //wasiat_id
        moveable_type: "Hibah",
        agreement_number: null,
        company_registration_number: null,
        institution_name: null,
        account_number: null,
        policy_number: null,
      },
      preferenceLabel: null,
    };
  },

  methods: {
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
      this.moveableProperty.moveable_id = this.trustId;
      this.moveableProperty.saham_product_name = this.preference.hibah_fixed_saham_type;
      ApiService.post("moveable-property", this.moveableProperty).then(
        (response) => {
          var propertyId = response.data.moveable_property.id;
          this.$router.push({
            name: "trust.moveable-property.receiver",
            query: {
              trust_id: this.trustId,
              message: "saved",
              property_id: propertyId,
              amendment_id: this.amendmentId,
            },
          });
        }
      );
      // var propertyId = 1;
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

    async getOgranization(organization_id) {
      return await ApiService.get(`/organization/${organization_id}`)
        .then((response) => {
          console.log(response.data);
          this.moveableProperty.institution_name =
            response.data.organization.name;
          console.log(
            "institution_name",
            this.moveableProperty.institution_name
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
    // this.setMoveableArray();
  },
  computed: {
    ...mapGetters(["preference", "trust", "userAccess", "userRole"]),
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    setMoveableArray() {
      // console.log("hibah_type", this.trust);
      if (["1", "2"].includes(this.trust.hibah_type)) {
        return [{ name: "Saham", value: "Saham" }];
      } else if (this.trust.hibah_type == "3") {
        return [{ name: "Syarikat", value: "Syarikat" }];
      } else if (["4", "5"].includes(this.trust.hibah_type)) {
        return [
          { name: "Bank", value: "Bank" },
          { name: "Simpanan", value: "Simpanan" },
        ];
      } else if (["6", "7"].includes(this.trust.hibah_type)) {
        return [
          { name: "Bank", value: "Bank" },
          { name: "Kenderaan", value: "Kenderaan" },
          { name: "Simpanan", value: "Simpanan" },
          { name: "Insurance", value: "Insurance" },
          { name: "Saham", value: "Saham" },
        ];
      }
    },
  },
  components: { TheMask },
  watch: {
    preference: {
      handler: function (val) {
        if (val) {
          console.log("vla", val);
          this.moveableProperty.property_type = val.hibah_fixed_property_type;
          console.log("watch pre", this.moveableProperty.property_type);
          // this.moveableProperty.institution_name = this.userAccess.accessible.name;
          if (val.organization_id) {
            this.getOgranization(val.organization_id);
          }
          this.moveableProperty.other_type = val.hibah_fixed_saham_type;
          // this.moveableProperty.property_type = val.hibah_fixed_saham_type;
          this.loader = true;
          this.preferenceLabel = val.corporate_saham_account_type;
        }
      },
    },

    trust: {
      handler: function (val) {
        // if (val) {
        //   if (["1", "2"].includes(val.hibah_type)) {
        //     if (this.preference) {
        //       this.preferenceLabel = this.preference.corporate_saham_account_type;
        //     }
        //   }
        // }
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row" v-if="preference">
      <!-- {{ preference }} -->
      <div class="col-lg-12 col-12 mb-4 pb-2" v-if="trust">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">{{ $t("trust.prop-info") }}</h5>

            <div class="row mt-4">
              <div class="col-md-7">
                <div class="form-group">
                  <label
                    v-if="['Super Admin', 'Staff'].includes(userRole)"
                    for="property_type"
                    >{{ $t("property-type2") }}
                  </label>
                  <label
                    v-if="['Client', 'Agent'].includes(userRole)"
                    for="property_type"
                    >Institusi
                  </label>
                  <select
                    v-if="this.trust"
                    name=""
                    id=""
                    class="form-control"
                    v-model="moveableProperty.property_type"
                    :disabled="
                      preference && preference.hibah_fixed_property_type != null
                    "
                  >
                    <option value="-">
                      -- {{ $t("choose.property-type") }} --
                    </option>
                    <option
                      :value="property.value"
                      v-for="property in setMoveableArray"
                      :key="property.value"
                    >
                      {{ property.name }}
                    </option>
                  </select>
                </div>
                <div
                  class="form-group"
                  v-if="preference && ['1', '2'].includes(trust.hibah_type)"
                >
                  <label v-if="['Super Admin', 'Staff'].includes(userRole)">
                    Nama Saham
                  </label>
                  <label v-if="['Client', 'Agent'].includes(userRole)">
                    Maklumat Akaun
                  </label>
                  <input
                    type="text"
                    name="hibah_fixed_saham_type"
                    class="form-control"
                    v-model="preference.hibah_fixed_saham_type"
                    :readonly="
                      preference && ['1', '2'].includes(trust.hibah_type)
                    "
                  />
                </div>
              </div>
            </div>
            <hr class="primary" v-if="moveableProperty.property_type" />
          </div>
          <div class="" v-if="moveableProperty.property_type == 'Saham'">
            <div class="card-body">
              <div class="form-group">
                <label>
                  {{ $t("org-name") }}
                </label>
                <input
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('org-name')"
                  v-model="moveableProperty.institution_name"
                />
              </div>
              <div class="form-group">
                <!-- {{ preferenceLabel }} -->
                <!-- {{ preference.corporate_saham_account_type }} -->
                <label
                  v-if="
                    trust &&
                    ['1', '2'].includes(trust.hibah_type) &&
                    preferenceLabel
                  "
                >
                  {{ preferenceLabel }}
                </label>
                <label v-if="!['1', '2'].includes(trust.hibah_type)">
                  {{ $t("accmembership-no") }}
                </label>
                <input
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="preferenceLabel"
                  v-model="moveableProperty.account_number"
                />
              </div>
            </div>
          </div>
          <div class="" v-if="moveableProperty.property_type == 'Insurance'">
            <div class="card-body">
              <div class="form-group">
                <label>
                  {{ $t("org-name") }}
                </label>
                <input
                  v-model="moveableProperty.institution_name"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('org-name')"
                />
              </div>
              <div class="form-group">
                <label>
                  {{ $t("policy-no") }}
                </label>
                <input
                  v-model="moveableProperty.policy_number"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('policy-no')"
                />
              </div>
            </div>
          </div>
          <div class="" v-if="moveableProperty.property_type == 'Simpanan'">
            <div class="card-body">
              <div class="form-group">
                <label>
                  {{ $t("org-name") }}
                </label>
                <input
                  v-model.trim="moveableProperty.institution_name"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('org-name')"
                />
              </div>
              <div class="form-group">
                <label>
                  {{ $t("accmembership-no") }}
                </label>
                <input
                  v-model.trim="moveableProperty.account_number"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('accmembership-no')"
                />
              </div>
            </div>
          </div>
          <div class="" v-if="moveableProperty.property_type == 'Syarikat'">
            <div class="card-body">
              <div class="form-group">
                <input
                  v-model="moveableProperty.institution_name"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('org-name')"
                />
              </div>
              <div class="form-group">
                <input
                  v-model="moveableProperty.company_registration_number"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('co-regno')"
                />
              </div>
            </div>
          </div>
          <div class="" v-if="moveableProperty.property_type == 'Kenderaan'">
            <div class="card-body">
              <div class="form-group">
                <div
                  style="position: absolute; right: 1%; top: 45.5%"
                  id="tooltip-target-1"
                >
                  <b-icon
                    icon="exclamation-circle-fill"
                    variant="secondary"
                  ></b-icon>
                  <!-- <span class="tooltiptext">Tooltip text</span> -->
                  <b-tooltip
                    target="tooltip-target-1"
                    triggers="hover"
                    placement="right"
                  >
                    <label> {{ $t("vehicle-types") }}.</label>
                  </b-tooltip>
                </div>
                <label>{{ $t("vehicle-type") }}</label>
                <input
                  v-model="moveableProperty.transport_type"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('vehicle-type')"
                />
              </div>
              <div class="form-group">
                <label> {{ $t("made-in") }} </label>

                <input
                  v-model="moveableProperty.transport_manufacturer"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('made-in')"
                />
              </div>
              <div class="form-group">
                <label> {{ $t("model-name") }} </label>

                <input
                  v-model="moveableProperty.transport_model"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('model-name')"
                />
              </div>
              <div class="form-group">
                <label>{{ $t("org.reg-no") }}</label>

                <input
                  v-model="moveableProperty.transport_registration_number"
                  type="text"
                  name=""
                  class="form-control"
                  v-bind:placeholder="$t('org.reg-no')"
                />
              </div>
            </div>
          </div>
          <div class="" v-if="moveableProperty.property_type == 'Bank'">
            <div class="card-body">
              <div class="form-group">
                <label>{{ $t("bank-type") }}</label>
                <span class="text-danger">*</span>
                <select
                  name=""
                  class="form-control"
                  v-model.trim="moveableProperty.bank_type"
                >
                  <option value="">-- {{ $t("choose.bank-type") }} --</option>
                  <option
                    v-for="(item, index) in banks"
                    :key="index"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </option>
                  <!-- <option value="AFFIN BANK BERHAD">AFFIN BANK BERHAD</option>
                  <option value="AGROBANK">AGROBANK</option>
                  <option
                    value="AL RAJHI & INVESTMENT CORPORATION(MALAYSIA) BERHAD"
                  >
                    AL RAJHI & INVESTMENT CORPORATION(MALAYSIA) BERHAD
                  </option>
                  <option value="ALLIANCE BANK MALAYSIA BERHAD">
                    ALLIANCE BANK MALAYSIA BERHAD
                  </option>
                  <option value="AMBANK">AMBANK</option>
                  <option value="ASIAN FINANCE BANK">ASIAN FINANCE BANK</option> -->
                </select>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  v-uppercase
                  name=""
                  class="form-control"
                  v-model.trim="moveableProperty.bank_branch"
                  v-bind:placeholder="$t('bank-branches')"
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  name=""
                  class="form-control"
                  v-model.trim="moveableProperty.bank_account_no"
                  v-bind:placeholder="$t('acc-no')"
                />
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
            {{ $t("save") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
