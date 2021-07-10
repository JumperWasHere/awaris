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
    this.getapproval();
    // this.getasignsaksi();
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
      wasiats: null,
      pindaanList: [],
      pindaanSaksiList: [],
    };
  },
  methods: {
    async getpindaanList(status) {
      return await ApiService.get(
        `/amendment?amendmentable_type=Hibah&load_with=amendmentable.user`
      )
        .then((response) => {
          // if (status == 1) {
          var pindaan = response.data.amendments.data ?? [];
          // this.pindaanList = response.data.amendments.data ?? [];
          this.pindaanList = pindaan.filter(
            (item) => item.status == 1 || item.status == 4
          );
          // console.log("pindaanList", this.pindaanList);
          // console.log("pindaan", pindaan);
          // } else if (status == 4) {
          //   this.pindaanSaksiList = response.data.amendments.data ?? [];
          // }
          // console.log(response.data.amendments.data);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    // async getasignsaksi() {
    //   await this.getpindaanList();
    // },
    async getapproval() {
      await this.getpindaanList(1);
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
                Senarai Pindaan
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div
        class="container card bg-light border-0 rounded shadow overflow-hidden"
      >
        <div class="card-body">
          <div class="row">
            <div
              class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0 border-0 sidebar sticky-bar"
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
                        placeholder="Carian..."
                      />
                      <input type="submit" id="searchsubmit" value="Search" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div v-if="pindaanList == []" class="p-5 text-center">
            <h5>Tiada rekod ditemui</h5>
          </div>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th style="width: 500px">Nama Penuh</th>
                  <th>MyKad</th>
                  <th style="width: 100px">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pindaan, index) in pindaanList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    {{
                      pindaan.amendmentable.user
                        ? pindaan.amendmentable.user.name
                        : "-"
                    }}
                  </td>
                  <td>
                    {{
                      pindaan.amendmentable.user
                        ? pindaan.amendmentable.user.ic_number
                        : "-"
                    }}
                  </td>
                  <td>
                    <router-link
                      v-if="pindaan.status == 1"
                      tag="button"
                      block
                      class="btn btn-secondary btn-sm"
                      :to="{
                        name: 'trust-onecent.part-a',
                        query: {
                          trust_id: pindaan.amendmentable_id,
                          amendment_id: pindaan.id,
                        },
                      }"
                      >Pengesahan</router-link
                    >
                    <router-link
                      v-if="pindaan.status == 4"
                      tag="button"
                      block
                      class="btn btn-secondary btn-sm"
                      :to="{
                        name: 'trust-onecent.part-i',
                        query: {
                          trust_id: pindaan.amendmentable_id,
                          amendment_id: pindaan.id,
                        },
                      }"
                      >Pengesahan Saksi</router-link
                    >
                  </td>
                </tr>
                <tr v-if="pindaanList.length == 0">
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
                <p class="mb-0">Menunjukkan 1–15 daripada 47 keputusan</p>
              </div>
            </div>
            <div class="col-lg-3 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div class="form custom-form">
                <div class="form-group mb-0">
                  <select
                    class="form-control custom-select"
                    id="Sortbylist-job"
                  >
                    <option>Tunjuk 5 keputusan</option>
                    <option>Tunjuk 10 keputusan</option>
                    <option>Tunjuk 15 keputusan</option>
                    <option>Tunjuk 20 keputusan</option>
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
                    <i class="mdi mdi-arrow-left"></i>Sebelumnya
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
                    Seterusnya
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
