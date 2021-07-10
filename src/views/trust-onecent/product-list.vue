<script>
import { ArrowUpIcon, SettingsIcon } from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";
import { mapGetters } from "vuex";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";
import { SET_TRUST_EMPTY, CLEAR_TRUST } from "@/services/store/trust.module";
import ApiService from "@/services/api.service";

export default {
  data() {
    return {};
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
    SettingsIcon,
  },
  computed: {
    error() {
      return this.$route.query.error;
    },
    ...mapGetters(["currentUser", "userRole"]),
  },
  mounted() {
    this.$store.dispatch(CLEAR_TRUST);
  },
  methods: {
    async pushRedirect(type) {
      if (this.userRole == "Client") {
        if (type) {
          let hibahId = await this.getHibah(type);
          if (hibahId) {
            this.$router.push({
              name: "trust-onecent.part-a",
              query: { trust_id: hibahId },
            });
          } else {
            this.$router.push({
              name: "trust-onecent.part-a",
              query: { type: type },
            });
          }
        }
      } else {
        this.$router.push({
          name: "trust-onecent.part-a",
          query: { type: type },
        });
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
              <h4 class="title text-white">Produk Amanah/Hibah</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-md-8 offset-md-2 mt-4 pt-2">
            <div class="alert alert-warning" v-if="error == 1">
              Sila pilih produk terlebih dahulu
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(1)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">
                        Deklarasi Hibah Amanah Korporat
                      </h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Deklarasi Hibah Amanah Korporat Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(2)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Deklarasi Amanah Korporat</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Deklarasi Amanah Korporat Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(3)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Deklarasi Hibah Amanah Tunai</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Deklarasi Hibah Amanah Tunai Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(4)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Deklarasi Amanah Tunai</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Deklarasi Amanah Tunai Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(5)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">
                        Deklarasi Hibah Amanah Hartanah
                      </h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Deklarasi Hibah Amanah Hartanah Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(6)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Deklarasi Amanah Hartanah</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Deklarasi Amanah Hartanah Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(7)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Hibah Amanah Tunai</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Hibah Amanah Tunai Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(8)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Amanah Tunai</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Tunai Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(9)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Hibah Amanah Hartanah</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Hibah Amanah Hartanah Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(10)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Amanah Hartanah</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Hartanah Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3 mt-4 pt-2">
            <div @click="pushRedirect(11)">
              <div class="card rounded shadow bg-dark border-0">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h4 class="text-white">Amanah Perniagaan</h4>
                      <div class="mt-4">
                        <p class="h6 text-muted mb-0">
                          Informasi Amanah Perniagaan Disini
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm">
                      <img src="/images/icon/next.png" height="30" alt="" />
                    </button>
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
