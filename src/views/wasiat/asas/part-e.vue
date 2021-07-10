<script>
import ApiService from "@/services/api.service";
import EditablePartE from "./editable/part-e";
import ReadonlyPartE from "./readonly/part-e";
//part f waris new
export default {
  name: "WasiatPartE",
  data() {
    return {
      wasiat: null,
    };
  },
  components: {
    "editable-part-e": EditablePartE,
    "readonly-part-e": ReadonlyPartE,
  },
  methods: {
    getWasiat() {
      ApiService.get(`wasiat/${this.wasiatId}`).then((response) => {
        this.wasiat = response.data.wasiat;
      });
    },
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
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
  watch: {
    wasiat: {
      handler: function (val) {
        if (val.status == -1) {
          this.$router.push({
            name: "wasiat.part_c",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
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
        if (!val.user.name) {
          this.$router.push({
            name: "wasiat.part_d",
            query: {
              wasiat_id: this.wasiatId,
              pengesahan: this.pengesahan,
            },
          });
        }
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <editable-part-e
      :wasiat="wasiat"
      v-if="!wasiat || [0, 1, 3].includes(wasiat.status)"
    />
    <readonly-part-e :wasiat="wasiat" v-if="wasiat && wasiat.status == 2" />
  </div>
</template>
