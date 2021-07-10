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

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
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
                Pengesahan Pindaan
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
          <h5 class="text-center">SENARAI PINDAAN DALAM PROSES WASIAT</h5>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">BIL.</th>
                  <th style="width: 200px">CODE 1</th>
                  <th>AMANAH</th>
                  <th style="width: 100px">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">BIL.</th>
                  <th style="width: 200px">CODE 2</th>
                  <th>RAKAN NIAGA</th>
                  <th style="width: 100px">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>A</td>
                  <td>BANK SENDIRIAN BERHAD</td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>RK-KFH</td>
                  <td>FKF AWARIS SOLUTIONS</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">BIL.</th>
                  <th style="width: 200px">CODE 3</th>
                  <th>BANK</th>
                  <th style="width: 100px">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>RK-KFH</td>
                  <td>KUWAIT FINANCE HOUSE</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">BIL.</th>
                  <th style="width: 200px">CODE 4</th>
                  <th>KOPERASI</th>
                  <th style="width: 100px">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>RK- KEKAL</td>
                  <td>KOPERASI PENDIDIKAN USAHAWAN BERHAD</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
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
