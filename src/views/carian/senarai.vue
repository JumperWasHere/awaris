<script>
import { ArrowUpIcon } from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";
import ApiService from "@/services/api.service";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import { mapGetters } from "vuex";

export default {
  mounted() {
    if (this.$route.query.ic_number && this.$route.query.ic_number != null) {
      this.newIc = this.$route.query.ic_number;
    }
    if (
      this.$route.query.old_ic_number &&
      this.$route.query.old_ic_number != null
    ) {
      this.oldIc = this.$route.query.old_ic_number;
    }
    if (this.$route.query.fullname && this.$route.query.fullname != null) {
      this.fullname = this.$route.query.fullname;
    }
    if (this.organization_id) {
      this.getListUser();
    }
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
      organizationType: null,
      newIc: "",
      oldIc: "",
      fullname: "",
      wasiats: null,
      wasiat_id: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  computed: {
    ...mapGetters(["currentUser", "userRole", "userAccess"]),
    organization_id() {
      if (this.userAccess) {
        return this.userAccess.organization_id;
      } else {
        return null;
      }
    },
    user_id() {
      return this.$route.query.user_id;
    },
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    getListUser() {
      var query;
      if (this.userRole == "Staff") {
        query = `/wasiat?ic_number=${this.newIc}&old_ic_number=${this.oldIc}&name=${this.fullname}&load_with=userDetail,organization,agent&&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Agent") {
        query = `/wasiat?ic_number=${this.newIc}&old_ic_number=${this.oldIc}&name=${this.fullname}&agent_id=${this.currentUser.id}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Super Admin") {
        query = `/wasiat?ic_number=${this.newIc}&old_ic_number=${this.oldIc}&organization_id =${this.userAccess.organization_id}&name=${this.fullname}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Admin") {
        query = `/wasiat?ic_number=${this.newIc}&old_ic_number=${this.oldIc}&name=${this.fullname}&branch_id=${this.userAccess.id}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      }
      console.log("query----", query);
      ApiService.get(query)
        .then((response) => {
          let temp_array = response.data.wasiats.data;
          console.log("temp_array----", temp_array);
          //this.wasiats = response.data.wasiats.data ?? [];
          this.pagination.totalRows = response.data.wasiats.total;
          var newobj = {};

          var count;
          if (this.pagination.currentPage == 1) {
            count = this.pagination.currentPage;
          } else {
            count =
              this.pagination.currentPage * this.pagination.perPage -
              this.pagination.perPage +
              1;
          }
          console.log("count", count);
          for (const index in temp_array) {
            newobj[count] = Object.assign({}, temp_array[index]);
            count++;
          }
          this.wasiats = newobj;
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error carian wasiat");
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    pageClicks(page) {
      console.log("pageClicks");
      this.pagination.currentPage = page;
      this.getListUser();
    },
    changePerPage() {
      console.log("changePerPage");
      this.pagination.currentPage = 1;
      this.getListUser();
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
                {{ $t("search-list") }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div
        class="container card public-profile border-0 rounded shadow overflow-hidden"
        style="padding-right: 0px !important; padding-left: 0px !important"
      >
        <div class="card-body">
          <h5 class="text-center pb-4 uppercase">
            {{ $t("wasiatasas.testator-list") }}
          </h5>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center table-sm">
              <thead class="bg-light">
                <tr>
                  <th>{{ $t("index") }}</th>
                  <th>{{ $t("amendment.no-wasiat") }}</th>
                  <th>{{ $t("fullname") }}</th>
                  <th>{{ $t("mykad") }}</th>
                  <th>{{ $t("mobile-no") }}</th>
                  <th>{{ $t("organization") }}</th>
                  <th>{{ $t("agent") }}</th>
                  <th>{{ $t("register-date") }}</th>
                  <th class="text-right">{{ $t("action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(wasiat, index) in wasiats" :key="index">
                  <td>{{ index }}</td>
                  <td>{{ wasiat.wasiat_no }}</td>
                  <td>
                    {{ wasiat.user_detail ? wasiat.user_detail.name : "-" }}
                  </td>
                  <td>
                    {{
                      wasiat.user_detail ? wasiat.user_detail.ic_number : "-"
                    }}
                  </td>
                  <td>
                    {{
                      wasiat.user_detail
                        ? wasiat.user_detail.mobile_number
                        : "-"
                    }}
                  </td>
                  <td>
                    {{ wasiat.organization ? wasiat.organization.name : "-" }}
                  </td>
                  <td>
                    {{ wasiat.agent ? wasiat.agent.name : "-" }}
                  </td>
                  <td>
                    {{
                      wasiat
                        ? wasiat.recorded_wasiat_date
                        : "-" | formatDateTime
                    }}
                  </td>
                  <td class="text-right">
                    <router-link
                      class="btn btn-secondary btn-sm"
                      :to="{
                        name: 'carian.status-a',
                        query: {
                          user_id: wasiat.user_id,
                        },
                      }"
                    >
                      {{ $t("view") }}
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
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
