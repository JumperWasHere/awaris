<template>
  <div>
    <div class="vld-parent">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        transition="bounce"
        blur="10px"
        :height="80"
        :width="150"
        color="#161c2d"
        loader="dots"
      >
        <!-- <label><input type="checkbox" />Full page?</label> -->
        <!-- <button @click.prevent="doAjax">fetch Data</button> -->
      </loading>
      <router-view :key="$route.path" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import { PREFERENCE } from "@/services/store/trust.module";
import { LOGOUT } from "@/services/store/auth.module";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: { Loading },
  mounted() {
    clearTimeout(this.timeOut);
    if (
      ![
        "login",
        "wasiat-verification.auth",
        "wasiat-verification.details",
        "wasiat-verification.eky",
        "wasiat-verification.pdpa",
      ].includes(this.$route.name)
    ) {
      this.countDownTimer();
    }
    if (this.isAuthenticated) {
      if (this.organizationId != -1) {
        this.$store.dispatch(PREFERENCE, this.organizationId);
      }
    }

    if (["development"].includes(process.env.VUE_APP_ENVI)) {
      let s = document.createElement("script");
      s.src = "https://api.buglog.io/website/GNERMNLW4J/code";
      s.async = 1;
      document.head.appendChild(s);
    }
  },
  data() {
    return {
      // isLoading: true,
      timeOut: null,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "isLoading", "userAccess"]),
    organizationId: function () {
      if (this.userAccess != null) {
        return this.userAccess.organization_id;
      } else {
        return -1;
      }
    },
  },

  methods: {
    countDownTimer() {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.$store.dispatch(LOGOUT).then(() => {
          // if (this.$route.name != "Home") {
          this.$router.push({ name: "login" });
          // }
        });
        this.$swal.fire({
          icon: "warning",
          html:
            "Anda telah membiarkan sistem ini lebih daripada 20 minit. Sila log masuk semula",
          showCloseButton: true,
          // showCancelButton: true,
          focusConfirm: false,
          // confirmButtonText: "Manual e-KYC",
          // cancelButtonText: "Tutup",
          showCloseButton: true,
        });
        // .then((result) => {
        //   if (result.value) {

        //   } else {
        //     this.countDownTimer();
        //   }
        // });
        // this.countDownTimer();
      }, 1800000); //30 mins
      // 1200000
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeOut);
  },
  unmounted() {
    console.log("unmounted");
    clearTimeout(this.timeOut);
  },
};
</script>