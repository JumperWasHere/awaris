<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import {
  ArrowUpIcon,
  EyeIcon,
  BoldIcon,
  FeatherIcon,
  CodeIcon,
  UserCheckIcon,
  GitMergeIcon,
  SettingsIcon,
} from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";
import { required, email } from "vuelidate/lib/validators";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  mounted() {
    this.getUser();
    this.getProfilePicture();
    this.form = this.user;
    this.form.designation = this.user.designation;
    console.log(this.form.designation);
  },
  data() {
    return {
      user: {},
      isSubmit: false,
      form: {
        designation: "",
        name: null,
        ic_number: null,
        other_ic_number: null,
        gender: "Male",
        religion: null,
        citizenship: "Warganegara",
        email: null,
        home_phone_number: null,
        mobile_number: null,
        address: null,
        postcode: null,
        city: null,
        state: null,
      },
      formPostcode: {},
      postcode: null,
      profile_picture: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      gender: {
        required,
      },
      mobile_number: {
        required,
      },
      address: {
        required,
      },
      postcode: {
        required,
      },
    },
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
    BoldIcon,
    FeatherIcon,
    CodeIcon,
    UserCheckIcon,
    GitMergeIcon,
    SettingsIcon,
  },
  computed: {
    clientId() {
      return this.$route.params.client_id;
    },
    genders() {
      return this.$t("genders").split(",");
    },
    designations() {
      var designations = this.$t("designations").split(",");
      if (this.newDesignation) {
        designations.push(this.newDesignation);
      } else if (!designations.includes(this.form.designation)) {
        designations.push(this.form.designation);
      }
      return designations;
    },
  },
  methods: {
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`).then((response) => {
          var postcode = response.data.postcode;
          if (postcode != null) {
            this.form.city = postcode.city;
            this.form.state = postcode.state;
          }
        });
      }
    },
    openpostcode() {
      this.$refs["modalPostcode"].show();
    },
    async storePostcode() {
      await ApiService.post(`postcode`, this.formPostcode).then((response) => {
        this.postcode = this.formPostcode.postcode;
      });
      await this.getPostcode();
      this.formPostcode = {};
      this.$swal.fire({
        icon: "success",
        html: "Poskod baharu telah didaftarkan.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    },
    getUser() {
      ApiService.get(`user/${this.clientId}`).then((response) => {
        this.user = response.data.user ?? {};
        this.form = this.user;
      });
    },
    getProfilePicture() {
      ApiService.get(`user/${this.clientId}/profile-picture?stream=false`).then(
        (response) => {
          this.profile_picture = response.data.profile_picture.public_path;
        }
      );
    },
    filesChange(files) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");

      ApiService.post(`user/${this.clientId}/profile-picture`, formData).then(
        (response) => {
          this.profile_picture = response.data.attachment;
        }
      );
    },
    submitForm() {
      this.isSubmit = true;
      var user = {
        _method: "PATCH",
        name: this.form.name,
        designation: this.form.designation,
        gender: this.form.gender,
        email: this.form.email,
        office_phone_number: this.form.office_phone_number,
        mobile_number: this.form.mobile_number,
        address: this.form.address,
        postcode: this.form.postcode,
        city: this.form.city,
        state: this.form.state,
        // status: 0,
      };
      ApiService.post(`/user/${this.user.id}`, user)
        .then((response) => {
          this.$swal
            .fire({
              icon: "success",
              html: "Kemaskini berjaya!",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            })
            .then((response) => {
              this.$router.push({
                name: "client.info",
                params: {
                  client_id: this.clientId,
                },
              });
            });
        })
        .catch((error) => {
          this.isSubmit = false;
          // console.log(error.response);
        });
    },
    back() {
      this.$router.push({
        name: "client.info",
        params: { client_id: this.clientId },
      });
    },
    async changeDesignation() {
      if (["Others", "Lain-lain"].includes(this.form.designation)) {
        const { value: newDesignation } = await this.$swal.fire({
          html:
            "<span style='margin-bottom:.5rem' class='form-group d-block w-100 text-left'><label style='margin-bottom:0px'>Gelaran</label></span>",
          input: "text",
        });
        if (newDesignation) {
          this.newDesignation = newDesignation;
          this.form.designation = newDesignation;
        } else {
          this.form.designation = this.designations[0];
        }
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
              <h4 class="title text-white">
                {{ $t("profile.update") }} - {{ user.name }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <form class="login-form mt-4">
              <div
                class="card bg-light border-0 rounded shadow"
                style="z-index: 1"
              >
                <div class="card-body">
                  <div class="row align-items-center border-bottom">
                    <div class="col-lg-12 col-md-3 text-md-left">
                      <div class="row">
                        <div
                          class="col-md-12 text-center mt-4 mt-sm-0"
                          v-if="profile_picture"
                        >
                          <img
                            :src="profile_picture"
                            class="avatar avatar-large rounded-circle shadow d-block mx-auto"
                            alt
                            height="150"
                          />
                          <label class="btn btn-primary mt-2" for="upload-photo"
                            >Tukar Gambar Profil</label
                          >
                          <input
                            type="file"
                            class="form-control-file"
                            name="photo"
                            id="upload-photo"
                            accept="image/*"
                            @change="filesChange($event.target.files)"
                          />
                          <div
                            class="col-md-12 text-center mt-4 mt-sm-0"
                            v-if="!profile_picture"
                          >
                            <label
                              class="upload-photo btn btn-primary"
                              for="upload-photo"
                              >Tambah Gambar Profil</label
                            >
                            <input
                              type="file"
                              name="photo"
                              id="upload-photo"
                              accept="image/*"
                              @change="filesChange($event.target.files)"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.name.$error }"
                          >
                            <label>
                              {{ $t("fullname") }}
                              <span class="text-danger">*</span>
                            </label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <select
                                  name
                                  class="form-control"
                                  v-model="form.designation"
                                  @change="changeDesignation"
                                  style="
                                    border-bottom-right-radius: 0;
                                    border-top-right-radius: 0;
                                  "
                                >
                                  <option
                                    v-for="designation in designations"
                                    :key="designation"
                                    :value="designation"
                                  >
                                    {{ designation }}
                                  </option>
                                </select>
                              </div>
                              <input
                                v-uppercase
                                type="text"
                                class="form-control"
                                name
                                id="full_name"
                                required
                                v-model.trim="$v.form.name.$model"
                              />
                            </div>
                            <div
                              class="form-error"
                              v-if="
                                $v.form.name.$error && !$v.form.name.required
                              "
                            >
                              Nama tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <label>
                              {{ $t("mykad") }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="ic_number"
                              v-model="form.ic_number"
                              required
                              readonly
                            />
                          </div>
                        </div>
                        <div class="col-md-8">
                          <div class="form-group position-relative">
                            <label>
                              {{ $t("old-ic") }}
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="old_ic_number"
                              v-model="form.old_ic_number"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.gender.$error }"
                          >
                            <label>
                              {{ $t("gender") }}
                              <span class="text-danger">*</span>
                            </label>
                            <select
                              name
                              id="gender"
                              class="form-control"
                              v-model.trim="$v.form.gender.$model"
                            >
                              <option value="">
                                -- {{ $t("choose.gender") }} --
                              </option>
                              <option
                                v-for="(gender, index) in genders"
                                :key="index"
                                :value="gender.split(':')[0]"
                              >
                                {{ gender.split(":")[1] }}
                              </option>
                            </select>
                            <div
                              class="form-error"
                              v-if="
                                $v.form.gender.$error &&
                                !$v.form.gender.required
                              "
                            >
                              Jantina tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{
                              'has-error': $v.form.mobile_number.$error,
                            }"
                          >
                            <label>
                              {{ $t("mobile-no") }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              id="mobile_number"
                              class="form-control"
                              required
                              v-model.trim="$v.form.mobile_number.$model"
                            />
                            <div
                              class="form-error"
                              v-if="
                                $v.form.mobile_number.$error &&
                                !$v.form.mobile_number.required
                              "
                            >
                              No. Telefon Bimbit tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <label>
                              {{ $t("office-no") }}
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              name
                              required
                              v-model="form.office_phone_number"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.address.$error }"
                          >
                            <label>
                              {{ $t("address") }}
                              <span class="text-danger">*</span>
                            </label>
                            <textarea
                              v-uppercase
                              class="form-control"
                              id="address"
                              rows="2"
                              v-model.trim="$v.form.address.$model"
                            ></textarea>
                            <div
                              class="form-error"
                              v-if="
                                $v.form.address.$error &&
                                !$v.form.address.required
                              "
                            >
                              Alamat tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.postcode.$error }"
                          >
                            <div
                              class="d-flex justify-content-between align-items-center"
                            >
                              <label>
                                {{ $t("postcode") }}
                                <span class="text-danger">*</span>
                              </label>
                              <span
                                @click="openpostcode"
                                style="
                                  text-decoration: underline;
                                  font-size: 11px;
                                  color: #333;
                                "
                                >{{ $t("add-new") }}</span
                              >
                            </div>
                            <input
                              type="text"
                              id="postcode"
                              class="form-control"
                              v-on:input="getPostcode"
                              v-model.trim="$v.form.postcode.$model"
                            />
                            <div
                              class="form-error"
                              v-if="
                                $v.form.postcode.$error &&
                                !$v.form.postcode.required
                              "
                            >
                              Poskod tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <label>{{ $t("city") }}</label>
                            <input
                              v-uppercase
                              type="text"
                              id="city"
                              class="form-control"
                              readonly
                              v-model="form.city"
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <label>{{ $t("state") }}</label>
                            <input
                              v-uppercase
                              type="text"
                              id="state"
                              class="form-control"
                              readonly
                              v-model="form.state"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row align-items-center mt-4">
                    <div class="col-lg-12 col-md-3 text-md-left">
                      <div class="row">
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.email.$error }"
                          >
                            <label>
                              {{ $t("email") }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="email"
                              required
                              v-model.trim="$v.form.email.$model"
                            />
                            <div class="form-error" v-if="!$v.form.email.email">
                              Anda telah memasukkan alamat e-mel yang tidak sah!
                            </div>
                            <div
                              class="form-error"
                              v-if="
                                $v.form.email.$error && !$v.form.email.required
                              "
                            >
                              E-mel tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <label>{{ $t("username") }}</label>
                            <span class="text-danger">*</span>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              id
                              required
                              :value="user.username"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group position-relative text-left">
                            <button
                              type="button"
                              @click="back"
                              class="btn btn-primary"
                            >
                              {{ $t("back") }}
                            </button>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group position-relative text-right">
                            <button
                              type="button"
                              @click="submitForm"
                              class="btn btn-primary"
                            >
                              <i class="mdi mdi-file-document"></i>
                              {{ $t("update") }}
                              <span
                                class="spinner-border spinner-border-sm"
                                v-if="isSubmit"
                              ></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <b-modal
                    ref="modalPostcode"
                    class="modal fade"
                    v-bind:title="$t('add-newpostcode')"
                    v-bind:ok-title="$t('save')"
                    v-bind:cancel-title="$t('cancel')"
                    @ok="storePostcode"
                  >
                    <div class="modal-body">
                      <div class="row">
                        <div class="col-md-6 form-group">
                          <label>
                            {{ $t("postcode") }}
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="formPostcode.postcode"
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 form-group">
                          <label>
                            {{ $t("city") }}
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            v-uppercase
                            class="form-control"
                            v-model="formPostcode.city"
                          />
                        </div>
                        <div class="col-md-6 form-group">
                          <label>
                            {{ $t("state") }}
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            v-uppercase
                            class="form-control"
                            v-model="formPostcode.state"
                          />
                        </div>
                      </div>
                    </div>
                  </b-modal>
                </div>
              </div>
            </form>
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
