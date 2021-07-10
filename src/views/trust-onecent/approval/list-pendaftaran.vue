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
  mounted() {
    this.organizationId = this.$route.query.organization_id;
    this.getPendingWasiat();
  },
  watch: {
    // organizationId() {
    //   return this.$route.query.organization_id;
    // },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  data() {
    return {
      organizationId: null,
      hibahs: null,
    };
  },
  methods: {
    getPendingWasiat() {
      ApiService.get(
        `hibah?organization_id=${this.organizationId}&status=2&load_with=user`
      ).then((response) => {
        this.hibahs = response.data.hibahs.data;
      });
    },
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
              <h4 class="title text-white" style="text-transform: capitalize">
                Senarai Carian
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div
        class="container card public-profile border-0 rounded shadow overflow-hidden"
      >
        <div class="card-body">
          <h5 class="text-center pb-4">SENARAI CARIAN PENGHIBAH</h5>
          <div class="row">
            <div
              class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 card border-0 sidebar sticky-bar"
            >
              <div class="widget">
                <div id="search2" class="widget-search mb-0">
                  <form
                    role="search"
                    method="get"
                    id="searchform"
                    class="searchform"
                  >
                    <div>
                      <input
                        type="text"
                        class="border rounded"
                        name="s"
                        id="s"
                        placeholder="Search..."
                      />
                      <input type="submit" id="searchsubmit" value="Search" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hibahs == null" class="p-5 text-center">
            <h5>Tiada rekod ditemui</h5>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-4"
            v-if="hibahs"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">ID</th>
                  <th style="width: 500px">Nama Penuh</th>
                  <th>No. MyKad / Lama</th>
                  <th style="width: 100px">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hibah, index) in hibahs" :key="index">
                  <td>{{ hibah.id }}</td>
                  <td>{{ hibah.user ? hibah.user.name : "-" }}</td>
                  <td>
                    {{ hibah.user ? hibah.user.ic_number : "-" }}
                  </td>
                  <td>
                    <router-link
                      tag="button"
                      block
                      class="btn-sm btn-primary"
                      :to="{
                        name: 'trust-onecent.part-a',
                        query: { trust_id: hibah.id, pengesahan: true },
                      }"
                      >Pengesahan</router-link
                    >
                  </td>
                </tr>
                <tr v-if="hibahs.length == 0">
                  <td class="p-5 text-center" colspan="4">
                    <h5>Tiada rekod ditemui</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-lg-9 col-md-7">
              <div class="section-title">
                <p class="mb-0">Showing 1–15 of 47 results</p>
              </div>
            </div>
            <div class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <select
                    class="form-control custom-select"
                    id="Sortbylist-job"
                  >
                    <option>Show 5 lists</option>
                    <option>Show 10 lists</option>
                    <option>Show 15 lists</option>
                    <option>Show 20 lists</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <!-- PAGINATION START -->
            <div class="col-12 mt-4 pt-2">
              <ul class="pagination justify-content-center mb-0">
                <li class="page-item">
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    aria-label="Previous"
                  >
                    <i class="mdi mdi-arrow-left"></i> Prev
                  </a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="javascript:void(0)">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="javascript:void(0)">2</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="javascript:void(0)">3</a>
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    aria-label="Next"
                  >
                    Next
                    <i class="mdi mdi-arrow-right"></i>
                  </a>
                </li>
              </ul>
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
