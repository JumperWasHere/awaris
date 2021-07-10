<script>
import EditablePartC from "./editable/part-c";
import ReadonlyPartC from "./readonly/part-c";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hibah: null,
    };
  },
  components: {
    "editable-part-c": EditablePartC,
    "readonly-part-c": ReadonlyPartC,
  },
  mounted() {
    if (!this.trustId) {
      this.$router.push({
        name: "trust.part-a",
      });
    }
  },
  methods: {
    // getWasiat() {
    //   ApiService.get(
    //     `wasiat/${this.wasiatId}?load_with=agent,organization,branch`
    //   ).then((response) => {
    //     this.wasiat = response.data.wasiat;
    //   });
    // },
  },
  computed: {
    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "trust"]),
    editable() {
      if (
        !["1", "2"].includes(this.trust.hibah_type) && //hibah biase
        [-1, 0, 1].includes(this.trust.status) &&
        !this.trust.payment_received_at &&
        !this.amendmentId
      ) {
        return true;
      } else if (
        ["1", "2"].includes(this.trust.hibah_type) && //hibah koporat
        [-1, 0].includes(this.trust.status) &&
        !this.amendmentId
      ) {
        return true;
      } else {
        return false;
      }
    },
    readonly() {
      if (
        this.trust &&
        !["1", "2"].includes(this.trust.hibah_type) &&
        ![-1, 0, 1].includes(this.trust.status) &&
        this.trust.payment_received_at
      ) {
        return true;
      } else if (
        this.trust &&
        ["1", "2"].includes(this.trust.hibah_type) &&
        ![-1, 0].includes(this.trust.status)
      ) {
        return true;
      } else if (this.amendmentId) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          this.hibah = val;
        }
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0" v-if="trust">
    <!-- {{ trust.status }} -->
    <editable-part-c :trust="hibah" v-if="editable" />
    <readonly-part-c :trust="hibah" v-if="readonly" />
  </div>
</template>
