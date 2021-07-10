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
                Pengesahan Pendaftaran Penuh
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
          <h5 class="text-center">
            SENARAI PENGESAHAN PENDAFTARAN PENUH WASIAT
          </h5>
          <div class="table-responsive bg-white shadow rounded mt-5">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil.</th>
                  <th style="width: 200px">Code 2</th>
                  <th>Rakan Niaga</th>
                  <th style="width: 100px">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>A</td>
                  <td>BANK SENDIRIAN BERHAD</td>
                  <td>
                    <router-link to="/wasiat/pengesahan/organisasi-penuh"
                      >1</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-5">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil.</th>
                  <th style="width: 200px">Code 3</th>
                  <th>Bank</th>
                  <th style="width: 100px">Jumlah</th>
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
          <div class="table-responsive bg-white shadow rounded mt-5">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil.</th>
                  <th style="width: 200px">Code 4</th>
                  <th>Koperasi</th>
                  <th style="width: 100px">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>RK-KOGURU</td>
                  <td>KOPERASI WARGA PENDIDIKAN TERENGGANU BERHAD</td>
                  <td>
                    <router-link to="/wasiat/pengesahan/organisasi-penuh"
                      >1</router-link
                    >
                  </td>
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
