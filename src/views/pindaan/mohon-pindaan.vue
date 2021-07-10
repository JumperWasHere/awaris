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
      printWaisiat_id: null,
      created_at: null,
      wasiats: null,
      amendment_price: null,
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
    this.getwasiatbyid();
    // console.log(this.user_id);
  },
  methods: {
    async printWasiat() {
      // var x = location.origin;
      if (this.amendment_array[0].status == 5) {
        window.open(
          process.env.VUE_APP_API_URL +
            `/amendment/${this.printWaisiat_id}/certificate/comprehensive`,
          "_blank"
        );
      } else {
        window.open(
          process.env.VUE_APP_API_URL +
            `/wasiat/${this.printWaisiat_id}/certificate/final`,
          "_blank"
        );
      }
      // ApiService.get(`/wasiat/${this.printWaisiat_id}/certificate`)
      //   .then((response) => {
      //     // var coverImage = atob(response.data);
      //     // var coverType = explode("/", coverType);
      //     // var coverPath = IMG_SAVE_PATH + "/cover." + coverType[1];
      //     // var coverFile = fopen(IMG_SAVE_PATH, "/cover.", coverType[1], "wb");
      //     // fwrite(coverFile, coverImage);
      //     // fclose(coverFile);
      //     // console.log(coverFile);
      //     // window.open(
      //     //   "data:application/pdf," + decodeURI(response.data),
      //     //   "_blank"
      //     // );
      //   })
      //   .catch((error) => {
      //     console.log("error");
      //   });
    },
    async getwasiatbyid() {
      ApiService.get(`/wasiat?user_id=${this.user_id}`)
        .then((response) => {
          var data_array = response.data.wasiats.data;
          if (Array.isArray(data_array) && data_array.length > 0) {
            if (data_array[0].status == 2) {
              //get wasiat status
              this.wasiats = data_array[0];
              this.wasiat_id = data_array[0].id;
              this.getlistPindaan();
              this.getPriceAmendmend();
            }
          }
        })
        .catch((error) => {});
    },
    getlistPindaan() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var data_array = response.data.amendments.data;
          // console.log(data_array);
          if (Array.isArray(data_array) && data_array.length > 0) {
            //mean pewasait have apply before
            this.amendment_array = data_array;
            this.amendment_index_status = data_array[0].status;
            this.amendment_id = data_array[0].id;
            // console.log("data_array[0].status");
            var filter = data_array.filter((item) => item.status == 5);
            if (Array.isArray(filter) && filter.length > 0) {
              this.btnPrint = true;
              this.printWaisiat_id = filter[0].id;
              console.log(this.printWaisiat_id);
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
        if (this.wasiats.price == 20) {
          console.log("wasiat-", this.wasiats);
          this.$refs["payAmendment"].show();
          return;
        }
        //if pewasait is first time apply or status last pindaan is =1
        this.requestAmendment();
      } else {
        // mean pewasait do not need to register new, because die x submit lagi ke awaris
        this.$router.push({
          name: "pindaan.part_a",
          params: {
            wasiat_id: this.wasiat_id,
          },
        });
      }
    },
    getPriceAmendmend() {
      ApiService.get(`/pricing/${this.wasiats.pricing_id}`)
        .then((response) => {
          console.log("pricing", response.data.pricing.amendment_price);
          this.amendment_price = response.data.pricing.amendment_price;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async paymentGateWay() {
      //await this.updatePaymentGateWay();
      var url =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        `/wasiat/${this.wasiats.id}/pindaanPayVerified`;
      var pay = {
        user_id: this.wasiats.user_id,
        title: "Amendment Payment",
        amount: this.amendment_price,
        type: "Amendment",
        description: "pay Amendment",
        redirect_url: url,
        amendment_for_wasiat_id: this.wasiats.id,
      };
      console.log(pay);
      ApiService.post(`payment`, pay)
        .then((response) => {
          var link = response.data.payment.payment_link;
          window.location.replace(link);

          console.log(link);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updatePaymentGateWay() {
      await this.updateWasiat();
      ApiService.post(`wasiat/${this.wasiatId}`, {
        _method: "PATCH",
        is_payment_verified: 1,
        payment_options_id: 1,
      })
        .then((response) => {
          this.payment_received_at = response.data.wasiat.payment_received_at;
        })
        .catch((error) => {
          this.acceptPay = false;
        });
    },
    async requestAmendment() {
      let obj = {
        amendmentable_type: "Wasiat",
        amendmentable_id: this.wasiat_id,
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
            name: "pindaan.part_a",
            params: {
              wasiat_id: this.wasiat_id,
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
        name: "pindaan.part_a",
        params: {
          wasiat_id: this.wasiat_id,
        },
      });
    },
    VerifiedWasiat(item, index) {
      // console.log(item);
      // window.open(item.public_path, "_blank");
      this.$router.push({
        name: "pindaan.draft-wasiat",
        params: { wasiat_id: item.amendmentable_id },
      });
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole"]),
    user_id() {
      return this.$store.getters.currentUser.id;
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
    pindaanStatus(value) {
      if (value == 0) {
        return "Dalam Proses";
      } else if (value == 1) {
        return "Permohonan Dihantar";
      } else if (value == 2) {
        return "Terima Draf Pindaan";
      } else if (value == 4) {
        return "Menunggu Pengesahan Saksi";
      } else if (value == 5) {
        return "Pindaan Selesai";
      } else if (!value) {
        return "-";
      }
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
              <h4 class="title text-white">Pindaan Wasiat / Komprehensif</h4>
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
            @click="printWasiat"
          >
            Muat Turun Wasiat Akhir
          </b-button>
        </div>
        <div class="row mt-3">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Bil.</th>
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
                  {{ item.status | pindaanStatus }}
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
                  <p v-if="item.status == 1">Menunggu Pengesahan</p>
                  <b-button
                    class="btn-sm btn-success"
                    v-if="item.status == 2"
                    @click="VerifiedWasiat(item, index)"
                  >
                    Pengesahan Draf Wasiat
                  </b-button>
                  <!-- <b-button v-if="item.status == 4" class="btn-sm btn-success">
                  MuatTurun Wasiat Akhir
                </b-button> -->
                  <p v-if="item.status == 4">Draf Diterima</p>
                  <p v-if="item.status == 5">Cetak Sijil</p>
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
        <b-modal
          ref="payAmendment"
          title="Jumlah Pembayaran"
          :no-enforce-focus="true"
          hide-footer
        >
          <div class="card-body">
            <div class="d-flex justify-content-center">
              <label class="label-agree-term">
                <strong>SAYA BERSETUJU DENGAN BAYARAN SEBANYAK</strong>
              </label>
            </div>
            <div class="d-flex justify-content-center">
              <label>
                <strong>RM{{ amendment_price }}</strong>
              </label>
            </div>
          </div>

          <b-button class="btn btn-danger" block @click="paymentGateWay">{{
            $t("agree")
          }}</b-button>
        </b-modal>
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
