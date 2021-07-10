<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import {
  ArrowUpIcon,
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
    return {
      testators: null,
      profile_picture: null,
      user_accesses: [],
    };
  },
  mounted() {
    console.log("Currentuser", this.currentUser);
    this.getOrganizationTestators();
    this.getProfilePicture();
  },
  methods: {
    getOrganizationTestators() {
      var org = 1;
      ApiService.get(`organization/${org}/testator`)
        .then((response) => {
          this.testators = response.data.testators.data;
        })
        .catch((error) => {});
    },

    getProfilePicture() {
      ApiService.get(
        `user/${this.currentUser.id}/profile-picture?stream=false`
      ).then((response) => {
        this.profile_picture = response.data.profile_picture
          ? response.data.profile_picture.public_path
          : "/images/icon/awaris-pattern.png";
      });
    },
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
  },
  computed: {
    ...mapGetters(["currentUser", "userRole", "userAccess"]),

    userId() {
      return this.$route.params.user_id;
    },
    routeName() {
      return this.$route.name;
    },
  },
  watch: {
    organizationType: [
      {
        handler: "setRoles",
      },
    ],
  },
  props: {
    organization: {
      type: Object,
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
              <h4 class="title text-white">
                {{ $t("profile.user") }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div
              class="card public-profile border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-lg-3 col-md-3 text-md-left text-center">
                    <div v-if="profile_picture" class="text-center">
                      <div
                        :style="
                          'background-image: url(' + profile_picture + ')'
                        "
                        class="bg-light shadow"
                        style="
                          border: 1px solid #eee;
                          position: relative;
                          display: inline-block;
                          border-radius: 100%;
                          height: 150px;
                          width: 150px;
                          background-repeat: no-repeat;
                          background-size: cover;
                          background-position: center center;
                        "
                      ></div>
                    </div>
                  </div>
                  <div class="col-lg-9 col-md-9">
                    <div class="row align-items-end">
                      <div
                        class="col-md-12 text-md-left text-center mt-4 mt-sm-0"
                      >
                        <h5 class="title mb-0">
                          {{ currentUser ? currentUser.designation : "" }}
                          {{ currentUser ? currentUser.name : "-" }}

                          <small
                            ><span
                              class="badge badge-success"
                              v-if="currentUser.status == 1"
                            >
                              {{ $t("active") }}
                            </span>
                            <span
                              class="badge badge-warning"
                              v-if="currentUser.status != 1"
                            >
                              {{ $t("inactive") }}
                            </span></small
                          >
                        </h5>
                        <small class="text-muted h6 mr-2">
                          {{
                            currentUser.roles ? currentUser.roles[0].name : "-"
                          }}
                        </small>
                        <ul class="list-inline mb-0 mt-3">
                          <li class="list-inline-item mr-2">
                            <router-link
                              to="/profile-edit"
                              class="btn btn-primary"
                            >
                              {{ $t("profile.update-details") }}
                              <i class="mdi mdi-chevron-right"></i>
                            </router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div
              class="card bg-light border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-bodyz">
                <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <router-link
                      :to="{ name: 'profile' }"
                      :class="routeName == 'profile' ? 'active' : ''"
                      class="nav-link"
                      >{{ $t("profile.information") }}</router-link
                    >
                  </li>
                  <li class="nav-item" v-if="userRole != 'Client'">
                    <router-link
                      :to="{ name: 'profile.signature' }"
                      :class="routeName == 'profile.signature' ? 'active' : ''"
                      class="nav-link"
                      >{{ $t("profile.signature") }}</router-link
                    >
                  </li>
                </ul>
                <div class="card-body">
                  <router-view></router-view>
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
