<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { required } from "vuelidate/lib/validators";
export default {
  name: "HibahPartA",
  data() {
    return {
      wasiat: null,
      form: {
        category: "",
        property_type: "",
        immoveable_type: "Hibah",
        property_no: "",
        state: "",
        city: "",
        district: "",
        lot_number: "",
        address: "",
        city_type: "",
      },
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
    };
  },
  validations: {
    form: {
      category: {
        required,
      },
      property_type: {
        required,
      },
      property_no: {
        required,
      },
      state: {
        required,
      },
      city: {
        required,
      },
      district: {
        required,
      },
      lot_number: {
        required,
      },
      address: {
        required,
      },
      city_type: {
        required,
      },
    },
  },
  mounted() {},
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
    async submitForm() {
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
      ApiService.post(
        `hibah/${this.hibahId}/immoveable-property`,
        this.form
      ).then((response) => {
        var propertyId = response.data.immoveable_property.id;
        this.$router.push({
          name: "trust-inheritance.immoveable-property.receiver",
          query: {
            hibah_id: this.hibahId,
            message: "saved",
            property_id: propertyId,
            amendment_id: amendmentId,
          },
        });
      });
    },
    filesChange(files, type) {
      const formData = new FormData();
      formData.append("document", files[0], "nama file");
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
      }
    },
  },
  computed: {
    hibahId() {
      return this.$route.query.hibah_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  components: { TheMask },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-md-12">
        <router-link
          class="d-flex align-items-center"
          :to="{
            name: 'trust-inheritance.property.immoveable',
            query: {
              hibah_id: hibahId,
            },
          }"
        >
          <img src="/images/icon/left-arrow.png" height="20" alt="" />
          <p
            class="m-0"
            style="padding-left: 10px; padding-top: 2px; display: inline-block"
          >
            Kembali ke Harta Tidak Alih
          </p>
        </router-link>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2 mt-3">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">{{ $t("trust.prop-info") }}</h5>
            <div class="row mt-4">
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.category.$error }"
                >
                  <label for="home_phone_number">{{ $t("category") }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name=""
                    id=""
                    class="form-control"
                    v-model.trim="$v.form.category.$model"
                  >
                    <option value="">- Pilih Kategori -</option>
                    <option value="Sebidang Tanah">Sebidang Tanah</option>
                    <option value="Sebuah Bangunan">Sebuah Bangunan</option>
                    <option value="Hakmilik Strata">Hak Milik Strata</option>
                  </select>
                  <div
                    class="form-error"
                    v-if="$v.form.category.$error && !$v.form.category.required"
                  >
                    Kategori tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.property_type.$error }"
                >
                  <label for="home_phone_number">{{
                    $t("property-type")
                  }}</label>
                  <span class="text-danger">*</span>
                  <select
                    name=""
                    class="form-control"
                    v-model.trim="$v.form.property_type.$model"
                  >
                    <option value="">-- {{ $t("choose.category") }} --</option>
                    <option value="Geran (Geran)">Geran (Geran)</option>
                    <option value="Pajakan Negeri (PN)">
                      Pajakan Negeri (PN)
                    </option>
                    <option value="Geran Mukim (GM)">Geran Mukim (GM)</option>
                    <option value="Pajakan Mukim (PM)">
                      Pajakan Mukim (PM)
                    </option>
                    <option value="Hakmilik Sementara Daerah (PSD)">
                      Hak Milik Sementara Daerah (PSD)
                    </option>
                    <option value="Hakmilik Sementara Mukim (PSM)">
                      Hak Milik Sementara Mukim (PSM)
                    </option>
                  </select>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.property_type.$error &&
                      !$v.form.property_type.required
                    "
                  >
                    Jenis Hak Milik tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.property_no.$error }"
                >
                  <label for="">{{ $t("property-no") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="$v.form.property_no.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.property_no.$error &&
                      !$v.form.property_no.required
                    "
                  >
                    No. Hak Milik tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.lot_number.$error }"
                >
                  <label for="">{{ $t("lot-no") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="$v.form.lot_number.$model"
                  />
                  <div
                    class="form-error"
                    v-if="
                      $v.form.lot_number.$error && !$v.form.lot_number.required
                    "
                  >
                    No. Lot tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.city_type.$error }"
                >
                  <label for=""
                    >{{ $t("city") }} / {{ $t("town") }} /
                    {{ $t("subdistrict") }}</label
                  >
                  <span class="text-danger">*</span>
                  <select
                    name=""
                    class="form-control"
                    v-model.trim="$v.form.city_type.$model"
                  >
                    <option value="Bandar">Bandar</option>
                    <option value="Pekan">Pekan</option>
                    <option value="Mukim">Mukim</option>
                  </select>
                  <div
                    class="form-error"
                    v-if="
                      $v.form.city_type.$error && !$v.form.city_type.required
                    "
                  >
                    Bandar / Pekan / Mukim tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.city.$error }"
                >
                  <label for=""
                    >{{ $t("city") }} / {{ $t("town") }} /
                    {{ $t("subdistrict") }}</label
                  >
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    v-uppercase
                    class="form-control"
                    v-bind:placeholder="$t('please-state')"
                    v-model.trim="$v.form.city.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.city.$error && !$v.form.city.required"
                  >
                    Bandar / Pekan / Mukim tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.district.$error }"
                >
                  <label for="">{{ $t("district") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    v-uppercase
                    class="form-control"
                    v-model.trim="$v.form.district.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.district.$error && !$v.form.district.required"
                  >
                    Daerah tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.state.$error }"
                >
                  <label for="">{{ $t("state") }}</label>
                  <span class="text-danger">*</span>
                  <input
                    type="text"
                    v-uppercase
                    class="form-control"
                    v-model.trim="$v.form.state.$model"
                  />
                  <div
                    class="form-error"
                    v-if="$v.form.state.$error && !$v.form.state.required"
                  >
                    Negeri tidak boleh dibiarkan kosong.
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div
                  class="form-group"
                  :class="{ 'has-error': $v.form.address.$error }"
                >
                  <label for="">{{ $t("address") }}</label>
                  <span class="text-danger">*</span>
                  <textarea
                    v-uppercase
                    class="form-control"
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
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <button type="button" @click="submitForm" class="btn btn-primary">
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
</template>
