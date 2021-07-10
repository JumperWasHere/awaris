<script>
import { mapGetters } from "vuex";
import eKYC from "@/views/trust/form/part-a/ekyc";
import ManualeKYC from "@/views/trust/form/part-a/manual-ekyc";
import eKYCComplete from "@/views/trust/form/part-a/ekyc-complete";

export default {
  computed: {
    ...mapGetters(["trust", "isEkycComplete", "failedCount"]),
    trustId() {
      return this.$route.query.trust_id;
    },
  },
  components: {
    ekyc: eKYC,
    "manual-ekyc": ManualeKYC,
    "ekyc-complete": eKYCComplete,
  },
  mounted() {
    // if (!this.trustId) {
    //   this.$router.push({
    //     name: "trust-onecent.part-a",
    //   });
    // }
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row" v-if="trust">
      <div
        class="col-lg-12 col-12 mb-4 pb-2"
        v-if="!isEkycComplete && failedCount <= 0"
      >
        <ekyc> </ekyc>
      </div>
      <div
        class="col-lg-12 col-12 mb-4 pb-2"
        v-if="!isEkycComplete && failedCount > 0"
      >
        <manual-ekyc> </manual-ekyc>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2" v-if="isEkycComplete">
        <ekyc-complete> </ekyc-complete>
      </div>
    </div>
  </div>
</template>
