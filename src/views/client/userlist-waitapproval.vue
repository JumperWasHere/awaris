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
    this.getOrgBankType();
    // this.getOrgRakanType();
    this.getAwarisType();
    this.getOrgKoperasiType();
    this.getOrgPelangganType();
    this.getKerajaanType();
    this.getSwastaType();
    this.getIndividuType();
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
      bank_array: null,
      rakan_array: null,
      koperasi_array: null,
      awaris_array: null,
      pelanggan_array: null,
      kerajaan_array: null,
      swasta_array: null,
      individu_array: null,
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
    async getOrgBankType() {
      ApiService.get(`/organization/1/pending-user-access-approval?type=Bank`)
        .then((response) => {
          let temp_obj = response.data.organizations ?? [];

          // this.bank_array = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;

          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.bank_array = newobj;
          console.log("bank_array", this.bank_array);
        })
        .catch((error) => {
          console.log("error - bank");
        });
    },

    async getAwarisType() {
      ApiService.get(`/organization/1/pending-user-access-approval?type=Awaris`)
        .then((response) => {
          // this.awaris_array = response.data.organizations ?? [];
          let temp_obj = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;
          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.awaris_array = newobj;
          console.log(this.awaris_array);
        })
        .catch((error) => {
          console.log("error - awaris");
        });
    },
    async getKerajaanType() {
      ApiService.get(
        `/organization/1/pending-user-access-approval?type=Kerajaan`
      )
        .then((response) => {
          //this.kerajaan_array = response.data.organizations ?? [];
          let temp_obj = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;
          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.kerajaan_array = newobj;
          console.log("kerajaan_array", this.kerajaan_array);
        })
        .catch((error) => {
          console.log("error - awaris");
        });
    },
    async getSwastaType() {
      ApiService.get(`/organization/1/pending-user-access-approval?type=Swasta`)
        .then((response) => {
          // this.swasta_array = response.data.organizations ?? [];
          let temp_obj = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;
          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.swasta_array = newobj;
          console.log("swasta_array", this.swasta_array);
        })
        .catch((error) => {
          console.log("error - awaris");
        });
    },
    async getIndividuType() {
      ApiService.get(
        `/organization/1/pending-user-access-approval?type=Individu`
      )
        .then((response) => {
          // this.individu_array = response.data.organizations ?? [];
          let temp_obj = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;
          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.individu_array = newobj;
          console.log("individu_array", this.individu_array);
        })
        .catch((error) => {
          console.log("error - awaris");
        });
    },
    async getOrgKoperasiType() {
      ApiService.get(
        `/organization/1/pending-user-access-approval?type=Koperasi`
      )
        .then((response) => {
          //this.koperasi_array = response.data.organizations ?? [];
          let temp_obj = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;
          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.koperasi_array = newobj;
          console.log("koperasi_array", this.koperasi_array);
        })
        .catch((error) => {
          console.log("error - Koperasi");
        });
    },
    async getOrgPelangganType() {
      ApiService.get(`/wasiat/pending-approval?type=Pelanggan`)
        .then((response) => {
          // this.pelanggan_array = response.data.organizations ?? [];
          let temp_obj = response.data.organizations ?? [];
          var newobj = {};
          var count = 1;
          for (const index in temp_obj) {
            newobj[count] = Object.assign({}, temp_obj[index]);
            count++;
          }
          this.pelanggan_array = newobj;
          console.log("pelanggan_array", this.pelanggan_array);
        })
        .catch((error) => {
          console.log("error - pelanggan");
        });
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
                {{ $t("user-verification") }}
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
          <h5 class="text-center" style="text-transform: uppercase">
            {{ $t("user-verificationlist") }}
          </h5>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="awaris_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="awaris_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>AWARIS</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(awaris, index) in awaris_array"
                v-bind:key="awaris.id"
              >
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ awaris.code }}</td>
                  <td>{{ awaris.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: awaris.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ awaris.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="bank_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="bank_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Bank</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody v-for="(bank, index) in bank_array" v-bind:key="bank.id">
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ bank.code }}</td>
                  <td>{{ bank.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: bank.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ bank.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="koperasi_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="koperasi_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Koperasi</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(koperasi, index) in koperasi_array"
                v-bind:key="koperasi.id"
              >
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ koperasi.code }}</td>
                  <td>{{ koperasi.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: koperasi.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ koperasi.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="kerajaan_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="kerajaan_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Kerajaan</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(kerajaan, index) in kerajaan_array"
                v-bind:key="kerajaan.id"
              >
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ kerajaan.code }}</td>
                  <td>{{ kerajaan.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: kerajaan.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ kerajaan.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="swasta_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="swasta_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Swasta</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(swasta, index) in swasta_array"
                v-bind:key="swasta.id"
              >
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ swasta.code }}</td>
                  <td>{{ swasta.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: swasta.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ swasta.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="individu_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="individu_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Individu</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(individu, index) in individu_array"
                v-bind:key="individu.id"
              >
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ individu.code }}</td>
                  <td>{{ individu.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: individu.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ individu.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="pelanggan_array"
          >
            <table
              class="table mb-0 table-center"
              v-if="pelanggan_array.length != 0"
            >
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">{{ $t("index") }}</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Pelanggan</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(pelanggan, index) in pelanggan_array"
                v-bind:key="pelanggan.id"
              >
                <tr>
                  <td>{{ index }}</td>
                  <td>{{ pelanggan.code }}</td>
                  <td>{{ pelanggan.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'organization.user',
                        params: {
                          organization_id: pelanggan.id,
                        },
                        query: {
                          status: 0,
                        },
                      }"
                      >{{ pelanggan.pending_user_access_count }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
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
