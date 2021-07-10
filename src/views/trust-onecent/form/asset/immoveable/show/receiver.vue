<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
const cloneDeep = require("clone-deep");

export default {
  data() {
    return {
      propertyReceives: null,
      allowAddReceiver: true,
      form: {},
      receivers: null,
      propertyReceivers: null,
      selectedReceiver: {},
      formUpdate: {},
    };
  },
  computed: {
    ...mapGetters(["trust", "preference"]),

    trustId() {
      return this.$route.query.trust_id;
    },
    propertyId() {
      return this.$route.query.property_id;
    },
    AddReceiver() {
      if (this.trust && this.preference) {
        return this.propertyReceivers;
      }
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  watch: {
    AddReceiver: {
      handler: function () {
        console.log("execute");
        if (this.trust && ["1", "2"].includes(this.trust.hibah_type)) {
          console.log("ada trust");
          if (this.preference && this.preference.hibah_single_heir == 1) {
            console.log("blh add heir");
            if (this.propertyReceivers && this.propertyReceivers.length >= 1) {
              console.log("x add heir");
              this.allowAddReceiver = false;
              console.log(this.allowAddReceiver);
            } else {
              console.log("blh add heir sbb x ckp");
              this.allowAddReceiver = true;
            }
          }
        } else {
          this.allowAddReceiver = true;
        }
      },
    },
  },
  mounted() {
    this.getReceivers();
    this.getPropertyReceivers();
  },
  methods: {
    getReceivers() {
      ApiService.get(`hibah/${this.trustId}/receiver`).then((response) => {
        this.receivers = response.data.receivers.data ?? [];
      });
    },
    getPropertyReceivers() {
      ApiService.get(`immoveable-property/${this.propertyId}/receiver`).then(
        (response) => {
          this.propertyReceivers = response.data.receivers.data ?? [];
        }
      );
    },
    createPropertyReceiver() {
      this.form.propertyable_id = this.propertyId;
      this.form.propertyable_type = "ImmoveableProperty";
      ApiService.post(`property-receiver`, this.form).then((response) => {
        this.getPropertyReceivers();
        this.form = {};
      });
    },
    onSelectedReceiver(event) {
      console.log(event.target.selectedIndex);
      this.selectedReceiver = this.receivers[event.target.selectedIndex - 1];
    },
    showUpdateModal(pr) {
      this.formUpdate = cloneDeep(pr);
      this.$refs["showUpdateModal"].show();
    },
    removePropertyReceiver(pr) {
      ApiService.post(`property-receiver/${pr.id}`, {
        _method: "DELETE",
      }).then((response) => {
        this.getPropertyReceivers();
      });
    },
    updatePropertyReceiver() {
      this.formUpdate._method = "PATCH";
      ApiService.post(
        `property-receiver/${this.formUpdate.id}`,
        this.formUpdate
      ).then((response) => {
        this.getPropertyReceivers();
      });
    },
  },
};
</script>


<template>
  <div>
    <div class="text-right mt-3" v-if="AddReceiver">
      <button
        v-b-modal.modal
        class="btn btn-primary btn-sm"
        v-if="
          (allowAddReceiver && [0, 1, 2].includes(trust.status)) || amendmentId
        "
      >
        Tambah Baru
      </button>
    </div>
    <div class="table-responsive mt-3 mb-5">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Bil.</th>
            <th>Nama</th>
            <th>MyKad</th>
            <th>Hubungan</th>
            <th>Bahagian</th>
            <th>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pr, index) in propertyReceivers" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pr.receiver.name }}</td>
            <td>{{ pr.receiver.ic_number }}</td>
            <td>{{ pr.receiver.relationship }}</td>
            <td>{{ pr.portion }}</td>
            <td class="text-right">
              <div
                class="btn-group-vertical"
                role="group"
                aria-label="Vertical button group"
                v-if="[0, 1, 2].includes(trust.status) || amendmentId"
              >
                <button
                  @click="showUpdateModal(pr)"
                  class="btn btn-secondary btn-sm"
                >
                  Kemaskini
                </button>
                <button
                  @click="removePropertyReceiver(pr)"
                  class="btn btn-danger btn-sm"
                >
                  Buang
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="propertyReceivers && propertyReceivers.length == 0">
            <td colspan="6" class="text-center">
              <h5 class="pt-5 pb-5">Tiada Data</h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal
      id="modal"
      title="Tambah Penerima Akaun"
      ok-title="Simpan"
      cancel-title="Batal"
      @ok="createPropertyReceiver"
    >
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-md-6">
            <label for="receiver_id">
              Penerima
              <img
                content="Jika penerima tidak tersenarai, sila daftarkan terlebih dahulu di Bahagian C"
                v-tippy
                height="15"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </label>
            <select
              name=""
              id=""
              class="form-control"
              v-model="form.receiver_id"
              @change="onSelectedReceiver($event)"
            >
              <option value=""></option>
              <option
                :value="receiver.id"
                v-for="(receiver, index) in receivers"
                :key="index"
              >
                {{ receiver.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="row" v-if="form.receiver_id">
          <div class="col-md-6 form-group">
            <label for="">MyKad</label>
            <p class="form-control-static">{{ selectedReceiver.ic_number }}</p>
          </div>
          <div class="col-md-6 form-group">
            <label for="">Hubungan</label>
            <p class="form-control-static">
              {{ selectedReceiver.relationship }}
            </p>
          </div>
          <div class="col-md-6 form-group">
            <label for="">Bahagian</label>
            <input type="text" class="form-control" v-model="form.portion" />
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      id="showUpdateModal"
      ref="showUpdateModal"
      title="Kemaskini Penerima Akaun"
      ok-title="Simpan"
      cancel-title="Batal"
      @ok="updatePropertyReceiver"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="">MyKad</label>
            <p class="form-control-static" v-if="formUpdate.receiver">
              {{ formUpdate.receiver.ic_number }}
            </p>
          </div>
          <div class="col-md-6 form-group">
            <label for="">Hubungan</label>
            <p class="form-control-static" v-if="formUpdate.receiver">
              {{ formUpdate.receiver.relationship }}
            </p>
          </div>
          <div class="col-md-6 form-group">
            <label for="">Bahagian</label>
            <input
              type="text"
              class="form-control"
              v-model.lazy="formUpdate.portion"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>