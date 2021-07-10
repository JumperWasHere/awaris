<script>
import { LOGOUT } from "@/services/store/auth.module";
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole"]),
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
  mounted() {
    ApiService.get(`/wasiat?user_id=` + this.currentUser.id)
      .then((response) => {
        //check if user have wasiat or not
        if (Array.isArray(response.data.wasiats.data[0])) {
        } else {
          this.wasiat = response.data.wasiats.data[0];
          this.wasiat_status = response.data.wasiats.data[0].status;
          this.wasiat_id = response.data.wasiats.data[0].id;
        }
      })
      .catch((error) => {});
  },
  data() {
    return {
      wasiat_status: "",
      wasiat_id: null,
      wasiat: null,
    };
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
        <router-link :to="{ name: 'dashboard' }" class="side-nav-link-ref">{{
          $t("navbar.homepage")
        }}</router-link>
      </li>
      <li class="has-submenu" v-if="preference.allow_wasiat == 1">
        <a href="javascript:void(0)" @click="onMenuClick">{{
          $t("navbar.testament")
        }}</a>
        <span class="menu-arrow"></span>
        <ul class="submenu megamenu">
          <li>
            <ul>
              <li v-if="userRole != 'Client'">
                <router-link
                  :to="{ name: 'carian.semak' }"
                  class="side-nav-link-ref"
                  >{{ $t("search2") }}</router-link
                >
              </li>
              <li>
                <router-link
                  v-if="wasiat != null"
                  :to="{
                    name: 'wasiat.part_a',
                    query: {
                      wasiat_id: this.wasiat_id,
                    },
                  }"
                  class="side-nav-link-ref"
                  >{{ $t("wasiatasas.my-will") }}</router-link
                >

                <router-link
                  v-if="wasiat_id == null"
                  :to="{
                    name: 'wasiat.part_a',
                  }"
                  class="side-nav-link-ref"
                  >{{ $t("reg-new") }}</router-link
                >
              </li>
              <li v-if="this.wasiat_status == 2">
                <router-link
                  :to="{ name: 'pindaan' }"
                  class="side-nav-link-ref"
                  >{{ $t("amendments2") }}</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <li
        class="has-submenu"
        v-if="['local', 'development', 'staging'].includes(environment)"
      >
        <a href="javascript:void(0)" @click="onMenuClick">{{
          $t("navbar.trust")
        }}</a>
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
              :to="{ name: 'hibah.list-client' }"
              class="side-nav-link-ref"
              >{{ $t("trust.hibah-lists") }}</router-link
            >
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
