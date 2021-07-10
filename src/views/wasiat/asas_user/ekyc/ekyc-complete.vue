<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    wasiatId() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
  props: {
    wasiat: {
      type: Object,
    },
  },
  methods: {
    nextPart() {
      this.closeEkyc();
      if (this.wasiatId) {
        this.$router.push({
          name: "wasiat-verification.pdpa",
          params: { wasiat_id: this.wasiatId },
        });
      }
    },
    async showIc(type) {
      var url;
      if (type == "front") {
        url = this.wasiat.mykad_front.public_path;
      } else {
        url = this.wasiat.selfie.public_path;
      }
      console.log("url", url);
      window.open(url, "_blank");
    },
    closeEkyc() {
      if (this.mediaStream) {
        const tracks = this.mediaStream.getTracks();
        tracks.map((track) => track.stop());
      }
    },
  },
};
</script>

<template>
  <div>
    <div>
      <div
        class="card bg-light job-box rounded shadow border-0 overflow-hidden"
      >
        <div class="card-body" v-if="wasiat">
          <h5 class="text-center">{{ $t("ekyc.complete") }}</h5>
          <div class="text-center">
            <img src="/images/secured.png" alt="" />
            <p class="mt-3" style="font-size: 10pt">
              <small>
                <span class="d-block">{{ $t("verified-on") }}: </span>
                <strong>{{ wasiat.ekyc_verified_at }}</strong>
              </small>
            </p>
          </div>
          <div class="row mt-4">
            <div class="col-md-6 form-group text-center">
              <label for="upload-photo-1"> Swafoto</label>
              <div class="card rounded shadow bg-dark">
                <div
                  class="d-flex align-items-center justify-content-center bd-highlight"
                  style="height: 150px"
                >
                  <label
                    v-if="wasiat && wasiat.selfie && wasiat.selfie.public_path"
                    :style="
                      'background-image: url(' +
                      wasiat.selfie.public_path +
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
                      wasiat &&
                      wasiat.mykad_front &&
                      wasiat.mykad_front.public_path
                    "
                    :style="
                      'background-image: url(' +
                      wasiat.mykad_front.public_path +
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