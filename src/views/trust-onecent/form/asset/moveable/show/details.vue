<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      type: "Bank",
      moveableProperty: {},
      property: {},
      preferenceLabel: null,
      hibah_type: null,
      one_cent_wallet_name: null,
      one_cent_username: null,
    };
  },
  computed: {
    ...mapGetters(["trust"]),

    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id ?? null;
    },
    propertyId() {
      return this.$route.query.property_id;
    },
    setMoveableArray() {
      console.log("hibah_type", this.trust);
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
  mounted() {
    this.getProperty();
  },
  methods: {
    getProperty() {
      ApiService.get(`moveable-property/${this.propertyId}`).then(
        (response) => {
          this.property = response.data.moveable_property ?? {};
          this.moveableProperty = this.property;
          this.one_cent_wallet_name = this.property.one_cent_wallet_name;
          this.one_cent_username = this.property.one_cent_username;
        }
      );
    },
    updateDetails() {
      this.moveableProperty._method = "PATCH";
      this.moveableProperty.one_cent_wallet_name = this.one_cent_wallet_name;
      this.moveableProperty.one_cent_username = this.one_cent_username;
      ApiService.post(
        `moveable-property/${this.propertyId}`,
        this.moveableProperty
      ).then((response) => {
        this.$notify({
          group: "foo",
          title: "Aset telah berjaya dikemaskini.",
          duration: 5000,
          type: "success",
        });
        this.$router.push({
          name: "trust-onecent.moveable-property.receiver",
          query: {
            trust_id: this.trustId,
            property_id: this.properyId,
            amendment_id: this.amendmentId,
          },
        });
      });
    },
  },
  watch: {
    preference: {
      handler: function (val) {
        if (val) {
          console.log("vla", val);
          this.moveableProperty.property_type = val.hibah_fixed_property_type;
          this.moveableProperty.other_type = val.hibah_fixed_saham_type;
          this.moveableProperty.property_type = val.hibah_fixed_saham_type;
          this.loader = true;
          this.preferenceLabel = val.corporate_saham_account_type;
        }
      },
    },
  },
};
</script>


<template>
  <div class="card-body">
    <div class="row">
      <div class="col-md-12 form-group" v-if="trust">
        <label for="Jenis Harta">Jenis Harta</label>
        <p class="form-control-static">Simpanan</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="bank_type">Jenis Akaun</label>
          <p class="form-control-static">Saham Akuan</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="bank_branch">Nama Organisasi</label>
          <p class="form-control-static">One Cent</p>
        </div>
      </div>
      <div class="col-md-6" v-if="one_cent_username">
        <div class="form-group">
          <label for="bank_account_no">Username</label>
          <input
            type="text"
            id="bank_account_no"
            v-model="one_cent_username"
            class="form-control"
            :readonly="![2].includes(trust.status)"
          />
        </div>
      </div>
      <div class="col-md-6" v-if="one_cent_wallet_name">
        <div class="form-group">
          <label for="bank_account_no">Wallet Name</label>
          <input
            type="text"
            id="bank_account_no"
            v-model="one_cent_wallet_name"
            class="form-control"
            :readonly="![2].includes(trust.status)"
          />
        </div>
      </div>
    </div>

    <!-- <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="office_number">Jenis Harta</label>
            <select
              name=""
              id=""
              class="form-control"
              v-model="form.other_type"
            >
              <option value=""></option>
              <option value="Saham">Saham</option>
              <option value="Insuran">Insuran</option>
              <option value="Simpanan">Simpanan</option>
              <option value="Syarikat">Syarikat</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="office_number">Jenis Keahlian</label>
            <select
              name=""
              id=""
              class="form-control"
              v-model="form.other_membership_type"
            >
              <option value=""></option>
              <option value="No. Akaun">No. Akaun</option>
              <option value="No. Ahli">No. Ahli</option>
              <option value="No. Polisi">No. Polisi</option>
              <option value="No. Syarikat">No. Syarikat</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="value">Jumlah Unit</label>
            <input
              type="text"
              id="value"
              v-model="form.value"
              class="form-control"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="agreement_number">No Perjanjian</label>
            <input
              type="text"
              id="agreement_number"
              v-model="form.agreement_number"
              class="form-control"
            />
          </div>
        </div>
      </div> -->
    <div class="row" v-if="trust">
      <div class="col-md-12 text-right">
        <div>
          <button
            type="button"
            @click="updateDetails"
            class="btn btn-primary"
            v-if="![2].includes(trust.status)"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>