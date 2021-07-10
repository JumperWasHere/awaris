<script>
import { mapGetters } from "vuex";
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
    this.getlistPindaan();
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
    pindaanStatus(value) {
      if (value == 0) {
        return "Dalam Proses";
      } else if (value == 1) {
        return "Permohonan Dihantar";
      } else if (value == 2) {
        return "Pindaan Lulus";
      } else if (value == 4) {
        return "Menunggu Pengesahan Saksi";
      } else if (value == 5) {
        return "Pindaan Selesai";
      } else if (!value) {
        return "-";
      }
    },
  },
  data() {
    return {
      btnPrint: false,
      organizationType: null,
      newIc: null,
      oldIc: null,
      fullname: null,
      amendment_id: null,
      amendment_index_status: null,
      form: {
        amendmentable_type: "Wasiat",
        Organisasi: null,
        organization_id: null,
        organization_type: null,
        status: null,
      },
      wasiat_id: null,
      amendment_array: null,
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
  },
  methods: {
    searchQuery() {
      console.log(this.form);

      this.getlistPindaan();
      this.pagination.currentPage = 1;
    },
    async getlistPindaan() {
      var query = `/amendment?status=${this.form.status}&organization_id=${this.organizationId}&load_with=amendmentable.user&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      console.log("current user", this.userAccess);
      ApiService.get(query)
        .then((response) => {
          var temp_array = response.data.amendments.data;
          console.log(temp_array);
          this.amendment_array = temp_array;
          this.pagination.totalRows = response.data.amendments.total;
          if (Array.isArray(temp_array) && temp_array.length > 0) {
            this.amendment_index_status = temp_array[0].status;
            this.amendment_id = temp_array[0].id;
            console.log(this.amendment_index_status);
          }

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
          this.amendment_array = newobj;
        })
        .catch((error) => {
          console.log("error fetch data from amendment");
        });
    },
    wasiatCertificate(amendment_id) {
      window.open(
        process.env.VUE_APP_API_URL +
          `/amendment/${amendment_id}/certificate/comprehensive`,
        "_blank"
      );
    },
    onChange(event) {
      console.log(event.target.value);
      this.form.Organisasi = event.target.value;
      this.getOrganizationByType(event.target.value);
    },
    getOrganizationByType(type) {
      ApiService.get(`/organization?type=${type}`)
        .then((response) => {
          this.organization_array = response.data.organizations.data ?? [];
        })
        .catch((error) => {});
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getlistPindaan();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getlistPindaan();
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
      return this.userAccess.organization_id;
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
                Senarai Pindaan
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
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("status") }}</label>
                      <select
                        required
                        name
                        class="form-control"
                        v-model="form.status"
                      >
                        <option value="">Semua</option>
                        <option value="0">Dalam Proses</option>
                        <option value="1">Permohonan Dihantar</option>
                        <option value="2">Pindaan Lulus</option>
                        <option value="4">Menunggu Pengesahan Saksi</option>
                        <option value="5">Pindaan Selesai</option>
                      </select>
                    </div>
                  </div>
                  <div
                    class="col-lg-4"
                    style="margin-top: auto; margin-bottom: 0px"
                  >
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
        <!--end row-->
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
                      <th>#</th>
                      <th class="text-center">No. Ruj. Pindaan</th>
                      <th>{{ $t("testator-name") }}</th>
                      <th>{{ $t("mykad") }}</th>
                      <th class="text-center">Pindaan Ke</th>
                      <th>Tarikh Pindaan</th>
                      <th>{{ $t("status") }}</th>
                      <th>{{ $t("action") }}</th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="(pindaan, index) in amendment_array"
                    :key="index"
                  >
                    <tr>
                      <td>{{ index }}</td>
                      <td class="text-center">{{ pindaan.id }}</td>
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
                      <td class="text-center">
                        {{ pindaan.count ? pindaan.count : "-" }}
                      </td>
                      <td>
                        {{ pindaan.created_at | getConvertDate }}
                      </td>
                      <td>
                        {{ pindaan.status | pindaanStatus }}
                      </td>
                      <td>
                        <div
                          class="btn-group-vertical"
                          role="group"
                          aria-label="Vertical button group"
                        >
                          <router-link
                            tag="button"
                            block
                            class="btn btn-secondary btn-sm"
                            :to="{
                              name: 'pindaan.part_a',
                              params: { wasiat_id: pindaan.amendmentable_id },
                            }"
                            >{{ $t("view") }}</router-link
                          >
                          <button
                            @click="wasiatCertificate(pindaan.id)"
                            class="btn btn-secondary btn-sm"
                            v-if="pindaan.status == 5 && userRole == 'Staff'"
                          >
                            Cetak Sijil
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="amendment_array && amendment_array.length == 0">
                      <td colspan="9" class="text-center">
                        <h6 class="mt-5 mb-5">Tiada pindaan direkodkan</h6>
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
                              <option value="10">
                                10 {{ $t("per-page") }}
                              </option>
                              <option value="25">
                                25 {{ $t("per-page") }}
                              </option>
                              <option value="50">
                                50 {{ $t("per-page") }}
                              </option>
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
