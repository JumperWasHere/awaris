<script>
import { LOGOUT } from "@/services/store/auth.module";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userAccess"]),
    environment() {
      return process.env.VUE_APP_ENVI;
    },
  },
  props: {
    isWhiteNavbar: {
      type: Boolean,
    },
    navLight: {
      type: Boolean,
    },
    preference: {
      type: Object,
    },
  },
  methods: {
    onMenuClick(event) {
      event.preventDefault();
      const nextEl = event.target.nextSibling.nextSibling;

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
        if (this.$route.name != "Home") {
          vm.$router.push({ name: "Home" });
        }
      });
      vm.$notify({
        group: "foo",
        title: "Anda telah log keluar dari sistem AWARIS",
        // text: data.message,
        type: "success",
      });
    },
  },
};
</script>

<template>
  <div>
    <ul
      v-if="isAuthenticated"
      class="navigation-menu"
      :class="{ 'nav-light': navLight === true }"
    >
      <li>
        <router-link :to="{ name: 'dashboard' }" class="side-nav-link-ref">
          {{ $t("navbar.homepage") }}
        </router-link>
      </li>
      <!-- <li class="has-submenu">
        <a href="javascript:void(0)" @click="onMenuClick">{{
          $t("navbar.testament")
        }}</a>
        <span class="menu-arrow"></span>
        <ul class="submenu megamenu">
          <li>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'wasiat.list' }"
                  class="side-nav-link-ref"
                  >{{ $t("will-list") }}</router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'carian.semak' }"
                  class="side-nav-link-ref"
                  >{{ $t("search2") }}</router-link
                >
              </li>
            </ul>
          </li>

          <li>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'dashboard.report' }"
                  class="side-nav-link-ref"
                  >{{ $t("report") }}</router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'wasiat.part_a' }"
                  class="side-nav-link-ref"
                  >{{ $t("reg-new") }}</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
      </li> -->

      <!-- <li
        class="has-submenu"
        v-if="['local', 'development', 'staging'].includes(environment)"
      >
        <a href="javascript:void(0)" @click="onMenuClick">{{ $t("trusts") }}</a>
        <span class="menu-arrow"></span>
        <ul class="submenu">
          <li>
            <router-link
              :to="{ name: 'trust.product-list' }"
              class="side-nav-link-ref"
              >{{ $t("reg-new") }}</router-link
            >
          </li>
          <li>
            <router-link
              :to="{ name: 'trust.list' }"
              class="side-nav-link-ref"
              >{{ $t("trust.lists") }}</router-link
            >
          </li>
        </ul>
      </li> -->
      <li class="has-submenu">
        <router-link
          :to="{
            name: 'organization.info',
            params: { organization_id: userAccess.organization_id },
          }"
          >{{ $t("organization") }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
