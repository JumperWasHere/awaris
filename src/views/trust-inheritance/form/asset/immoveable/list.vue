<script>
import { GET_HIBAH_BY_ID } from "@/services/store/amanah-pusaka.module";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      properties: null,
      isMounted: false,
    };
  },
  computed: {
    ...mapGetters(["hibah"]),
    hibahId() {
      return this.$route.query.hibah_id ?? null;
    },
    trustDetails() {
      return this.hibah;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  mounted() {
    this.getPropertyList();

    if (this.$route.query.hibah_id) {
       this.$store.dispatch(GET_HIBAH_BY_ID, this.$route.query.hibah_id);
    }
    this.isMounted = true;
  },
  methods: {
    getPropertyList() {
      ApiService.get(`hibah/${this.hibahId}/immoveable-property`).then(
        (response) => {
          this.properties = response.data.immoveable_properties.data ?? [];
        }
      );
    },
    deleteProperty(property_id, index) {
      ApiService.post(`/immoveable-property/${property_id}`, {
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
  filters: {
    fullAddress: function (value) {
      if (value) {
        return String(value.lot_number ? value.lot_number.concat(", ") : "")
          .concat(String(value.address ? value.address.concat(", ") : ""))
          .concat(String(value.district ? value.district.concat(", ") : ""))
          .concat(String(value.city ? value.city.concat(", ") : ""))
          .concat(String(value.state ? value.state.concat(". ") : ""));
      }
      return "-";
    },
  },
};
</script>


<template >
  <div>
    <!-- <div v-if="trustDetails"> -->
    <div class="text-right mt-5 mr-2">
      <router-link
        :to="{
          name: 'trust-inheritance.immoveable-property.create',
          query: {
            hibah_id: hibahId,
          },
        }"
        class="btn btn-primary btn-sm ml-2"
        >+ Harta</router-link
      >
    </div>

    <div class="p-4 text-center" v-if="properties && properties.length == 0">
      <h5>{{ $t("trust.no-prop") }}</h5>
    </div>

    <div class="row">
      <div
        class="col-md-12"
        v-for="(property, index) in properties"
        :key="index"
      >
        <div class="pl-3 pr-3 mt-2">
          <strong>
            <router-link
              :to="{
                name: 'trust-inheritance.immoveable-property.details',
                query: {
                  hibah_id: hibahId,
                  property_id: property.id,
                  amendment_id: amendmentId,
                },
              }"
            >
              {{ index + 1 + ". " + property.category }}
            </router-link>
          </strong>
          <div class="row pl-3">
            <div class="col-md-6">
              <strong>{{ $t("property-type") }}</strong
              >: {{ property.property_type }}
            </div>
            <div class="col-md-6">
              <strong>{{ $t("property-no") }}</strong
              >:
              {{ property.property_no }}
            </div>
            <div class="col-md-6">
              <strong> {{ $t("address") }}</strong
              >: {{ property | fullAddress }}
            </div>
            <!-- <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-inheritance.immoveable-property.attachment',
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
                        name: 'trust-inheritance.immoveable-property.receiver',
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
                    <h6 class="mt-3 mb-3">{{ $t("trust.no-beneficiary") }}</h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="text-right">
          <router-link
            :to="{
              name: 'trust-inheritance.immoveable-property.transaction',
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