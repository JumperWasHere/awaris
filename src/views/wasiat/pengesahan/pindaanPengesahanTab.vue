<script>
import { ArrowUpIcon, SettingsIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      organization: {},
      organization_type: null,
    };
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
    SettingsIcon,
  },
  methods: {
    // getOrganization() {
    //   ApiService.get(`organization/${this.organizationId}`).then((response) => {
    //     this.organization = response.data.organization ?? {};
    //     this.organization_type = response.data.organization.type;
    //     console.log(this.organization_type);
    //   });
    // },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organization_id;
    },
    ...mapGetters(["userRole"]),
  },
  mounted() {
    // if (this.organizationId) {
    //   this.getOrganization();
    // }
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
            <div class="page-next-level mt-4">
              <h4 class="title text-white" style="text-transform: capitalize">
                Pengesahan Pindaan Wasiat
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <router-link
                :class="
                  this.$route.name == 'wasiat.pengesahan.list-pindaan'
                    ? 'active'
                    : ''
                "
                class="nav-link"
                :to="{
                  name: 'wasiat.pengesahan.list-pindaan',
                }"
                >Pengesahan Pindaan
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                :class="
                  this.$route.name == 'wasiat.pengesahan.list-pindaan-saksi'
                    ? 'active'
                    : ''
                "
                class="nav-link"
                :to="{
                  name: 'wasiat.pengesahan.list-pindaan-saksi',
                }"
                >Pengesahan Saksi Pindaan</router-link
              >
            </li>
          </ul>
          <div class="card-body">
            <div class>
              <router-view
                v-bind:organization="organization"
                v-bind:userRole="userRole"
              ></router-view>
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
