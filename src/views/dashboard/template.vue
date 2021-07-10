<script>
import { ArrowUpIcon, SettingsIcon } from "vue-feather-icons";
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
    ArrowUpIcon,
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
              <h4 class="title text-white">Template</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="table-responsive">
          <table class="table">
            <tr>
              <th>
                <div class="text-center">
                  <h4>Template page</h4>
                </div>
              </th>
            </tr>
          </table>
        </div>
      </div>
    </section>

    <Footer />
    <Switcher />

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
