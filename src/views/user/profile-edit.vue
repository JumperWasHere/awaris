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
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      newDesignation: "",
      form: {
        designation: "",
        name: null,
        ic_number: null,
        gender: "Male",
        mobile_number: null,
        home_phone_number: null,
        staff_code: null,
        staff_number: null,
        address: null,
        postcode: null,
        city: null,
        state: null,
        status: null,
        email: null,
      },
      formPostcode: {},
      postcode: null,
      userId: null,
      submit: false,
      profile_picture: null,
      user_accesses: [],
    };
  },
  validations() {
    if (this.userRole != "Staff") {
      return {
        form: {
          name: {
            required,
            minLength: minLength(9),
            maxLength: maxLength(50),
          },
          email: {
            required,
            email,
          },
        },
      };
    } else if (this.userRole == "Staff") {
      return {
        form: {
          name: {
            required,
            minLength: minLength(9),
            maxLength: maxLength(50),
          },
          staff_code: {
            required,
          },
          status: {
            required,
          },
          email: {
            required,
            email,
          },
        },
      };
    } else if (this.userRole == null) {
      return {
        form: {
          name: {
            required,
            minLength: minLength(9),
            maxLength: maxLength(50),
          },
        },
      };
    }
  },
  mounted() {
    console.log("Currentuser", this.currentUser);
    this.form = this.currentUser;
    this.form.designation = this.currentUser.designation;
    console.log(this.form.designation);
    this.getProfilePicture();
  },
  methods: {
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              this.form.city = postcode.city;
              this.form.state = postcode.state;
            }
          })
          .catch(() => {
            this.form.city = "";
            this.form.state = "";
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
    getProfilePicture() {
      ApiService.get(
        `user/${this.currentUser.id}/profile-picture?stream=false`
      ).then((response) => {
        this.profile_picture = response.data.profile_picture
          ? response.data.profile_picture.public_path
          : "/images/icon/awaris-pattern.png";
      });
    },
    filesChange(files) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");

      ApiService.post(
        `user/${this.currentUser.id}/profile-picture`,
        formData
      ).then((response) => {
        this.profile_picture = response.data.attachment.public_path;
      });
    },
    async onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.submit = true;
        var currentUser = await this.saveProfile();
        this.submit = false;
        if (currentUser != null) {
          this.$swal
            .fire({
              icon: "success",
              html: "Kemaskini berjaya!",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            })
            .then((result) => {
              this.$router.push({
                name: "profile",
              });
            });
        }
      } else {
        this.$notify({
          group: "full-noti",
          text: "Sila isi ruangan yang bertanda (*)",
          duration: 5000,
          type: "success",
        });
      }
    },
    async saveProfile() {
      var user = {
        _method: "PATCH",
        ic_number: this.form.ic_number,
        designation: this.form.designation,
        name: this.form.name,
        gender: this.form.gender,
        email: this.form.email,
        office_phone_number: this.form.office_phone_number,
        mobile_number: this.form.mobile_number,
        address: this.form.address,
        postcode: this.form.postcode,
        city: this.form.city,
        state: this.form.state,
        staff_code: this.form.staff_code,
        staff_number: this.form.staff_number,
        status: this.form.status,
      };

      console.log("User to update: ", user);
      return await ApiService.post(`/user/${this.currentUser.id}`, user)
        .then((response) => {
          console.log(response.data);
          return response.data.user.id;
        })
        .catch((error) => {
          this.submit = false;
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
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
    ...mapGetters(["currentUser", "userRole"]),

    organizationType() {
      return this.organization.type;
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
                {{ $t("profile.update") }} - {{ currentUser.name }}
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
            <form @submit.prevent="onSubmit" class="login-form mt-4">
              <div
                class="card bg-light border-0 rounded shadow"
                style="z-index: 1"
              >
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-12 col-md-3">
                      <h4
                        class="title text-center"
                        style="text-transform: capitalize"
                      >
                        {{ $t("profile.user") }}
                      </h4>
                      <div class="row mt-4">
                        <div class="col-md-3 mt-4 mt-sm-0 text-center">
                          <div v-if="profile_picture">
                            <div
                              :style="
                                'background-image: url(' + profile_picture + ')'
                              "
                              class="bg-light shadow"
                              style="
                                border: 1px solid #eee;
                                position: relative;
                                display: inline-block;
                                border-radius: 100%;
                                height: 150px;
                                width: 150px;
                                background-repeat: no-repeat;
                                background-size: cover;
                                background-position: center center;
                              "
                            >
                              <span></span>
                              <label
                                class="shadow"
                                style="
                                  background: white;
                                  border-radius: 5px;
                                  padding: 4px;
                                  position: absolute;
                                  bottom: 5px;
                                  right: 5px;
                                  margin: 0;
                                "
                                for="upload-photo"
                              >
                                <img
                                  src="/images/icon/image-gallery.png"
                                  height="20"
                                  alt=""
                                />
                              </label>
                              <input
                                type="file"
                                class="form-control-file"
                                name="photo"
                                id="upload-photo"
                                accept="image/*"
                                @change="filesChange($event.target.files)"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-9">
                          <div class="row">
                            <div class="col-md-8">
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
                                    v-model.trim="$v.form.name.$model"
                                  />
                                </div>
                                <div
                                  class="form-error"
                                  v-if="!$v.form.name.minLength"
                                >
                                  Nama hendaklah sekurang kurangnya
                                  {{ $v.form.name.$params.minLength.min }}
                                  karakter.
                                </div>
                                <div
                                  class="form-error"
                                  v-if="!$v.form.name.maxLength"
                                >
                                  Nama hendaklah maksimum
                                  {{ $v.form.name.$params.maxLength.max }}
                                  karakter.
                                </div>
                                <div
                                  class="form-error"
                                  v-if="
                                    $v.form.name.$error &&
                                    !$v.form.name.required
                                  "
                                >
                                  Nama tidak boleh dibiarkan kosong.
                                </div>
                              </div>
                            </div>
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
                                  readonly
                                />
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group position-relative">
                                <label>
                                  {{ $t("gender") }}
                                  <span class="text-danger">*</span>
                                </label>
                                <select
                                  name
                                  id="gender"
                                  class="form-control"
                                  v-model="form.gender"
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
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group position-relative">
                                <label>{{ $t("mobile-no") }}</label>
                                <input
                                  type="text"
                                  id="mobile_number"
                                  class="form-control"
                                  v-model="form.mobile_number"
                                />
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group position-relative">
                                <label>{{ $t("office-no") }}</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  name
                                  v-model="form.office_phone_number"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 col-md-3 text-md-left">
                      <div class="row" v-if="userRole == 'Staff'">
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.staff_code.$error }"
                          >
                            <label>{{ $t("staff-code") }}</label>
                            <span class="text-danger">*</span>
                            <input
                              v-uppercase
                              type="text"
                              class="form-control"
                              placeholder="Kod Kakitangan"
                              name
                              v-model.trim="$v.form.staff_code.$model"
                            />
                            <div
                              class="form-error"
                              v-if="
                                $v.form.staff_code.$error &&
                                !$v.form.staff_code.required
                              "
                            >
                              Kod Kakitangan tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <label>{{ $t("staff-no") }}</label>
                            <input
                              v-uppercase
                              type="text"
                              class="form-control"
                              placeholder="No Pekerja"
                              name
                              v-model="form.staff_number"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group position-relative">
                            <label>{{ $t("address") }}</label>
                            <textarea
                              v-uppercase
                              class="form-control"
                              id="address"
                              rows="2"
                              v-model="form.address"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group position-relative">
                            <div
                              class="d-flex justify-content-between align-items-center"
                            >
                              <label>{{ $t("postcode") }}</label>
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
                              v-model="form.postcode"
                            />
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
                      <div class="row" v-if="userRole != 'Staff'">
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{
                              'has-error': $v.form.email.$error,
                            }"
                          >
                            <label>{{ $t("email") }}</label>
                            <input
                              type="text"
                              class="form-control"
                              id="email"
                              v-model.trim="$v.form.email.$model"
                            />
                            <div class="form-error" v-if="!$v.form.email.email">
                              Anda telah memasukkan alamat email yang tidak sah!
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
                      </div>
                    </div>
                  </div>
                  <div class="row align-items-center mt-4">
                    <div class="col-lg-12 col-md-3 text-md-left">
                      <div class="row" v-if="userRole == 'Staff'">
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{ 'has-error': $v.form.status.$error }"
                          >
                            <label>
                              {{ $t("user-status") }}
                              <span class="text-danger">*</span>
                            </label>
                            <select
                              name
                              class="form-control"
                              v-model.trim="$v.form.status.$model"
                            >
                              <option value>- Pilih Status -</option>
                              <option value="1">Aktif</option>
                              <option value="0">Tidak Aktif</option>
                            </select>
                            <div
                              class="form-error"
                              v-if="
                                $v.form.status.$error &&
                                !$v.form.status.required
                              "
                            >
                              Status Pengguna tidak boleh dibiarkan kosong.
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div
                            class="form-group position-relative"
                            :class="{
                              'has-error': $v.form.email.$error,
                            }"
                          >
                            <label>
                              {{ $t("email") }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="email"
                              v-model.trim="$v.form.email.$model"
                            />
                            <div class="form-error" v-if="!$v.form.email.email">
                              Anda telah memasukkan alamat email yang tidak sah!
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
                              required
                              :value="currentUser.username"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group position-relative text-left">
                            <router-link to="/profile" class="btn btn-primary">
                              <i class="mdi mdi-chevron-left"></i>
                              {{ $t("back") }}
                            </router-link>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group position-relative text-right">
                            <button type="submit" class="btn btn-primary">
                              <i class="mdi mdi-file-document"></i>
                              {{ $t("save") }}
                              <span
                                class="spinner-border spinner-border-sm"
                                v-if="submit"
                              ></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
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
