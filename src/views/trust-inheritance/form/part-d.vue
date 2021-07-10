<script>
import EditablePartD from "./editable/part-d";
import ReadonlyPartD from "./readonly/part-d";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  components: {
    "editable-part-d": EditablePartD,
    "readonly-part-d": ReadonlyPartD,
  },
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <editable-part-d />
    <!-- <readonly-part-d/> -->
  </div>
</template>
