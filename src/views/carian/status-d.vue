<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      wasiat_status: null,
      wasiat_id: null,
      amendment_status: null,
      cetak: false,
    }; //amendment_status 1 :dalam process pindaan; 2: pindaan dah approve
  },
  components: {},
  mounted() {
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id;
      this.getwasiatDetails();
    }
  },
  methods: {
    async getwasiatDetails() {
      ApiService.get(`/wasiat?user_id=${this.user_id}`)
        .then((response) => {
          var data_array = response.data.wasiats.data;
          if (Array.isArray(data_array) && data_array.length) {
            this.wasiat_status = data_array[0].status;
            this.wasiat_id = data_array[0].id;
            if (data_array[0].status == 2) {
              this.getAmendment();
            }
            // console.log(this.wasiat_status);
          }
          // console.log(data_array);
        })
        .catch((error) => {});
    },
    async getAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // console.log(response.data);
          var data_array = response.data.amendments.data;
          if (Array.isArray(data_array) && data_array.length) {
            this.amendment_status = data_array[0].status;
          }
        })
        .catch((error) => {});
    },
    cetakresit() {
      this.cetak = true;
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
          this.cetak = false;
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
          this.cetak = false;
        });
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <router-link :to="{ name: 'carian.semak' }" class="btn btn-primary"
          >Kembali</router-link
        >
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">STATUS</h5>
            <form class="login-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Wasiat Status:</label>
                    <p>
                      {{
                        this.wasiat_status == 0
                          ? "Masih dalam proses pembuatan wasiat."
                          : this.wasiat_status == 1
                          ? "Sedang menunggu pengesahan."
                          : this.wasiat_status == 2
                          ? "Permohonan wasiat asas berjaya."
                          : "Permohonan wasiat asas terbatal."
                      }}
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <router-link
                      class="btn btn-primary"
                      :to="{
                        name: 'wasiat.receipt',
                        params: { wasiat_id: this.wasiat_id },
                      }"
                      target="_blank"
                    >
                      Cetak Resit
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Pindaan Status:</label>
                    <p>
                      {{
                        this.amendment_status == null
                          ? "Anda belum membuat pindaan wasiat."
                          : this.amendment_status == 0
                          ? "Anda sedang membuat pindaan wasiat, dan menunggu pengesahan."
                          : this.amendment_status == 1
                          ? "Pindaan wasiat anda telah dihantar ke pihak AWARIS."
                          : this.amendment_status == 2
                          ? "Pihak AWARIS telah mengesahkan Pindaan Anda, anda boleh membuat pengesahan Draf wasiat akhir."
                          : this.amendment_status == 4
                          ? "Pihak AWARIS sedang mengesahkan saksi Pindaan Anda."
                          : this.amendment_status == 5
                          ? "Pindaan selesai."
                          : "-"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
