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
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      organization_id: null,
      logo: null,
      newIc: null,
      oldIc: null,
      fullname: null,
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
  mounted() {
    if (this.userAccess) {
      this.organization_id = this.userAccess.organization_id;
      // console.log(this.organization_id);
      this.getOrgLogo();
    }
  },
  methods: {
    async getOrgLogo() {
      ApiService.get(`/organization/${this.organization_id}/logo?stream=false`)
        .then((response) => {
          if (response.data.logo != null) {
            this.logo = response.data.logo.public_path;
          } else {
          }
        })
        .catch((error) => {});
    },
    onSubmit() {
      this.$router.push({
        name: "carian.senarai",
        query: {
          ic_number: this.newIc,
          old_ic_number: this.oldIc,
          fullname: this.fullname,
        },
      });
    },
  },
  computed: {
    ...mapGetters(["currentUser", "userRole", "userAccess"]),
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
              <h4 class="title text-white">
                Semakan Maklumat Wasiat Pelanggan
              </h4>
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
                <form class="login-form" @submit.stop.prevent="onSubmit">
                  <div class="col-md-12">
                    <img
                      v-bind:src="logo"
                      class="avatar avatar-large-logo d-block mx-auto"
                      alt
                    />
                    <div class="form-group position-relative mt-5">
                      <label>No. MyKad</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="No. MyKad"
                        name
                        v-model="newIc"
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
                        v-model="oldIc"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group position-relative">
                      <label>Nama Penuh</label>
                      <input
                        type="text"
                        v-uppercase
                        class="form-control"
                        placeholder="Nama Penuh"
                        name
                        v-model="fullname"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12 text-right">
                    <div class="form-group">
                      <button class="btn btn-primary">Cari</button>
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
