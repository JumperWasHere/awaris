<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      type: "Bank",
      form: {},
      property: {},
    };
  },
  computed: {
    ...mapGetters(["hibah"]),

    hibahId() {
      return this.$route.query.hibah_id ?? null;
    },
    propertyId() {
      return this.$route.query.property_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  mounted() {
    this.getProperty();
  },
  methods: {
    getProperty() {
      ApiService.get(`immoveable-property/${this.propertyId}`).then(
        (response) => {
          this.property = response.data.immoveable_property ?? {};
          this.form = this.property;
        }
      );
    },
    updateDetails() {
      this.form._method = "PATCH";
      ApiService.post(`moveable-property/${this.propertyId}`, this.form).then(
        (response) => {
          this.$notify({
            group: "foo",
            title: "Aset telah berjaya dikemaskini.",
            duration: 5000,
            type: "success",
          });
        }
      );
    },
  },
};
</script>


<template>
  <div class="card-body">
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="form-group">
          <label for="home_phone_number">Kategori</label>
          <select
            name=""
            id=""
            class="form-control"
            v-model="form.category"
            :disabled="![0, 1, 2].includes(hibah.status) || !amendmentId"
          >
            <option value="">- Pilih Kategori -</option>
            <option value="Sebidang Tanah">Sebidang Tanah</option>
            <option value="Sebuah Bangunan">Sebuah Bangunan</option>
            <option value="Hakmilik Strata">Hak Milik Strata</option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="home_phone_number">Jenis Harta Milik</label>
          <select
            name=""
            id=""
            class="form-control"
            v-model="form.property_type"
            :disabled="![0, 1, 2].includes(hibah.status) || !amendmentId"
          >
            <option value="">- Pilih Kategori -</option>
            <option value="Geran (Geran)">Geran (Geran)</option>
            <option value="Pajakan Negeri (PN)">Pajakan Negeri (PN)</option>
            <option value="Geran Mukim (GM)">Geran Mukim (GM)</option>
            <option value="Pajakan Mukim (PM)">Pajakan Mukim (PM)</option>
            <option value="Hakmilik Sementara Daerah (PSD)">
              Hak Milik Sementara Daerah (PSD)
            </option>
            <option value="Hakmilik Sementara Mukim (PSM)">
              Hak Milik Sementara Mukim (PSM)
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-6 form-group">
        <label for="">No. Hak Milik</label>
        <input
          type="text"
          class="form-control"
          v-model="form.property_no"
          :readonly="![0, 1, 2].includes(hibah.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">Negeri</label>
        <input
          type="text"
          class="form-control"
          v-model="form.state"
          :readonly="![0, 1, 2].includes(hibah.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">Daerah</label>
        <input
          type="text"
          class="form-control"
          v-model="form.district"
          :readonly="![0, 1, 2].includes(hibah.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">Bandar</label>
        <input
          type="text"
          class="form-control"
          v-model="form.city"
          :readonly="![0, 1, 2].includes(hibah.status) || !amendmentId"
        />
      </div>
      <div class="col-md-6 form-group">
        <label for="">No. Lot</label>
        <input
          type="text"
          class="form-control"
          v-model="form.lot_number"
          :readonly="![0, 1, 2].includes(hibah.status) || !amendmentId"
        />
      </div>
      <div class="col-md-12 form-group">
        <label for="">Alamat</label>
        <input
          type="text"
          class="form-control"
          v-model="form.address"
          :readonly="![0, 1, 2].includes(hibah.status) || !amendmentId"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 text-right">
        <button
          type="button"
          @click="updateDetails"
          class="btn btn-primary"
          v-if="[0, 1, 2].includes(hibah.status) || amendmentId"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>