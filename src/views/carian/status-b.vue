<script>
/**
 * Page-aboutus component
 */
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      user_id: null,
      fullname: null,
      email: null,
      ic_number: null,
      old_ic_number: null,
      mobile_number: null,
      home_phone_number: null,
      address: null,
      city: null,
      postcode: null,
      state: null,
    };
  },
  components: {},
  mounted() {
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id;
      this.getPewasiatDetails();
    }
  },
  methods: {
    getPewasiatDetails() {
      ApiService.get(`/user/${this.user_id}`)
        .then((response) => {
          var data = response.data.user;
          this.fullname = data.name;
          this.email = data.email;
          this.ic_number = data.ic_number;
          this.old_ic_number = data.old_ic_number;
          this.mobile_number = data.mobile_number;
          this.home_phone_number = data.home_phone_number;
          this.address = data.address;
          this.city = data.city;
          this.postcode = data.postcode;
          this.state = data.state;
        })
        .catch((error) => {});
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
            <h5 class="text-center">MAKLUMAT PEWASIAT</h5>
            <form class="login-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Nama Penuh:</label>
                    <p>{{ this.fullname }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Emel:</label>
                    <p>{{ this.email }}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>No. MyKad:</label>
                    <p>{{ this.ic_number }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>No MyKad Lama:</label>
                    <p>{{ this.old_ic_number ? this.old_ic_number : "-" }}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>No. Telefon Bimbit:</label>
                    <p>{{ this.mobile_number }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>No. Telefon Rumah/Pejabat:</label>
                    <p>
                      {{
                        this.home_phone_number ? this.home_phone_number : "-"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Alamat:</label>
                    <p style="text-transform: uppercase">
                      {{ this.address }},<br />
                      {{ this.postcode }},<br />{{ this.city }},<br />{{
                        this.state
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!--end col-->
    </div>
    <!--end row-->
    <!-- Back to top -->
  </div>
</template>
