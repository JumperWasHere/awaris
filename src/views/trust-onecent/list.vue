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

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
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
    };
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
  methods: {
    async getlistHibah() {
      ApiService.get(
        `/hibah?organization_id=${this.organization_id}&branch_id=${this.branch_id}&status=${this.status}&load_with=user,organization,branch&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
        // `/hibah?load_with=user,organization`
      )
        .then((response) => {
          this.hibah_array = response.data.hibahs.data ?? [];
          this.pagination.totalRows = response.data.hibahs.total;
          console.log(response.data);
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
    kemaskini(trust_id) {
      this.$router.push({
        name: "trust-onecent.part-a",
        query: {
          trust_id: trust_id,
        },
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getlistHibah();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getlistHibah();
    },
  },
  computed: {
    isSearch() {
      return this.$route.query.organization_id !== undefined;
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
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label> Jenis Organisasi</label>
                      <select
                        required
                        name
                        id="gender"
                        class="form-control"
                        v-model="organization_type"
                        @change="onChange($event)"
                      >
                        <option value="AWARIS">AWARIS</option>
                        <option value="Koperasi">Koperasi</option>
                        <option value="Bank">Bank</option>
                        <option value="Rakan Niaga">Rakan Niaga</option>
                      </select>
                    </div>
                  </div>
                  <!-- <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label> Jenis Wasiat</label>
                      <select
                        required
                        name
                        id="gender"
                        class="form-control"
                        v-model="form.Wasiat_type"
                      >
                        <option value="1">Wasiat Islam</option>
                        <option value="2">Wasiat Konvensional</option>
                      </select>
                    </div>
                  </div> -->
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label>Organisasi</label>
                      <select
                        name
                        id
                        class="form-control"
                        v-model="organization_id"
                        @change="changeOrg($event)"
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
                      <label>Cawangan</label>
                      <select
                        name
                        id="gender"
                        class="form-control"
                        v-model="branch_id"
                      >
                        <option
                          :value="branch.id"
                          v-for="branch in branch_array"
                          :key="branch.id"
                        >
                          {{ branch.branch_name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group position-relative">
                      <label>Status</label>
                      <select
                        required
                        name
                        id="gender"
                        class="form-control"
                        v-model="status"
                      >
                        <option value="0">Baru</option>
                        <option value="1">Dalam Proses</option>
                        <option value="2">Lulus</option>
                        <option value="3">Batal</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4 text-right">
                    <div class="form-group">
                      <b-button class="btn btn-primary" @click="searchQuery"
                        >Cari</b-button
                      >
                      <!-- <a href="#" ></a> -->
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
                      <td>{{ index + 1 }}</td>
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
                            @click="kemaskini(item.id)"
                          >
                            Kemaskini
                          </b-button>

                          <b-button class="btn-sm btn-danger"> Sijil </b-button>
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
