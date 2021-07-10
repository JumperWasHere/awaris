<script>
import { ArrowUpIcon } from "vue-feather-icons";
import { mapGetters } from "vuex";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import moment from "moment";

export default {
  data() {
    return {
      currentMonth: null,
    };
  },
  mounted() {
    this.currentMonth = moment().format("YYYY-MM");
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toHumanDate: function (value) {
      return moment(value, "YYYY-MM").format("MMMM YYYY");
    },
  },

  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    downloadExcel() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/wasiat/approved-report?date=${this.currentMonth}`,
        "_blank"
      );
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
              <h4 class="title text-white" style="text-transform: capitalize">
                Laporan Bulanan Disahkan
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
          <h5 class="text-center">AWARIS APPROVED MONTHLY REPORT</h5>

          <div class="row mt-5">
            <div class="col-md-4">
              <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label"
                  >Bulan</label
                >
                <div class="col-sm-8 col-md-8 col-lg-6">
                  <input
                    type="month"
                    class="form-control"
                    v-model="currentMonth"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <b-button class="btn btn-secondary" @click="downloadExcel">
                Download Excel</b-button
              >
            </div>
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
