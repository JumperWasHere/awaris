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
              <h4 class="title text-white">Pindaan Wasiat</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 col-12">
            <div class="card bg-light rounded shadow border-0 overflow-hidden">
              <div class="card-body">
                <form class="login-form">
                  <div class="col-md-12">
                    <div class="form-group position-relative mt-5">
                      <label>No. MyKad</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="No. MyKad"
                        name
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group position-relative">
                      <label
                        >No. Kad Pengenalan Lama / Polis / Tentera /
                        Passport</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="No. Kad Pengenalan Lama"
                        name
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group position-relative">
                      <label>Nama Penuh</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Nama Penuh"
                        name
                        required
                      />
                    </div>
                  </div>
                  <div class="col-lg-12 text-right">
                    <div class="form-group">
                      <a href="#" class="btn btn-primary">Cari</a>
                    </div>
                  </div>
                </form>
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
