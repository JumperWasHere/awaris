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
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

/**
 * Page-aboutus component
 * 1. check if pewasait have apply amendment before
 * 2. if have check status amendment
 * 2. if not can apply (show btn)
 * 3. if status amendment is 0 -> hide btn apply
 * 3. if status amendment is 1 or 2 user can aplly new pindaan(show btn)
 */
export default {
  data() {
    return {
      wasiat_id: null,
      amendment_array: [],
      amendment_id: null,
      amendment_index_status: null,
      btnMohon: true,
      btnPrint: false,
      printHibah_id: null,
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
    this.getlistPindaan();
    // console.log(this.user_id);
  },
  methods: {
    async printHibah() {
      // var x = location.origin;
      window.open(
        process.env.VUE_APP_API_URL + `/hibah/${this.trustId}/certificate`,
        "_blank"
      );
    },
    getlistPindaan() {
      ApiService.get(`/amendment?hibah_id=${this.trustId}`)
        .then((response) => {
          var data_array = response.data.amendments.data;
          console.log("Data", data_array);
          this.amendment_array = data_array;
          if (Array.isArray(data_array) && data_array.length > 0) {
            //mean pewasait have apply before
            console.log("amendment_array", this.amendment_array);
            this.amendment_index_status = data_array[0].status;
            this.amendment_id = data_array[0].id;
            //console.log("data_array[0].status");
            var filter = data_array.filter((item) => item.status == 5);
            if (Array.isArray(filter) && filter.length > 0) {
              this.btnPrint = true;
              this.printHibah_id = filter[0].id;
            }
          }
          console.log("index status", this.amendment_index_status);
          this.btnMohon = false;
        })
        .catch((error) => {});
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
          name: "trust.part-a",
          query: {
            trust_id: this.trustId,
            amendment_id: this.amendment_id,
          },
        });
      }
    },
    async requestAmendment() {
      let obj = {
        amendmentable_type: "Hibah",
        amendmentable_id: this.trustId,
        notes: null,
        status: 0,
      };

      ApiService.post(`/amendment`, obj)
        .then((response) => {
          var data_obj = response.data.amendment;
          console.log(data_obj);
          this.amendment_array = data_obj;
          console.log(this.amendment_id);
          this.amendment_id = data_obj.id;
          this.$router.push({
            name: "trust.part-a",
            query: {
              trust_id: this.trustId,
              amendment_id: this.amendment_id,
            },
          });

          // pindaan.part_a
        })
        .catch((error) => {
          console.log("error");
        });
    },
    openPindaan() {
      this.$router.push({
        name: "trust.part-a",
        query: {
          trust_id: this.trustId,
          amendment_id: this.amendment_id,
        },
      });
    },
    VerifiedHibah(item, index) {
      this.$router.push({
        name: "trust.part-draft",
        query: {
          trust_id: this.trustId,
          amendment_id: this.amendment_id,
        },
      });
    },
    VerifiedPenerima(item, index) {
      this.$router.push({
        name: "trust.part-penerima",
        query: {
          trust_id: this.trustId,
          amendment_id: this.amendment_id,
        },
      });
    },
    VerifiedSaksi() {
      this.$router.push({
        name: "trust.part-i",
        query: {
          trust_id: this.trustId,
          amendment_id: this.amendment_id,
        },
      });
    },
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "currentUser",
      "userRole",
      "trust",
      "amendment",
    ]),
    user_id() {
      return this.$store.getters.currentUser.id;
    },
    trustId() {
      return this.$route.query.trust_id ?? null;
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
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
    amendmentStatus(value) {
      if (!value) return "-";
      // value = value.toString();
      else if (value == 0) return "Dalam Proses";
      else if (value == 1) return "Permohonan Dihantar";
      else if (value == 2) return "Pengesahan Draf hibah";
      else if (value == 3) return "Tandatangan Penerima";
      else if (value == 4) return "Tandatangan Saksi";
      else if (value == 5) return "Selesai";
      else return "Out-of-Range";
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
              <h4 class="title text-white">Pindaan Hibah</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="d-flex flex-row-reverse">
          <b-button
            v-if="[null, 5].includes(amendment_index_status)"
            @click="applyAmendment"
            class="btn-sm btn-primary m-1"
            :disabled="btnMohon"
            >Mohon Pindaan Baru</b-button
          >
          <b-button
            class="btn-sm btn-success m-1"
            v-if="btnPrint"
            @click="printHibah"
          >
            Muat Turun Sijil Hibah
          </b-button>
        </div>
        <div class="row mt-3">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Bil</th>
                <th scope="col">Tarikh Pindaan</th>
                <th scope="col">Pindaan Ke</th>
                <th scope="col">Status</th>
                <th scope="col">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in this.amendment_array" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.created_at | getConvertDate }}</td>
                <td>{{ item.count }}</td>
                <td>
                  {{ item.status | amendmentStatus }}
                </td>
                <td>
                  <!-- <b-button class="btn-sm btn-success" block> Lihat</b-button> -->
                  <b-button
                    class="btn-sm btn-danger"
                    block
                    v-if="item.status == 0"
                    @click="openPindaan"
                  >
                    Kemaskini</b-button
                  >
                  <b-button
                    class="btn-sm btn-success"
                    v-if="item.status == 2"
                    @click="VerifiedHibah(item, index)"
                  >
                    Pengesahan Draf Hibah
                  </b-button>
                  <b-button
                    v-if="item.status == 3"
                    @click="VerifiedPenerima(item, index)"
                    class="btn-sm btn-success"
                  >
                    Pengesahan Penerima
                  </b-button>
                  <b-button
                    @click="VerifiedSaksi(item, index)"
                    v-if="item.status == 4"
                    class="btn-sm btn-success"
                  >
                    Pengsahan Saksi
                  </b-button>
                  <a v-if="item.status == 5"> Cetak Sijil Hibah </a>
                </td>
              </tr>
              <tr v-if="amendment_array.length == 0">
                <td colspan="5" class="text-center">
                  <h5 class="mt-5 mb-5">Tiada pindaan direkodkan</h5>
                </td>
              </tr>
            </tbody>
          </table>
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
