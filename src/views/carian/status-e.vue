<script>
/**
 * Page-aboutus component
 */
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      wasiat_status: null,

      amendment_status: null,
      cetak: false,
    }; //amendment_status 1 :dalam process pindaan; 2: pindaan dah approve
  },
  components: {},
  mounted() {},
  methods: {
    printWasiatCertificate() {
      if (this.amendment_id) {
        // mean have amendment and pindaan == 4
        window.open(
          process.env.VUE_APP_API_URL +
            `/amendment/${this.amendment_id}/certificate/comprehensive`,
          "_blank"
        );
      } else {
        window.open(
          process.env.VUE_APP_API_URL +
            `/wasiat/${this.wasiat_id}/certificate/final`,
          "_blank"
        );
      }
    },
  },
  computed: {
    wasiat_id() {
      return this.$route.query.wasiat_id;
    },
    user_id() {
      return this.$route.query.user_id;
    },
    amendment_id() {
      return this.$route.query.amendment_id;
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <router-link :to="{ name: 'carian.semak' }" class="btn btn-primary"
          >Kembali</router-link
        >
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">Cetak Wasiat Akhir</h5>
            <hr class="primary" />

            <div class="row d-flex justify-content-center">
              <div>
                <b-button
                  class="btn btn-primary"
                  @click="printWasiatCertificate"
                >
                  Cetak wasiat
                  <span
                    class="spinner-border spinner-border-sm"
                    v-if="cetak"
                  ></span>
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end col-->
    </div>
    <!--end row-->
    <!-- Back to top -->
  </div>
</template>
