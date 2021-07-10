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
import { mapGetters } from "vuex";

import { Carousel, Slide } from "vue-carousel";
import ApiService from "@/services/api.service";
import Graph from "@/views/wasiat/report/component/graph";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  mounted() {
    // this.organizationType = this.$route.params.type;

    this.getJson(false);
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  data() {
    return {
      organizationType: null,
      loaded: false,
      data: {
        labels: ["Baru", "Dalam Proses", "Lulus"],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
      date: {
        start: null,
        end: null,
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
    Graph,
  },
  methods: {
    async getJson(search) {
      var query;
      if (search) {
        query = `/organization/${this.userAccess.organization_id}/report/wasiat/status?wasiat_type=1&start_date=${this.date.start}&end_date=${this.date.end}`;
      } else {
        query = `/organization/${this.userAccess.organization_id}/report/wasiat/status?wasiat_type=1`;
      }
      this.loaded = false;
      let result_Islam = await this.getIslamData(search);
      let result_Konversional = await this.getKonversional(search);
      if (result_Islam && result_Konversional) {
        let obj = {
          labels: ["Baru", "Dalam Proses", "Lulus", "Batal"],
          datasets: [
            {
              data: result_Islam.values,
              label: "Wasiat Islam",
              backgroundColor: "#0B0B61",
              barThickness: 20,
              maxBarThickness: 40,
              minBarLength: 1,
              offset: true,
            },
            {
              data: result_Konversional.values,
              label: "Wasiat Konversional",
              backgroundColor: "#B40431",
              barThickness: 20,
              maxBarThickness: 40,
              minBarLength: 1,
              offset: true,
            },
          ],
        };
        this.data = obj;
        console.log(this.data);
        this.loaded = true;
      }
    },
    async getKonversional(search) {
      var query;
      if (search) {
        query = `/organization/${this.userAccess.organization_id}/report/wasiat/status?wasiat_type=2&start_date=${this.date.start}&end_date=${this.date.end}`;
      } else {
        query = `/organization/${this.userAccess.organization_id}/report/wasiat/status?wasiat_type=2`;
      }
      return await ApiService.get(query)
        .then((response) => {
          console.log("getKonversional", response.data);
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async getIslamData(search) {
      var query;
      if (search) {
        query = `/organization/${this.userAccess.organization_id}/report/wasiat/status?wasiat_type=1&start_date=${this.date.start}&end_date=${this.date.end}`;
      } else {
        query = `/organization/${this.userAccess.organization_id}/report/wasiat/status?wasiat_type=1`;
      }
      return await ApiService.get(query)
        .then((response) => {
          console.log("getIslamData", response.data);
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    search() {
      console.log(this.date.start, "||", this.date.end);
      this.getJson(true);
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
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
                STATISTIK WASIAT TERKINI
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- {{ userAccess.organization_id }} -->
    <section class="section">
      <div
        class="container card public-profile border-0 rounded shadow overflow-hidden"
      >
        <div class="d-flex justify-content-between">
          <div class="col-6 justify-content-center">
            <label for="example-date-input" class="col-form-label"
              >Tarikh Mula</label
            >
            <div>
              <input
                class="form-control"
                type="date"
                v-model="date.start"
                id="example-date-input"
              />
            </div>
          </div>
          <div class="col-6">
            <label for="example-date-input" class="col-form-label"
              >Tarikh Akhir</label
            >
            <div>
              <input
                class="form-control"
                type="date"
                id="example-date-input"
                v-model="date.end"
              />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end m-3">
          <b-button class="btn" @click="search"> Cari </b-button>
        </div>
        <div class="card-body">
          <div class="container">
            <!-- <Graph :chartdata="chartdata" :options="options" /> -->
            <Graph
              :data="this.data"
              :options="this.options"
              :date="this.date"
              v-if="loaded"
            />
          </div>
        </div>
      </div>
    </section>
    <Footer />
    <!-- <Switcher /> -->
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
