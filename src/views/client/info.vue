<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { ArrowUpIcon } from "vue-feather-icons";
import ChangePasswordModal from "./change-password-modal.vue";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      user: {},
      profile_picture: null,
    };
  },
  mounted() {
    this.getUser();
    this.getProfilePicture();
  },
  methods: {
    getUser() {
      ApiService.get(`user/${this.clientId}`).then((response) => {
        this.user = response.data.user ?? {};
      });
    },
    getProfilePicture() {
      ApiService.get(`user/${this.clientId}/profile-picture?stream=false`).then(
        (response) => {
          this.profile_picture = response.data.profile_picture.public_path;
          if (response.data.profile_picture) {
            this.profile_picture = response.data.profile_picture.public_path;
          }
        }
      );
    },
    changePassword() {
      this.$refs.changePasswordModal.showModal();
    },
    back() {
      this.$router.push({
        name: "client.list",
        params: { client_id: this.clientId },
      });
    },
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
    ChangePasswordModal,
  },
  computed: {
    ...mapGetters(["userRole"]),
    clientId() {
      return this.$route.params.client_id;
    },
    fullAddress() {
      return String(this.user.address ? this.user.address.concat(", ") : "")
        .concat(
          String(this.user.postcode ? this.user.postcode.concat(", ") : "")
        )
        .concat(String(this.user.city ? this.user.city.concat(", ") : ""))
        .concat(String(this.user.state ? this.user.state.concat(". ") : ""));
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
              <h4 class="title text-white">Kakitangan Amanah Warisan Berhad</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div
              class="card public-profile border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-lg-3 col-md-3 text-md-left text-center">
                    <div v-if="profile_picture">
                      <img
                        :src="profile_picture"
                        class="avatar avatar-large rounded-circle shadow d-block mx-auto"
                        alt
                        height="150"
                      />
                      <input
                        type="file"
                        name="photo"
                        id="upload-photo"
                        accept="image/*"
                        @change="filesChange($event.target.files)"
                      />
                    </div>
                    <div v-if="!profile_picture">
                      <img
                        :src="profile_picture"
                        class="avatar avatar-large rounded-circle shadow d-block mx-auto"
                        alt
                        height="150"
                      />
                    </div>
                  </div>
                  <div class="col-lg-9 col-md-9">
                    <div class="row align-items-end">
                      <div
                        class="col-md-12 text-md-left text-center mt-4 mt-sm-0"
                      >
                        <h3 class="title mb-0">{{ user.name }}</h3>
                        <small class="text-muted h6 mr-2">
                          {{ user.role }}
                        </small>
                        <ul class="list-inline mb-0 mt-3">
                          <li class="list-inline-item mr-2">
                            <router-link
                              :to="{
                                name: 'client.edit',
                                params: { client_id: clientId },
                              }"
                              class="btn btn-primary"
                            >
                              {{ $t("profile.update-details") }}
                              <i class="mdi mdi-chevron-right"></i>
                            </router-link>
                          </li>
                        </ul>
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
            <div
              class="card bg-light border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 form-group">
                    <label>{{ $t("email") }}</label>
                    <p class="form-control-static">
                      {{ user.email ? user.email : "-" }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label>{{ $t("gender") }}</label>
                    <p class="form-control-static" v-if="user.gender == 1">
                      {{ $t("male") }}
                    </p>
                    <p class="form-control-static" v-if="user.gender == 2">
                      {{ $t("female") }}
                    </p>
                  </div>

                  <div class="col-md-6 form-group">
                    <label>{{ $t("mykad") }}</label>
                    <p class="form-control-static">
                      {{ user.ic_number ? user.ic_number : "-" }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label for>{{ $t("old-ic") }}</label>
                    <p class="form-control-static">
                      {{ user.old_ic_number ? user.old_ic_number : "-" }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label>{{ $t("mobile-no") }}</label>
                    <p class="form-control-static">
                      {{ user.mobile_number ? user.mobile_number : "-" }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label>{{ $t("office-no") }}</label>
                    <p class="form-control-static">
                      {{
                        user.office_phone_number
                          ? user.office_phone_number
                          : "-"
                      }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label>{{ $t("address") }}</label>
                    <!-- <p class="form-control-static">
                      {{ user.address ? user.address : "-" }}
                    </p> -->
                    <p class="form-control-static">
                      {{ fullAddress ? fullAddress : "-" }}
                    </p>
                  </div>
                  <!-- <div class="col-md-6 form-group">
                    <label>{{ $t("postcode") }}</label>
                    <p class="form-control-static">
                      {{ user.postcode ? user.postcode : "-" }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label>{{ $t("city") }}</label>
                    <p class="form-control-static">
                      {{ user.city ? user.city : "-" }}
                    </p>
                  </div>
                  <div class="col-md-6 form-group">
                    <label>{{ $t("state") }}</label>
                    <p class="form-control-static">
                      {{ user.state ? user.state : "-" }}
                    </p>
                  </div> -->
                </div>
                <div class="d-flex justify-content-between">
                  <button type="button" @click="back" class="btn btn-primary">
                    <i class="mdi mdi-chevron-left"></i>{{ $t("back") }}
                  </button>
                  <div>
                    <button
                      v-if="['Staff'].includes(this.userRole)"
                      type="button"
                      @click="$refs.changePasswordModal.showModal()"
                      class="btn btn-primary"
                    >
                      Tukar Kata Laluan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <ChangePasswordModal ref="changePasswordModal" />
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
