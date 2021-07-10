<script>
import { LOGOUT } from "@/services/store/auth.module";
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";

import AdminNavigation from "@/components/navigation/admin.vue";
import StaffNavigation from "@/components/navigation/staff.vue";
import AgentNavigation from "@/components/navigation/agent.vue";
import ItNavigation from "@/components/navigation/technical.vue";
import OrganizationSuperAdminNavigation from "@/components/navigation/organization-super-admin.vue";
import BranchAdminNavigation from "@/components/navigation/branch-admin.vue";
import UserNavigation from "@/components/navigation/user.vue";
import { SET_WASIAT_EMPTY, CLEAR_WASIAT } from "@/services/store/wasiat.module";

export default {
  data() {
    return {
      isCondensed: false,
      preference: {
        allow_hibah: 2,
        allow_wasiat: 1,
      },
    };
  },
  props: {
    isWhiteNavbar: {
      type: Boolean,
    },
    navLight: {
      type: Boolean,
    },
  },
  components: {
    UserNavigation,
    AdminNavigation,
    StaffNavigation,
    AgentNavigation,
    OrganizationSuperAdminNavigation,
    BranchAdminNavigation,
    ItNavigation,
  },
  mounted() {
    this.$store.dispatch(CLEAR_WASIAT);

    window.onscroll = function () {
      onwindowScroll();
    };

    function onwindowScroll() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        document.getElementById("topnav").classList.add("nav-sticky");
        document.getElementById("div_language").style.display = "none";
      } else {
        document.getElementById("topnav").classList.remove("nav-sticky");
        document.getElementById("div_language").style.display = "block";
      }

      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        document.getElementById("back-to-top").style.display = "inline";
      } else {
        document.getElementById("back-to-top").style.display = "none";
      }
    }

    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("active");
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add("active");
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add("active");
            const parent4 = parent3.parentElement;
            if (parent4) {
              const parent5 = parent4.parentElement;
              parent5.classList.add("active");
            }
          }
        }
      }
    }
    if (this.userRole != "Client") {
      this.getPreference();
    }
  },
  methods: {
    /**
     * Toggle menu
     */
    toggleMenu() {
      this.isCondensed = !this.isCondensed;
      if (this.isCondensed) {
        document.getElementById("navigation").style.display = "block";
      } else document.getElementById("navigation").style.display = "none";
    },
    getPreference() {
      ApiService.get(
        `organization/${this.userAccess.organization_id}/preference`
      ).then((response) => {
        this.preference = response.data.preference ?? {};
      });
    },
    /**
     * Menu clicked show the submenu
     */
    onMenuClick(event) {
      event.preventDefault();
      const nextEl = event.target.nextSibling.nextSibling;
      // console.log(event.target.nextSibling.nextSibling);
      // console.log(event.target.lastChild);
      // console.log(event.target.childNodes);

      if (nextEl && !nextEl.classList.contains("open")) {
        const parentEl = event.target.parentNode;
        if (parentEl) {
          parentEl.classList.remove("open");
        }
        nextEl.classList.add("open");
      } else if (nextEl) {
        nextEl.classList.remove("open");
      }
      return false;
    },
    logout() {
      const vm = this;
      vm.$store.dispatch(LOGOUT).then(() => {
        setTimeout(() => {
          if (this.$route.name != "Home") {
            vm.$router.push({ name: "Home" });
          }
        }, 500);
      });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
    shortName() {
      return this.currentUser.name.split(" ", 1);
    },
  },
};
</script>

