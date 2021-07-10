
<script>
import { mapGetters } from "vuex";
import { ArrowUpIcon } from "vue-feather-icons";
import { TheMask } from "vue-the-mask";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
    this.getWasiats();
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
    wasiatstatus(value) {
      // if (!value) return "-";
      // value = value.toString();
      if (value == -1) return "Baru";
      else if (value == 0) return "Belum Selesai";
      else if (value == 1) return "Tunggu Pengesahan";
      else if (value == 2) return "Lulus";
      else return "none";
    },
  },
  data() {
    return {
      organizationType: null,
      newIc: null,
      oldIc: null,
      fullname: null,
      status_array: ["Baru", "Dalam Proses", "Lulus", "Batal"],
      form: {
        Wasiat_type: "",
        Organisasi: "",
        organization_id: "",
        organization_type: "",
        pindaan: false,
        status: "",
        ic_number: "",
      },
      wasiats: null,
      organization_array: null,
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
    TheMask,
  },
  methods: {
    searchQuery() {
      console.log(this.form);
      this.getWasiats();
    },
    kemaskini(wasiat_id) {
      this.$router.push({
        name: "wasiat.part_e",
        query: { wasiat_id: wasiat_id },
      });
    },

    async getWasiats() {
      var query;

      if (this.userRole == "Staff") {
        query = `/wasiat?status=${this.form.status}&payment_option_id=1,2,3&organization_id=${this.organizationId}&having_amendment=${this.form.pindaan}&except_status=-1&wasiat_type=${this.form.Wasiat_type}&organization_type=${this.form.organization_type}&ic_number=${this.form.ic_number}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Agent") {
        query = `/wasiat?status=${this.form.status}&payment_option_id=1,2,3&organization_id=${this.organizationId}&having_amendment=${this.form.pindaan}&except_status=-1&wasiat_type=${this.form.Wasiat_type}&organization_type=${this.form.organization_type}&ic_number=${this.form.ic_number}&agent_id=${this.currentUser.id}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Super Admin") {
        query = `/wasiat?status=${this.form.status}&payment_option_id=1,2,3&organization_id=${this.organizationId}&having_amendment=${this.form.pindaan}&except_status=-1&wasiat_type=${this.form.Wasiat_type}&organization_type=${this.form.organization_type}&ic_number=${this.form.ic_number}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Admin") {
        query = `/wasiat?status=${this.form.status}&payment_option_id=1,2,3&having_amendment=${this.form.pindaan}&except_status=-1&wasiat_type=${this.form.Wasiat_type}&organization_type=${this.form.organization_type}&ic_number=${this.form.ic_number}&branch_id=${this.userAccess.id}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      }
      console.log("query----", query);
      ApiService.get(query)
        .then((response) => {
          let temp_array = response.data.wasiats.data ?? [];
          console.log("temp_array----", temp_array);
          //this.wasiats = response.data.wasiats.data ?? [];
          this.pagination.totalRows = response.data.wasiats.total;
          var newobj = {};
          console.log("currentpage", this.pagination.currentPage);
          console.log("perPage", this.pagination.perPage);

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

          console.log("waisats", this.wasiats);
          console.log("waisats - all ", response.data);
        })
        .catch((error) => {
          console.log("error fetch data from wasiat");
        });
    },

    onChange(event) {
      console.log(event.target.value);
      this.form.Organisasi = event.target.value;
      this.getOrganizationByType(event.target.value);
    },
    getOrganizationByType(type) {
      ApiService.get(`/organization?type=${type}&limit=1000`)
        .then((response) => {
          this.organization_array = response.data.organizations.data ?? [];
        })
        .catch((error) => {});
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getWasiats();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getWasiats();
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },

  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
    isSearch() {
      return this.$route.query.organization_id !== undefined;
    },

    organizationId() {
      if (this.userRole != "Staff") {
        console.log("organization", this.userAccess);
        if (!this.userAccess) {
          return null;
        }

        return this.userAccess.organization_id;
      }
      return this.form.organization_id;
    },
  },
  // watch: {
  //   wasiats: {
  //     handler: function (val) {
  //       if (this.userRole == "Agent") {
  //         var temp = val.filter((item) => item.agent.id == this.currentUser.id);
  //         this.wasiats = temp ?? [];
  //         console.log("filter by agent ", temp);
  //       }
  //     },
  //   },
  // },
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
                {{ $t("will-list") }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container overflow-hidden">
        <div class="container">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-1 variant="info">{{
                $t("search2")
              }}</b-button>
            </b-card-header>
            <b-collapse
              id="accordion-1"
              :visible="isSearch"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="row">
                  <div class="col-md-4" v-if="userRole == 'Staff'">
                    <div class="form-group position-relative">
                      <label> {{ $t("org-type") }}</label>
                      <select
                        required
                        id="organization_type"
                        class="form-control"
                        v-model="form.organization_type"
                        @change="onChange($event)"
                      >
                        <option value="AWARIS">AWARIS</option>
                        <option value="Koperasi">
                          {{ $t("cooperative") }}
                        </option>
                        <option value="Bank">{{ $t("bank") }}</option>
                        <option value="Rakan Niaga">
                          {{ $t("business-partner") }}
                        </option>
                        <option value="Swasta">Swasta</option>
                        <option value="Individu">Individu</option>
                        <option value="Kerajaan">Kerajaan</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label> {{ $t("wasiatasas.type") }}</label>
                      <select
                        required
                        id="Wasiat_type"
                        class="form-control"
                        v-model="form.Wasiat_type"
                      >
                        <option value="1">Wasiat Islam</option>
                        <option value="2">Wasiat Konvensional</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4" v-if="userRole == 'Staff'">
                    <div class="form-group position-relative">
                      <label>{{ $t("organization") }}</label>
                      <select
                        id="organization_id"
                        class="form-control"
                        v-model="form.organization_id"
                      >
                        <option
                          :value="role.id"
                          v-for="role in organization_array"
                          :key="role.id"
                        >
                          {{ role.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("amendments2") }}</label>
                      <select
                        required
                        id="pindaan"
                        class="form-control"
                        v-model="form.pindaan"
                      >
                        <option value="false">Wasiat Asas</option>
                        <option value="true">Wasiat Komprehensif</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("status") }}</label>
                      <select
                        required
                        id="status"
                        class="form-control"
                        v-model="form.status"
                      >
                        <option value="">Semua</option>
                        <option value="0">Belum Selesai</option>
                        <option value="1">Dalam Proses</option>
                        <option value="2">Lulus</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>No Kp</label>
                      <the-mask
                        id="ic_number"
                        :mask="['######-##-####']"
                        class="form-control"
                        v-model="form.ic_number"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12 text-right">
                    <div class="form-group">
                      <b-button class="btn btn-primary" @click="searchQuery">{{
                        $t("search")
                      }}</b-button>
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
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
                      <th>{{ $t("index") }}</th>
                      <th>{{ $t("amendment.no-wasiat") }}</th>
                      <th>{{ $t("testator-name") }}</th>
                      <th>{{ $t("mykad") }}</th>
                      <th>{{ $t("wasiatasas.type") }}</th>
                      <th>{{ $t("business-partner") }}</th>
                      <th>{{ $t("register-date") }}</th>
                      <th>{{ $t("agent") }}</th>
                      <th>{{ $t("status") }}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in wasiats" :key="index">
                      <td>{{ index }}</td>
                      <td>{{ item.wasiat_no }}</td>
                      <td>
                        {{ item.user_detail ? item.user_detail.name : "-" }}
                      </td>
                      <td>
                        {{
                          item.user_detail ? item.user_detail.ic_number : "-"
                        }}
                      </td>
                      <td>
                        {{
                          item.wasiat_type == 1
                            ? "Wasiat Islam"
                            : item.wasiat_type == 2
                            ? "Wasiat Konvensional"
                            : "-"
                        }}
                      </td>
                      <td>
                        {{ item.organization ? item.organization.name : "-" }}
                      </td>
                      <td>
                        {{ item.created_at | getConvertDate }}
                      </td>
                      <td>{{ item.agent ? item.agent.name : "-" }}</td>
                      <td>
                        {{ item.status | wasiatstatus }}
                      </td>
                      <td class="text-center">
                        <div
                          class="btn-group-vertical"
                          role="group"
                          aria-label="Vertical button group"
                        >
                          <router-link
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'wasiat.details',
                              params: { wasiat_id: item.id },
                            }"
                          >
                            {{ $t("view") }}
                          </router-link>

                          <router-link
                            v-if="userRole == 'Staff'"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'wasiat.part_e',
                              query: { wasiat_id: item.id },
                            }"
                          >
                            {{ $t("update") }}
                          </router-link>
                          <router-link
                            v-if="item.status == 0 && userRole != 'Staff'"
                            tag="button"
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'wasiat.part_f',
                              query: { wasiat_id: item.id },
                            }"
                          >
                            Dalam Proses
                          </router-link>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="wasiats && wasiats.length == 0">
                      <td colspan="9" class="text-center">
                        <h6 class="mt-5 mb-5">
                          {{ $t("wasiatasas.no-will") }}
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
