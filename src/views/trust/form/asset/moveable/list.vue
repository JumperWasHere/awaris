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
    ...mapGetters(["preference", "trust", "amendment"]),
    trustId() {
      return this.$route.query.trust_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustDetails() {
      return this.trust;
    },
    allowAddProperty() {
      if (this.trustId && [0, 2].includes(this.trust.status)) {
        return true;
      } else if (
        ["1", "2"].includes(this.trust.hibah_type) &&
        this.userRole != "Client"
      ) {
        return false;
      } else if (
        this.amendmentId &&
        !["1", "2"].includes(this.trust.hibah_type)
      ) {
        return true;
      } else {
        return false;
      }
    },
    deletebtnStatus() {
      if (
        this.trust &&
        [0, 1, 2].includes(this.trust.status) &&
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
      ApiService.get(`hibah/${this.trustId}/moveable-property`).then(
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
  <div v-if="trustDetails">
    <div class="text-right mt-5 mr-2 mb-4">
      <router-link
        v-if="allowAddProperty"
        :to="{
          name: 'trust.moveable-property.create',
          query: { trust_id: trustId, amendment_id: amendmentId },
        }"
        class="btn btn-primary btn-sm"
        >+</router-link
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
                    name: 'trust.moveable-property.details',
                    query: {
                      trust_id: trustId,
                      property_id: property.id,
                      amendment_id: amendmentId,
                    },
                  }"
                >
                  {{ index + 1 + ". " + property.property_type }}
                </router-link>
              </strong>
            </div>
            <div class="col-md-6 text-right mb-4">
              <b-button
                v-if="deletebtnStatus"
                @click="deleteProperty(property.id, index)"
                class="btn-sm btn-danger"
              >
                {{ $t("remove") }}
              </b-button>
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
                  name: 'trust.moveable-property.attachment',
                  query: {
                    trust_id: trustId,
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
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust.moveable-property.attachment',
                  query: {
                    trust_id: trustId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
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
              <strong> Nama Organisasi</strong>:
              {{ property.institution_name }}
            </div>
            <!-- <div class="col-md-6">
              <strong> Jumlah Unit </strong>: {{ property.value }}
            </div>
            <div class="col-md-6">
              <strong>No Perjanjian</strong>: {{ property.account_number }}
            </div> -->
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust.moveable-property.attachment',
                  query: {
                    trust_id: trustId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
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
                  name: 'trust.moveable-property.attachment',
                  query: {
                    trust_id: trustId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
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

            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust.moveable-property.attachment',
                  query: {
                    trust_id: trustId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
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
                  name: 'trust.moveable-property.attachment',
                  query: {
                    trust_id: trustId,
                    property_id: property.id,
                    amendment_id: amendmentId,
                  },
                }"
                >{{ property.total_documents }} dokumen</router-link
              >
            </div>
          </div>
          <div class="table-responsive pl-3 mt-3 mb-4">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>#</th>
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
                  <td>
                    <router-link
                      :to="{
                        name: 'trust.moveable-property.receiver',
                        query: {
                          trust_id: trustId,
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
                  <td colspan="4" class="text-center">
                    <h6 class="mt-3 mb-3">Tiada penerima</h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr class="primary" />
      </div>
    </div>
  </div>
</template>