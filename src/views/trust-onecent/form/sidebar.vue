<script>
import ApiService from "@/services/api.service";
import {
  TRUST,
  AMENDMENT,
  PREFERENCE,
  WITNESS_SIGN,
} from "@/services/store/trust.module";
import { mapGetters } from "vuex";
import {
  ArrowUpIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  MonitorIcon,
  HeartIcon,
  EyeIcon,
  BoldIcon,
  FeatherIcon,
  CodeIcon,
  UserCheckIcon,
  GitMergeIcon,
  SettingsIcon,
} from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      trust_details: null,
      amendment_status: null,
      amendment_id: null,
      Reload: {
        pereference: false,
        trust: false,
      },

      updateStatus: {
        amendmentable_type: "Hibah",
        _method: "PATCH",
      },
    };
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    Carousel,
    Slide,
    ArrowUpIcon,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    MonitorIcon,
    HeartIcon,
    EyeIcon,
    BoldIcon,
    FeatherIcon,
    CodeIcon,
    UserCheckIcon,
    GitMergeIcon,
    SettingsIcon,
  },
  computed: {
    trustPart() {
      if (this.$route.name == "trust-onecent.part-a") {
        return 1;
      } else if (["trust-onecent.part-b"].includes(this.$route.name)) {
        return 2;
      } else if (["trust-onecent.part-c"].includes(this.$route.name)) {
        return 3;
      } else if (["trust-onecent.part-d"].includes(this.$route.name)) {
        return 4;
      } else if (
        ["trust-onecent.part-e", "trust-onecent.receiver.update"].includes(
          this.$route.name
        )
      ) {
        return 5;
      } else if (
        [
          "trust-onecent.part-f",
          "trust-onecent.part-f.moveable",
          "trust-onecent.part-f.immoveable",
          "trust-onecent.moveable-property.create",
          "trust-onecent.moveable-property.receiver",
          "trust-onecent.moveable-property.details",
          "trust-onecent.moveable-property.attachment",
          "trust-onecent.immoveable-property.create",
          "trust-onecent.immoveable-property.receiver",
          "trust-onecent.immoveable-property.details",
          "trust-onecent.immoveable-property.attachment",
        ].includes(this.$route.name)
      ) {
        return 6;
      } else if (
        [
          "trust-onecent.part-g",
          "trust-onecent.caretaker.create",
          "trust-onecent.caretaker.update",
        ].includes(this.$route.name)
      ) {
        return 7;
      } else if (this.$route.name == "trust-onecent.part-h") {
        return 8;
      } else if (this.$route.name == "trust-onecent.part-i") {
        return 9;
      } else if (this.$route.name == "trust-onecent.part-signpenerima") {
        return 10;
      } else if (this.$route.name == "trust-onecent.part-draft") {
        return 0;
      } else {
        return 1;
      }
    },
    trustId() {
      return this.$route.query.trust_id ?? null;
    },
    amendmentId() {
      return this.$route.query.amendment_id ?? null;
    },
    certUrl() {
      return process.env.VUE_APP_API_URL + `/hibah/${this.trustId}/certificate`;
    },
    type() {
      return this.$route.query.type;
    },
    organizationId() {
      return 1;
    },
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "trust",
      "userRole",
      "amendment",
      "witness_sign",
      "preference",
    ]),
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          this.trust_details = val;
          if (val.organization_id) {
            this.Reload.trust = true;
          }
        }
      },
    },
    preference: {
      handler: function (val) {
        if (val) {
          if (this.userRole != "Client") {
            this.Reload.pereference = true;
          }
        }
      },
    },
    Reload: {
      handler: function (val) {
        if (val.trust) {
          this.$store.dispatch(PREFERENCE, this.trust.organization_id);
        }
      },
      deep: true,
    },
    amendment: {
      handler: function (val) {},
    },
  },
  async mounted() {
    if (!this.trustId) {
      if (this.trustPart > 1) {
        if (!this.type) {
          this.$router.push({
            name: "trust.product-list",
            query: { trust_id: this.trustId, error: 1 },
          });
        } else {
          return;
        }
      } else if (!this.type) {
        this.$router.push({
          name: "trust.product-list",
          query: { trust_id: this.trustId, error: 1 },
        });
      }
    }
    await this.$store.dispatch(TRUST, this.trustId);
    if (this.trustId) {
      this.$store.dispatch(AMENDMENT, this.trustId);
      this.$store.dispatch(WITNESS_SIGN, this.trustId);
      this.getamendment();
    }
  },
  methods: {
    onNavigate() {
      window.open(this.certUrl, "_blank");
    },
    async approveHibah() {
      ApiService.post(`hibah/${this.trustId}`, {
        _method: "PATCH",
        status: 5,
        is_draft_accepted: 1,
      }).then((response) => {
        this.$router.push({
          name: "trust.pengesahan.list-pendaftaran",
          query: { organization_id: this.trust.organization_id },
        });
      });
    },
    async declineHibah() {
      ApiService.post(`hibah/${this.trustId}`, {
        _method: "PATCH",
        status: 0,
      }).then((response) => {
        this.$router.push({
          name: "trust.pengesahan.list-pendaftaran",
          query: { organization_id: this.trust.organization_id },
        });
      });
    },
    async updateAmendment() {
      return await ApiService.post(
        `/amendment/${this.amendmentId}`,
        this.updateStatus
      )
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    getamendment() {
      ApiService.get(`/amendment?hibah_id=${this.trustId}`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
    getWasiat() {
      ApiService.get(`/wasiat/${this.wasiatId}`)
        .then((response) => {
          this.wasiat = response.data.wasiat ?? {};
        })
        .catch((error) => {});
    },
  },
};
</script>

<template>
  <div>
    <Navbar :nav-light="true" />

    <section class="bg-half bg-primary d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title text-white">
                <span v-if="type == 1">Hibah Korporat</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-12">
            <div class="sidebar sticky-bar p-4 rounded shadow bg-light">
              <div class="widget mb-4 pb-4 border-bottom">
                <!-- {{ trust }} -->
                <div id="jobkeywords" class="widget-search mt-4 mb-0"></div>
                <!-- <router-link
                  v-if="
                    (userRole == 'Client' &&
                      trust &&
                      trust.status == 3 &&
                      trust.is_draft_accepted == 0) ||
                    (amendmentId && amendment && amendment.status == 2)
                  "
                  :to="{
                    name: 'trust-onecent.part-draft',
                    query: {
                      trust_id: trustId,
                      type: type,
                      amendment_id: amendmentId,
                    },
                  }"
                  class="btn w-100 mb-1"
                  :class="trustPart == 0 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Pengesahan Draf
                  </span>
                  <span class="d-block">Terima Draf</span>
                </router-link> -->
                <!-- <router-link
                  :to="{
                    name: 'trust-onecent.part-a',
                    query: {
                      trust_id: trustId,
                      type: type,
                      amendment_id: amendmentId,
                    },
                  }"
                  class="btn w-100"
                  :class="trustPart >= 1 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian A
                  </span>
                  <span class="d-block">Akaun</span>
                </router-link> -->
                <!-- <router-link
                  :to="{
                    name: 'trust-onecent.part-b',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 2 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian B
                  </span>
                  <span class="d-block">eKYC</span>
                </router-link> -->
                <!-- <router-link
                  :to="{
                    name: 'trust-onecent.part-c',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 3 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian C
                  </span>
                  <span class="d-block">Hibah</span>
                </router-link> -->
                <router-link
                  :to="{
                    name: 'trust-onecent.part-d',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 4 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian A
                  </span>
                  <span class="d-block">Penghibah</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'trust-onecent.part-e',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 5 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian B
                  </span>
                  <span class="d-block">Penerima</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'trust-onecent.part-f.moveable',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 6 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian C
                  </span>
                  <span class="d-block">Akaun</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'trust-onecent.part-g',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 7 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian D
                  </span>
                  <span class="d-block">Penjaga</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'trust-onecent.part-h',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 8 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian E
                  </span>
                  <span class="d-block">Pengesahan</span>
                </router-link>
                <!-- {{ trust_details  v-if="trust_details.status == 5"}} -->
                <router-link
                  v-if="trust && trust.status == 2 && userRole == 'Staff'"
                  :to="{
                    name: 'trust-onecent.part-i',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 9 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian F
                  </span>
                  <span class="d-block">Saksi</span>
                </router-link>
                <router-link
                  v-if="
                    (amendmentId && amendment && amendment.status == 3) ||
                    (trust && trust.status == 3 && trust.is_draft_accepted == 1)
                  "
                  :to="{
                    name: 'trust-onecent.part-signpenerima',
                    query: { trust_id: trustId, amendment_id: amendmentId },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 10 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    TandaTangan
                  </span>
                  <span class="d-block">Tandatangan penerima</span>
                </router-link>
              </div>
              <!-- <div class="text-center" v-if="trust && trust.status == 3">
                <button @click="onNavigate" class="btn btn-info btn-sm">
                  Cetak Hibah
                </button>
              </div> -->
              <hr
                class="primary"
                v-if="userRole == 'Staff' && trust && trust.status == 2"
              />
              <!-- <div> -->
              <div
                class="row d-flex justify-content-center"
                v-if="
                  (userRole == 'Staff' && trust && trust.status == 2) ||
                  (userRole == 'Staff' && this.amendment_status == 1)
                "
              >
                <button
                  type="button"
                  @click="approveHibah"
                  class="btn btn-success mr-1"
                >
                  {{ $t("confirm") }}
                </button>
                <button
                  type="button"
                  @click="declineHibah"
                  class="btn btn-danger ml-1"
                >
                  {{ $t("cancel") }}
                </button>
              </div>
              <div
                v-if="trust && trust.status == 5"
                class="d-flex justify-content-center"
              >
                <b-button class="btn btn-primary" @click="onNavigate">
                  Cetak Sijil
                </b-button>
              </div>
            </div>
          </div>

          <router-view> </router-view>
        </div>
      </div>
    </section>

    <Footer />
    <a
      href="javascript: void(0);"
      class="btn btn-icon btn-soft-primary back-to-top"
      id="back-to-top"
      v-scroll-to="'#topnav'"
    >
      <arrow-up-icon class="icons"></arrow-up-icon>
    </a>
  </div>
</template>
