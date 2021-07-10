<script>
import { ArrowUpIcon, SettingsIcon } from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";
import { mapGetters } from "vuex";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {};
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
    SettingsIcon,
  },
  computed: {
    ...mapGetters(["userRole", "userAccess"]),
    error() {
      return this.$route.query.error;
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
              <h4 class="title text-white">Laporan</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-md-8 offset-md-2 mt-4 pt-2">
            <div class="alert alert-warning" v-if="error == 1">
              Sila pilih laporan terlebih dahulu
            </div>
          </div>
        </div>

        <div class="row">
          <div
            class="col-md-6 offset-md-3 mt-4 pt-2"
            v-if="['Staff'].includes(userRole)"
          >
            <router-link :to="{ name: 'dashboard.report-yearly' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Tahunan</h4>
                      <!-- <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Korporate Sikit Disini
                        </p>
                      </div> -->
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <router-link :to="{ name: 'dashboard.detailed-yearly-report' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Tahunan Terperinci</h4>
                      <!-- <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Korporate Sikit Disini
                        </p>
                      </div> -->
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <router-link :to="{ name: 'dashboard.report-monthly' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Bulanan</h4>
                      <!-- <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Korporate Sikit Disini
                        </p>
                      </div> -->
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <router-link :to="{ name: 'dashboard.detailed-monthly-report' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Bulanan Terperinci</h4>
                      <!-- <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Korporate Sikit Disini
                        </p>
                      </div> -->
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <router-link :to="{ name: 'dashboard.approved-monthly-report' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Bulanan Disahkan</h4>
                      <!-- <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Korporate Sikit Disini
                        </p>
                      </div> -->
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <router-link :to="{ name: 'dashboard.report-daily' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Harian</h4>
                      <!-- <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Korporate Sikit Disini
                        </p>
                      </div> -->
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div
            class="col-md-6 offset-md-3 mt-4 pt-2"
            v-if="['Staff', 'Super Admin'].includes(userRole)"
          >
            <router-link :to="{ name: 'dashboard.report-soa' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Penyata Akaun (SOA)</h4>
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div
            class="col-md-6 offset-md-3 mt-4 pt-2"
            v-if="['Staff', 'Super Admin'].includes(userRole)"
          >
            <router-link :to="{ name: 'dashboard.loan-bmmb' }"
              ><div class="card rounded shadow bg-dark border-0">
                <div class="pt-4 pb-4 pl-4 pr-4">
                  <div class="d-flex justify-content-between">
                    <div class="pt-2">
                      <h4 class="text-white">Laporan Pembiayaan BMMB</h4>
                    </div>
                    <div class="pt-1">
                      <button class="btn btn-primary btn-sm">
                        <img src="/images/icon/next.png" height="30" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
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
