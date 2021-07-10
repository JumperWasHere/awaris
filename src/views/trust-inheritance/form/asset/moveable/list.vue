<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      properties: null,
    };
  },
  computed: {
    ...mapGetters(["preference", "amendment", "hibah"]),
    hibahId() {
      return this.$route.query.hibah_id ?? null;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    allowAddProperty() {
      if (this.hibahId && [0, 2].includes(this.hibah.status)) {
        return true;
      } else if (
        ["1", "2"].includes(this.hibah.hibah_type) &&
        this.userRole != "Client"
      ) {
        return false;
      } else if (
        this.amendmentId &&
        !["1", "2"].includes(this.hibah.hibah_type)
      ) {
        return true;
      } else {
        return false;
      }
    },
    deletebtnStatus() {
      if (
        this.hibah &&
        [0, 1, 2].includes(this.hibah.status) &&
        !this.amendmentId
      ) {
        return true;
      } else if (
        this.amendmentId &&
        this.amendment &&
        [1, 0].includes(this.amendment.status)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.getPropertyList();
  },
  methods: {
    getPropertyList() {
      ApiService.get(`hibah/${this.hibahId}/moveable-property`).then(
        (response) => {
          this.properties = response.data.moveable_properties.data ?? [];
          console.log(this.properties);
        }
      );
    },
    deleteProperty(property_id, index) {
      // console.log(property_id);
      ApiService.post(`/moveable-property/${property_id}`, {
        _method: "DELETE",
      })
        .then((response) => {
          this.properties.splice(index, 1);
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error");
        });
    },
  },
};
</script>


<template>
  <div>
    <div class="text-right mt-5 mr-2 mb-4">
      <!-- <router-link
        :to="{
          name: 'trust-inheritance.moveable-property.transaction',
          query: {
            hibah_id: hibahId
          },
        }"
        class="btn btn-primary btn-sm"
        >+ Transaksi</router-link
      > -->
      <router-link
        :to="{
          name: 'trust-inheritance.moveable-property.create',
          query: {
            hibah_id: hibahId
          },
        }"
        class="btn btn-primary btn-sm ml-2"
        >+ Harta</router-link
      >
    </div>
    <div class="p-4 text-center" v-if="properties && properties.length == 0">
      <h5>{{ $t("trust.no-prop") }}</h5>
    </div>

    <div class="row" style="position: relative">
      <div
        class="col-md-12"
        v-for="(property, index) in properties"
        :key="index"
      >
        <div class="pl-3 pr-3 mt-2">
          <div class="row">
            <div class="col-md-6">
              <strong>
                <router-link
                  :to="{
                    name: 'trust-inheritance.moveable-property.details',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                >
                  {{ index + 1 + ". " + property.property_type }}
                </router-link>
              </strong>
            </div>
          </div>
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
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.moveable-property.attachment',
                  query: {
                    hibah_id: hibahId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
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
            <!-- <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.moveable-property.attachment',
                  query: {
                    hibah_id: hibahId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div> -->
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Saham'">
            <div class="col-md-6">
              <strong>No Akaun atau No Ahli</strong>:
              {{ property.account_number }}
            </div>
            <div class="col-md-6">
              <strong> Nama Organisasi</strong>:
              {{ property.institution_name }}
            </div>
            <!-- <div class="col-md-6">
              <strong> Jumlah Unit </strong>: {{ property.value }}
            </div>
            <div class="col-md-6">
              <strong>No Perjanjian</strong>: {{ property.account_number }}
            </div> -->
            <!-- <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.moveable-property.attachment',
                  query: {
                    hibah_id: hibahId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div> -->
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
            <!-- <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.moveable-property.attachment',
                  query: {
                    hibah_id: hibahId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div> -->
          </div>
          <div class="row pl-3" v-if="property.property_type == 'Simpanan'">
            <div class="col-md-6">
              <strong>No Akaun atau No Ahli</strong>:
              {{ property.account_number }}
            </div>
            <div class="col-md-6">
              <strong> Nama Organisasi </strong>:
              {{ property.institution_name }}
            </div>
            <!-- <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.moveable-property.attachment',
                  query: {
                    hibah_id: hibahId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div> -->
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
            <!-- <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.moveable-property.attachment',
                  query: {
                    hibah_id: hibahId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div> -->
          </div>
          <div class="table-responsive pl-3 mt-3 mb-4">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ $t("name") }}</th>
                  <th>{{ $t("mykad") }}</th>
                  <th>{{ $t("relationship") }}</th>
                  <th>{{ $t("part") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pr, index2) in property.property_receivers"
                  :key="index2"
                >
                  <td>
                    <router-link
                      :to="{
                        name: 'trust-inheritance.moveable-property.receiver',
                        query: {
                          hibah_id: hibahId,
                          property_id: property.id,
                          amendment_id: amendmentId,
                        },
                      }"
                    >
                      {{ index2 + 1 }}
                    </router-link>
                  </td>
                  <td>{{ pr.receiver.name }}</td>
                  <td>{{ pr.receiver.ic_number }}</td>
                  <td>{{ pr.receiver.relationship }}</td>
                  <td>{{ pr.portion }}</td>
                </tr>
                <tr v-if="property.property_receivers.length == 0">
                  <td colspan="5" class="text-center">
                    <h6 class="mt-3 mb-3">Tiada penerima</h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="text-right">
          <router-link
            :to="{
              name: 'trust-inheritance.moveable-property.transaction',
              query: {
                hibah_id: hibahId,
                property_id: property.id,
              },
            }"
            tag="button"
            class="btn btn-primary btn-sm"
            >+ Transaksi</router-link
          >
          &nbsp;
          <b-button
            v-if="(hibah && [0, 1, 2].includes(hibah.status)) || amendmentId"
            @click="deleteProperty(property.id, index)"
            class="btn-sm btn-danger"
          >
            Buang
          </b-button>
        </div>
        <hr class="primary" />
      </div>
    </div>
  </div>
</template>