<script>
import { ArrowUpIcon } from "vue-feather-icons";
import { mapGetters } from "vuex";
import { TheMask } from "vue-the-mask";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
    this.getlistHibah();
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
      organization_type: null,
      wasiat_array: null,
      organization_array: null,
      branch_array: null,
      branch_id: "",
      status: "",
      Organisasi: null,
      organization_id: "",
      hibah_array: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
      form: {
        hibah_type: "",
        Organisasi: "",
        organization_id: "",
        organization_type: "",
        pindaan: false,
        status: "",
        ic_number: "",
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
    async getlistHibah() {
      var query;
      if (this.userRole == "Staff") {
        query = `/hibah?status=${this.form.status}&except_status=-1&organization_id=${this.organization_id}&organization_type=${this.form.organization_type}&hibah_type=${this.form.hibah_type}&ic_number=${this.form.ic_number}&load_with=user,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Agent") {
        query = `/hibah?status=${this.form.status}&except_status=-1&organization_id=${this.organization_id}&organization_type=${this.form.organization_type}&hibah_type=${this.form.hibah_type}&ic_number=${this.form.ic_number}&agent_id=${this.currentUser.id}&load_with=user,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Super Admin") {
        query = `/hibah?status=${this.form.status}&except_status=-1&organization_id=${this.organization_id}&organization_type=${this.form.organization_type}&hibah_type=${this.form.hibah_type}&ic_number=${this.form.ic_number}&load_with=user,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      } else if (this.userRole == "Admin") {
        query = `/hibah?status=${this.form.status}&except_status=-1&&organization_type=${this.form.organization_type}&hibah_type=${this.form.hibah_type}&ic_number=${this.form.ic_number}&branch_id=${this.userAccess.id}&load_with=user,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      }
      // `/hibah?organization_id=${this.organization_id}&branch_id=${this.branch_id}&status=${this.status}&load_with=user,organization,branch&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;
      console.log("query----", query);

      ApiService.get(
        query
        // `/hibah?load_with=user,organization`
      )
        .then((response) => {
          var temp_array = response.data.hibahs.data ?? [];
          this.pagination.totalRows = response.data.hibahs.total;
          console.log(response.data);

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
          this.hibah_array = newobj;
        })
        .catch((error) => {});
    },
    onChange(event) {
      console.log(event.target.value);
      this.Organisasi = event.target.value;
      this.getOrganizationByType(event.target.value);
    },
    getOrganizationByType(type) {
      ApiService.get(`/organization?type=${type}`)
        .then((response) => {
          this.organization_array = response.data.organizations.data ?? [];
        })
        .catch((error) => {});
    },

    getBranch(org_id) {
      ApiService.get(`/organization/${org_id}/branch`)
        .then((response) => {
          console.log(response.data);
          this.branch_array = response.data.branches.data ?? [];
          // this.organization_array = response.data.organizations.data ?? [];
        })
        .catch((error) => {});
    },
    changeOrg(event) {
      var org_id = event.target.value;
      this.getBranch(org_id);
    },
    searchQuery() {
      this.getlistHibah();
    },
    kemaskini(trust_id, type) {
      if (type == 12) {
        this.$router.push({
          name: "trust-onecent.part-d",
          query: {
            trust_id: trust_id,
          },
        });
      } else {
        this.$router.push({
          name: "trust.part-a",
          query: {
            trust_id: trust_id,
          },
        });
      }
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getlistHibah();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getlistHibah();
    },
    generateCert(trustId) {
      var certUrl =
        process.env.VUE_APP_API_URL + `/hibah/${trustId}/certificate`;
      window.open(certUrl, "_blank");
    },
  },
  computed: {
    isSearch() {
      return this.$route.query.organization_id !== undefined;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
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
                Senarai Hibah
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
              <b-button block v-b-toggle.accordion-1 variant="info"
                >Carian</b-button
              >
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
                        <option value="">Semua</option>

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
                      <label> Jenis Hibah</label>
                      <select
                        required
                        id="hibah_type"
                        class="form-control"
                        v-model="form.hibah_type"
                      >
                        <option value="">Semua</option>
                        <option value="1">
                          Deklarasi Hibah Amanah Korporat
                        </option>
                        <option value="2">Deklarasi Amanah Korporat</option>
                        <option value="3">Deklarasi Hibah Amanah Tunai</option>
                        <option value="4">Deklarasi Amanah Tunai</option>
                        <option value="5">
                          Deklarasi Hibah Amanah Hartanah
                        </option>
                        <option value="6">Deklarasi Amanah Hartanah</option>
                        <option value="7">Hibah Amanah Tunai</option>
                        <option value="8">Amanah Tunai</option>
                        <option value="9">Hibah Amanah Hartanah</option>
                        <option value="10">Amanah Hartanah</option>
                        <option value="11">Amanah Perniagaan</option>
                        <option value="12">One cent</option>
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
                  <!-- <div class="col-md-4">
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
                  </div> -->
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
                        <option value="0">Baru</option>
                        <option value="1">Penghibah Kemaskini</option>
                        <option value="2">Dalam Process</option>
                        <option value="3">Terima Draf</option>
                        <option value="4">Saksi Dalam process</option>
                        <option value="5">Cetak Hibah</option>
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
                      <th>Bil</th>
                      <th>No Hibah</th>
                      <th>Nama Penghibah</th>
                      <th>No. MyKad / Lama / Polis / Tentera / Passport</th>
                      <th>Organisasi</th>
                      <th>Cawangan</th>
                      <th>Tindakan</th>
                    </tr>
                  </thead>

                  <tbody v-if="hibah_array != null">
                    <tr v-for="(item, index) in hibah_array" :key="index">
                      <td>{{ index }}</td>
                      <td>{{ item.hibah_number ? item.hibah_number : "-" }}</td>
                      <td>{{ item.user ? item.user.name : "-" }}</td>
                      <td>{{ item.user ? item.user.ic_number : "-" }}</td>
                      <td>
                        {{ item.organization ? item.organization.name : "-" }}
                      </td>
                      <td></td>
                      <td>
                        <div
                          class="btn-group-vertical"
                          role="group"
                          aria-label="Vertical button group"
                        >
                          <b-button
                            class="btn btn-success btn-sm"
                            block
                            @click="kemaskini(item.id, item.hibah_type)"
                          >
                            Kemaskini
                          </b-button>

                          <b-button
                            v-if="item.status == 5"
                            @click="generateCert(item.id)"
                            class="btn-sm btn-danger"
                          >
                            Sijil
                          </b-button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
                        <option value="10">10 setiap halaman</option>
                        <option value="25">25 setiap halaman</option>
                        <option value="50">50 setiap halaman</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="row">
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
              </div> -->
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
