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

/**
 * Page-aboutus component
 */
export default {
  data() {
    return {};
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

    <!-- Shape Start -->

    <!--Shape End-->

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-12">
            <div class="sidebar sticky-bar p-4 rounded shadow bg-light">
              <!-- SEARCH -->
              <div class="widget mb-4 pb-4 border-bottom">
                <div id="jobkeywords" class="widget-search mt-4 mb-0"></div>
                <router-link
                  :to="{ name: 'wasiatAgent.part-a' }"
                  class="btn btn-primary w-100"
                >
                  Part A
                  <span class="d-block" style="font-weight: 100">Wasiat</span>
                </router-link>
                <router-link
                  :to="{ name: 'wasiatAgent.part-b' }"
                  class="btn btn-secondary w-100 mt-1"
                >
                  Part B
                  <span class="d-block" style="font-weight: 100">Pewasiat</span>
                </router-link>
                <router-link
                  :to="{ name: 'wasiatAgent.part-c' }"
                  class="btn btn-secondary w-100 mt-1"
                >
                  Part C
                  <span class="d-block" style="font-weight: 100">Waris</span>
                </router-link>
                <router-link
                  :to="{ name: 'wasiatAgent.part-d' }"
                  class="btn btn-secondary w-100 mt-1"
                >
                  Part D
                  <span class="d-block" style="font-weight: 100"
                    >Pengesahan</span
                  >
                </router-link>
                <router-link
                  :to="{ name: 'wasiatAgent.part-e' }"
                  class="btn btn-secondary w-100 mt-1"
                >
                  Part E
                  <span class="d-block" style="font-weight: 100">Saksi</span>
                </router-link>
              </div>
              <!-- SEARCH -->

              <!-- CATAGORIES -->

              <!-- Posted -->
            </div>
          </div>
          <!--end col-->

          <router-view> </router-view>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <!--end container-->
    </section>

    <!--end section-->
    <Footer />
    <!-- Footer End -->
    <!-- <Switcher /> -->
    <!-- Back to top -->
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
