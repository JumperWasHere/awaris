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
    <section class="bg-half bg-primary d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title text-white">{{ $t("navbar.homepage") }}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6 mt-4 pt-2">
            <div
              class="media key-feature align-items-center p-3 rounded shadow"
            >
              <div class="icon text-center rounded-circle mr-3">
                <monitor-icon
                  class="fea icon-ex-md text-primary"
                ></monitor-icon>
              </div>
              <div class="media-body">
                <h4 class="title mb-0">3 Pending Wasiat</h4>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 mt-4 pt-2">
            <div
              class="media key-feature align-items-center p-3 rounded shadow"
            >
              <div class="icon text-center rounded-circle mr-3">
                <heart-icon class="fea icon-ex-md text-primary"></heart-icon>
              </div>
              <div class="media-body">
                <h4 class="title mb-0">3 Clients</h4>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 mt-4 pt-2">
            <div
              class="media key-feature align-items-center p-3 rounded shadow"
            >
              <div class="icon text-center rounded-circle mr-3">
                <eye-icon class="fea icon-ex-md text-primary"></eye-icon>
              </div>
              <div class="media-body">
                <h4 class="title mb-0">4 Pending Approval</h4>
              </div>
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
