<script>
import EditablePartB from "./editable/part-b";
import ReadonlyPartB from "./readonly/part-b";
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  components: {
    "editable-part-b": EditablePartB,
    "readonly-part-b": ReadonlyPartB,
  },
  computed: {
    ...mapGetters(["hibah"]),
  },
  async mounted() {},
  methods: {},
  watch: {},
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0" v-if="hibah">
    <editable-part-b />
    <!-- <readonly-part-b /> -->
  </div>
</template>
