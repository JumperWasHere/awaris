<script>
import EditablePartH from "./editable/part-h";
import ReadonlyPartH from "./readonly/part-h";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  components: {
    "editable-part-h": EditablePartH,
    "readonly-part-h": ReadonlyPartH,
  },
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <editable-part-h />
    <!-- <readonly-part-h/> -->
  </div>
</template>
