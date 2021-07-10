<script>
import { mapGetters } from "vuex";
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import moment from "moment";
import ApiService from "@/services/api.service";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
    this.getWasiats();
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
      wasiats: null,
      html_table: null,
    };
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    getWasiats() {
      ApiService.get(`/wasiat/report/yearly-summary?format=html`).then(
        (response) => {
          this.html_table = response.data;
        }
      );
    },
    downloadExcel() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/wasiat/report/yearly-summary?format=excel`,
        "_blank"
      );
    },
  },
  computed: {
    ...mapGetters(["userRole", "userAccess"]),
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
                Laporan Tahunan
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div
        class="container card public-profile border-0 rounded shadow overflow-hidden"
      >
        <div class="card-body">
          <div class="row mb-4">
            <div
              class="col-lg-12 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0 text-right">
                  <b-button class="btn btn-primary" @click="downloadExcel">
                    Download Excel</b-button
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table" v-html="html_table"></table>
          </div>
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
