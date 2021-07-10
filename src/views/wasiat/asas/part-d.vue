<script>
import EditablePartD from "./editable/part-d";
import ReadonlyPartD from "./readonly/part-d";
import { mapGetters } from "vuex";

import ApiService from "@/services/api.service";
//part E - new
export default {
  name: "WasiatPartD",
  data() {
    return {
      wasiat: null,
    };
  },
  components: {
    "editable-part-d": EditablePartD,
    "readonly-part-d": ReadonlyPartD,
  },
  mounted() {
    if (this.wasiatId) {
      this.getWasiat();
    } else {
      this.$router.push({
        name: "wasiat.part_a",
      });
    }
  },
  methods: {
    getWasiat() {
      ApiService.get(`wasiat/${this.wasiatId}`).then((response) => {
        this.wasiat = response.data.wasiat;
      });
    },
  },
  computed: {
            ...mapGetters([ "userRole"]),

    wasiatId() {
      return this.$route.query.wasiat_id;
    },
  },
  watch: {
    wasiat: {
      handler: function (val) {
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
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <editable-part-d
      :wasiat="wasiat"
      v-if="!wasiat || [0, 1, 3].includes(wasiat.status)|| userRole=='Staff'"/>
    <readonly-part-d :wasiat="wasiat" v-if="wasiat && wasiat.status == 2 && !userRole=='Staff'" />
  </div>
</template>
