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
    ...mapGetters(["preference", "trust"]),

    trustId() {
      return this.$route.query.trust_id;
    },
    trustDetails() {
      return this.trust;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    allowAddProperty() {
      if (this.trust.hibah_type == 1) {
        if (
          this.preference &&
          this.preference.hibah_single_immoveable_property == 1
        ) {
          if (this.properties && this.properties.length >= 1) {
            return false;
          }
          return true;
        }
        return true;
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.getPropertyList();
  },
  methods: {
    getPropertyList() {
      ApiService.get(`hibah/${this.trustId}/immoveable-property`).then(
        (response) => {
          this.properties = response.data.immoveable_properties.data ?? [];
        }
      );
    },
    deleteProperty(property_id, index) {
      // console.log(property_id);
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
  <div v-if="trustDetails">
    <div class="text-right mt-5 mr-2">
      <router-link
        v-if="(trustId && [0, 1, 2].includes(trust.status)) || amendmentId"
        :to="{
          name: 'trust.immoveable-property.create',
          query: { trust_id: trustId, amendment_id: amendmentId },
        }"
        class="btn btn-primary btn-sm"
        >+</router-link
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
          <b-button
            v-if="(trust && [0, 1, 2].includes(trust.status)) || amendmentId"
            @click="deleteProperty(property.id, index)"
            class="btn-sm btn-danger"
            style="position: absolute; right: 5%; top: 0%"
          >
            Delete
          </b-button>
          <strong>
            <router-link
              :to="{
                name: 'trust.immoveable-property.details',
                query: {
                  trust_id: trustId,
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
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust.immoveable-property.attachment',
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
                        name: 'trust.immoveable-property.receiver',
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
                    <h6 class="mt-3 mb-3">{{ $t("trust.no-beneficiary") }}</h6>
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