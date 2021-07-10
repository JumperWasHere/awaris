<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import JwtService from "@/services/jwt.service";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  HomeIcon,
  UserIcon,
  KeyIcon,
} from "vue-feather-icons";

export default {
  data() {
    return {
      wasiat: {},
      witness: null,
      amendment_status: null,
      amendment_id: null,
      printWasiat_id: null,
      amendment_array: null,
      amendment_index_status: null,
      btnPrint: false,
      tokenval: null,
      hasError: false,
    };
  },
  components: {
    PulseLoader,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    HomeIcon,
    UserIcon,
    KeyIcon,
  },
  methods: {},
  mounted() {
    if (this.wasiatId && this.paymentStatus) {
      if (this.paymentStatus == 1) {
        this.$router.push({
          name: "pindaan.part_a",
          params: {
            wasiat_id: this.wasiatId,
          },
        });
      } else {
        this.$router.push({
          name: "pindaan",
        });
      }
    }
  },
  computed: {
    ...mapGetters(["userAccess", "userRole", "currentUser"]),

    wasiatId() {
      return this.$route.params.wasiat_id;
    },
    paymentStatus() {
      return this.$route.query.status;
    },
  },
};
</script>

<template>
  <div>
    <span>Please Wait</span>

    <!-- {{ tokenval }} -->
  </div>
</template>
