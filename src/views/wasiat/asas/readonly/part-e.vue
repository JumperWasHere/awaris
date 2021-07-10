<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  name: "ReadonlyPartB",
  props: {
    wasiat: {
      type: Object,
    },
  },
  data() {
    return {
      submit: false,
    };
  },
  mounted() {},
  components: {},
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    fullAddress() {
      return String(
        this.wasiat.heir.address ? this.wasiat.heir.address.concat(", ") : ""
      )
        .concat(
          String(
            this.wasiat.heir.postcode
              ? this.wasiat.heir.postcode.concat(", ")
              : ""
          )
        )
        .concat(
          String(
            this.wasiat.heir.city ? this.wasiat.heir.city.concat(", ") : ""
          )
        )
        .concat(
          String(
            this.wasiat.heir.state ? this.wasiat.heir.state.concat(". ") : ""
          )
        );
    },
  },
  methods: {
    submitHeirForm() {
      this.submit = true;
      this.$router.push({
        name: "wasiat.part_f",
        query: { wasiat_id: this.wasiatId },
      });
    },
  },
};
</script>

<template>
  <section>
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">KETERANGAN MENGENAI WARIS</h5>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="organization_id">Nama Penuh</label>
                <p class="input-control-static">
                  {{ wasiat.heir.name ? wasiat.heir.name : "-" }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id">Hubungan</label>
                <p class="input-control-static">
                  {{
                    wasiat.heir.relationship ? wasiat.heir.relationship : "-"
                  }}
                </p>
              </div>
              <div class="col-md-6 form-group">
                <label for="organization_id">No. Telefon Bimbit</label>
                <p class="input-control-static">
                  {{
                    wasiat.heir.mobile_number ? wasiat.heir.mobile_number : "-"
                  }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="organization_id">Alamat</label>
                <p
                  class="input-control-static"
                  style="text-transform: uppercase"
                >
                  {{ fullAddress ? fullAddress : "-" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <button @click="submitHeirForm" class="btn btn-primary" type="button">
            Seterusnya
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
