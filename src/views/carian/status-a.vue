<script>
/**
 * Page-aboutus component
 */
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      user_id: null,
      wasiatDetails: null,
      branch_id: null,
      organization_id: null,
      form: {
        branch: null,
        account_type: null,
        price: null,
        wasiat_id: null,
        wasiat_type: null,
        payment_method: null,
      },
    };
  },
  components: {},
  mounted() {
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id;
    }
    this.getwasiatDetails();
  },
  methods: {
    getwasiatDetails() {
      ApiService.get(`/wasiat?user_id=${this.user_id}&load_with=branch`)
        .then((response) => {
          var data_array = response.data.wasiats.data;
          if (Array.isArray(data_array)) {
            this.wasiatDetails = data_array[0];
            this.branch_id = data_array[0].branch_id;
            this.organization_id = data_array[0].organization_id;
            this.form.account_type = data_array[0].account_type;
            this.form.price = data_array[0].price;
            this.form.wasiat_id = data_array[0].id;
            this.form.wasiat_type = data_array[0].wasiat_type;
            this.form.payment_method = data_array[0].is_cash_payment; //if true means cash
          }
          this.getBranchName();
          // console.log(this.wasiatDetails);
        })
        .catch((error) => {});
    },
    async getBranchName() {
      ApiService.get(`/organization/${this.organization_id}/branch`)
        .then((response) => {
          if (Array.isArray(response.data.branches.data)) {
            this.form.branch = response.data.branches.data[0].branch_name;
          }
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
            <h5 class="text-center">AMANAH WARISAN BERHAD</h5>
            <form class="login-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Cawangan:</label>
                    <p>{{ this.wasiatDetails.branch.branch_name }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Wasiat ID:</label>
                    <p>{{ this.form.wasiat_id }}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Jenis Wasiat:</label>
                    <p>
                      {{
                        this.form.wasiat_type == 1
                          ? "Wasiat Islam"
                          : "Wasiat Konvensional"
                      }}
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Harga Wasiat:</label>
                    <p>RM{{ this.form.price }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Method Bayaran:</label>
                    <p>
                      {{
                        this.form.payment_method == true
                          ? "Tunai"
                          : "Atas Talian"
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
