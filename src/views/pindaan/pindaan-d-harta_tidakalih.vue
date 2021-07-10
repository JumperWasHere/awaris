<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      immoveable_properties_array: null,
      amendment_status: null,
      amendment_id: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  components: {},
  mounted() {
    this.getimmovableList();
    this.wasiatGetAmendment();
  },
  methods: {
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
    getimmovableList() {
      ApiService.get(
        `/wasiat/${this.wasiat_id}/immoveable-property?&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
      )
        .then((response) => {
          this.immoveable_properties_array =
            response.data.immoveable_properties.data ?? [];
          console.log(response.data.immoveable_properties.data);
          this.pagination.totalRows = response.data.immoveable_properties.total;
        })
        .catch((error) => {});
    },
    deleteHarta(item, index) {
      ApiService.post(`/immoveable-property/${item.id}`, { _method: "DELETE" })
        .then((response) => {
          this.immoveable_properties_array.splice(index, 1);
          console.log(response.data);
        })
        .catch((error) => {});
    },
    updateHarta(id) {
      this.$router.push({
        name: "pindaan.form-pindaan-harta-tidak-alih",
        params: {
          wasiat_id: this.wasiat_id,
        },
        query: {
          property_id: id,
          pengesahan: this.pengesahan,
        },
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getimmovableList();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getimmovableList();
    },
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
};
</script>

<template>
  <div>
    <div class="text-right mt-5 mr-2">
      <router-link
        v-if="[0, 1].includes(amendment_status)"
        :to="{
          name: 'pindaan.form-pindaan-harta-tidak-alih',
          params: {
            wasiat_id: this.wasiat_id,
          },
          query: {
            pengesahan: pengesahan,
          },
        }"
        class="btn btn-primary btn-sm"
        >Tambah Maklumat Harta</router-link
      >
    </div>
    <!-- <div class="row mt-3">
      <div class="table-responsive">
        <table class="table table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">Bil</th>
              <th scope="col">Jenis / No.Pemilik / Bahagian Di Geran</th>
              <th scope="col">Nama</th>

              <th scope="col">Tindakan</th>
            </tr>
          </thead>
          <tbody v-if="immoveable_properties_array.length == 0">
            <tr>
              <td colspan="4" class="text-center">
                <h5 class="mt-5">Tiada Data</h5>
              </td>
            </tr>
          </tbody>
          <tbody v-if="immoveable_properties_array.length > 0">
            <tr
              v-for="(item, index) in immoveable_properties_array"
              :key="index"
            >
              <td scope="col">{{ index + 1 }}</td>
              <td scope="col">{{ item.property_no }}</td>
              <td scope="col">{{ item.category }}</td>

              <td scope="col d-flex justify-content-around">
                <b-btn
                  class="btn-sm btn-primary"
                  @click="updateHarta(item.id)"
                  block
                  >Lihat</b-btn
                >
                <b-btn
                  v-if="amendment_status == 0"
                  class="btn-sm btn-danger"
                  block
                  @click="deleteHarta(item, index)"
                  >Buang</b-btn
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
    <div
      class="p-4 text-center"
      v-if="
        immoveable_properties_array && immoveable_properties_array.length == 0
      "
    >
      <h5>Tiada harta didaftarkan</h5>
    </div>
    <div class="row">
      <div
        class="col-md-12"
        v-for="(property, index) in immoveable_properties_array"
        :key="index"
      >
        <div class="pl-3 pr-3 mt-2">
          <strong>
            <router-link
              :to="{
                name: 'pindaan.form-pindaan-harta-tidak-alih',
                params: {
                  wasiat_id: wasiat_id,
                },
                query: {
                  property_id: property.id,
                  pengesahan: pengesahan,
                },
              }"
            >
              {{ index + 1 + ". " + property.category }}
            </router-link>
          </strong>
          <div class="row pl-3">
            <div class="col-md-6">
              <strong>Jenis Harta Milik</strong>: {{ property.property_type }}
            </div>
            <div class="col-md-6">
              <strong> No. Hak Milik</strong>:
              {{ property.property_no }}
            </div>
            <div class="col-md-6">
              <strong> Alamat</strong>: {{ property.address }}
            </div>
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-tidak-alih',
                  params: {
                    wasiat_id: wasiat_id,
                  },
                  query: { property_id: property.id, pengesahan: pengesahan },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="table-responsive mt-3 mb-4">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>MyKad</th>
                  <th>Hubungan</th>
                  <th>Bahagian</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pr, index2) in property.property_receivers"
                  :key="index2"
                >
                  <td>{{ pr.receiver.name }}</td>
                  <td>{{ pr.receiver.ic_number }}</td>
                  <td>{{ pr.receiver.relationship }}</td>
                  <td>{{ pr.portion }}</td>
                </tr>
                <tr v-if="property.property_receivers.length == 0">
                  <td colspan="4" class="text-center">
                    <h6 class="mt-3 mb-3">Tiada penerima</h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="d-flex justify-content-end"
          v-if="[0, 1, 4].includes(amendment_status)"
        >
          <b-button
            class="btn-sm btn-danger"
            @click="deleteHarta(property, index)"
            >Buang</b-button
          >
        </div>
        <hr class="primary" />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-8">
        <b-pagination
          v-model="pagination.currentPage"
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
          @change="pageClicks"
          aria-controls="my-table"
        ></b-pagination>
      </div>
      <div class="col-md-4">
        <div class="form custom-form">
          <div class="form-group mb-0">
            <select
              v-model="pagination.perPage"
              class="form-control custom-select"
              id="Sortbylist-job"
              @change="changePerPage()"
            >
              <option value="10">10 {{ $t("per-page") }}</option>
              <option value="25">25 {{ $t("per-page") }}</option>
              <option value="50">50 {{ $t("per-page") }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
