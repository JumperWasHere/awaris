<script>
import ApiService from "@/services/api.service";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      property: {
        _method: null,
        category: null,
        property_type: null,
        property_no: null,
        state: null,
        lot_number: null,
        city_type: null,
        city: null,
        district: null,
        address: null,
        property_portion: null,
        immoveable_id: null,
        immoveable_type: "Wasiat",
      },
      form: {
        reciver: null,
      },
      register_receiver_data: {
        propertyable_type: null,
        propertyable_id: null,
        receiver_id: null,
        portion: null,
      },
      receiver_array: null,
      penerima_ic: null,
      penerima_relationship: null,
      amendment_status: null,
      amendment_id: null,
    };
  },
  validations: {
    property: {
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
      property_portion: {
        required,
      },
    },
  },
  components: {},
  methods: {
    btnmodalPenerima() {
      this.$refs["modalPenerima"].show();
    },
    hideModal() {
      this.$refs["modalPenerima"].hide();
    },
    registerImmoveableProperty() {
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
      this.property.immoveable_id = parseInt(this.wasiat_id);
      var query = `/immoveable-property`;
      if (this.property_id) {
        this.property._method = "PATCH";
        query = `/immoveable-property/${this.property_id}`;
      }
      console.log(this.property);
      ApiService.post(query, this.property)
        .then((response) => {
          var temp = response.data.immoveable_property;
          this.register_receiver_data.propertyable_type = temp.property_type;
          this.register_receiver_data.propertyable_id = temp.id;
          this.$router.push({
            name: "pindaan.receiver-harta-tidak-alih",
            params: {
              wasiat_id: this.wasiat_id,
            },
            query: {
              property_id: temp.id,
              pengesahan: this.pengesahan,
            },
          });
        })
        .catch((error) => {
          console.log("error");
        });
    },
    getreceiverlist() {
      ApiService.get(`/wasiat/${this.wasiat_id}/receiver`)
        .then((response) => {
          this.receiver_array = response.data.receivers.data ?? [];
        })
        .catch((error) => {});
    },
    onChangePenerima(event) {
      var penerima = event.target.value;
      var temp = this.receiver_array.filter((item) => item.id == penerima);
      this.penerima_ic = temp[0].ic_number ?? null;
      this.penerima_relationship = temp[0].relationship ?? null;
    },
    registerReceiver() {
      ApiService.post(`/property-receiver`, this.register_receiver_data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {});
    },
    getPropertyDetails() {
      ApiService.get(
        `/wasiat/${this.wasiat_id}/immoveable-property?id=${this.property_id}`
      )
        .then((response) => {
          var data = response.data.immoveable_properties.data.filter(
            (item) => item.id == this.property_id
          );
          this.property.category = data[0].category;
          this.property.property_type = data[0].property_type;
          this.property.property_no = data[0].property_no;
          this.property.state = data[0].state;
          this.property.city = data[0].city;
          this.property.city_type = data[0].city_type;
          this.property.district = data[0].district;
          this.property.address = data[0].address;
          this.property.lot_number = data[0].lot_number;
          this.property.property_portion = data[0].property_portion;
        })
        .catch((error) => {});
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            console.log("amendmentid", this.amendment_id);
          }
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.property.wasiat_id = this.wasiat_id;
    this.getreceiverlist();
    this.wasiatGetAmendment();
    if (this.property_id) {
      this.getPropertyDetails();
    }
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    property_id() {
      return this.$route.query.property_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
};
</script>

<template>
  <div class="row">
    <div class="col-lg-12 col-12 mb-4 mt-4 pb-2">
      <h5 class="text-center" style="text-transform: uppercase">
        {{ $t("amendment.ownership2") }}
      </h5>
      <form class="login-form">
        <div class="row d-flex justify-content-center">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.category.$error }"
            >
              <label>{{ $t("category") }}</label>
              <span class="text-danger">*</span>
              <select
                name=""
                class="form-control"
                v-model.trim="$v.property.category.$model"
              >
                <option value="Sebidang Tanah">Sebidang Tanah</option>
                <option value="Sebuah Bangunan">Sebuah Bangunan</option>
                <option value="Hak Milik Strata">Hak Milik Strata</option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.property.category.$error && !$v.property.category.required
                "
              >
                Kategori tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.property_type.$error }"
            >
              <label for="">{{ $t("property-type") }}</label>
              <span class="text-danger">*</span>
              <select
                name=""
                class="form-control"
                v-model.trim="$v.property.property_type.$model"
              >
                <option value="Geran">Geran (Geran)</option>
                <option value="Pajakan Negeri">Pajakan Negeri (PN)</option>
                <option value="Gerai Mukim">Gerai Mukim (GM)</option>
                <option value="Pajakan Mukim">Pajakan Mukim (PM)</option>
                <option value="Hak Milik Sementara Daerah">
                  Hak Milik Sementara Daerah (HSD)
                </option>
                <option value="Hak Milik Sementara Mukim">
                  Hak Milik Sementara Mukim (HSM)
                </option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.property.property_type.$error &&
                  !$v.property.property_type.required
                "
              >
                Jenis Hak Milik tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.property_no.$error }"
            >
              <label>{{ $t("property-no") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                name=""
                class="form-control"
                v-model.trim="$v.property.property_no.$model"
              />
              <div
                class="form-error"
                v-if="
                  $v.property.property_no.$error &&
                  !$v.property.property_no.required
                "
              >
                No. Hak Milik tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.lot_number.$error }"
            >
              <label>{{ $t("lot-no") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                name=""
                class="form-control"
                v-model.trim="$v.property.lot_number.$model"
              />
              <div
                class="form-error"
                v-if="
                  $v.property.lot_number.$error &&
                  !$v.property.lot_number.required
                "
              >
                No. Lot tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.city_type.$error }"
            >
              <label for=""
                >{{ $t("city") }} / {{ $t("town") }} /
                {{ $t("subdistrict") }}</label
              >
              <span class="text-danger">*</span>
              <select
                name=""
                class="form-control"
                v-model.trim="$v.property.city_type.$model"
              >
                <option value="Bandar">Bandar</option>
                <option value="Pekan">Pekan</option>
                <option value="Mukim">Mukim</option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.property.city_type.$error &&
                  !$v.property.city_type.required
                "
              >
                Pilihan ini tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.city.$error }"
            >
              <label for=""
                >{{ $t("city") }} / {{ $t("town") }} /
                {{ $t("subdistrict") }}</label
              >
              <span class="text-danger">*</span>
              <input
                type="text"
                v-uppercase
                name=""
                class="form-control"
                v-bind:placeholder="$t('please-state')"
                v-model.trim="$v.property.city.$model"
              />
              <div
                class="form-error"
                v-if="$v.property.city.$error && !$v.property.city.required"
              >
                Bandar / Pekan / Mukim tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-star">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.district.$error }"
            >
              <label>{{ $t("district") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                v-uppercase
                name=""
                class="form-control"
                v-model.trim="$v.property.district.$model"
              />
              <div
                class="form-error"
                v-if="
                  $v.property.district.$error && !$v.property.district.required
                "
              >
                Daerah tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.state.$error }"
            >
              <label for="">{{ $t("state") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                v-uppercase
                name=""
                class="form-control"
                v-model.trim="$v.property.state.$model"
              />
              <div
                class="form-error"
                v-if="$v.property.state.$error && !$v.property.state.required"
              >
                Negeri tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.property_portion.$error }"
            >
              <label for="">{{ $t("part") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                v-uppercase
                name=""
                class="form-control"
                v-model.trim="$v.property.property_portion.$model"
              />
              <div
                class="form-error"
                v-if="
                  $v.property.property_portion.$error &&
                  !$v.property.property_portion.required
                "
              >
                Bahagian tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
            <div
              class="form-group"
              :class="{ 'has-error': $v.property.address.$error }"
            >
              <label for="">{{ $t("address") }}</label>
              <span class="text-danger">*</span>
              <textarea
                v-uppercase
                class="form-control"
                rows="2"
                v-model.trim="$v.property.address.$model"
              >
              </textarea>
              <div
                class="form-error"
                v-if="
                  $v.property.address.$error && !$v.property.address.required
                "
              >
                Alamat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <b-button
            v-if="[0, 1, 4].includes(amendment_status)"
            class="btn btn-primary"
            @click="registerImmoveableProperty"
          >
            {{ $t("trust.save-prop") }}
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>
