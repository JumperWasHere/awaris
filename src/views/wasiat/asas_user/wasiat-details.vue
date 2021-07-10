<script>
import ApiPublicService from "@/services/api-public.service";
import { mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  data() {
    return {
      wasiat: {},
      witness: null,
    };
  },
  components: {
    PulseLoader,
  },
  methods: {
    getWasiat() {
      ApiPublicService.get(
        `wasiat/${this.wasiatId}?load_with=agent,organization,branch,user,userDetail,heir`
      ).then((response) => {
        this.wasiat = response.data.wasiat;
        var wasiat = response.data.wasiat;
        if (wasiat) {
          if (wasiat.user_detail.gender == 1) {
            this.wasiat.user_detail.gender = "Lelaki";
          }
          if (wasiat.user_detail.gender == 2) {
            this.wasiat.user_detail.gender = "Perempuan";
          }
          if (wasiat.user_detail.nationality == 1) {
            this.wasiat.user_detail.nationality = "Warganegara";
          }
          if (wasiat.user_detail.nationality == 2) {
            this.wasiat.user_detail.nationality = "Bukan Warganegara";
          }
        }
      });
    },
    getwitness() {
      ApiPublicService.get(`/wasiat/${this.wasiatId}/witness`)
        .then((response) => {
          this.witness = response.data.witnesses.data ?? [];
        })
        .catch((error) => {});
    },
    next() {
      this.$router.push({
        name: "wasiat-verification.ekyc",
        params: { wasiat_id: this.wasiatId },
      });
    },
  },
  mounted() {
    if (this.wasiatId) {
      this.getWasiat();
      this.getwitness();
    }
  },
  computed: {
    ...mapGetters(["userAccess", "userRole", "currentUser"]),
    wasiatId() {
      return this.$route.params.wasiat_id;
    },
  },
  filters: {
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
  },
};
</script>

