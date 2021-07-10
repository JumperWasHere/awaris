<script>
import ApiService from "@/services/api.service";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      amendment_status: null,
      amendment_id: null,
      porperty: {
        wasiat_id: null,
        category: null,
        property_type: null,
        property_no: null,
        state: null,
        city: null,
        district: null,
        address: null,
      },

      register_receiver_data: {
        propertyable_type: "ImmoveableProperty",
        propertyable_id: null,
        receiver_id: null,
        portion: null,
      },
      deleteReceiverData: {
        _method: "DELETE",
        receiver_id: null,
      },
      updateReceiverData: {
        _method: "PATCH",
        receiver_id: null,
        portion: null,
      },
      receiver_array: null,
      receiverProperty: [],
      penerima_ic: null,
      penerima_relationship: null,
      modalbtn: null,
      receiverProperty_id: null,
      index_penerima: null,
    };
  },
  validations: {
    register_receiver_data: {
      receiver_id: {
        required,
      },
      portion: {
        required,
      },
    },
  },
  components: {},
  methods: {
    btnmodalPenerima() {
      this.$v.$reset();
      this.modalbtn = "Daftar";
      this.register_receiver_data.receiver_id = null;
      this.register_receiver_data.portion = null;
      this.penerima_ic = null;
      this.penerima_relationship = null;
      this.$refs["modalPenerima"].show();
    },
    hideModal(bvModalEvt) {
      if (this.modalbtn == "Daftar") {
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
        this.registerReceiver();
      } else if (this.modalbtn == "Kemas Kini") {
        this.updateReceiver();
      }
    },
    hideModalReceiver() {},
    getreceiverlist() {
      ApiService.get(`/wasiat/${this.wasiat_id}/receiver`)
        .then((response) => {
          this.receiver_array = response.data.receivers.data ?? [];
        })
        .catch((error) => {});
    },
    getimmoveablereceiver() {
      ApiService.get(`/immoveable-property/${this.property_id}/receiver`)
        .then((response) => {
          console.log(response.data);
          this.receiverProperty = response.data.receivers.data ?? [];
        })
        .catch((error) => {});
    },
    onChangePenerima(event) {
      var penerima = event.target.value;
      var temp = this.receiver_array.filter((item) => item.id == penerima);
      this.penerima_ic = temp[0].ic_number ?? null;
      this.penerima_relationship = temp[0].relationship ?? null;
      this.receiver_id = temp[0].id ?? null;
    },
    registerReceiver() {
      this.register_receiver_data.propertyable_id = this.property_id;
      console.log(this.register_receiver_data);
      ApiService.post(`/property-receiver`, this.register_receiver_data)
        .then((response) => {
          this.receiverProperty.push(response.data.property_receiver);
          this.$refs["modalPenerima"].hide();
        })
        .catch((error) => {});
    },
    deleteReceiver(id, receiver_id, index) {
      this.deleteReceiverData.receiver_id = receiver_id;
      ApiService.post(`/property-receiver/${id}`, this.deleteReceiverData)
        .then((response) => {
          this.receiverProperty.splice(index, 1);
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    updateReceiverModal(item, index) {
      this.$refs["modalPenerima"].show();
      this.modalbtn = "Kemas Kini";
      this.index_penerima = index;
      this.register_receiver_data.receiver_id = item.receiver.id;
      this.penerima_ic = item.receiver.ic_number;
      this.penerima_relationship = item.receiver.relationship;
      this.register_receiver_data.portion = item.portion;
      this.receiverProperty_id = item.id;
    },
    updateReceiver() {
      this.updateReceiverData.receiver_id = this.register_receiver_data.receiver_id;
      this.updateReceiverData.portion = this.register_receiver_data.portion;

      var id = this.receiverProperty_id;
      ApiService.post(`/property-receiver/${id}`, this.updateReceiverData)
        .then((response) => {
          var data_receiver = response.data.property_receiver;
          console.log(data_receiver);
          this.receiverProperty.splice(this.index_penerima, 1, data_receiver);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    tryapi() {
      ApiService.get(`/immoveable-property/${this.property_id}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {});
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
    // if (this.property_id && this.wasiat_id) {
    if (!this.property_id) {
      this.$router.push({
        name: "pindaan.form-pindaan-harta-tidak-alih",
        params: { wasiat_id: this.wasiat_id },
        query: {
          pengesahan: pengesahan,
        },
      });
    }
    this.porperty.wasiat_id = this.wasiat_id;
    this.getreceiverlist();
    this.getimmoveablereceiver();
    this.wasiatGetAmendment();
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
      <div>
        <div class="row d-flex justify-content-center">
          <h5>MAKLUMAT PENERIMA</h5>
        </div>
        <div class="row d-flex justify-content-end">
          <div class="col-lg-12 d-flex justify-content-end">
            <b-btn
              class="btn-sm btn-primary"
              @click="btnmodalPenerima"
              v-if="[0, 1, 4].includes(amendment_status)"
              >Tambah Penerima</b-btn
            >
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th scope="col">{{ $t("index") }}</th>
                    <th scope="col">{{ $t("name") }}</th>
                    <th scope="col">{{ $t("mykad") }}</th>
                    <th scope="col" class="text-center">
                      {{ $t("relationship") }}
                    </th>
                    <th scope="col" class="text-center">{{ $t("part") }}</th>
                    <th
                      scope="col"
                      class="text-center"
                      v-if="[0, 1, 4].includes(amendment_status)"
                    >
                      {{ $t("action") }}
                    </th>
                  </tr>
                </thead>
                <tbody v-if="this.receiverProperty.length == 0">
                  <tr>
                    <td colspan="6" class="text-center">
                      <h5 class="mt-5">{{ $t("no-info") }}</h5>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="this.receiverProperty.length != 0">
                  <tr v-for="(item, index) in receiverProperty" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.receiver.name }}</td>
                    <td>{{ item.receiver.ic_number }}</td>
                    <td class="text-center">
                      {{ item.receiver.relationship }}
                    </td>
                    <td class="text-center">{{ item.portion }}</td>
                    <td class="text-center">
                      <div
                        class="btn-group-vertical"
                        role="group"
                        aria-label="Vertical button group"
                      >
                        <b-button
                          v-if="[0, 1, 4].includes(amendment_status)"
                          tag="button"
                          class="btn btn-secondary btn-sm"
                          block
                          @click="updateReceiverModal(item, index)"
                        >
                          {{ $t("update") }}
                        </b-button>
                        <b-button
                          tag="button"
                          v-if="[0, 1, 4].includes(amendment_status)"
                          class="btn btn-danger btn-sm"
                          block
                          @click="
                            deleteReceiver(item.id, item.receiver.id, index)
                          "
                        >
                          {{ $t("remove") }}
                        </b-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <b-btn
                class="btn btn-primary"
                v-if="[0, 1, 4].includes(amendment_status)"
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-tidak-alih',
                  params: {
                    wasiat_id: this.wasiat_id,
                  },
                  query: {
                    property_id: this.property_id,
                    pengesahan: pengesahan,
                  },
                }"
                >{{ $t("save-next") }}</b-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      ref="modalPenerima"
      title="Tambah penerima"
      @ok="hideModal"
      @cancel="hideModalReceiver"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
    >
      <div class="card-body">
        <div class="row">
          <div
            class="form-group col-12"
            :class="{
              'has-error': $v.register_receiver_data.receiver_id.$error,
            }"
          >
            <label>Nama Penuh</label>
            <span class="text-danger">*</span>
            <select
              name
              id
              class="form-control"
              v-model.trim="$v.register_receiver_data.receiver_id.$model"
              @change="onChangePenerima($event)"
            >
              <option
                :value="receiver.id"
                v-for="receiver in receiver_array"
                :key="receiver.id"
              >
                {{ receiver.name }}
              </option>
            </select>
            <div
              class="form-error"
              v-if="
                $v.register_receiver_data.receiver_id.$error &&
                !$v.register_receiver_data.receiver_id.required
              "
            >
              Nama Penuh tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label> No. MyKad: {{ this.penerima_ic }} </label>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label>Hubungan: {{ this.penerima_relationship }}</label>
          </div>
        </div>
        <div class="row">
          <div
            class="form-group col-12"
            :class="{ 'has-error': $v.register_receiver_data.portion.$error }"
          >
            <input
              type="text"
              class="form-control"
              placeholder="Bahagian*"
              v-model.trim="$v.register_receiver_data.portion.$model"
            />
            <div
              class="form-error"
              v-if="
                $v.register_receiver_data.portion.$error &&
                !$v.register_receiver_data.portion.required
              "
            >
              Bahagian tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
