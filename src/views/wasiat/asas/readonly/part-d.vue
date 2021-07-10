<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  name: "ReadonlyPartB",
  props: {
    wasiat: {
      type: Object,
    },
  },
  data() {
    return {
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      submit: false,
    };
  },
  mounted() {
    if (this.wasiatId) {
      this.getDocuments();
    }
  },
  components: {},
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
    fullAddress() {
      return String(
        this.wasiat.user_detail.permanent_address
          ? this.wasiat.user_detail.permanent_address.concat(", ")
          : ""
      )
        .concat(
          String(
            this.wasiat.user_detail.permanent_postcode
              ? this.wasiat.user_detail.permanent_postcode.concat(", ")
              : ""
          )
        )
        .concat(
          String(
            this.wasiat.user_detail.permanent_city
              ? this.wasiat.user_detail.permanent_city.concat(", ")
              : ""
          )
        )
        .concat(
          String(
            this.wasiat.user_detail.permanent_state
              ? this.wasiat.user_detail.permanent_state.concat(". ")
              : ""
          )
        );
    },
  },
  methods: {
    submitForm() {
      this.submit = true;
      this.$router.push({
        name: "wasiat.part_e",
        query: { wasiat_id: this.wasiatId },
      });
    },
    getDocuments(wasiatId) {
      ApiService.get(`/wasiat/${this.wasiatId}/document`)
        .then((response) => {
          console.log("array document");
          var image_array = response.data.attachments.data;
          var front = image_array.filter((item) => item.type == "mykad-front");
          var back = image_array.filter((item) => item.type == "mykad-back");
          this.mykad.frontUrl = front[0].public_path;
          this.mykad.backUrl = back[0].public_path;
        })
        .catch((error) => {
          console.log("get document");
        });
    },
    showIc(type) {
      var url;
      if (type == "front") {
        url = this.mykad.frontUrl;
      } else {
        url = this.mykad.backUrl;
      }
      console.log("url", url);
      window.open(url, "_blank");
    },
  },
};
</script>

<template>
  <section>
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">{{ $t("testator") }}</h5>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="organization_id">{{ $t("fullname") }}</label>
                <p class="input-control-static">
                  {{ wasiat.user.designation ? wasiat.user.designation : "-" }}
                  {{ wasiat.user.name ? wasiat.user.name : "-" }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("mykad") }}</label>
                <p class="input-control-static">
                  {{ wasiat.user_detail ? wasiat.user_detail.ic_number : "-" }}
                </p>
              </div>
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("old-ic") }}</label>
                <p class="input-control-static">
                  {{
                    wasiat.user_detail.old_ic_number
                      ? wasiat.user_detail.old_ic_number
                      : "-"
                  }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("gender") }}</label>
                <p
                  class="input-control-static"
                  v-if="wasiat.user_detail.gender == 1"
                >
                  {{ $t("male") }}
                </p>
                <p
                  class="input-control-static"
                  v-if="wasiat.user_detail.gender != 1"
                >
                  {{ $t("female") }}
                </p>
              </div>
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("religion") }}</label>
                <p class="input-control-static">
                  {{
                    wasiat.user_detail.religion
                      ? wasiat.user_detail.religion
                      : "-"
                  }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("race") }}</label>
                <p class="form-control-static">
                  {{ wasiat.user_detail.race ? wasiat.user_detail.race : "-" }}
                </p>
              </div>
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("nationality") }}</label>
                <p
                  class="form-control-static"
                  v-if="wasiat.user_detail.nationality == 1"
                >
                  {{ $t("citizen") }}
                </p>
                <p
                  class="form-control-static"
                  v-if="wasiat.user_detail.nationality != 1"
                >
                  {{ $t("not-citizen") }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id"> {{ $t("email") }}</label>
                <p class="input-control-static">
                  {{
                    wasiat.user_detail.email ? wasiat.user_detail.email : "-"
                  }}
                </p>
              </div>
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("mobile-no") }}</label>
                <p class="input-control-static">
                  {{
                    wasiat.user_detail.mobile_number
                      ? wasiat.user_detail.mobile_number
                      : "-"
                  }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("home-telno") }}</label>
                <p class="input-control-static">
                  {{
                    wasiat.user_detail.home_phone_number
                      ? wasiat.user_detail.home_phone_number
                      : "-"
                  }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="organization_id">{{ $t("address") }}</label>
                <p
                  class="form-control-static"
                  style="text-transform: uppercase"
                >
                  {{ fullAddress ? fullAddress : "-" }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("mykadcopy-front") }}</label>
                <div class="card rounded shadow bg-dark">
                  <div
                    class="d-flex align-items-center justify-content-center bd-highlight"
                    style="height: 150px"
                  >
                    <label
                      v-if="mykad.frontUrl"
                      :style="'background-image: url(' + mykad.frontUrl + ');'"
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
                <div class="d-flex justify-content-center mt-2">
                  <b-button
                    class="btn-sm btn-primary m-1"
                    @click="showIc('front')"
                  >
                    {{ $t("view") }}
                  </b-button>
                </div>
              </div>
              <div class="col-md-6 form-group">
                <label for="organization_id">{{ $t("mykadcopy-back") }}</label>
                <div class="card rounded shadow bg-dark">
                  <div
                    class="d-flex align-items-center justify-content-center bd-highlight"
                    style="height: 150px"
                  >
                    <label
                      v-if="mykad.backUrl"
                      :style="'background-image: url(' + mykad.backUrl + ');'"
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
                <div class="d-flex justify-content-center mt-2">
                  <b-button
                    class="btn-sm btn-primary m-1"
                    @click="showIc('back')"
                  >
                    {{ $t("view") }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <div class="d-flex justify-content-between"></div>
          <button type="button" @click="submitForm" class="btn btn-primary">
            {{ $t("next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
