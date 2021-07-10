<script>
import { ArrowUpIcon } from "vue-feather-icons";
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      insert_code: null,
    };
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole", "userAccess"]),
  },
  mounted() {},
  methods: {
    async submitForm() {
      ApiService.get(`/one-cent/hibah-coupon/${this.insert_code}/redeem`)
        .then((response) => {
          console.log("response token", response.data);
          this.$router.push({
            name: "trust-onecent.part-d",
            query: { trust_id: response.data.hibah.id },
          });
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            html: error.data.message,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
        });
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
    ></section>
    <section class="section d-flex align-items-center">
      <div
        class="container"
        style="padding-right: 100px; padding-left: 100px; height: inherit"
      >
        <div class="row align-items-center">
          <div class="col-lg-12">
            <div class="card bg-light rounded shadow border-0 overflow-hidden">
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <h5 class="text-center">Hibah One Cent</h5>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-3">
                    <div class="form-group position-relative mt-4">
                      <label>Sila masukkan kupon:</label>
                    </div>
                  </div>
                  <div class="col-lg-7">
                    <div class="form-group position-relative mt-4">
                      <input
                        type="text"
                        class="form-control"
                        id="coupon"
                        required
                        v-model="insert_code"
                      />
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="form-group position-relative mt-4">
                      <button @click="submitForm" class="btn btn-primary">
                        Redeem
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
