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
import ApiService from "@/services/api.service";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      form: {
        old_password: null,
        password: null,
        password_confirmation: null,
      },
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
  methods: {
    async changePassword() {
      if (this.form.password == this.form.password_confirmation) {
        var result = await this.changePasswordApi();
        if (!result) {
          this.$swal.fire({
            icon: "error",
            html: "Kata Laluan Sekarang tidak benar",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          return;
        } else {
          this.$swal.fire({
            icon: "success",
            html: "Anda berjaya menukar kata laluan",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$router.push({ name: "dashboard" });
        }
      } else {
        this.$swal.fire({
          icon: "error",
          html: "Kata laluan tidak sama",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      }
    },
    async changePasswordApi() {
      return await ApiService.post(`/password/change`, this.form)
        .then((response) => {
          return true;
          console.log(response.data);
        })
        .catch((error) => {
          return false;
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  mounted() {},
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
                {{ $t("navbar.change-password") }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <div
              class="card bg-light job-box rounded shadow border-0 overflow-hidden"
            >
              <div class="card-body">
                <div class="form-group">
                  <label for="">{{ $t("current.password") }}</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="form.old_password"
                  />
                </div>
                <div class="form-group">
                  <label for="">{{ $t("new.password") }}</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="form.password"
                  />
                </div>
                <div class="form-group">
                  <label for="">{{ $t("confirm-password") }}</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="form.password_confirmation"
                  />
                </div>
                <div class="form-group text-right">
                  <button class="btn btn-primary" @click="changePassword">
                    <i class="mdi mdi-file-document"></i>
                    {{ $t("save") }}
                  </button>
                </div>
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
