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
                Pengesahan
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
            PENGESAHAN PRA-PENDAFTARAN : AL KAHFI CONSULTANT
          </h5>
          <div class="row mt-2">
            <div
              class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <label>Kad Pengenalan Baru:</label>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Kad Pengenalan Baru"
                    name
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div
              class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <label
                    >Kad Pengenalan Lama / Polis / Tentera / Passport:</label
                  >
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Kad Pengenalan Lama / Polis / Tentera / Passport"
                    name
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div
              class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <label>Nama Penuh:</label>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nama Penuh"
                    name
                    required
                  />
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <a href="#" class="btn btn-primary">Cari</a>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div
              class="col-lg-8 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <label>Bilangan Wasiat: 0</label>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0"
            >
              <div class="form custom-form">
                <div class="form-group mb-0 text-right">
                  <router-link
                    to="/wasiat/pengesahan/pendaftaran"
                    class="btn btn-outline-primary mr-2"
                  >
                    <i class="mdi mdi-arrow-left"></i> Senarai Pengesahan
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-2">
            <table class="table mb-0 table-center" style="font-size: 12px">
              <thead class="bg-light">
                <tr>
                  <th>Bil. Organisasi</th>
                  <th>Tarikh Daftar</th>
                  <th>Nama Pewasiat</th>
                  <th>No. KP Baru / Lama / Polis / Tentera / Passport</th>
                  <th>Negeri</th>
                  <th>Cawangan</th>
                  <th>Nama Ejen</th>
                  <th>Telefon Ejen</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>15-01-2020</td>
                  <td>JAMBARI BINTI TOKIJO</td>
                  <td>565656565656</td>
                  <td>SELANGOR</td>
                  <td>ALKAHFI CAWANGAN SELANGOR</td>
                  <td>SARINI BINTI AB WAHAB</td>
                  <td>60133780755</td>
                  <td>
                    <router-link
                      to="/wasiat/pengesahan/tindakan"
                      class="btn btn-primary"
                      style="font-size: 12px"
                      >Pengesahan</router-link
                    >
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>04-02-2020</td>
                  <td>LEE AH TAI</td>
                  <td>540508045291</td>
                  <td>SELANGOR</td>
                  <td>ALKAHFI CAWANGAN SELANGOR</td>
                  <td>ZULFADLI BIN ISKANDAR</td>
                  <td>60134859427</td>
                  <td>
                    <router-link
                      to="/wasiat/pengesahan/tindakan"
                      class="btn btn-primary"
                      style="font-size: 12px"
                      >Pengesahan</router-link
                    >
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>01-01-2020</td>
                  <td>ISMAIL BIN MOHAMAD</td>
                  <td>850401025577</td>
                  <td>SELANGOR</td>
                  <td>ALKAHFI CAWANGAN SELANGOR</td>
                  <td>ZULFADLI BIN ISKANDAR</td>
                  <td>60134859427</td>
                  <td>
                    <router-link
                      to="/wasiat/pengesahan/tindakan"
                      class="btn btn-primary"
                      style="font-size: 12px"
                      >Pengesahan</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-lg-9 col-md-7">
              <div class="section-title">
                <p class="mb-0">Showing 1–15 of 47 results</p>
              </div>
            </div>
            <div class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <select
                    class="form-control custom-select"
                    id="Sortbylist-job"
                  >
                    <option>Show 5 lists</option>
                    <option>Show 10 lists</option>
                    <option>Show 15 lists</option>
                    <option>Show 20 lists</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 mt-4 pt-2">
              <ul class="pagination justify-content-center mb-0">
                <li class="page-item">
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    aria-label="Previous"
                  >
                    <i class="mdi mdi-arrow-left"></i> Prev
                  </a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="javascript:void(0)">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="javascript:void(0)">2</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="javascript:void(0)">3</a>
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    aria-label="Next"
                  >
                    Next
                    <i class="mdi mdi-arrow-right"></i>
                  </a>
                </li>
              </ul>
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
    <!-- Back to top -->
  </div>
</template>
