<script>
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowUpIcon } from "vue-feather-icons";
export default {
  components: {
    Navbar,
    ArrowUpIcon,
    Footer,
  },
  data() {
    return {
      month: null,
    };
  },
  methods: {
    getExcel() {
      window.open(
        process.env.VUE_APP_API_URL +
          `/ezqurban/transaction/report/monthly?date=${this.month}`,
        "_blank"
      );
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
                Laporan Transaksi Bulanan
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="card shadow border-0">
              <div class="card-body">
                <div class="form-group">
                  <label for="date">Date</label>
                  <input
                    type="month"
                    name="date"
                    id="date"
                    class="form-control"
                    v-model="month"
                  />
                </div>
                <div class="form-group text-right">
                  <button @click="getExcel" class="btn btn-primary">
                    Dapatkan Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>