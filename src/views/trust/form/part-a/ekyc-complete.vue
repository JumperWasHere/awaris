<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["trust"]),
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    selfiePath() {},
  },
  methods: {
    nextPart() {
      this.$router.push({
        name: "trust.part-c",
        query: { trust_id: this.trust.id, amendment_id: this.amendmentId },
      });
    },
    async showIc(type) {
      var url;
      if (
        type == "front" &&
        this.trust &&
        this.trust.mykad_front &&
        this.trust.mykad_front.public_path
      ) {
        url = this.trust.mykad_front.public_path;
      } else if (
        type == "Swafoto" &&
        this.trust &&
        this.trust.selfie &&
        this.trust.selfie.public_path
      ) {
        url = this.trust.selfie.public_path;
      }
      console.log("url", url);
      window.open(url, "_blank");
    },
  },
  watch: {},
};
</script>

<template>
  <div>
    <div>
      <div
        class="card bg-light job-box rounded shadow border-0 overflow-hidden"
      >
        <div class="card-body" v-if="trust">
          <h5 class="text-center">{{ $t("ekyc.complete") }}</h5>
          <div class="text-center">
            <img src="/images/secured.png" alt="" />
            <p class="mt-3" style="font-size: 10pt">
              <small>
                <span class="d-block">{{ $t("verified-on") }}: </span>
                <strong>{{ trust.ekyc_verified_at }}</strong>
              </small>
            </p>
          </div>
          <div class="row mt-4">
            <div class="col-md-6 form-group text-center">
              <label for="upload-photo-1"> Swafoto bersama MyKad </label>
              <div class="card rounded shadow bg-dark">
                <div
                  class="d-flex align-items-center justify-content-center bd-highlight"
                  style="height: 150px"
                >
                  <label
                    v-if="trust && trust.selfie && trust.selfie.public_path"
                    :style="
                      'background-image: url(' + trust.selfie.public_path + ');'
                    "
                    style="
                      border-radius: 5px;
                      margin-bottom: 0;
                      background-position: center;
                      background-repeat: no-repeat;
                      background-size: cover;
                      height: 100%;
                      width: 100%;
                    "
                    for="upload-photo-2"
                  ></label>
                </div>
              </div>
              <div class="col-md-12 text-center mt-2">
                <b-button
                  class="btn-sm btn-primary m-1"
                  @click="showIc('Swafoto')"
                >
                  {{ $t("view") }}
                </b-button>
              </div>
            </div>
            <div class="col-md-6 form-group text-center">
              <label for="upload-photo-1"> MyKad (Depan) </label>
              <div class="card rounded shadow bg-dark">
                <div
                  class="d-flex align-items-center justify-content-center bd-highlight"
                  style="height: 150px"
                >
                  <label
                    v-if="
                      trust &&
                      trust.mykad_front &&
                      trust.mykad_front.public_path
                    "
                    :style="
                      'background-image: url(' +
                      trust.mykad_front.public_path +
                      ');'
                    "
                    style="
                      border-radius: 5px;
                      margin-bottom: 0;
                      background-position: center;
                      background-repeat: no-repeat;
                      background-size: cover;
                      height: 100%;
                      width: 100%;
                    "
                    for="upload-photo-2"
                  ></label>
                </div>
              </div>
              <div class="col-md-12 text-center mt-2">
                <b-button
                  class="btn-sm btn-primary m-1"
                  @click="showIc('front')"
                >
                  {{ $t("view") }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right mt-3">
      <button @click="nextPart" class="btn btn-primary">
        {{ $t("next") }}
      </button>
    </div>
  </div>
</template>