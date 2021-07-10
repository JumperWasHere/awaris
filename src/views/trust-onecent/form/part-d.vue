<script>
import EditablePartD from "./editable/part-d";
import ReadonlyPartD from "./readonly/part-d";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hibah: null,
    };
  },
  components: {
    "editable-part-d": EditablePartD,
    "readonly-part-d": ReadonlyPartD,
  },
  mounted() {
    if (!this.trustId) {
      this.$router.push({
        name: "trust-onecent.part-a",
      });
    }
  },
  methods: {},
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    ...mapGetters([
      "isAuthenticated",
      "userAccess",
      "userRole",
      "trust",
      "amendment",
    ]),

    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          this.hibah = val;
          if (val.status == -1) {
            this.$router.push({
              name: "trust-onecent.part-c",
              query: {
                trust_id: this.trustId,
                amendment_id: this.amendmentId,
              },
            });
          }
        }
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0" v-if="trust">
    <editable-part-d
      :trust="hibah"
      v-if="trust && [0, 1, 3].includes(trust.status)"
    />
    <readonly-part-d
      :trust="hibah"
      v-if="trust && ![0, 1, 3].includes(trust.status)"
    />
  </div>
</template>
