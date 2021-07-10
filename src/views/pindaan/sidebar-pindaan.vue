<script>
import ApiService from "@/services/api.service";
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
      amendment_status: null,
      amendment_id: null,
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
    ...mapGetters(["isAuthenticated", "userAccess", "userRole"]),
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pindaanPart() {
      if (this.$route.name == "pindaan.part_a") {
        return 1;
      } else if (this.$route.name == "pindaan.part_b") {
        return 2;
      } else if (this.$route.name == "pindaan.part_c") {
        return 3;
      } else if (this.$route.name == "pindaan.part_d-tidakalih") {
        return 4;
      } else if (this.$route.name == "pindaan.part_d-alih") {
        return 4;
      } else if (this.$route.name == "pindaan.form-pindaan-harta-tidak-alih") {
        return 4;
      } else if (this.$route.name == "pindaan.form-pindaan-harta-alih") {
        return 4;
      } else if (
        this.$route.name == "pindaan.form-pindaan-dokumen-tidak-alih"
      ) {
        return 4;
      } else if (this.$route.name == "pindaan.form-pindaan-dokumen-alih") {
        return 4;
      } else if (this.$route.name == "pindaan.receiver-harta-tidak-alih") {
        return 4;
      } else if (this.$route.name == "pindaan.receiver-harta-alih") {
        return 4;
      } else if (this.$route.name == "pindaan.part_e") {
        return 5;
      } else if (this.$route.name == "pindaan.part_f") {
        return 6;
      } else if (this.$route.name == "pindaan.part_g") {
        return 7;
      } else if (this.$route.name == "pindaan.part_h") {
        return 8;
      } else if (this.$route.name == "pindaan.part_i") {
        return 9;
      } else if (this.$route.name == "pindaan.draft-wasiat") {
        return 10;
      }
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    allowsaksi() {
      if (this.amendment_status == 4) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.wasiatGetAmendment();
  },
  methods: {
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
          }
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
              <h4 class="title text-white">Pindaan Wasiat</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="sidebar sticky-bar p-4 rounded shadow bg-light">
              <div class="widget mb-4 pb-4 border-bottom">
                <div id="jobkeywords" class="widget-search mt-4 mb-0"></div>
                <router-link
                  :to="{
                    name: 'pindaan.part_a',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100"
                  :class="pindaanPart >= 1 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian A
                  </span>
                  <span class="d-block">Wasiat</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'pindaan.part_b',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 2 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian B
                  </span>
                  <span class="d-block">Pewasiat</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'pindaan.part_c',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 3 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian C
                  </span>
                  <span class="d-block">Penerima</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'pindaan.part_d-tidakalih',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 4 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian D
                  </span>
                  <span class="d-block">Harta</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'pindaan.part_e',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 5 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian E
                  </span>
                  <span class="d-block">Penjaga</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'pindaan.part_f',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 6 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian F
                  </span>
                  <span class="d-block">Pesanan</span>
                </router-link>

                <router-link
                  :to="{
                    name: 'pindaan.part_g',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 7 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian G
                  </span>
                  <span class="d-block">Dokumen</span>
                </router-link>
                <router-link
                  :to="{
                    name: 'pindaan.part_h',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 8 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian H
                  </span>
                  <span class="d-block">Pengesahan</span>
                </router-link>
                <router-link
                  v-if="allowsaksi"
                  :to="{
                    name: 'pindaan.part_i',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 9 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian I
                  </span>
                  <span class="d-block">Saksi</span>
                </router-link>
                <router-link
                  v-if="amendment_status == 2"
                  :to="{
                    name: 'pindaan.draft-wasiat',
                    params: {
                      wasiat_id: this.wasiat_id,
                    },
                    query: { pengesahan: pengesahan },
                  }"
                  class="btn w-100 mt-1"
                  :class="pindaanPart >= 10 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span class="d-block">Draf Wasiat Akhir</span>
                </router-link>
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