<template>
  <div>
    <header id="topnav-login">
      <div class="container">
        <div id="navigation" class="border-bottom-nav">
          <div class="row">
            <div class="col-lg-6">
              <ul
                class="navigation-menu mb-0"
                v-scroll-spy-active="{ selector: 'li.has-submenu' }"
              >
                <li class="has-submenu">
                  <a href="https://awarisgroup.com/"
                    ><i class="mdi mdi-chevron-left mr-1"></i
                    >{{ $t("navbar.homepage") }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="col-lg-6">
              <div class="text-white text-right pr-4 btn-hai">
                <p class="p-lang">
                  LANGUAGE &nbsp;
                  <span class="lang-bg ml-2">
                    <span @click="changeLocale('ms')" style="cursor: pointer">
                      BM
                    </span>
                    |
                    <span @click="changeLocale('en')" style="cursor: pointer">
                      ENG
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="section">
      <div class="container" style="margin-top: 100px">
        <div class="bg-overlay bg-overlay-white bg-overlay-img"></div>
        <div class="row justify-content-center" style="margin-bottom: 50px">
          <div
            class="card verification-page bg-white shadow rounded-login border-0"
          >
            <div class="card-body-login">
              <div class="row">
                <div class="col-lg-12">
                  <h5 class="m-0 title text-left">
                    KETERANGAN MENGENAI WASIAT
                  </h5>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="table-responsive bg-light shadow rounded mt-4"
                      >
                        <table class="table mb-0 table-center">
                          <tbody>
                            <tr>
                              <th class="bg-secondary" style="width: 20%">
                                No. Wasiat
                              </th>
                              <td style="width: 30%">
                                {{ wasiat ? wasiat.wasiat_no : "-" }}
                              </td>
                              <th class="bg-secondary" style="width: 20%">
                                Jenis Wasiat
                              </th>
                              <td>
                                {{
                                  wasiat.wasiat_type == 1
                                    ? "Wasiat Islam"
                                    : "Wasiat Konvensional"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Tarikh Wasiat</th>
                              <td colspan="3">
                                {{ wasiat.created_at | getConvertDate }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Harga Wasiat</th>
                              <td>RM{{ wasiat.price }}</td>
                              <th class="bg-secondary">Status</th>
                              <td>
                                {{
                                  wasiat.status == 0
                                    ? "Sedang Membuat Wasiat"
                                    : wasiat.status == 1
                                    ? "Tunggu Pengesahan"
                                    : wasiat.status == 2
                                    ? "Wasiat Lulus"
                                    : "Wasiat Batal"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Organisasi</th>
                              <td>
                                {{
                                  wasiat.organization
                                    ? wasiat.organization.name
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">Cawangan</th>
                              <td>
                                {{
                                  wasiat.branch
                                    ? wasiat.branch.branch_name
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Nama Ejen</th>
                              <td>
                                {{ wasiat.agent ? wasiat.agent.name : "-" }}
                              </td>
                              <th class="bg-secondary">No. Telefon Ejen</th>
                              <td>
                                {{
                                  wasiat.agent
                                    ? wasiat.agent.mobile_number
                                    : "-"
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-lg-12">
                  <h5 class="m-0 title text-left">
                    KETERANGAN MENGENAI PEWASIAT
                  </h5>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="table-responsive bg-light shadow rounded mt-4"
                      >
                        <table class="table mb-0 table-center">
                          <tbody>
                            <tr>
                              <th class="bg-secondary" style="width: 20%">
                                Gelaran
                              </th>
                              <td style="width: 30%">
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.designation
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary" style="width: 20%">
                                Nama Penuh
                              </th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.name
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Kad Pengenalan Baru</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.ic_number
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">
                                Kad Pengenalan Lama / Polis / Tentera / Passport
                              </th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.other_ic_number
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Jantina</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.gender
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">Warganegara</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.nationality
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">No. Telefon Bimbit</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.mobile_number
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">No. Telefon Rumah</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.home_phone_number
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Email</th>
                              <td colspan="3">
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.email
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">
                                Alamat Surat Menyurat
                              </th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.correspondence_address
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">Poskod</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.correspondence_postcode
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Bandar</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.correspondence_city
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">Negeri</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.correspondence_state
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Alamat Tetap</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.permanent_address
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">Poskod</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.permanent_postcode
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Bandar</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.permanent_city
                                    : "-"
                                }}
                              </td>
                              <th class="bg-secondary">Negeri</th>
                              <td>
                                {{
                                  wasiat.user_detail
                                    ? wasiat.user_detail.permanent_state
                                    : "-"
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-lg-12">
                  <h5 class="m-0 title text-left">
                    KETERANGAN WARIS UNTUK DI HUBUNGI
                  </h5>
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="table-responsive bg-light shadow rounded mt-4"
                      >
                        <table class="table mb-0 table-center">
                          <tbody>
                            <tr>
                              <th class="bg-secondary" style="width: 20%">
                                Nama Penuh
                              </th>
                              <td style="width: 30%">
                                {{ wasiat.heir ? wasiat.heir.name : "-" }}
                              </td>
                              <th class="bg-secondary" style="width: 20%">
                                Hubungan Dengan Pewaris
                              </th>
                              <td>
                                {{
                                  wasiat.heir ? wasiat.heir.relationship : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">No. Telefon Bimbit</th>
                              <td>
                                {{
                                  wasiat.heir ? wasiat.heir.mobile_number : "-"
                                }}
                              </td>
                              <th class="bg-secondary">No. Telefon Rumah</th>
                              <td>
                                {{
                                  wasiat.heir
                                    ? wasiat.heir.home_phone_number
                                    : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">
                                Alamat Surat Menyurat
                              </th>
                              <td>
                                {{ wasiat.heir ? wasiat.heir.address : "-" }}
                              </td>
                              <th class="bg-secondary">Poskod</th>
                              <td>
                                {{ wasiat.heir ? wasiat.heir.postcode : "-" }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Bandar</th>
                              <td>
                                {{ wasiat.heir ? wasiat.heir.city : "-" }}
                              </td>
                              <th class="bg-secondary">Negeri</th>
                              <td>
                                {{ wasiat.heir ? wasiat.heir.state : "-" }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 text-center mt-4 mt-sm-0">
                  <div class="mt-md-4 mt-3 mt-sm-0">
                    <h5>Saya bersetuju dengan maklumat di atas.</h5>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 text-center mt-4 mt-sm-0">
                  <div class="mt-md-4 mt-3 mt-sm-0">
                    <button @click="next" class="btn btn-primary mr-2">
                      Seterusnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer-login footer-bar">
      <div class="container text-center">
        <div class="row">
          <div class="col-sm-12 mb-3">
            <div class="text-sm-center">
              <p class="mb-3">
                <strong>©2021 AWARIS. {{ $t("copyright") }}.</strong><br />
                {{ $t("poweredby") }} <strong>PROOFFICE</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
