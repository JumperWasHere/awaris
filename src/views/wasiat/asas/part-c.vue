<script>
import EditablePartC from "./editable/part-c";
import ReadonlyPartC from "./readonly/part-c";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
//part b new - done
export default {
  data() {
    return {
      // wasiat: null,
    };
  },
  components: {
    "editable-part-c": EditablePartC,
    "readonly-part-c": ReadonlyPartC,
  },
  mounted() {
    if (!this.wasiatId) {
      this.$router.push({
        name: "wasiat.part_a",
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
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    ...mapGetters(["wasiat"]),
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <editable-part-c
      :wasiat="wasiat"
      v-if="
        !wasiatId || (wasiatId && wasiat && [-1, 0].includes(wasiat.status))
      "
    />
    <readonly-part-c
      :wasiat="wasiat"
      v-if="wasiat && [1, 2].includes(wasiat.status)"
    />
  </div>
</template>
