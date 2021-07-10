<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      wasiat: null,
      form: {},
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
    };
  },
  mounted() {
    if (!this.trustId) {
      this.$router.push({
        name: "trust-onecent.part-a",
      });
    }
  },
  methods: {
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`).then((response) => {
          var postcode = response.data.postcode;
          if (postcode != null) {
            this.form.city = postcode.city;
            this.form.state = postcode.state;
          }
        });
      }
    },
    submitForm() {},
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          if (val.status == -1) {
            this.$router.push({
              name: "trust-onecent.part-c",
              query: {
                trust_id: this.trustId,
                amendment_id: this.amendmentId,
              },
            });
          }
        }
      },
    },
  },
  computed: {
    ...mapGetters(["preference", "userRole", "trust"]),
    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    routeName() {
      return this.$route.name;
    },
    message() {
      return this.$route.query.message;
    },
    trustDetails() {
      return this.trust;
    },
    hibahMoveable() {
      if (
        this.preference &&
        this.preference.hibah_allow_moveable_property == 1
      ) {
        if (["1", "2"].includes(this.trust.hibah_type)) {
          return true;
        } else if (["3", "4", "7", "8", "11"].includes(this.trust.hibah_type)) {
          return true;
        } else return false;
      } else {
        if (["3", "4", "7", "8", "11"].includes(this.trust.hibah_type)) {
          return true;
        } else {
          return false;
        }
      }
      // if (["2", "3", "4", "7", "8"].includes(this.trust.hibah_type)) {
      //   return true;
      // } else if (this.trust.hibah_type == 1) {
      //   if (this.preference && this.preference.hibah_allow_moveable_property) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
    },
    hibahImmoveable() {
      if (
        this.preference &&
        this.preference.hibah_allow_immoveable_property == 1
      ) {
        if (["1", "2"].includes(this.trust.hibah_type)) {
          return true;
        } else if (["5", "6", "9", "10"].includes(this.trust.hibah_type)) {
          return true;
        } else return false;
      } else {
        if (["5", "6", "9", "10"].includes(this.trust.hibah_type)) {
          return true;
        } else {
          return false;
        }
      }
      // if (["5", "6", "9", "10"].includes(this.trust.hibah_type)) {
      //   return true;
      // } else if (this.trust.hibah_type == 1) {
      //   if (
      //     this.preference &&
      //     this.preference.hibah_allow_immoveable_property
      //   ) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
    },
  },
  components: { TheMask },
};
</script>

<template>
  <div
    class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0"
    v-if="trustDetails"
  >
    <div class="row">
      <div class="col-md-12" v-if="message == 'saved'">
        <div class="alert alert-success">{{ $t("trust.movprop-success") }}</div>
      </div>

      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-0 mt-4">
              Maklumat Akaun
              <img
                content="Senarai akaun yang akan diagihkan"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>

            <ul class="nav nav-tabs mt-4">
              <li class="nav-item" v-if="hibahMoveable">
                <router-link
                  class="nav-link"
                  :class="
                    routeName == 'trust-onecent.part-f.moveable' ? 'active' : ''
                  "
                  :to="{
                    name: 'trust-onecent.part-f.moveable',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                >
                  {{ $t("mov-prop") }}
                </router-link>
              </li>
            </ul>
            <router-view> </router-view>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <router-link
                :to="{
                  name: 'trust-onecent.part-g',
                  query: { trust_id: this.trustId, amendment_id: amendmentId },
                }"
                class="btn btn-primary"
              >
                {{ $t("next") }}
                <span
                  class="spinner-border spinner-border-sm"
                  v-if="submit"
                ></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
