<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import banks from "utility/banks.json";

export default {
  data() {
    return {
      banks: banks,
      drop: {
        container: null,
      },
      moveableProperty: {
        _method: null,
        wasiat_id: null,
        bank_type: null,
        bank_branch: null,
        bank_account_no: null,
        property_type: null,
        transport_type: null,
        transport_manufacturer: null,
        transport_model: null,
        transport_registration_number: null,
        moveable_id: null, //wasiat_id
        moveable_type: "Wasiat",
        agreement_number: null,
        company_registration_number: null,
        institution_name: null,
        account_number: null,
        policy_number: null,
      },
      amendment_status: null,
      amendment_id: null,
    };
  },
  components: {},
  methods: {
    btnmodalPenerima() {
      this.$refs["modalPenerima"].show();
    },
    hideModal() {
      this.$refs["modalPenerima"].hide();
    },
    onChange(event) {
      // if(event.target.value ="Bank"){
      this.drop.container = event.target.value;
      // }
      console.log(event.target.value);
    },

    registermoveable() {
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

      if (this.moveableProperty.property_type) {
        this.moveableProperty.wasiat_id = this.wasiat_id;
        this.moveableProperty.moveable_id = this.wasiat_id;
        if (this.property_id) {
          this.moveableProperty._method = "PATCH";
          ApiService.post(
            `/moveable-property/${this.property_id}`,
            this.moveableProperty
          )
            .then((response) => {
              var id = response.data.moveable_property.id;
              console.log(response.data.moveable_property.id);
              this.$router.push({
                name: "pindaan.receiver-harta-alih",
                params: {
                  wasiat_id: this.wasiat_id,
                },
                query: {
                  property_id: this.property_id,
                  pengesahan: this.pengesahan,
                },
              });
            })
            .catch((error) => {});
        } else {
          ApiService.post(`/moveable-property`, this.moveableProperty)
            .then((response) => {
              var id = response.data.moveable_property.id;
              // console.log(response.data.moveable_property.id);
              this.$router.push({
                name: "pindaan.receiver-harta-alih",
                params: {
                  wasiat_id: this.wasiat_id,
                },
                query: {
                  property_id: id,
                  pengesahan: this.pengesahan,
                },
              });
            })
            .catch((error) => {});
        }
      } else {
        this.$swal.fire({
          icon: "error",
          html: "Sila pilih jenis harta",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      }
    },
    getPropertyDetails() {
      ApiService.get(
        `/wasiat/${this.wasiat_id}/moveable-property?id=${this.property_id}`
      )
        .then((response) => {
          var data = response.data.moveable_properties.data.filter(
            (item) => item.id == this.property_id
          );
          console.log(data);
          this.drop.container = data[0].property_type;
          this.moveableProperty.property_type = data[0].property_type;
          this.moveableProperty.bank_type = data[0].bank_type;
          this.moveableProperty.bank_branch = data[0].bank_branch;
          this.moveableProperty.bank_account_no = data[0].bank_account_no;
          this.moveableProperty.transport_type = data[0].transport_type;
          this.moveableProperty.transport_manufacturer =
            data[0].transport_manufacturer;
          this.moveableProperty.transport_model = data[0].transport_model;
          this.moveableProperty.transport_registration_number =
            data[0].transport_registration_number;
          this.moveableProperty.institution_name = data[0].institution_name;
          this.moveableProperty.account_number = data[0].account_number;
          this.moveableProperty.policy_number = data[0].policy_number;
          this.moveableProperty.company_registration_number =
            data[0].company_registration_number;
        })
        .catch((error) => {
          console.log("error");
        });
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            console.log("amendmentid", this.amendment_id);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
  },
  mounted() {
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
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "currentUser"]),
  },
  validations() {
    if (this.moveableProperty.property_type == "Saham") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          institution_name: {
            required,
          },
          account_number: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == "Syarikat") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          institution_name: {
            required,
          },
          company_registration_number: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == "Insurans") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          institution_name: {
            required,
          },
          policy_number: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == "Simpanan") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          institution_name: {
            required,
          },
          account_number: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == "Kenderaan") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          transport_type: {
            required,
          },
          transport_manufacturer: {
            required,
          },
          transport_model: {
            required,
          },
          transport_registration_number: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == "Bank") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          bank_type: {
            required,
          },
          bank_branch: {
            required,
          },
          bank_account_no: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == "Syarikat") {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          institution_name: {
            required,
          },
          company_registration_number: {
            required,
          },
        },
      };
    } else if (this.moveableProperty.property_type == null) {
      return {
        moveableProperty: {
          property_type: {
            required,
          },
          institution_name: {
            required,
          },
          account_number: {
            required,
          },
        },
      };
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col-lg-12 col-12 mb-4 mt-4 pb-2">
      <h5 class="text-center" style="text-transform: uppercase">
        {{ $t("amendment.ownership1") }}
      </h5>
      <form class="login-form">
        <div
          class="form-group"
          :class="{ 'has-error': $v.moveableProperty.property_type.$error }"
        >
          <label>Sila pilih jenis harta:</label>
          <span class="text-danger">*</span>
          <select
            class="form-control custom-select"
            @change="onChange($event)"
            v-model.trim="$v.moveableProperty.property_type.$model"
          >
            <option value="">-- Pilih jenis harta --</option>
            <option value="Bank">Bank</option>
            <option value="Kenderaan">Kenderaan</option>
            <option value="Saham">Saham</option>
            <option value="Insurans">Insurans</option>
            <option value="Simpanan">Simpanan</option>
            <option value="Syarikat">Syarikat</option>
          </select>
          <div
            class="form-error"
            v-if="
              $v.moveableProperty.property_type.$error &&
              !$v.moveableProperty.property_type.required
            "
          >
            Sila pilih jenis harta.
          </div>
        </div>
        <div class="card" v-if="drop.container == 'Bank'">
          <div class="card-body">
            <div
              class="form-group"
              :class="{ 'has-error': $v.moveableProperty.bank_type.$error }"
            >
              <label>Jenis bank</label>
              <span class="text-danger">*</span>
              <select
                name=""
                class="form-control"
                v-model.trim="$v.moveableProperty.bank_type.$model"
              >
                <option value="">-- Pilih jenis bank --</option>
                <option
                  v-for="(bank, index) in banks"
                  :value="bank.name"
                  :key="index"
                >
                  {{ bank.name }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.bank_type.$error &&
                  !$v.moveableProperty.bank_type.required
                "
              >
                Sila pilih jenis bank.
              </div>
            </div>
            <div
              class="form-group"
              :class="{ 'has-error': $v.moveableProperty.bank_branch.$error }"
            >
              <input
                type="text"
                v-uppercase
                class="form-control"
                v-model.trim="$v.moveableProperty.bank_branch.$model"
                placeholder="Cawangan Bank*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.bank_branch.$error &&
                  !$v.moveableProperty.bank_branch.required
                "
              >
                Cawangan Bank tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.bank_account_no.$error,
              }"
            >
              <input
                type="text"
                v-uppercase
                class="form-control"
                v-model.trim="$v.moveableProperty.bank_account_no.$model"
                placeholder="No. Akaun*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.bank_account_no.$error &&
                  !$v.moveableProperty.bank_account_no.required
                "
              >
                No. Akaun tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2" v-if="drop.container == 'Kenderaan'">
          <div class="card-body">
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.transport_type.$error,
              }"
            >
              <label>Jenis Kenderaan</label>
              &nbsp;
              <img
                content="Jenis kenderaan adalah seperti: Kereta, motosikal, lori, van,
                  dan lain-lain"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
              <input
                v-model.trim="$v.moveableProperty.transport_type.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Jenis Kenderaan*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.transport_type.$error &&
                  !$v.moveableProperty.transport_type.required
                "
              >
                Jenis Kenderaan tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.transport_manufacturer.$error,
              }"
            >
              <label> Buatan </label> &nbsp;
              <img
                content="Contoh: Proton, Perodua, Honda, Toyota, Yamaha, dan lain-lain"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
              <input
                v-model.trim="$v.moveableProperty.transport_manufacturer.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Buatan*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.transport_manufacturer.$error &&
                  !$v.moveableProperty.transport_manufacturer.required
                "
              >
                Buatan tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.transport_model.$error,
              }"
            >
              <label> Nama Model </label>
              &nbsp;
              <img
                content="Contoh: Viva 850, CR-V 2.0L i-VTEC (A), KRISS AN110F dan lain-lain"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
              <input
                v-model.trim="$v.moveableProperty.transport_model.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Nama Model*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.transport_model.$error &&
                  !$v.moveableProperty.transport_model.required
                "
              >
                Nama Model tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error':
                  $v.moveableProperty.transport_registration_number.$error,
              }"
            >
              <label> No. Pendaftaran</label>

              <input
                v-model.trim="
                  $v.moveableProperty.transport_registration_number.$model
                "
                type="text"
                v-uppercase
                class="form-control"
                placeholder="No. Pendaftaran*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.transport_registration_number.$error &&
                  !$v.moveableProperty.transport_registration_number.required
                "
              >
                No. Pendaftaran tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2" v-if="drop.container == 'Saham'">
          <div class="card-body">
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.institution_name.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.institution_name.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Nama Organisasi*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.institution_name.$error &&
                  !$v.moveableProperty.institution_name.required
                "
              >
                Nama Organisasi tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.account_number.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.account_number.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="No Akaun / No Ahli*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.account_number.$error &&
                  !$v.moveableProperty.account_number.required
                "
              >
                No Akaun / No Ahli tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2" v-if="drop.container == 'Insurans'">
          <div class="card-body">
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.institution_name.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.institution_name.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Nama Organisasi*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.institution_name.$error &&
                  !$v.moveableProperty.institution_name.required
                "
              >
                Nama Organisasi tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.policy_number.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.policy_number.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="No Polisi*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.policy_number.$error &&
                  !$v.moveableProperty.policy_number.required
                "
              >
                No Polisi tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2" v-if="drop.container == 'Simpanan'">
          <div class="card-body">
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.institution_name.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.institution_name.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Nama Organisasi*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.institution_name.$error &&
                  !$v.moveableProperty.institution_name.required
                "
              >
                Nama Organisasi tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.account_number.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.account_number.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="No Akaun / No Ahli*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.account_number.$error &&
                  !$v.moveableProperty.account_number.required
                "
              >
                Nama Organisasi tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2" v-if="drop.container == 'Syarikat'">
          <div class="card-body">
            <div
              class="form-group"
              :class="{
                'has-error': $v.moveableProperty.institution_name.$error,
              }"
            >
              <input
                v-model.trim="$v.moveableProperty.institution_name.$model"
                type="text"
                v-uppercase
                class="form-control"
                placeholder="Nama Organisasi*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.institution_name.$error &&
                  !$v.moveableProperty.institution_name.required
                "
              >
                Nama Organisasi tidak boleh dibiarkan kosong.
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error':
                  $v.moveableProperty.company_registration_number.$error,
              }"
            >
              <input
                v-model.trim="
                  $v.moveableProperty.company_registration_number.$model
                "
                type="text"
                v-uppercase
                class="form-control"
                placeholder="No Pendaftaran Syarikat*"
              />
              <div
                class="form-error"
                v-if="
                  $v.moveableProperty.company_registration_number.$error &&
                  !$v.moveableProperty.company_registration_number.required
                "
              >
                No Pendaftaran Syarikat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <b-button
                @click="registermoveable()"
                v-if="[0, 1, 4].includes(amendment_status)"
                class="btn btn-primary"
                >Simpan & Seterusnya</b-button
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
