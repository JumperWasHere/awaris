<script>
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
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return { wasiat_status: null, wasiat_id: null, amendment_id: null };
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
  methods: {
    async getwasiatDetails() {
      ApiService.get(`/wasiat?user_id=${this.user_id}`)
        .then((response) => {
          var data_array = response.data.wasiats.data;
          if (Array.isArray(data_array) && data_array.length) {
            this.wasiat_status = data_array[0].status;
            this.wasiat_id = data_array[0].id;
            if (data_array[0].status == 2) {
              this.getAmendment();
            }
            // console.log(this.wasiat_status);
          }
          // console.log(data_array);
        })
        .catch((error) => {});
    },
    async getAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // console.log(response.data);
          var data_array = response.data.amendments.data;
          if (Array.isArray(data_array) && data_array.length) {
            var data = data_array.filter((item) => item.status == 4);
            console.log(data);
            this.amendment_status = data[0].status;
            this.amendment_id = data[0].id;
          }
        })
        .catch((error) => {});
    },
  },
  mounted() {
    // if (this.$route.query.user_id) {
    //   this.user_id = this.$route.query.user_id;
    // }
    this.getwasiatDetails();
  },
  computed: {
    user_id() {
      return this.$route.query.user_id;
    },
    statusPart() {
      if (this.$route.name == "carian.status-a") {
        return 1;
      } else if (this.$route.name == "carian.status-b") {
        return 2;
      } else if (this.$route.name == "carian.status-c") {
        return 3;
      } else if (this.$route.name == "carian.status-d") {
        return 4;
      } else if (this.$route.name == "carian.status-e") {
        return 5;
      }
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userRole"]),
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
              <h4 class="title text-white" style="text-transform: capitalize">
                Status Carian Pewasiat
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
              <!-- SEARCH -->
              <div class="widget mb-4 pb-4 border-bottom">
                <div id="jobkeywords" class="widget-search mt-4 mb-0"></div>
                <router-link
                  :to="{
                    name: 'carian.status-a',
                    query: {
                      user_id: user_id,
                    },
                  }"
                  class="btn w-100"
                  :class="statusPart == 1 ? 'btn-primary' : 'btn-secondary'"
                  >Wasiat</router-link
                >
                <router-link
                  :to="{
                    name: 'carian.status-b',
                    query: {
                      user_id: user_id,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="statusPart == 2 ? 'btn-primary' : 'btn-secondary'"
                  >Pewasiat</router-link
                >
                <router-link
                  :to="{
                    name: 'carian.status-c',
                    query: {
                      user_id: user_id,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="statusPart == 3 ? 'btn-primary' : 'btn-secondary'"
                  >Ejen</router-link
                >
                <router-link
                  :to="{
                    name: 'carian.status-d',
                    query: {
                      user_id: user_id,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="statusPart == 4 ? 'btn-primary' : 'btn-secondary'"
                  >Status</router-link
                >
                <router-link
                  v-if="wasiat_status == 2 && userRole == 'Staff'"
                  :to="{
                    name: 'carian.status-e',
                    query: {
                      user_id: user_id,
                      wasiat_id: this.wasiat_id,
                      amendment_id: this.amendment_id,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="statusPart == 5 ? 'btn-primary' : 'btn-secondary'"
                  >Cetak Wasiat</router-link
                >
              </div>
            </div>
          </div>
          <router-view></router-view>
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
