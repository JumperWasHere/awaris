<script>
import { Carousel, Slide } from "vue-carousel";
import { ArrowUpIcon } from "vue-feather-icons";
import { mapGetters } from "vuex";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      wasiat: {},
      witness: null,
      amendment_status: null,
      amendment_id: null,
      printWasiat_id: null,
      amendment_array: null,
      amendment_index_status: null,
      btnPrint: false,
    };
  },
  methods: {
    async getWasiat() {
      ApiService.get(
        `wasiat/${this.wasiatId}?load_with=agent,organization,branch,user,userDetail,heir`
      ).then((response) => {
        this.wasiat = response.data.wasiat;
        if (this.wasiat.status == 2) {
          this.getamendment();
        }
        var wasiat = response.data.wasiat;
        console.log("wasiat", wasiat);
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
    async getwitness() {
      ApiService.get(`/wasiat/${this.wasiatId}/witness`)
        .then((response) => {
          this.witness = response.data.witnesses.data ?? [];
        })
        .catch((error) => {});
    },
    getamendment() {
      ApiService.get(`/wasiat/${this.wasiatId}/amendment`)
        .then((response) => {
          var data_array = response.data.amendments.data;
          var array = [];
          var filter = data_array.filter((item) => item.status == 5);
          if (Array.isArray(filter) && filter.length > 0) {
            this.printWasiat_id = filter[0].id;
            this.btnPrint = true;
            console.log("printWasiat_id", filter[0]);
          }
          if (Array.isArray(data_array) && data_array.length > 0) {
            this.amendment_status = data_array[0].status;
            this.amendment_index_status = data_array[0].status;
            array.push(data_array[0]);
            this.amendment_array = array ?? [];
          }
        })
        .catch((error) => {});
    },
    wasiatCertificate() {
      if (this.printWasiat_id) {
        window.open(
          process.env.VUE_APP_API_URL +
            `/amendment/${this.printWasiat_id}/certificate/comprehensive`,
          "_blank"
        );
      } else {
        window.open(
          process.env.VUE_APP_API_URL +
            `/wasiat/${this.wasiatId}/certificate/final`,
          "_blank"
        );
      }
    },
    applyAmendment() {
      if (
        this.amendment_index_status == null ||
        this.amendment_index_status != 0
      ) {
        //if pewasait is first time apply or status last pindaan is =1
        this.requestAmendment();
      } else {
        // mean pewasait do not need to register new, because die x submit lagi ke awaris
        this.$router.push({
          name: "pindaan.part_a",
          params: {
            wasiat_id: this.wasiatId,
          },
        });
      }
    },
    async requestAmendment() {
      let obj = {
        amendmentable_type: "Wasiat",
        amendmentable_id: this.wasiatId,
        notes: null,
        status: 0,
        is_staff_created: 1,
      };

      ApiService.post(`/amendment`, obj)
        .then((response) => {
          var data_obj = response.data.amendment;
          console.log(data_obj);
          console.log(this.amendment_id);
          this.amendment_id = data_obj.id;
          this.$router.push({
            name: "pindaan.part_a",
            params: {
              wasiat_id: this.wasiatId,
            },
          });
        })
        .catch((error) => {
          console.log("error");
        });
    },
    VerifiedWasiat(item, index) {
      this.$router.push({
        name: "pindaan.draft-wasiat",
        params: { wasiat_id: item.amendmentable_id },
      });
    },
    VerifiedWasiatStatus1(item, index) {
      this.$router.push({
        name: "pindaan.part_a",
        params: { wasiat_id: item.amendmentable_id },
      });
    },
    async printWasiat() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/wasiat/${this.printWaisiat_id}/certificate`,
        "_blank"
      );
    },
    back() {
      this.$router.push({
        name: "wasiat.list",
        query: { wasiat_id: this.wasiatId },
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
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
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
              <h4 class="title text-white">Maklumat Wasiat Asas</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12">
                  <h5 class="mb-4 title text-left">
                    PENJEJAKAN WASIAT
                  </h5>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="step ">
                        <div >
                        
                            <div 
                             :class="wasiat.status  == 0 ? 'circle-active' : 'circle'"
                              >1</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Permohonan Wasiat Asas</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <div class="step">
                        <div>
                            <div :class="wasiat.status  == 1 ? 'circle-active' : 'circle'">2</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Menunggu pengesahan AWARIS</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 &&amendment_status == null ? 'circle-active' : 'circle'">3</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Wasiat Asas disahkan</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 && amendment_status == 0? 'circle-active' : 'circle'">4</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Permohonan Wasiat Komprehensif</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 && amendment_status == 1? 'circle-active' : 'circle'">5</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Pengesahan Pindaan</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 && amendment_status == 2? 'circle-active' : 'circle'">6</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Pengesahan Draf Wasiat Komprehensif</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <!-- <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 && amendment_status == 3? 'circle-active' : 'circle'">6</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Pembatalan Pindaan</div>
                            <br>
                            <br>
                        </div>
                      </div> -->
                      <!-- <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 && amendment_status == 3? 'circle-active' : 'circle'">7</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Pewasiat menandatangani Wasiat Komprehensif</div>
                            <br>
                            <br>
                        </div>
                      </div> -->
                      <div class="step">
                        <div>
                            <div :class="wasiat.status  == 2 && amendment_status == 4? 'circle-active' : 'circle'">7</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Pengesahan Wasiat Komprehensif</div>
                            <br>
                            <br>
                        </div>
                      </div>
                      <!-- <div class="step">
                        <div>
                            <div class="circle">9</div>
                            <div class="line"></div>
                        </div>
                        <div>
                            <div class="title">Selesai</div>
                            <br>
                            <br>
                        </div>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
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
                              <td>
                                {{ wasiat.created_at | getConvertDate }}
                              </td>
                              
                              <th class="bg-secondary">Tarikh Wasiat Terima</th>
                              <td>
                                {{
                                 wasiat ? wasiat.wasiat_received_date : "-" 
                                }}
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
                                    : (wasiat.status == 2
                                        ? "Wasiat Lulus"
                                        : "Wasiat Batal")
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
                                {{ wasiat.branch ? wasiat.branch.branch_name : "-" }}
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
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12 col-md-12 text-md-left">
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
                                  wasiat.user_detail ? wasiat.user_detail.designation : "-"
                                }}
                              </td>
                              <th class="bg-secondary" style="width: 20%">
                                Nama Penuh
                              </th>
                              <td>
                                {{ wasiat.user_detail ? wasiat.user_detail.name : "-" }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Kad Pengenalan Baru</th>
                              <td>
                                {{ wasiat.user_detail ? wasiat.user_detail.ic_number : "-" }}
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
                                {{ wasiat.user_detail ? wasiat.user_detail.gender : "-" }}
                              </td>
                              <th class="bg-secondary">Warganegara</th>
                              <td>
                                {{
                                  wasiat.user_detail ? wasiat.user_detail.nationality : "-"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">No. Telefon Bimbit</th>
                              <td>
                                {{
                                  wasiat.user_detail ? wasiat.user_detail.mobile_number : "-"
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
                                {{ wasiat.user_detail ? wasiat.user_detail.email : "-" }}
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
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12 col-md-12 text-md-left">
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
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12 col-md-12 text-md-left">
                  <h5 class="title text-left">SENARAI SAKSI</h5>
                  <div
                    class="row"
                    v-for="(witness, index) in witness"
                    :key="index"
                  >
                    <div class="col-md-12">
                      <h6 class="title text-left mt-4">
                        SAKSI {{ index + 1 }}
                      </h6>
                      <div class="table-responsive bg-light shadow rounded">
                        <table class="table mb-0 table-center">
                          <tbody>
                            <tr>
                              <th class="bg-secondary" style="width: 20%">
                                Nama Penuh
                              </th>
                              <td style="width: 30%">
                                {{ witness ? witness.name : "-" }}
                              </td>
                              <th class="bg-secondary" style="width: 20%">
                                Kad Pengenalan Baru
                              </th>
                              <td>
                                {{ witness ? witness.ic_number : "-" }}
                              </td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">
                                Alamat Surat Menyurat
                              </th>
                              <td>{{ witness ? witness.address : "-" }}</td>
                              <th class="bg-secondary">Poskod</th>
                              <td>{{ witness ? witness.postcode : "-" }}</td>
                            </tr>
                            <tr>
                              <th class="bg-secondary">Bandar</th>
                              <td>{{ witness ? witness.city : "-" }}</td>
                              <th class="bg-secondary">Negeri</th>
                              <td>{{ witness ? witness.state : "-" }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12 col-md-12 text-md-left">
                  <h5 class="title text-left">KETERANGAN MENGENAI PINDAAN</h5>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="pindaan">
                        <div v-if="wasiat.status == 2">
                          <div class="d-flex justify-content-end m-3">
                          <b-button
                            v-if="[null,5].includes(amendment_index_status)  && userRole =='Staff'"
                            @click="applyAmendment"
                            class="btn-sm btn-primary m-1"
                            >Mohon Pindaan Baru</b-button
                          >
                          </div>
                        </div>
                      </div>
                      <div class="table-responsive bg-light shadow rounded">
                        <table class="table mb-0 table-center">
                          <thead>
                            <tr>
                              <th class="bg-secondary">
                                Bil
                              </th>
                              <th class="bg-secondary">
                                Pegawai Pindaan
                              </th>
                              <th class="bg-secondary">
                                No Telefon Ejen
                              </th>
                              <th class="bg-secondary">
                                Tarikh Pindaan
                              </th>
                              <th class="bg-secondary">
                                Pindaan Ke
                              </th>
                              <th class="bg-secondary">
                                Status
                              </th>
                              <th class="bg-secondary">
                                Tindakan
                              </th>
                            </tr>
                          </thead>
                          <tbody v-if="amendment_array == null">
                            <tr>
                              <td colspan="7" class="text-center">
                                <h5 class="mt-5">Tiada Pindaan</h5>
                              </td>
                            </tr>
                          </tbody>
                          <tbody v-if="amendment_array">
                            <tr v-for="(item,index) in amendment_array" :key="index">
                              <td>
                                {{ index+1 }}
                              </td>
                              <td>
                                {{ item ? item.incharged_by_id : "-" }}
                              </td>
                              <td>
                                999
                              </td>
                              <td>
                                {{ item ? item.created_at : '-' |getConvertDate }}
                              </td>
                              <td>
                                {{ item ? item.count : '-' }}
                              </td>
                              <td>
                                {{ item.status
                                ? item.status == 0 ? "Dalam Proses"
                                : item.status == 1 ? "Permohonan Dihantar"
                                : item.status == 2 ? "Terima Draf Pindaan"
                                : item.status == 4 ? "Pengesahan Saksi" 
                                : item.status == 5 ? "Pindaan Berjaya"
                                : "-"
                                : "-" }}
                              </td>
                              <td class="text-left" v-if="item.status == 0">
                                <router-link 
                                  tag="button"
                                  class="btn btn-secondary btn-sm"
                                  :to="{ name: 'pindaan.part_a',
                                  params: { wasiat_id: item.amendmentable_id} }" > 
                                  KemasKini
                                </router-link>
                              </td>
                              <td class="text-left" v-if="item.status == 1">
                                <b-button class="btn-sm btn-secondary"
                                  @click="VerifiedWasiatStatus1(item, index)">
                                  Pengesahan
                                </b-button>
                              </td>
                              <td class="text-left" v-if="item.status == 2">
                                <b-button class="btn-sm btn-secondary"
                                  @click="VerifiedWasiat(item, index)">
                                  Pengesahan Draf Wasiat
                                </b-button>
                              </td>
                             
                              <td class="text-left" v-if="item.status == 4">
                                Draf Diterima
                              </td>
                              <td class="text-left" v-if="item.status == 5">
                                Cetak Sijil
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12 col-md-12 text-md-left">
                  <h5 class="m-0 title text-left">
                    AKTA PERLINDUNGAN DATA PERIBADI 2010
                  </h5>
                  <div class="row mt-4">
                    <div class="col-md-12">
                      <div class="card bg-light border-0 rounded shadow">
                        <div class="text-justify card-body">
                          <label
                            >Dengan menyempurnakan borang ini anda membenarkan
                            maklumat peribadi anda untuk digunakan oleh Amanah
                            Warisan Berhad untuk memberikan anda perkhidmatan
                            Amanah Warisan Berhad yang bersesuaian dengan anda.
                            Maklumat peribadi yang diberikan oleh anda akan
                            digunakan untuk pentadbiran dan pengurusan
                            perkhidmatan yang diberikan kepada anda. Maklumat
                            peribadi anda boleh digunakan untuk memberi anda
                            maklumat lanjut mengenai produk dan perkhidmatan
                            yang sesuai dengan anda daripada Amanah Warisan
                            Berhad. Maklumat tersebut adalah sulit dan
                            persendirian dan tidak akan dikemukakan oleh pihak
                            ketiga tanpa kebenaran anda. Semua maklumat yang
                            diberikan oleh anda dalam borang ini adalah tepat,
                            lengkap dan terkini. Jika anda ingin mengemaskini
                            maklumat peribadi anda, sila hubungi kami di talian
                            03-62639990, email: admin@awarisgroup.com.</label
                          >
                        </div>
                        <div class="inner text-center">
                          <label>
                            <b>
                              <i class="mdi mdi-check"></i>&nbsp; Saya memahami
                              akta perlindungan data peribadi 2010
                            </b>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-12 col-md-12 text-md-left">
                  <h5 class="m-0 title text-left">PENGESAHAN WASIAT</h5>
                  <div class="row mt-4">
                    <div class="col-md-12">
                      <div class="card bg-light border-0 rounded shadow">
                        <div class="card-body">
                          <p>Saya
                          <strong>{{
                            wasiat.user ? wasiat.user.name : "-"
                          }}</strong
                          >, No. MyKad
                          <strong>{{
                            wasiat.user ? wasiat.user.ic_number : "-"
                          }}</strong
                          >,</p>
                          <p>
                            <i class="mdi mdi-check"></i>
                            <strong>BERSETUJU DAN MEMAHAMI:</strong>
                          </p>
                          <p>
                            <ol>
                              <li>Melantik AMANAH WARISAN BERHAD sebagai Wasi dan
                            Pemegang Amanah bagi wasiat saya dengan kadar fi pelaksanaan sebanyak 2% daripada jumlah keseluruhan harta Pusaka saya</li>
                            <li>Menarik balik semua wasiat yang terdahulu yang
                            dibuat oleh saya (sekiranya ada) dan sebarang
                            pembayaran di atas wasiat ini tidak akan
                            dikembalikan kepada saya.</li>
                            </ol>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-lg-12 col-md-12 text-md-left">
            <div class="row">
              <div class="col-md-12">
                <div class="row align-items-end">
                  <div class="col-md-12 text-center mt-4 mt-sm-0">
                    <div class="mt-md-4 mt-3 mt-sm-0">
                      <button
                      @click="back"
                      class="btn btn-outline-primary mr-2"
                      type="button"
                    ><i class="mdi mdi-arrow-left"></i>
                      {{ $t("back") }}
                    </button>
                      <button
                        @click="wasiatCertificate"
                        class="btn btn-primary mr-2"
                        v-if="this.wasiat.status == 2 && this.userRole =='Staff'"
                      >
                        <i class="mdi mdi-file-document"></i>Sijil Wasiat
                      </button>
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
