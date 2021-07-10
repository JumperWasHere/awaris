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
      bank_array: [],
      // rakan_array: [],
      koperasi_array: [],
      awaris_array: [],
      pelanggan_array: [],
      kerajaan_array: [],
      swasta_array: [],
      individu_array: [],
      indexSwasta: 0,
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
  mounted() {
    this.getOrgBankType();
    // this.getOrgRakanType();
    this.getAwarisType();
    this.getOrgKoperasiType();
    this.getOrgPelangganType();
    this.getOrgKerajaanType();
    this.getOrgSwastaType();
    this.getOrgIndividualType();
  },
  methods: {
    async getOrgBankType() {
      ApiService.get(`/wasiat/pending-approval?type=Bank`)
        .then((response) => {
          this.bank_array = response.data.organizations ?? [];
        })
        .catch((error) => {
          console.log("error - bank");
        });
    },

    async getOrgKerajaanType() {
      ApiService.get(`/wasiat/pending-approval?type=Kerajaan`)
        .then((response) => {
          this.kerajaan_array = response.data.organizations ?? [];
          console.log(response.data.organizations);
        })
        .catch((error) => {
          console.log("error - rakan niaga");
        });
    },
    async getOrgSwastaType() {
      ApiService.get(`/wasiat/pending-approval?type=Swasta`)
        .then((response) => {
          var obj = response.data.organizations ?? [];

          var newobj = {};
          var count = 1;
          for (const index in obj) {
            newobj[count] = Object.assign({}, obj[index]);
            count++;
          }
          this.swasta_array = newobj;

          console.log("Swasta", response.data.organizations);
          console.log("Swasta after ", newobj);
        })
        .catch((error) => {
          console.log("error - rakan niaga");
        });
    },

    async getOrgIndividualType() {
      ApiService.get(`/wasiat/pending-approval?type=Individu`)
        .then((response) => {
          this.individu_array = response.data.organizations ?? [];
          console.log(response.data.organizations);
        })
        .catch((error) => {
          console.log("error - rakan niaga");
        });
    },

    async getAwarisType() {
      ApiService.get(`/wasiat/pending-approval?type=Awaris`)
        .then((response) => {
          this.awaris_array = response.data.organizations ?? [];
        })
        .catch((error) => {
          console.log("error - awaris");
        });
    },
    async getOrgKoperasiType() {
      ApiService.get(`/wasiat/pending-approval?type=Koperasi`)
        .then((response) => {
          this.koperasi_array = response.data.organizations ?? [];
        })
        .catch((error) => {
          console.log("error - Koperasi");
        });
    },
    async getOrgPelangganType() {
      ApiService.get(`/wasiat/pending-approval?type=Pelanggan`)
        .then((response) => {
          this.pelanggan_array = response.data.organizations ?? [];
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
                {{ $t("verification") }}
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
            {{ $t("verifywasiat.list") }}
          </h5>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.awaris_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>AWARIS</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody v-for="(awaris, index) in awaris_array" v-bind:key="index">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ awaris.code }}</td>
                  <td>{{ awaris.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: awaris.id,
                        },
                      }"
                      >{{ awaris.total_pending }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.bank_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Bank</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody v-for="(bank, index) in bank_array" v-bind:key="index">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ bank.code }}</td>
                  <td>{{ bank.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: bank.id,
                        },
                      }"
                      >{{ bank.total_pending }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.koperasi_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Koperasi</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(koperasi, index) in koperasi_array"
                v-bind:key="index"
              >
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ koperasi.code }}</td>
                  <td>{{ koperasi.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: koperasi.id,
                        },
                      }"
                      >{{ koperasi.total_pending }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.individu_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Individu</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rakan, index) in individu_array" v-bind:key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ rakan.code }}</td>
                  <td>{{ rakan.short_name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: rakan.id,
                        },
                      }"
                      >{{ rakan.total_pending }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.pelanggan_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Pelangna</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody
                v-for="(pelanggan, index) in pelanggan_array"
                v-bind:key="index"
              >
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ pelanggan.code }}</td>
                  <td>{{ pelanggan.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: pelanggan.id,
                        },
                      }"
                      >{{ pelanggan.total_pending }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.kerajaan_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Kerajaan</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rakan, index) in kerajaan_array" v-bind:key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ rakan.code }}</td>
                  <td>{{ rakan.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: rakan.id,
                        },
                      }"
                      >{{ rakan.total_pending }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="table-responsive bg-white shadow rounded mt-5"
            v-if="this.swasta_array.length != 0"
          >
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <tr>
                  <th style="width: 100px">Bil</th>
                  <th style="width: 200px">{{ $t("code") }}</th>
                  <th>Swasta</th>
                  <th style="width: 100px">{{ $t("total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rakan, index) in swasta_array" v-bind:key="index">
                  <td>{{ index }}</td>
                  <td>{{ rakan.code }}</td>
                  <td>{{ rakan.name }}</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'wasiat.pengesahan.list-pendaftaran',
                        query: {
                          organization_id: rakan.id,
                        },
                      }"
                      >{{ rakan.total_pending }}</router-link
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
