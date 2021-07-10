<script>
import { mapGetters } from "vuex";
import { ArrowUpIcon } from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";

export default {
  mounted() {
    this.getHibahUser();
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    getConvertDate: function (tempDate) {
      if (!tempDate) return "-";
      var date = new Date(tempDate);
      var dateConvert =
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "/" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "/" +
        date.getFullYear();
      return dateConvert;
    },
  },
  data() {
    return {
      hibahs: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    searchQuery() {
      console.log(this.form);

      this.getHibahUser();
    },
    kemaskini(wasiat_id) {
      this.$router.push({
        name: "wasiat.part_e",
        query: { wasiat_id: wasiat_id },
      });
    },
    onChange(event) {
      console.log(event.target.value);
      this.form.Organisasi = event.target.value;
      this.getOrganizationByType(event.target.value);
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getHibahUser();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getHibahUser();
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    async getHibahUser() {
      return await ApiService.get(`/hibah?user_id=${this.currentUser.id}`)
        .then((response) => {
          console.log("hibah", response.data.hibahs.data);
          this.hibahs = response.data.hibahs.data ?? [];
          this.trustId = response.data.hibahs.data[0].id ?? [];
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async printCetificate() {
      window.open(this.certUrl, "_blank");
    },
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "userRole",
      "userAccess",
      "trust",
    ]),
    isSearch() {
      return this.$route.query.organization_id !== undefined;
    },
    certUrl() {
      return process.env.VUE_APP_API_URL + `/hibah/${this.trustId}/certificate`;
    },
  },
  filters: {
    hibahType: function (value) {
      if (!value) return "-";
      // value = value.toString();
      else if (value == 1) return "Hibah Korporat";
      else if (value == 2) return "Amanah Korporat";
      else return value;
    },
    hibahStatus: function (value) {
      if (!value) return "-";
      // value = value.toString();
      else if (value == 0) return "Dalam Proses";
      else if (value == 1) return "Kemas Kini";
      else if (value == 2) return "Tunggu Pengesahan";
      else if (value == 3) return "Pengesahan Sijil Hibah";
      else if (value == 4) return "Pengesahan Saksi";
      else if (value == 5) return "Cetak Sijil Hibah";
      else return "Out-of-Range";
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
              <h4 class="title text-white" style="text-transform: capitalize">
                Senarai Produk Penghibah
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container overflow-hidden" v-if="currentUser">
        <div class="row">
          <div class="col-md-12">
            <div class="card-body">
              <div class="table-responsive bg-white shadow rounded mt-2">
                <table
                  class="table mb-0 table-center table-sm"
                  style="font-size: 10pt"
                >
                  <thead class="bg-light">
                    <tr>
                      <th>Bil.</th>
                      <th>Jenis Hibah</th>
                      <th>Status</th>
                      <th>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody v-if="!hibahs">
                    <tr>
                      <td colspan="7" class="text-center">
                        <h5 class="mt-5">Tiada Pendaftaran hibah</h5>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-if="hibahs">
                    <tr v-for="(item, index) in hibahs" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.hibah_type | hibahType }}</td>
                      <td>
                        {{ item.status | hibahStatus }}
                      </td>
                      <td>
                        <div
                          class="btn-group-vertical"
                          role="group"
                          aria-label="Vertical button group"
                        >
                          <!-- <router-link
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'wasiat.details',
                              params: { trust_id: item.id },
                            }"
                          >
                            {{ $t("view") }}
                          </router-link> -->

                          <router-link
                            v-if="item.status == 1"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'trust-onecent.part-a',
                              query: { trust_id: item.id },
                            }"
                          >
                            <!-- {{ $t("update") }} -->
                            Kemas Kini
                          </router-link>
                          <router-link
                            v-if="item.status == 3 && !item.is_draft_accepted"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'trust-onecent.part-draft',
                              query: { trust_id: item.id },
                            }"
                          >
                            <!-- {{ $t("update") }} -->
                            Pengesahan Draf
                          </router-link>
                          <router-link
                            v-if="item.status == 3 && item.is_draft_accepted"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'trust-onecent.part-signpenerima',
                              query: { trust_id: item.id },
                            }"
                          >
                            <!-- {{ $t("update") }} -->
                            Pengesahan Penerima
                          </router-link>
                          <router-link
                            v-if="item.status == 4"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'trust-onecent.part-i',
                              query: { trust_id: item.id },
                            }"
                          >
                            <!-- {{ $t("update") }} -->
                            Pengesahan Saksi
                          </router-link>
                          <router-link
                            v-if="item.status == 5"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'trust-onecent.part-a',
                              query: { trust_id: item.id },
                            }"
                          >
                            <!-- {{ $t("update") }} -->
                            Pindaan
                          </router-link>
                          <b-button
                            v-if="item.status == 5"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            @click="printCetificate"
                            >Cetak Sijil
                          </b-button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="hibahs && hibahs.length == 0">
                      <td colspan="9" class="text-center">
                        <h6 class="mt-5 mb-5">
                          {{ $t("trust.no-hibah") }}
                        </h6>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <b-pagination
                    v-model="pagination.currentPage"
                    :total-rows="pagination.totalRows"
                    :per-page="pagination.perPage"
                    @change="pageClicks"
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
                <div class="col-md-4">
                  <div class="form custom-form">
                    <div class="form-group mb-0">
                      <select
                        v-model="pagination.perPage"
                        class="form-control custom-select"
                        id="Sortbylist-job"
                        @change="changePerPage()"
                      >
                        <option value="10">10 {{ $t("per-page") }}</option>
                        <option value="25">25 {{ $t("per-page") }}</option>
                        <option value="50">50 {{ $t("per-page") }}</option>
                      </select>
                    </div>
                  </div>
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
