<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { TRUST } from "@/services/store/trust.module";
export default {
  data() {
    return {
      properties: null,
      insert_code: null,
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
    async getPropertyListReturn() {
      return await ApiService.get(`hibah/${this.trustId}/moveable-property`)
        .then((response) => {
          this.properties = response.data.moveable_properties.data ?? [];
          console.log(this.properties);
          return response.data.moveable_properties.data ?? [];
        })
        .catch((error) => {
          return null;
        });
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
    async addProperty() {
      // console.log("truts", this.trust);
      var maxProperty = this.trust.one_cent_maximum_moveable_property;
      var totalProperty = await this.getPropertyListReturn();
      // console.log("totalProperty", totalProperty.length);
      console.log(
        "totalProperty",
        totalProperty.length,
        "maxProperty",
        maxProperty
      );
      if (totalProperty.length < maxProperty) {
        this.$router.push({
          name: "trust-onecent.moveable-property.create",
          query: { trust_id: this.trustId, amendment_id: this.amendmentId },
        });
        // this.$refs["modalAddCoupon"].show();
      } else {
        this.$refs["modalAddCoupon"].show();
      }
    },
    async RedeemCode() {
      var vm = this;
      ApiService.get(`/one-cent/hibah-coupon/${this.insert_code}/redeem`)
        .then((response) => {
          this.$refs["modalAddCoupon"].hide();
          this.$store.dispatch(TRUST, this.trustId);
          vm.$notify({
            group: "foo",
            title: response.data.message,
            type: "success",
          });
        })
        .catch((error) => {
          vm.$notify({
            group: "foo",
            title: error.data.message,
            type: "warn",
          });
        });
    },
  },
};
</script>


<template>
  <div v-if="trustDetails">
    <div class="text-right mt-5 mr-2 mb-4">
      <b-button @click="addProperty" class="btn btn-primary btn-sm">+</b-button>
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
                    name: 'trust-onecent.moveable-property.details',
                    query: {
                      trust_id: trustId,
                      property_id: property.id,
                      amendment_id: amendmentId,
                    },
                  }"
                >
                  {{ index + 1 + ". " + property.one_cent_wallet_name }}
                </router-link>
              </strong>
            </div>
            <div class="col-md-6 text-right mb-4">
              <b-button
                v-if="deletebtnStatus"
                @click="deleteProperty(property.id, index)"
                class="btn-sm btn-danger"
              >
                Delete
              </b-button>
            </div>
          </div>
          <div class="row pl-3">
            <div class="col-md-6"><strong>Jenis Akaun</strong>: Simpanan</div>
            <div class="col-md-6">
              <strong>Nama Organisasi</strong>: One Cent
            </div>

            <div class="col-md-6">
              <strong> Username </strong>:
              {{ property.one_cent_username }}
            </div>
            <div class="col-md-6">
              <strong> Wallet Name</strong>:
              {{ property.one_cent_wallet_name }}
            </div>
            <div class="col-md-6">
              <strong> Dokumen</strong>:
              <router-link
                :to="{
                  name: 'trust-onecent.moveable-property.attachment',
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
                        name: 'trust-onecent.moveable-property.receiver',
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
    <b-modal
      ref="modalAddCoupon"
      hide-footer
      centered
      title="Had Kupon"
      :no-enforce-focus="true"
    >
      <div class="d-flex justify-content-center">
        <h6 class="text-center">
          Anda telah mencapai had akaun, sila buat pembelian kupon baharu
        </h6>
      </div>
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          id="coupon"
          required
          v-model="insert_code"
        />
        <div class="input-group-append">
          <button class="btn btn-primary btn-sm" @click="RedeemCode">
            Tebus
          </button>
          <!-- <b-button @click="RedeemCode" class="btn btn-primary"
              >Redeem</b-button
            > -->
        </div>
      </div>
      <!-- <div class="d-flex justify-content-center row">
        <div class="col-lg-7">
          <div class="form-group position-relative mt-4">
            <input
              type="text"
              class="form-control"
              id="coupon"
              required
              v-model="insert_code"
            />
          </div>
        </div>
        <div class="col-lg-2">
          <div class="form-group position-relative mt-4">
            <b-button @click="RedeemCode" class="btn btn-primary"
              >Redeem</b-button
            >
          </div>
        </div>
      </div> -->
    </b-modal>
  </div>
</template>