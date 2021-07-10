<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import banks from "utility/banks.json";

export default {
  // name: "HibahPartA",
  data() {
    return {
      form: {
        username: null,
        wallet_name: null,
      },
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
      this.moveableProperty.property_type = "Simpanan";
      this.moveableProperty.one_cent_username = this.form.username;
      this.moveableProperty.one_cent_wallet_name = this.form.wallet_name;
      ApiService.post("moveable-property", this.moveableProperty).then(
        (response) => {
          var propertyId = response.data.moveable_property.id;
          this.$router.push({
            name: "trust-onecent.moveable-property.receiver",
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
    ...mapGetters(["preference", "trust", "userAccess"]),
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    setMoveableArray() {
      // console.log("hibah_type", this.trust);
      if (this.trust.hibah_type == "1") {
        return [{ name: "Saham", value: "Saham" }];
      } else if (this.trust.hibah_type == "2") {
        return [{ name: "Syarikat", value: "Syarikat" }];
      } else if (["4", "3"].includes(this.trust.hibah_type)) {
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
    // preference: {
    //   handler: function (val) {
    //     if (val) {
    //       console.log("vla", val);
    //       this.moveableProperty.property_type = val.hibah_fixed_property_type;
    //       if (val.organization_id) {
    //         this.getOgranization(val.organization_id);
    //       }
    //       this.moveableProperty.other_type = val.hibah_fixed_saham_type;
    //       this.moveableProperty.property_type = val.hibah_fixed_saham_type;
    //       this.loader = true;
    //       this.preferenceLabel = val.corporate_saham_account_type;
    //     }
    //   },
    // },

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
    <div class="row">
      <!-- {{ preference }} -->
      <div class="col-lg-12 col-12 mb-4 pb-2" v-if="trust">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">{{ $t("trust.prop-info") }}</h5>

            <div class="row mt-4">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="hibah_fixed_saham_type"
                    >{{ $t("property-type2") }}
                  </label>
                  <p class="form-control-static">Simpanan</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label> Nama Saham </label>
                  <p class="form-control-static">Akaun</p>
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="hibah_fixed_saham_type">Nama Organisasi </label>
                  <p class="form-control-static">One Cent</p>
                </div>
              </div>
            </div>
            <hr />
            <div class="row mt-4">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="onecent_username">Username</label>
                  <input
                    type="text"
                    name="onecent_username"
                    class="form-control"
                    v-model="form.username"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="onecent_wallet_name">Wallet Name</label>
                  <input
                    type="text"
                    name="onecent_wallet_name"
                    class="form-control"
                    v-model="form.wallet_name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
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
