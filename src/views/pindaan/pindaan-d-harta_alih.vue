<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      moveable_properties_array: null,
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
    this.getmovableList();
    this.wasiatGetAmendment();
  },
  methods: {
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
    getmovableList() {
      ApiService.get(
        `/wasiat/${this.wasiat_id}/moveable-property?&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
      )
        .then((response) => {
          this.moveable_properties_array =
            response.data.moveable_properties.data ?? [];
          console.log(response.data.moveable_properties.data);
          this.pagination.totalRows = response.data.moveable_properties.total;
        })
        .catch((error) => {});
    },
    deleteHarta(item, index) {
      ApiService.post(`/moveable-property/${item.id}`, { _method: "DELETE" })
        .then((response) => {
          this.moveable_properties_array.splice(index, 1);
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    updateHarta(id) {
      this.$router.push({
        name: "pindaan.form-pindaan-harta-alih",
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
      this.getmovableList();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getmovableList();
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
  <!-- <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0"> -->
  <div>
    <!-- <div class="row d-flex justify-content-end">
      <router-link
        class="btn-sm btn-primary"
        :to="{
          name: 'pindaan.form-pindaan-harta-alih',
          params: {
            wasiat_id: this.wasiat_id,
          },
        }"
        >Tambah Maklumat Harta</router-link
      >
    </div> -->
    <div class="text-right mt-5 mr-2">
      <router-link
        v-if="[0, 1].includes(amendment_status)"
        :to="{
          name: 'pindaan.form-pindaan-harta-alih',
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
          <tbody v-if="moveable_properties_array.length == 0">
            <tr>
              <td colspan="4" class="text-center">
                <h5 class="mt-5">Tiada Data</h5>
              </td>
            </tr>
          </tbody>
          <tbody v-if="moveable_properties_array.length > 0">
            <tr v-for="(item, index) in moveable_properties_array" :key="index">
              <td scope="col">{{ index + 1 }}</td>
              <td scope="col">
                {{
                  item.bank_type
                    ? item.bank_type
                    : item.transport_type
                    ? item.transport_type
                    : item.other_organization_name
                    ? item.other_organization_name
                    : "-"
                }}
              </td>
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
      v-if="moveable_properties_array && moveable_properties_array.length == 0"
    >
      <h5>Tiada harta didaftarkan</h5>
    </div>

    <div class="row">
      <div
        class="col-md-12"
        v-for="(property, index) in moveable_properties_array"
        :key="index"
      >
        <div class="pl-3 pr-3 mt-2">
          <strong>
            <router-link
              :to="{
                name: 'pindaan.form-pindaan-harta-alih',
                params: {
                  wasiat_id: wasiat_id,
                },
                query: {
                  property_id: property.id,
                  pengesahan: pengesahan,
                },
              }"
            >
              {{ index + 1 + ". " + property.property_type }}
            </router-link>
          </strong>
          <div class="row pl-3" v-if="property.property_type == 'Bank'">
            <div class="col-md-6">
              <strong>Jenis Bank</strong>: {{ property.bank_type }}
            </div>
            <div class="col-md-6">
              <strong> Cawangan Bank</strong>:
              {{ property.bank_branch }}
            </div>
            <div class="col-md-6">
              <strong> No Akaun/Ahli</strong>: {{ property.bank_account_no }}
            </div>
            <div class="col-md-6">
              <strong>Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-alih',
                  params: {
                    wasiat_id: wasiat_id,
                  },
                  query: { property_id: property.id, pengesahan: pengesahan },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Kenderaan'">
            <div class="col-md-6">
              <strong>Jenis Kenderaan</strong>: {{ property.transport_type }}
            </div>
            <div class="col-md-6">
              <strong> Buatan</strong>:
              {{ property.transport_manufacturer }}
            </div>
            <div class="col-md-6">
              <strong> Model</strong>: {{ property.transport_model }}
            </div>
            <div class="col-md-6">
              <strong>No. Pendaftaran</strong>:
              {{ property.transport_registration_number }}
            </div>
            <div class="col-md-6">
              <strong>Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-alih',
                  params: {
                    wasiat_id: wasiat_id,
                  },
                  query: { property_id: property.id, pengesahan: pengesahan },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Saham'">
            <div class="col-md-6">
              <strong>No Akaun atau No Ahli</strong>:
              {{ property.account_number }}
            </div>
            <div class="col-md-6">
              <strong> Nama Organisasi </strong>:
              {{ property.institution_name }}
            </div>
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-alih',
                  params: {
                    wasiat_id: wasiat_id,
                  },
                  query: { property_id: property.id, pengesahan: pengesahan },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Syarikat'">
            <div class="col-md-6">
              <strong>No Pendaftaran Syarikat</strong>:
              {{ property.company_registration_number }}
            </div>
            <div class="col-md-6">
              <strong> Nama Organisasi </strong>:
              {{ property.institution_name }}
            </div>

            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-alih',
                  params: {
                    wasiat_id: wasiat_id,
                  },
                  query: { property_id: property.id, pengesahan: pengesahan },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Simpanan'">
            <div class="col-md-6">
              <strong> No Akaun atau No Ahli </strong>:
              {{ property.account_number }}
            </div>
            <div class="col-md-6">
              <strong> Nama Organisasi </strong>:
              {{ property.institution_name }}
            </div>
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-alih',
                  params: {
                    wasiat_id: wasiat_id,
                  },
                  query: { property_id: property.id, pengesahan: pengesahan },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Insurans'">
            <div class="col-md-6">
              <strong>No Polisi</strong>:
              {{ property.policy_number }}
            </div>
            <div class="col-md-6">
              <strong> Nama Organisasi </strong>:
              {{ property.institution_name }}
            </div>
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'pindaan.form-pindaan-dokumen-alih',
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
                  <!-- <td v-if="!pr.receiver_id">
                    {{ pr }}
                  </td> -->
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
