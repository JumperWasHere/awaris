<script>
import ApiPublicService from "@/services/api-public.service";
import { mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { VERIFY_AUTH } from "@/services/store/auth.module";
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
  methods: {
    getbarer() {
      ApiPublicService.get(
        `/route-token/${this.routeToken}?token=${this.token}`
      )
        .then((response) => {
          console.log("token", response);
          this.tokenval = response.data.bearer_token ?? null;
          if (this.tokenval) {
            JwtService.savePublicToken(response.data.bearer_token);
            ApiPublicService.init();
            this.$router.push({
              name: "wasiat-verification.details",
              params: { wasiat_id: this.wasiatId },
            });
            // Promise.all([store.dispatch(VERIFY_AUTH)])
            //   .then((response) => {
            //     console.log("VERIFY_AUTH", response);
            //     this.$router.push({
            //       name: "wasiat-verification.details",
            //       params: this.wasiatId,
            //     });
            //   })
            //   .catch((error) => {
            //     this.hasError = true;
            //   });
          }
        })
        .catch((error) => {
          this.hasError = true;
          console.log(error);
        });
    },
  },
  mounted() {
    if (this.token && this.wasiatId) {
      this.getbarer();
    }
  },
  computed: {
    ...mapGetters(["userAccess", "userRole", "currentUser"]),
    token() {
      return this.$route.query.token;
    },
    wasiatId() {
      return this.$route.params.wasiat_id;
    },
    routeToken() {
      return this.$route.query.token_id;
    },
  },
};
</script>

<template>
  <div v-if="hasError">
    <span>PLEASE REQUEST NEW URL FROM AGENT</span>
    <!-- {{ tokenval }} -->
  </div>
</template>
