<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      pricing: {},
    };
  },
  mounted() {
    console.log(this.pricingId);
    this.getPriceDetails();
  },
  methods: {
    getPriceDetails() {
      ApiService.get(`pricing/${this.pricingId}`).then((response) => {
        this.pricing = response.data.pricing ?? {};
      });
    },
    back() {
      this.$router.push({
        name: "organization.pricing",
        params: { pricing_id: this.pricingId },
      });
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userRole"]),
    organizationId() {
      return this.$route.params.organization_id;
    },
    pricingId() {
      return this.$route.params.pricing_id;
    },
    organizationType() {
      return this.organization.type;
    },
  },
  props: {
    organization: {
      type: Object,
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">{{
          $t("product")
        }}</label>
        <p class="form-control-static">{{ pricing.product }}</p>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">{{
          $t("org.nav3")
        }}</label>
        <p class="form-control-static">RM {{ pricing.price }}</p>
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">Deskripsi</label>
        <p class="form-control-static">{{ pricing.description }}</p>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">{{
          $t("pricing.awaris-share")
        }}</label>
        <p class="form-control-static">RM {{ pricing.awaris_share }}</p>
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">{{
          $t("business-partner")
        }}</label>
        <p class="form-control-static">RM {{ pricing.organization_share }}</p>
      </div>
      <div class="form-group col-md-4" v-if="userRole == 'Staff'">
        <label for style="text-transform: capitalize">{{
          $t("pricing.possb-share")
        }}</label>
        <p class="form-control-static">RM {{ pricing.prooffice_share }}</p>
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize"
          >Perkongsian Lain-lain</label
        >
        <p class="form-control-static">RM {{ pricing.others_share }}</p>
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize"
          >Perkongsian Lain-lain (Deskripsi)</label
        >
        <p class="form-control-static">{{ pricing.others_description }}</p>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">Harga Pindaan</label>
        <p class="form-control-static">RM {{ pricing.amendment_price }}</p>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize"
          >Perkongsian Pindaan AWARIS</label
        >
        <p class="form-control-static">
          RM {{ pricing.amendment_awaris_share }}
        </p>
      </div>
      <div class="form-group col-md-4">
        <label
          for
          style="text-transform: capitalize"
          v-if="organizationType == 'Awaris'"
          >{{ $t("pricing.partner-share") }}</label
        >
        <label
          for
          style="text-transform: capitalize"
          v-if="organizationType != 'Awaris'"
          >Perkongsian Pindaan Rakan Niaga</label
        >
        <p class="form-control-static">
          RM {{ pricing.amendment_organization_share }}
        </p>
      </div>
      <div class="form-group col-md-4" v-if="userRole == 'Staff'">
        <label for style="text-transform: capitalize"
          >Perkongsian Pindaan POSSB</label
        >
        <p class="form-control-static">
          RM {{ pricing.amendment_prooffice_share }}
        </p>
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize">{{ $t("status") }}</label>
        <p class="form-control-static">
          <span class="badge badge-success" v-if="pricing.status == 1">{{
            $t("active")
          }}</span>
          <span class="badge badge-warning" v-if="pricing.status != 1">{{
            $t("inactive")
          }}</span>
        </p>
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        <i class="mdi mdi-chevron-left"></i>{{ $t("back") }}
      </button>
      <router-link
        :to="{
          name: 'organization.pricing.edit',
          params: { organization_id: organizationId, pricing_id: pricingId },
        }"
        class="btn btn-primary"
        >{{ $t("update") }}</router-link
      >
    </div>
  </div>
</template>
