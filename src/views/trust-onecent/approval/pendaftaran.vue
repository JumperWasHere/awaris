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
      ApiService.get(`/hibah/pending-approval?type=Bank&status=2`)
        .then((response) => {
          this.bank_array = response.data.organizations ?? [];
        })
        .catch((error) => {
          console.log("error - bank");
        });
    },

    async getOrgKerajaanType() {
      ApiService.get(`/hibah/pending-approval?type=Kerajaan&status=2`)
        .then((response) => {
          this.kerajaan_array = response.data.organizations ?? [];
          console.log(response.data.organizations);
        })
        .catch((error) => {
          console.log("error - rakan niaga");
        });
    },
    async getOrgSwastaType() {
      ApiService.get(`/hibah/pending-approval?type=Swasta&status=2`)
        .then((response) => {
          this.swasta_array = response.data.organizations ?? [];
          console.log(response.data.organizations);
        })
        .catch((error) => {
          console.log("error - rakan niaga");
        });
    },
    async getOrgIndividualType() {
      ApiService.get(`/hibah/pending-approval?type=Individu&status=2`)
        .then((response) => {
          this.individu_array = response.data.organizations ?? [];
          console.log(response.data.organizations);
        })
        .catch((error) => {
          console.log("error - rakan niaga");
        });
    },

    async getAwarisType() {
      ApiService.get(`/hibah/pending-approval?type=Awaris&status=2`)
        .then((response) => {
          this.awaris_array = response.data.organizations ?? [];
        })
        .catch((error) => {
          console.log("error - awaris");
        });
    },
    async getOrgKoperasiType() {
      ApiService.get(`/hibah/pending-approval?type=Koperasi&status=2`)
        .then((response) => {
          this.koperasi_array = response.data.organizations ?? [];
        })
        .catch((error) => {
          console.log("error - Koperasi");
        });
    },
    async getOrgPelangganType() {
      ApiService.get(`/hibah/pending-approval?type=Pelanggan&status=2`)
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
    <!-- <Navbar :nav-light="true" />
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
    </section> -->
    <div
      class="container card public-profile border-0 rounded shadow overflow-hidden"
      style="padding-right: 0px !important; padding-left: 0px !important"
    >
      <div class="card-body">
        <h5 class="text-center" style="text-transform: uppercase">
          <!-- {{ $t("verifywasiat.list") }} -->
          SENARAI PENGESAHAN PENDAFTARAN HIBAH
        </h5>
        <div
          class="table-responsive bg-white shadow rounded mt-5"
          v-if="this.awaris_array.length > 0"
        >
          <table class="table mb-0 table-center">
            <thead class="bg-light">
              <tr>
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>AWARIS</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody v-for="awaris in awaris_array" v-bind:key="awaris.id">
              <tr>
                <td>{{ awaris.id }}</td>
                <td>{{ awaris.code }}</td>
                <td>{{ awaris.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>Bank</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody v-for="bank in bank_array" v-bind:key="bank.id">
              <tr>
                <td>{{ bank.id }}</td>
                <td>{{ bank.code }}</td>
                <td>{{ bank.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>Koperasi</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody v-for="koperasi in koperasi_array" v-bind:key="koperasi.id">
              <tr>
                <td>{{ koperasi.id }}</td>
                <td>{{ koperasi.code }}</td>
                <td>{{ koperasi.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
          v-if="this.individu_array.length > 0"
        >
          <table class="table mb-0 table-center">
            <thead class="bg-light">
              <tr>
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>Individu</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rakan in individu_array" v-bind:key="rakan.id">
                <td>{{ rakan.id }}</td>
                <td>{{ rakan.code }}</td>
                <td>{{ rakan.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
          v-if="this.pelanggan_array.length > 0"
        >
          <table class="table mb-0 table-center">
            <thead class="bg-light">
              <tr>
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>Bank</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody
              v-for="pelanggan in pelanggan_array"
              v-bind:key="pelanggan.id"
            >
              <tr>
                <td>{{ pelanggan.id }}</td>
                <td>{{ pelanggan.code }}</td>
                <td>{{ pelanggan.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
          v-if="this.kerajaan_array.length > 0"
        >
          <table class="table mb-0 table-center">
            <thead class="bg-light">
              <tr>
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>Kerajaan</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rakan in kerajaan_array" v-bind:key="rakan.id">
                <td>{{ rakan.id }}</td>
                <td>{{ rakan.code }}</td>
                <td>{{ rakan.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
          v-if="this.swasta_array.length > 0"
        >
          <table class="table mb-0 table-center">
            <thead class="bg-light">
              <tr>
                <th style="width: 100px">ID</th>
                <th style="width: 200px">{{ $t("code") }}</th>
                <th>Swasta</th>
                <th style="width: 100px">{{ $t("total") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rakan in swasta_array" v-bind:key="rakan.id">
                <td>{{ rakan.id }}</td>
                <td>{{ rakan.code }}</td>
                <td>{{ rakan.short_name }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'trust.pengesahan.list-pendaftaran',
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
    <!-- <Footer />
    <a
      href="javascript: void(0);"
      class="btn btn-icon btn-soft-primary back-to-top"
      id="back-to-top"
      v-scroll-to="'#topnav'"
    >
      <arrow-up-icon class="icons"></arrow-up-icon>
    </a> -->
  </div>
</template>
