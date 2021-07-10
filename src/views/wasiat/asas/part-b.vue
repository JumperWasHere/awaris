<script>
import { mapGetters } from "vuex";
import eKYC from "@/views/wasiat/asas/part-a/ekyc";
import ManualeKYC from "@/views/wasiat/asas/part-a/manual-ekyc";
import eKYCComplete from "@/views/wasiat/asas/part-a/ekyc-complete";
//part d - new
export default {
  data() {
    return {
      finishload: false,
    };
  },
  computed: {
    ...mapGetters(["isEkycCompleteWasiat", "failedCountWasiat", "wasiat"]),
    wasiatDetails() {
      return this.wasiat;
    },
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
  },
  components: {
    ekyc: eKYC,
    "manual-ekyc": ManualeKYC,
    "ekyc-complete": eKYCComplete,
  },
  watch: {
    isEkycCompleteWasiat: {
      handler: function (val) {
        console.log(val);
        this.finishload = true;
        // this.form.ic_number = this.trust.user.ic_number;
      },
    },
    wasiat: {
      handler: function (val) {
        if (val) {
          console.log(val);
          if (val.status == -1) {
            this.$router.push({
              name: "wasiat.part_c",
              query: {
                wasiat_id: this.wasiatId,
              },
            });
          }
          // if (!val.payment_received_at) {
          //   this.$router.push({
          //     name: "wasiat.part_payment",
          //     query: {
          //       wasiat_id: this.wasiatId,
          //       pengesahan: this.pengesahan,
          //     },
          //   });
          // }
        }
      },
    },
  },
  mounted() {
    if (!this.wasiatId) {
      this.$router.push({
        name: "wasiat.part_a",
      });
    }
  },
  unmounted() {
    const tracks = this.mediaStream.getTracks();
    tracks.map((track) => track.stop());
  },
  destroyed() {
    if (this.mediaStream) {
      alert(this.stream.getTracks().length);
      this.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row" v-if="wasiat">
      <div
        class="col-lg-12 col-12 mb-4 pb-2"
        v-if="!isEkycCompleteWasiat && failedCountWasiat <= 0"
      >
        <ekyc> </ekyc>
      </div>
      <div
        class="col-lg-12 col-12 mb-4 pb-2"
        v-if="!isEkycCompleteWasiat && failedCountWasiat > 0"
      >
        <manual-ekyc> </manual-ekyc>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2" v-if="isEkycCompleteWasiat">
        <ekyc-complete> </ekyc-complete>
      </div>
    </div>
  </div>
</template>
