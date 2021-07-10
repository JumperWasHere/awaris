<script>
import ApiService from "@/services/api.service";
import Switcher from "@/components/switcher";
import { LOGIN, LOGOUT } from "@/services/store/auth.module";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { mapGetters } from "vuex";
const axios = require("axios").default;
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  HomeIcon,
  UserIcon,
  KeyIcon,
} from "vue-feather-icons";

/**
 * Auth-login component
 */
export default {
  data() {
    return {
      form: {
        name: "",
        ic_number: "",
        address: "",
        nationality: "",
        gender: "Male",
        religion: "",
      },
      isLogin: false,
      documentOcr: {},
    };
  },
  components: {
    PulseLoader,
    Switcher,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    HomeIcon,
    UserIcon,
    KeyIcon,
  },
  methods: {
    onSubmit() {
      this.form._method = "PATCH";
      ApiService.post(`user/${this.currentUser.id}`, this.form).then(
        (response) => {
          this.$router.push({
            name: "dashboard",
          });
        }
      );
    },
    getDocumentOcr() {
      ApiService.get(`user/${this.currentUser.id}/document-ocr`).then(
        (response) => {
          if (response.data.document_ocr) {
            var documentOcr = response.data.document_ocr ?? {};
            this.form.name = documentOcr.name;
            this.form.ic_number = documentOcr.ic_number;
            this.form.address = documentOcr.address;
            this.form.nationality = documentOcr.nationality;
            this.form.gender =
              documentOcr.gender == "LELAKI" ? "Male" : "Female";
            this.form.religion = documentOcr.religion;
          }
        }
      );
    },
    logout() {
      const vm = this;
      vm.$store.dispatch(LOGOUT).then(() => {
        setTimeout(() => {
          if (this.$route.name != "Home") {
            vm.$router.push({ name: "Home" });
          }
        }, 500);
      });
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser", "userRole"]),
    registerCompleted() {
      return this.$route.query.status == "register-completed";
    },
    userStatus() {
      return this.$route.query.user_status;
    },
  },
  mounted() {
    this.getDocumentOcr();
  },
};
</script>

<template>
  <div>
    <div class="back-to-home rounded d-none d-sm-block">
      <button @click="logout" class="btn btn-icon btn-soft-primary">
        <key-icon class="icons"></key-icon>
      </button>
    </div>

    <section class="bg-home d-flex align-items-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7 col-md-6">
            <div class="mr-lg-5">
              <img
                src="/images/user/login.svg"
                class="img-fluid d-block mx-auto"
                alt
              />
            </div>
          </div>
          <div class="col-lg-5 col-md-6">
            <div class="card login-page bg-white shadow rounded border-0">
              <div class="card-body">
                <h4 class="card-title text-center mb-0">Pengesahan Identiti</h4>
                <p class="text-center">
                  <small
                    class="text-center text-muted"
                    style="font-size: 9pt; line-height: 2px"
                    >Maklumat ini diekstrak dari MyKad anda. Sila semak dan
                    perbetulkan jika terdapat keasalahan.</small
                  >
                </p>
                <form class="login-form mt-4" @submit.stop.prevent="onSubmit">
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group position-relative">
                        <label>
                          Nama Penuh
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder=""
                          v-model="form.name"
                          required
                        />
                      </div>
                    </div>

                    <div class="col-lg-8">
                      <div class="form-group position-relative">
                        <label>
                          MyKad
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.ic_number"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group position-relative">
                        <label>
                          Jantina
                          <span class="text-danger">*</span>
                        </label>
                        <select
                          name=""
                          id=""
                          class="form-control"
                          v-model="form.gender"
                        >
                          <option value="Male">Lelaki</option>
                          <option value="Female">Perempuan</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group position-relative">
                        <label>
                          Alamat
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.address"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group position-relative">
                        <label>
                          Poskod
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.postcode"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group position-relative">
                        <label>
                          Bandar
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.city"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group position-relative">
                        <label>
                          Negeri
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.state"
                        />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group position-relative">
                        <label>
                          Kewarganegaraan
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.nationality"
                        />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group position-relative">
                        <label>
                          Agama
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="form.religion"
                        />
                      </div>
                    </div>
                    <div class="col-lg-12 mb-0">
                      <button
                        class="btn btn-primary btn-block spinner spinner-light spinner-right"
                      >
                        Simpan
                        <span
                          class="spinner-border spinner-border-sm"
                          v-if="isLogin"
                        ></span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Switcher />
  </div>
</template>
