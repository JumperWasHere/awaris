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
    };
  },
  computed: {
    ...mapGetters(["trust", "preference"]),

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
          console.log(
            "property",
            response.data.moveable_property.property_type
          );
          this.property = response.data.moveable_property ?? {};
          this.moveableProperty = this.property;
        }
      );
    },
    updateDetails() {
      this.moveableProperty._method = "PATCH";
      ApiService.post(`moveable-property/${this.propertyId}`, this.form).then(
        (response) => {
          this.$notify({
            group: "foo",
            title: "Aset telah berjaya dikemaskini.",
            duration: 5000,
            type: "success",
          });
        }
      );
    },
  },
  watch: {
    preference: {
      handler: function (val) {
        if (val) {
          console.log("vla", val);
          // this.moveableProperty.property_type = val.hibah_fixed_property_type;
          // this.moveableProperty.other_type = val.hibah_fixed_saham_type;
          // this.moveableProperty.property_type = val.hibah_fixed_saham_type;
          this.loader = true;
          this.preferenceLabel = val.corporate_saham_account_type;
        }
      },
    },

    trust: {
      handler: function (val) {},
    },
  },
};
</script>


<template>
  <div class="card-body">
    <div class="row" v-if="preference">
      <div class="col-md-12 form-group" v-if="trust">
        <label for="Jenis Harta">Jenis Harta</label>
        <p class="form-control-static">{{ property.property_type }}</p>
      </div>
    </div>
    <div class="row" v-if="property.property_type == 'Bank'">
      <div class="col-md-6">
        <div class="form-group">
          <label for="bank_type">Jenis Bank</label>
          <input
            type="text"
            id="bank_type"
            v-model="form.bank_type"
            class="form-control"
            placeholder="Contoh: CIMB, MBB, BIMB"
            :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="bank_branch">Cawangan Bank</label>
          <input
            type="text"
            id="bank_branch"
            v-model="form.bank_branch"
            class="form-control"
            :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="bank_account_no">No Akaun/Ahli</label>
          <input
            type="text"
            id="bank_account_no"
            v-model="form.bank_account_no"
            class="form-control"
            :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
          />
        </div>
      </div>
    </div>
    <div class="row" v-if="property.property_type == 'Kenderaan'">
      <div class="col-md-6 form-group">
        <label for="">
          Jenis Kenderaan
          <img
            content="Contoh : motosikal, kereta, van, lori, basikal dan lain-lain"
            v-tippy
            height="15"
            class="mb-1"
            src="/images/icon/info-button.png"
          />
        </label>
        <input
          type="text"
          class="form-control"
          v-model="form.transport_type"
          :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">
          Buatan
          <img
            content="Contoh : Proton, Produa, Honda, Toyota, Yamaha dan lain-lain"
            v-tippy
            height="15"
            class="mb-1"
            src="/images/icon/info-button.png"
          />
        </label>
        <input
          type="text"
          class="form-control"
          v-model="form.transport_manufacturer"
          :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">
          Buatan
          <img
            content="Contoh : Viva 850, CR-V 2.0L I-VTEC (A), KRISS AN110F dan lain-lain"
            v-tippy
            height="15"
            class="mb-1"
            src="/images/icon/info-button.png"
          />
        </label>
        <input
          type="text"
          class="form-control"
          v-model="form.transport_model"
          :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">
          No. Pendaftaran
          <img
            content="Contoh : BNF 2705"
            v-tippy
            height="15"
            class="mb-1"
            src="/images/icon/info-button.png"
          />
        </label>
        <input
          type="text"
          class="form-control"
          v-model="form.transport_registration_number"
          :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
        />
      </div>
    </div>
    <div class="row" v-if="property.property_type == 'Saham'">
      <div class="col-md-12">
        <div
          class="form-group"
          v-if="preference && ['1', '2'].includes(trust.hibah_type)"
        >
          <label> Nama Saham </label>
          <input
            type="text"
            name="hibah_fixed_saham_type"
            class="form-control"
            v-model="preference.hibah_fixed_saham_type"
            :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
          />
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <label> Nama Organisasi</label>
          <input
            type="text"
            name=""
            class="form-control"
            placeholder="Nama Organisasi*"
            v-model="moveableProperty.institution_name"
            :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
          />
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <label
            v-if="
              trust && ['1', '2'].includes(trust.hibah_type) && preferenceLabel
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
            placeholder="No Akaun / No Ahli*"
            v-model="moveableProperty.account_number"
            :readonly="![0, 1, 2].includes(trust.status) || !amendmentId"
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
    <!-- <div class="row">
      <div class="col-md-12 text-right">
        <div>
          <button
            type="button"
            @click="updateDetails"
            class="btn btn-primary"
            v-if="[0, 1, 2].includes(trust.status) || amendmentId"
          >
            Simpan
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>