<template>
  <div>
    <!-- {{ currentUser }} -->
    <header
      id="topnav"
      class="defaultscroll sticky"
      :class="{ 'bg-white': isWhiteNavbar === true }"
    >
      <div class="container">
        <div class="text-white text-right pr-4 btn-hai" id="div_language">
          <p class="p-lang">
            LANGUAGE &nbsp;
            <span class="lang-bg ml-2 rounded">
              <span
                @click="changeLocale('ms')"
                style="cursor: pointer"
                :class="$i18n.locale == 'ms' ? 'text-white' : ''"
              >
                BM
              </span>
              |
              <span
                @click="changeLocale('en')"
                style="cursor: pointer"
                :class="$i18n.locale == 'en' ? 'text-white' : ''"
              >
                ENG
              </span>
            </span>
          </p>
        </div>
        <div>
          <router-link class="logo mb-0 p-0" to="/" v-if="navLight !== true">
            <img src="/images/logo-awaris.png" height="40" alt />
          </router-link>
          <router-link class="logo" to="/" v-else>
            <img src="/images/logo-awaris.png" class="l-dark" height="60" alt />
            <img
              src="/images/logo-awaris-white.png"
              class="l-light"
              height="60"
              alt
            />
          </router-link>
        </div>
        <div class="buy-button" v-if="!isAuthenticated">
          <router-link
            :to="{ name: 'login' }"
            class="btn"
            :class="{
              'btn-light': navLight === true,
              'btn-primary': navLight !== true,
            }"
            >{{ $t("log-in") }}</router-link
          >
        </div>
        <div
          class="buy-button btn-hai"
          v-if="isAuthenticated"
          style="line-height: 100%"
        >
          <ul class="navigation-menu">
            <li class="has-submenu last-elements">
              <a href="#" style="padding-top: 15px">
                <img
                  src="/images/icon/settings.png"
                  class="l-dark"
                  height="30"
                  alt
                />
              </a>
              <ul class="submenu">
                <li>
                  <router-link :to="{ name: 'profile' }">
                    {{ $t("navbar.profile") }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'change-password' }">
                    {{ $t("navbar.change-password") }}
                  </router-link>
                </li>
                <li>
                  <a href="#" @click="logout">
                    {{ $t("navbar.logout") }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="menu-extras">
          <div class="menu-item">
            <!-- Mobile menu toggle-->
            <a
              class="navbar-toggle"
              @click="toggleMenu()"
              :class="{ open: isCondensed === true }"
            >
              <div class="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>
            <!-- End mobile menu toggle-->
          </div>
        </div>

        <div id="navigation" v-if="isAuthenticated">
          <StaffNavigation
            :nav-light="navLight"
            :preference="preference"
            v-if="userRole == 'Staff'"
          ></StaffNavigation>
          <AdminNavigation
            :nav-light="navLight"
            :preference="preference"
            v-if="userRole == 'Admin'"
          ></AdminNavigation>
          <AgentNavigation
            :nav-light="navLight"
            :preference="preference"
            v-if="userRole == 'Agent'"
          ></AgentNavigation>
          <OrganizationSuperAdminNavigation
            :nav-light="navLight"
            :preference="preference"
            v-if="userRole == 'Super Admin'"
          ></OrganizationSuperAdminNavigation>
          <UserNavigation
            :nav-light="navLight"
            :preference="preference"
            v-if="userRole == 'Client'"
          ></UserNavigation>
          <ItNavigation
            :nav-light="navLight"
            :preference="preference"
            v-if="userRole == 'IT'"
          >
          </ItNavigation>
          <hr class="show-max" />
          <ul
            style=""
            class="navigation-menu nav-user"
            :class="{ 'nav-light': navLight === true }"
          >
            <li class="has-submenu">
              <a href="javascript:void(0)" @click="onMenuClick">{{
                $t("settings")
              }}</a>
              <span class="menu-arrow"></span>
              <ul class="submenu megamenu">
                <li>
                  <ul>
                    <li>
                      <router-link
                        :to="{ name: 'profile' }"
                        class="side-nav-link-ref"
                        >{{ $t("navbar.profile") }}</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        :to="{ name: 'change-password' }"
                        class="side-nav-link-ref"
                        >{{ $t("navbar.change-password") }}</router-link
                      >
                    </li>
                    <li>
                      <a href="#" @click="logout">
                        {{ $t("navbar.logout") }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>
