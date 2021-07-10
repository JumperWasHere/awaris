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
  BarChartIcon,
} from "vue-feather-icons";
import { mapGetters } from "vuex";
import { Carousel, Slide } from "vue-carousel";
import ApiService from "@/services/api.service";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import download from "downloadjs";

export default {
  data() {
    return {
      wasiat_status: null,
      print: false,
      wasiat: null,
      payment_received_at: null,
      price: null,
      wasiat_id: null,
      btnsejarah: false,
      amendment_status: null,
      btnPrint: false,
      printWasiat_id: null,
      organization_type: null,
      user_accesses: [],
      preference: {
        allow_hibah: 2,
        allow_wasiat: 1,
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
    BarChartIcon,
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
    environment() {
      return process.env.VUE_APP_ENVI;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    userRoleVal() {
      return this.userRole;
    },
    successAlrt() {
      return this.$route.query.status;
    },
    succcessAlrtHibah() {
      return this.$route.query.statusHibah;
    },
    fullAddress() {
      return String(
        this.currentUser.address ? this.currentUser.address.concat(", ") : ""
      )
        .concat(
          String(
            this.currentUser.postcode
              ? this.currentUser.postcode.concat(", ")
              : ""
          )
        )
        .concat(
          String(
            this.currentUser.city ? this.currentUser.city.concat(", ") : ""
          )
        )
        .concat(
          String(
            this.currentUser.state ? this.currentUser.state.concat(". ") : ""
          )
        );
    },
  },
  mounted() {
    // console.log(this.userId);
    if (this.userRole != "Client") {
      this.getPreference();
    }

    this.getUserAccessDetails();
    this.getWasiatStatus();
    if (this.successAlrt && this.successAlrt == "verified") {
      this.$swal.fire({
        icon: "success",
        html: "Pendaftaran Wasiat telah berjaya.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    }
    if (this.succcessAlrtHibah && this.succcessAlrtHibah == "success") {
      this.$swal.fire({
        icon: "success",
        html: "Pendaftaran Hibah telah berjaya.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    }
  },
  methods: {
    getPreference() {
      ApiService.get(
        `organization/${this.userAccess.organization_id}/preference`
      ).then((response) => {
        this.preference = response.data.preference ?? {};
        // console.log("preference", this.preference);
      });
    },
    status() {
      this.$refs["modalStatus"].show();
    },
    async TambahCawangan() {
      var organizationId = this.userAccess.organization_id;

      this.$router.push({
        name: "organization.branch",
        params: { organization_id: organizationId },
      });
    },
    async TambahPengguna() {
      var organizationId = this.userAccess.organization_id;

      this.$router.push({
        name: "organization.user",
        params: { organization_id: organizationId },
      });
    },
    async HibahOneCent(type) {
      let hibahId = await this.getHibah(type);
      if (hibahId) {
        this.$router.push({
          name: "trust-onecent.part-d",
          query: { trust_id: hibahId },
        });
      } else {
        if (type == 12) {
          this.$router.push({
            name: "trust-onecent.redeem",
          });
        }
      }
    },
    async getHibah(type) {
      return await ApiService.get(
        `hibah?hibah_type=${type}&user_id=${this.currentUser.id}&return_first=true`
      )
        .then((response) => {
          return response.data.hibahs ? response.data.hibahs.id : null;
        })
        .catch(() => {
          return null;
        });
    },
    statusPindaan() {
      this.$refs["modalStatusPindaan"].show();
    },
    pindaan(type) {
      if (type == "Wasiat") {
        this.$router.push({ name: "wasiat.pengesahan.list-pindaan" });
      } else {
        this.$router.push({ name: "wasiat.pengesahan.list-pindaan-hibah" });
      }
    },
    sejarah() {
      this.$refs["sejarahModal"].show();
    },
    getUserAccessDetails() {
      ApiService.get(`user/${this.currentUser.id}/access`).then((response) => {
        var user_accesses = response.data.user_accesses.data[0];
        if (user_accesses) {
          this.user_accesses = user_accesses;
          this.statusAccess = user_accesses.status;
        }
      });
    },
    getWasiatStatus() {
      ApiService.get(`/wasiat?user_id=${this.currentUser.id}`)
        .then((response) => {
          var temp = response.data.wasiats.data[0];
          // console.log(temp);
          if (
            Array.isArray(response.data.wasiats.data) &&
            response.data.wasiats.data.length
          ) {
            // console.log("eceuxte");
            this.wasiat = temp;
            this.wasiat_id = temp.id;
            if (temp.payment_received_at != null) {
              this.payment_received_at = this.getConvertDate(
                temp.payment_received_at
              );
              this.price = temp.price;
            } else {
              this.price = null;
            }
            this.wasiat_status = temp.status;
            if (temp.status == 2) {
              this.getAmendment();
            }
          } else {
            this.wasiat_status = null;
          }

          // console.log(this.wasiat_status);
        })
        .catch((error) => {});
    },
    printWasiat() {
      // this.print = true;
      if (this.printWasiat_id) {
        // mean have amendment and pindaan == 4
        window.open(
          process.env.VUE_APP_API_URL +
            `/amendment/${this.printWasiat_id}/certificate/comprehensive`,
          "_blank"
        );
      } else {
        window.open(
          process.env.VUE_APP_API_URL +
            `/wasiat/${this.wasiat_id}/certificate/final`,
          "_blank"
        );
      }
    },
    printReceipt() {
      this.btnsejarah = true;
      ApiService.get(`/wasiat/${this.wasiat_id}/paid-notification`)
        .then((response) => {
          var temp = response.data.notification;
          var email = temp.email;
          var notel = temp.mobile_number;
          this.$swal.fire({
            // title: '<strong>Info</strong>',
            icon: "success",
            html:
              "Resit anda telah berjaya di hantar ke <br/> emel: " +
              email +
              "<br/> dan ke <br/> nombor telefon: " +
              notel,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.btnsejarah = false;
          this.$refs["sejarahModal"].hide();
        })
        .catch((error) => {
          this.$swal.fire({
            // title: '<strong>Info</strong>',
            icon: "error",
            html:
              "Resit anda tidak berjaya dihantar, sila hubungi khidmat pelangan kami",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.btnsejarah = false;
          this.$refs["sejarahModal"].hide();
        });
    },
    getAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // console.log(response.data);
          var data_array = response.data.amendments.data;
          var filter = data_array.filter((item) => item.status == 5);
          if (Array.isArray(filter) && filter.length > 0) {
            this.btnPrint = true;
            this.printWasiat_id = filter[0].id;
            console.log(this.printWasiat_id);
          }
          console.log(filter);
          if (Array.isArray(data_array) && data_array.length) {
            this.amendment_status = data_array[0].status;
          }
        })
        .catch((error) => {});
    },
    getConvertDate(tempDate) {
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
    approval() {
      this.$router.push({ name: "client.pending" });
    },
    wasiatProcess() {
      this.$router.push({ name: "wasiat.pengesahan.pendaftaran" });
    },
    hibahProcess() {
      this.$router.push({ name: "trust.pengesahan.pendaftaran" });
      // this.$router.push({ name: "trust.pengesahan.tabpendaftaran" });
    },
    viewGraph() {
      this.$router.push({ name: "dashboard.graph" });
    },
    registerWasiat() {
      this.$router.push({ name: "wasiat.part_a" });
    },
    registerHibah() {
      this.$router.push({ name: "trust.product-list" });
    },
  },
  props: {
    organization: {
      type: Object,
    },
  },
};
</script>

<template>
  <div>
    <Navbar :nav-light="true" />
    <section
      class="bg-half bg-primary d-table w-100"
      style="background-image: url(/images/header.png)"
    >
      <div class="container">
        <div class="row justify-content-left">
          <div class="col-lg-12 text-left">
            <div class="page-next-level">
              <h5 class="text-white mt-4">
                {{ $t("navbar.hi") }} {{ currentUser.name }},
              </h5>
              <h4 class="title text-white m-0">
                {{ $t("welcometo-awaris") }}!
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <div class="card rounded border-0 overflow-hidden">
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 mb-4">
                    <h5>{{ $t("choose-business") }}</h5>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Staff'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="wasiatProcess"
                    >
                      {{ $t("dashboard.wasiat") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Staff'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="pindaan('Wasiat')"
                    >
                      {{ $t("amendment.confirmation") }} Wasiat
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="userRole == 'Client' && this.amendment_status != null"
                  >
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="statusPindaan"
                    >
                      {{ $t("dashboard.pindaan") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Client'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="status"
                    >
                      {{ $t("dashboard.status") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Client'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="sejarah"
                    >
                      {{ $t("dashboard.history") }}
                    </button>
                  </div>
                </div>
                <div class="row" v-if="!['production'].includes(environment)">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Client'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="HibahOneCent(12)"
                    >
                      Hibah One Cent
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Staff'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="approval"
                    >
                      {{ $t("dashboard.user") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="['Super Admin', 'Admin', 'Staff'].includes(userRole)"
                  >
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="viewGraph"
                    >
                      {{ $t("dashboard.list") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="userRole == 'Staff'"
                    @click="hibahProcess"
                  >
                    <button class="btn btn-primary-db btn-block">
                      {{ $t("dashboard.hibah") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Staff'">
                    <button
                      class="btn btn-primary-db btn-block"
                      @click="pindaan('Hibah')"
                    >
                      {{ $t("amendment.confirmation") }} Hibah
                    </button>
                  </div>
                </div>

                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="userRole == 'Agent' && preference.allow_wasiat == 1"
                    @click="registerWasiat"
                  >
                    <button class="btn btn-primary-db btn-block">
                      {{ $t("dashboard.reg-will") }}
                    </button>
                  </div>
                </div>
                <!-- {{ preference }} -->
                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="userRole == 'Agent' && preference.allow_hibah == 1"
                    @click="registerHibah"
                  >
                    <button class="btn btn-primary-db btn-block">
                      {{ $t("dashboard.reg-hibah") }}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10 mb-2" v-if="userRole == 'Staff'">
                    <router-link
                      :to="{ name: 'ezqurban.transaction.list' }"
                      class="btn btn-primary-db btn-block"
                    >
                      Transaksi EzQurban
                    </router-link>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="userRole == 'IT'"
                    @click="TambahPengguna"
                  >
                    <button class="btn btn-primary-db btn-block">
                      Tambah Pengguna
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-lg-10 mb-2"
                    v-if="userRole == 'IT'"
                    @click="TambahCawangan"
                  >
                    <button class="btn btn-primary-db btn-block">
                      Tambah Cawangan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card bg-light rounded shadow border-0 overflow-hidden">
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <h5>{{ $t("acc-information") }}</h5>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative mt-4">
                      <label>{{ $t("name") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative mt-4">
                      <p>: &nbsp; {{ currentUser ? currentUser.name : "-" }}</p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("mykad") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p>
                        : &nbsp;
                        {{
                          currentUser.ic_number ? currentUser.ic_number : "-"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("address") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p>: &nbsp; {{ fullAddress ? fullAddress : "-" }}</p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("mobile-no") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p>
                        : &nbsp;
                        {{
                          currentUser.mobile_number
                            ? currentUser.mobile_number
                            : "-"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("email") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p>
                        : &nbsp;
                        {{ currentUser.email ? currentUser.email : "-" }}
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div
                  class="row"
                  v-if="['Staff', 'Super Admin'].includes(userRole)"
                >
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("partner-name") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p
                        class="form-control-static"
                        v-if="user_accesses && user_accesses.organization"
                      >
                        : &nbsp;
                        {{ user_accesses.organization.name }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label v-if="organization_type == 'Awaris'">{{
                        $t("position")
                      }}</label>
                      <label v-if="organization_type != 'Awaris'">{{
                        $t("user-role")
                      }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p>
                        : &nbsp;
                        {{
                          currentUser.roles ? currentUser.roles[0].name : "-"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="['Agent', 'Admin'].includes(userRole)">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("org.nav2") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p
                        class="form-control-static"
                        v-if="user_accesses && user_accesses.accessible"
                      >
                        : &nbsp;
                        {{ user_accesses.accessible.branch_name }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group position-relative">
                      <label>{{ $t("username") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="form-group position-relative">
                      <p>
                        : &nbsp;
                        {{ currentUser.username ? currentUser.username : "-" }}
                      </p>
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
    <b-modal ref="modalStatus" title="Status Wasiat" hide-footer>
      <div class="card-body">
        <div class="data-form">
          <h5>{{ $t("wasiat") }}</h5>
          <label v-if="this.wasiat_status == null">{{
            $t("wasiatmodal.status-null")
          }}</label>
          <label v-if="this.wasiat_status == 0">{{
            $t("wasiatmodal.status0")
          }}</label>
          <label v-if="this.wasiat_status == 1">{{
            $t("wasiatmodal.status1")
          }}</label>
          <label v-if="this.wasiat_status == 2">{{
            $t("wasiatmodal.status2")
          }}</label>
          <label v-if="this.wasiat_status == 3">{{
            $t("wasiatmodal.status3")
          }}</label>
        </div>
        <div class="data-form">
          <button
            v-if="this.wasiat_status == 2"
            class="btn btn-success"
            @click="printWasiat"
          >
            {{ $t("printwill") }}
            <span class="spinner-border spinner-border-sm" v-if="print"></span>
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalStatusPindaan" title="Status Pindaan Wasiat" hide-footer>
      <div class="card-body">
        <div class="data-form" v-if="this.amendment_status != null">
          <h5>{{ $t("amendments") }}</h5>

          <label>{{
            this.amendment_status == 0
              ? "Anda sedang membuat pindaan."
              : this.amendment_status == 1
              ? "Sedang menunggu pengesahan."
              : this.amendment_status == 2
              ? "Anda perlu memeriksa draf pindaan."
              : this.amendment_status == 4
              ? "Sedang menunggu pengesahan saksi."
              : this.amendment_status == 5
              ? "Pindaan anda berjaya."
              : "Pindaan anda terbatal."
          }}</label>
        </div>
      </div>
    </b-modal>
    <b-modal ref="sejarahModal" hide-footer title="Sejarah Transaksi">
      <div class="card-body">
        <div class="data-form" v-if="this.payment_received_at == null">
          <label>{{ $t("wasiatmodal.no-payment") }}.</label>
        </div>
        <div class="data-form" v-if="this.payment_received_at != null">
          <label>{{ $t("wasiatmodal.payment-done") }}.</label>
          <div class="table-responsive bg-white shadow rounded mt-4">
            <table class="table mb-0 table-center">
              <thead class="bg-light">
                <th>{{ $t("date") }}</th>
                <th>{{ $t("total") }}</th>
                <th>{{ $t("information") }}</th>
              </thead>
              <tr>
                <td>{{ this.payment_received_at }}</td>
                <td>RM {{ this.price }}</td>
                <td>
                  <button class="btn-sm btn-primary m-1" @click="printReceipt">
                    {{ $t("wasiatmodal.send-receipt") }}
                    <span
                      class="spinner-border spinner-border-sm"
                      v-if="btnsejarah"
                    ></span></button
                  ><br /><br />
                  <router-link
                    class="btn-sm btn-success m-1"
                    :to="{
                      name: 'wasiat.receipt',
                      params: { wasiat_id: this.wasiat_id },
                    }"
                    target="_blank"
                  >
                    {{ $t("wasiatmodal.download-receipt") }}
                  </router-link>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
