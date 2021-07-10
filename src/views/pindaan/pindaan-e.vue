<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { TheMask } from "vue-the-mask";
import {
  required,
  minLength,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      items: [{ Bil: 40, Nama_Penuh: "Dickerson", Tindakan: "viewDetails" }],
      caretaker_array: [],
      amendment_status: null,
      amendment_id: null,
      newRelationship: null,
      user_details: {},
      form: {
        _method: null,
        wasiat_id: null,
        name: null,
        ic_number: null,
        old_ic_number: null,
        relationship: null,
        mobile_number: null,
        home_phone_number: null,
        address: null,
        address_1: null,
        postcode: null,
        city: null,
        state: null,
        caretakerable_type: "Wasiat",
        caretakerable_id: null,
        sameAddress: null,
      },
      mykad: {
        front: null,
        frontUrl: null,
        frontUrlDisplay: null,
        back: null,
        backUrl: null,
        backUrlDisplay: null,
      },
      post: {
        postcode: null,
        city: null,
        state: null,
      },
      btnText: null,
      fileFront: null,
      fileBack: null,
      delete: null,
      register: null,
      selectCaretaker_id: null,
      selectCaretaker_index: null,
      postcode: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      relationship: {
        required,
      },
      mobile_number: {
        required,
        numeric,
      },
      ic_number: {
        required,
      },
      address: {
        required,
      },
      postcode: {
        required,
      },
    },
    mykad: {
      frontUrl: {
        required,
      },
      backUrl: {
        required,
      },
    },
  },
  components: { TheMask },
  methods: {
    tambahPenjagaModal() {
      this.$v.$reset();
      this.btnText = "Simpan";
      this.form.name = null;
      this.form.ic_number = null;
      this.form.old_ic_number = null;
      this.form.relationship = null;
      this.form.mobile_number = null;
      this.form.home_phone_number = null;
      this.form.address = null;
      this.form.postcode = null;
      this.postcode = null;
      this.form.city = null;
      this.form.state = null;
      this.selectCaretaker_id = null;
      this.selectCaretaker_index = null;
      this.mykad.frontUrl = null;
      this.mykad.backUrl = null;
      // this.form = {};

      this.$refs["modalTambahPenjaga"].show();
    },
    openpostcode() {
      this.$refs["modalPostcode"].show();
      // this.$refs["modalTambahPenjaga"].hide();
    },
    hideModalCaretaker() {},
    hideModal(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi ruangan yang bertanda (*)",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      this.form.wasiat_id = parseInt(this.wasiat_id);
      if (this.btnText == "Kemas Kini") {
        this.form._method = "PATCH";
        this.updatePenjaga();
      } else if (this.btnText == "Simpan") {
        this.form._method = null;
        this.registerPenjaga();
      }

      // console.log(obj);
    },
    async updatePenjaga() {
      ApiService.post(`/caretaker/${this.selectCaretaker_id}`, this.form)
        .then((response) => {
          console.log(response.data.caretaker);
          var data_temp = response.data.caretaker;
          this.caretaker_array.splice(this.selectCaretaker_index, 1, data_temp);
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya kemas kini Penjaga.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          if (this.fileFront) {
            this.uploadICFront(data_temp.id);
          }
          if (this.fileBack) {
            this.uploadICBack(data_temp.id);
          }
          this.$refs["modalTambahPenjaga"].hide();
        })
        .catch((error) => {});
    },
    async registerPenjaga() {
      this.form.caretakerable_id = this.wasiat_id;
      this.form.address_1 = this.form.address;
      ApiService.post(`/caretaker`, this.form)
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya mendaftar penjaga.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          var objResponse = response.data.caretaker;
          console.log(objResponse);
          this.caretaker_array.push(objResponse);

          if (this.fileFront) {
            this.uploadICFront(objResponse.id);
          }
          if (this.fileBack) {
            this.uploadICBack(objResponse.id);
          }

          this.$refs["modalTambahPenjaga"].hide();
        })
        .catch((error) => {
          this.$swal.fire({
            // title: '<strong>Info</strong>',
            icon: "error",
            html: "Anda tidak berjaya mendaftar penjaga",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
        });
    },
    getlistCaretaker() {
      ApiService.get(`/wasiat/${this.wasiat_id}/caretaker`)
        .then((response) => {
          this.caretaker_array = response.data.caretakers.data;

          console.log(response.data.caretakers.data);
        })
        .catch((error) => {});
    },
    deleteCaretaker(caretaker_id) {
      let obj = {
        _method: "DELETE",
      };
      const vm = this;
      let index = 0;
      for (index; index < this.caretaker_array.length; index++) {
        if (this.caretaker_array[index].id == caretaker_id) {
          break;
        }
      }
      ApiService.post(`/caretaker/${caretaker_id}`, obj)
        .then((response) => {
          this.$swal.fire({
            // title: '<strong>Info</strong>',
            icon: "success",
            html: "Anda telah berjaya memadam Penjaga.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.caretaker_array.splice(index, 1);
          // this.caretaker_array = response.data.caretakers.data;

          // console.log(response.data.caretakers.data);
        })
        .catch((error) => {});
    },
    async updateCaretaker(item, index) {
      console.log(item);
      this.btnText = "Kemas Kini";
      this.$refs["modalTambahPenjaga"].show();
      this.form.name = item.name;
      this.form.ic_number = item.ic_number;
      this.form.old_ic_number = item.old_ic_number;
      this.form.relationship = item.relationship;

      this.form.mobile_number = item.mobile_number;
      this.form.home_phone_number = item.home_phone_number;
      this.form.address = item.address_1;
      this.form.postcode = item.postcode;
      this.postcode = item.postcode;
      this.form.city = item.city;
      this.form.state = item.state;
      this.selectCaretaker_id = item.id;
      this.selectCaretaker_index = index;
      await this.getCaretakerIC(item.id);
      // console.log(obj);
      // console.log(item);
    },
    async getCaretakerIC(caretaker_id) {
      return await ApiService.get(`/caretaker/${caretaker_id}/document`)
        .then((response) => {
          var image_array = response.data.documents.data;
          var front = image_array.filter((item) => item.type == "mykad-front");
          var back = image_array.filter((item) => item.type == "mykad-back");

          console.log("getCaretakerIC", image_array);
          if (front.length != 0) {
            this.mykad.frontUrl = front[0].public_path;

            if (
              !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
                front[0].mime_type
              )
            ) {
              this.mykad.frontUrlDisplay = "/images/logo/iconAttachement.jpg";
            } else {
              this.mykad.frontUrlDisplay = front[0].public_path;
            }
          }
          if (back.length != 0) {
            this.mykad.backUrl = back[0].public_path;
            if (
              !["image/jpeg", "image/gif", "image/png", "image/jpg"].includes(
                back[0].mime_type
              )
            ) {
              this.mykad.backUrlDisplay = "/images/logo/iconAttachement.jpg";
            } else {
              this.mykad.backUrlDisplay = back[0].public_path;
            }
            // console.log(front[0].public_path);
          }
        })
        .catch((error) => {
          console.log("error");
        });
    },
    uploadICFront(caretaker_id) {
      ApiService.post(`/caretaker/${caretaker_id}/document`, this.fileFront)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {});
    },
    uploadICBack(caretaker_id) {
      ApiService.post(`/caretaker/${caretaker_id}/document`, this.fileBack)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {});
    },
    filesChange(files, type) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");
      formData.append("description", type);
      formData.append("type", type);
      // console.log(files[0]);
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
        this.fileFront = formData;
        if (!["image/jpeg", "image/gif", "image/png"].includes(files[0].type)) {
          this.mykad.frontUrlDisplay = "/images/logo/iconAttachement.jpg";
        } else {
          this.mykad.frontUrlDisplay = URL.createObjectURL(files[0]);
        }
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
        this.fileBack = formData;
        if (!["image/jpeg", "image/gif", "image/png"].includes(files[0].type)) {
          this.mykad.backUrlDisplay = "/images/logo/iconAttachement.jpg";
        } else {
          this.mykad.backUrlDisplay = URL.createObjectURL(files[0]);
        }
        console.log(formData);
      }
    },
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
    openIcFront(type) {
      if (type == "front") {
        window.open(this.mykad.frontUrl, "_blank");
      } else {
        window.open(this.mykad.backUrl, "_blank");
      }
    },
    savePostcode() {
      ApiService.post(`/postcode`, this.post)
        .then((response) => {
          console.log(response.data);
          this.$swal.fire({
            // title: '<strong>Info</strong>',
            icon: "success",
            html: "poskod " + this.post.postcode + " berjaya di tambah",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.form.city = response.data.postcode.city;
          this.form.state = response.data.postcode.state;
        })
        .catch((error) => {});
      this.$refs["modalPostcode"].hide();
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            this.getuser_Details();
            console.log("amendmentid", this.amendment_id);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
    async changeRelationship(event) {
      if (["Others", "Lain-lain"].includes(event.target.value)) {
        const { value: newRelationship } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Hubungan</label></span>",
          input: "text",
        });
        if (newRelationship) {
          console.log(newRelationship);
          this.newRelationship = newRelationship;
          this.form.relationship = newRelationship;
        } else {
          this.form.relationship = this.relationship[0];
        }
      }
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        console.log("");
        this.form.address = this.user_details.correspondence_address;
        this.form.city = this.user_details.correspondence_city;
        this.form.state = this.user_details.correspondence_state;
        this.form.postcode = this.user_details.correspondence_postcode;
        this.postcode = this.user_details.correspondence_postcode;
      } else {
        this.form.address = "";
        this.form.city = "";
        this.form.state = "";
        this.form.postcode = "";
        this.postcode = "";
      }
    },
    async getuser_Details() {
      ApiService.get(`/wasiat/${this.wasiat_id}/user-detail`)
        .then((response) => {
          this.user_details = response.data.user_detail;

          console.log("user_details", response.data);
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getlistCaretaker();
    this.wasiatGetAmendment();
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "currentUser"]),

    relationships() {
      var relationships = this.$t("relationships").split(",");
      if (this.newRelationship) {
        relationships.push(this.newRelationship);
      } else if (!relationships.includes(this.form.relationship)) {
        relationships.push(this.form.relationship);
      }
      return relationships;
    },
  },
  watch: {
    postcode: {
      handler: function (val) {
        this.form.postcode = val;
        this.getPostcode();
      },
    },
    locale: function () {
      if (!this.newRelationship) this.form.relationship = this.relationship[0];
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-4" style="text-transform: uppercase">
              {{ $t("amendment.guardian-desc") }}
              <img
                content="Jika ada benefisiari bawah umur 18 tahun atau OKU"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>
            <form class="login-form">
              <div class="row d-flex justify-content-end">
                <div class="col-lg-12 d-flex justify-content-end">
                  <div
                    class="d-flex flex-column mb-4"
                    v-if="[0, 1].includes(amendment_status)"
                  >
                    <b-button
                      v-if="caretaker_array.length < 4"
                      class="btn-sm btn-primary"
                      @click="tambahPenjagaModal"
                      >Tambah Penjaga Utama</b-button
                    >
                  </div>
                </div>
              </div>
              <div class="row d-flex mt-2 mb-3">
                <div class="col-lg-12">
                  <div class="table-responsive">
                    <table class="table table-hover table-sm">
                      <thead>
                        <tr>
                          <th style="width: 100px">{{ $t("index") }}</th>
                          <th style="width: 500px">{{ $t("fullname") }}</th>
                          <th
                            style="width: 100px"
                            v-if="[0, 1, 4, 5].includes(amendment_status)"
                          >
                            {{ $t("action") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(caretaker, index) in caretaker_array"
                          v-bind:key="index"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ caretaker.name }}</td>
                          <td
                            class="text-right"
                            v-if="[0, 1, 4, 5].includes(amendment_status)"
                          >
                            <div
                              class="btn-group-vertical"
                              role="group"
                              aria-label="Vertical button group"
                            >
                              <b-button
                                tag="button"
                                v-if="[0, 1, 4, 5].includes(amendment_status)"
                                class="btn btn-secondary btn-sm"
                                @click="updateCaretaker(caretaker, index)"
                              >
                                {{ $t("update") }}
                              </b-button>
                              <b-button
                                tag="button"
                                v-if="[0, 1, 4].includes(amendment_status)"
                                class="btn btn-danger btn-sm"
                                @click="deleteCaretaker(caretaker.id)"
                              >
                                {{ $t("remove") }}
                              </b-button>
                            </div>
                          </td>
                        </tr>
                        <tr
                          v-if="caretaker_array && caretaker_array.length == 0"
                        >
                          <td class="text-center" colspan="3">
                            <h6 class="mt-5 mb-5">{{ $t("no-data") }}</h6>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <router-link
                v-if="[0, 1].includes(amendment_status)"
                :to="{
                  name: 'pindaan.part_f',
                  params: {
                    wasiat_id: this.wasiat_id,
                  },
                  query: {
                    pengesahan: this.pengesahan,
                  },
                }"
                class="btn btn-primary"
                >{{ $t("save-next") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      ref="modalTambahPenjaga"
      v-bind:title="$t('amendment.keyguardian-info')"
      @ok="hideModal"
      @cancel="hideModalCaretaker"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      :no-enforce-focus="true"
    >
      <div class="card-body">
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.name.$error }"
            >
              <label for>{{ $t("fullname") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                v-uppercase
                name
                v-model.trim="$v.form.name.$model"
                id="name"
                class="form-control"
              />
              <div
                class="form-error"
                v-if="$v.form.name.$error && !$v.form.name.required"
              >
                Nama Penuh tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-star">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.relationship.$error }"
            >
              <label for>{{ $t("relationship") }}</label>
              <span class="text-danger">*</span>
              <select
                name="relationship"
                id="relationship"
                v-model.trim="$v.form.relationship.$model"
                class="form-control"
                @change="changeRelationship($event)"
              >
                <option value>-- {{ $t("choose.relationship") }} --</option>
                <option
                  v-for="relationship in relationships"
                  :key="relationship"
                  :value="relationship"
                >
                  {{ relationship }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.form.relationship.$error && !$v.form.relationship.required
                "
              >
                Hubungan tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.ic_number.$error }"
            >
              <label for>{{ $t("mykad") }}</label>
              <span class="text-danger">*</span>
              <the-mask
                type="text"
                v-model.trim="$v.form.ic_number.$model"
                name
                :mask="['######-##-####']"
                id="ic_number"
                class="form-control"
              />
              <div
                class="form-error"
                v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
              >
                No. MyKad tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
            <div class="form-group">
              <label for>{{ $t("old-ic") }}</label>
              <input
                type="text"
                v-model="form.old_ic_number"
                name
                id="old_ic_number"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.mobile_number.$error }"
            >
              <label for>{{ $t("mobile-no") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                v-model.trim="$v.form.mobile_number.$model"
                name
                id="mobile_number"
                class="form-control"
              />
              <div
                class="form-error"
                v-if="
                  $v.form.mobile_number.$error && !$v.form.mobile_number.numeric
                "
              >
                No. Telefon Bimbit hendaklah dalam bentuk nombor.
              </div>
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
          <div class="col-md-6">
            <div class="form-group">
              <label for>No. Telefon Rumah</label>
              <input
                type="text"
                v-model="form.home_phone_number"
                name
                id="home_phone_number"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.address.$error }"
            >
              <label for>{{ $t("mailing-address") }}</label>
              <span class="text-danger">*</span>
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customCheck1"
                  v-model="form.sameAddress"
                  @change="copyAddress"
                  value="1"
                />
                <label class="custom-control-label" for="customCheck1">
                  {{ $t("amendment.same-address") }}
                </label>
              </div>
              <textarea
                v-uppercase
                class="form-control"
                :readonly="form.sameAddress == 1"
                id="address"
                rows="2"
                v-model.trim="$v.form.address.$model"
              ></textarea>
              <div
                class="form-error"
                v-if="$v.form.address.$error && !$v.form.address.required"
              >
                Alamat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.postcode.$error }"
            >
              <label for="postcode" class="d-block">
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ $t("postcode") }}</span>
                  <span class="text-danger">*</span>
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
              </label>
              <input
                type="text"
                id="postcode"
                class="form-control"
                :readonly="form.sameAddress == 1"
                v-model.lazy.trim="postcode"
              />
              <div
                class="form-error"
                v-if="$v.form.postcode.$error && !$v.form.postcode.required"
              >
                Poskod tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-group">
              <label for="city">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="city"
                class="form-control"
                readonly
                v-model="form.city"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="state">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
                id="state"
                class="form-control"
                readonly
                v-model="form.state"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.mykad.frontUrl.$error }"
            >
              <label
                >{{ $t("mykadcopy-front")
                }}<span class="text-danger">*</span></label
              >
              <div class="card rounded shadow bg-dark">
                <div
                  class="d-flex align-items-center justify-content-center bd-highlight"
                  style="height: 150px"
                >
                  <label
                    v-if="mykad.frontUrl"
                    :style="
                      'background-image: url(' + mykad.frontUrlDisplay + ');'
                    "
                    style="
                      border-radius: 5px;
                      margin-bottom: 0;
                      background-position: center;
                      background-repeat: no-repeat;
                      background-size: cover;
                      height: 100%;
                      width: 100%;
                    "
                    for="upload-photo-1"
                  ></label>
                  <label
                    class="upload-photo-dark text-center"
                    for="upload-photo-1"
                    v-if="!mykad.frontUrl"
                  >
                    <span>{{ $t("choose.mykadfront") }}</span>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    id="upload-photo-1"
                    class="upload-photo-input"
                    accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                    @change="filesChange($event.target.files, 'mykad-front')"
                  />
                </div>
              </div>
              <div
                class="form-error"
                v-if="$v.mykad.frontUrl.$error && !$v.mykad.frontUrl.required"
              >
                Dokumen tidak boleh dibiarkan kosong.
              </div>
              <div class="d-flex justify-content-center">
                <b-button
                  v-if="mykad.frontUrl"
                  class="btn-sm btn-success m-1"
                  @click="openIcFront('front')"
                >
                  {{ $t("view") }}
                </b-button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.mykad.backUrl.$error }"
            >
              <label
                >{{ $t("mykadcopy-back")
                }}<span class="text-danger">*</span></label
              >
              <div class="card rounded shadow bg-dark">
                <div
                  class="d-flex align-items-center justify-content-center bd-highlight"
                  style="height: 150px"
                >
                  <label
                    v-if="mykad.backUrl"
                    :style="
                      'background-image: url(' + mykad.backUrlDisplay + ');'
                    "
                    style="
                      border-radius: 5px;
                      margin-bottom: 0;
                      background-position: center;
                      background-repeat: no-repeat;
                      background-size: cover;
                      height: 100%;
                      width: 100%;
                    "
                    for="upload-photo-2"
                  ></label>
                  <label
                    class="upload-photo-dark text-center"
                    for="upload-photo-2"
                    v-if="!mykad.backUrl"
                  >
                    <span>{{ $t("choose.mykadback") }}</span>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    id="upload-photo-2"
                    class="upload-photo-input"
                    accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                    @change="filesChange($event.target.files, 'mykad-back')"
                  />
                </div>
              </div>
              <div
                class="form-error"
                v-if="$v.mykad.backUrl.$error && !$v.mykad.backUrl.required"
              >
                Dokumen tidak boleh dibiarkan kosong.
              </div>
              <div class="d-flex justify-content-center">
                <b-button
                  v-if="mykad.backUrl"
                  class="btn-sm btn-success m-1"
                  @click="openIcFront('back')"
                >
                  {{ $t("view") }}
                </b-button>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="d-flex justify-content-center">
          <b-button
            v-if="amendment_status == 0"
            class="mt-3"
            variant="outline-danger"
            block
            @click="hideModal"
            >{{ btnText }}</b-button
          >
        </div> -->
      </div>
    </b-modal>
    <b-modal
      ref="modalPostcode"
      class="modal fade"
      :no-enforce-focus="true"
      ok-title="Simpan"
      cancel-title="Batal"
      @ok="savePostcode"
    >
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Tambah Poskod</h5>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label> Poskod </label>
          <input
            type="number"
            class="form-control savePostcode"
            name="userstate"
            v-model.lazy="postcode"
          />
        </div>
        <div class="form-group">
          <label> Bandar </label>
          <input
            type="text"
            class="form-control saveCity"
            name="userstate"
            v-model="post.city"
          />
        </div>
        <div class="form-group">
          <label> Negeri </label>
          <input
            type="text"
            class="form-control saveState"
            name="userstate"
            v-model="post.state"
          />
        </div>
      </div>

      <!-- <div class="modal-footer">
              <button type="button" class="btn btn-danger simpanPostcode">
                Simpan
              </button>
      </div>-->
    </b-modal>
  </div>
</template>
