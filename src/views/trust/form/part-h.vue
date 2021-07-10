<script>
import componentPengesahanKoperate from "./component/part-h-koperate";
import componentPengesahanBiase from "./component/part-h-koperate";

import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hibah: null,
      amendmentDetails: null,
      isKoperate: null,
      paymethod: null,
      receipt: {
        imageUrl: null,
      },
    };
  },
  components: {
    "part-h-corporation": componentPengesahanKoperate,
    "part-h-normal": componentPengesahanBiase,
  },
  mounted() {
    if (!this.trustId) {
      this.$router.push({
        name: "trust.part-a",
      });
    }
  },
  methods: {
    getPaymentMethod(val) {
      // console.log(val);
      ApiService.get(`/organization/${val.organization_id}`)
        .then((response) => {
          console.log("ORG=", response.data);
          let allow_cash_payment =
            response.data.organization.allow_cash_payment;
          let allow_payment_gateway =
            response.data.organization.allow_payment_gateway;
          if (allow_cash_payment == 1 && allow_payment_gateway == 1) {
            this.paymethod = "both";
          } else {
            this.paymethod = "cash";
          }
        })
        .catch((error) => {});
    },
    async getDocument() {
      ApiService.get(`/hibah/${this.trustId}/document`)
        .then((response) => {
          var filter = response.data.attachments.data.filter(
            (item) => item.type == "payment"
          );
          this.receipt.imageUrl = filter[0].public_path;
          console.log("getDocument", this.receipt.imageUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    trustId() {
      return this.$route.query.trust_id;
    },
    ...mapGetters([
      "isAuthenticated",
      "userAccess",
      "userRole",
      "trust",
      "amendment",
      "userAccess",
    ]),
  },
  watch: {
    trust: {
      handler: function (val) {
        if (val) {
          this.hibah = val;
          if (val.status == -1) {
            this.$router.push({
              name: "trust.part-c",
              query: {
                trust_id: this.trustId,
                amendment_id: this.amendmentId,
              },
            });
          }
          if (["1", "2"].includes(val.hibah_type)) {
            this.isKoperate = true;
            // console.log("upload", this.paymethod);
            this.getDocument();
          } else {
            this.isKoperate = false;
          }
        } else {
          this.isKoperate = false;
        }
      },
    },
    amendment: {
      handler: function (val) {
        if (val) {
          this.amendmentDetails = val;
        }
      },
    },
    userAccess: {
      handler: function (val) {
        if (val) {
          this.getPaymentMethod(val);
        } else {
          this.paymethod = "online";
        }
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0" v-if="trust">
    <!-- {{ amendment.status }} -->
    <part-h-corporation
      :trust="hibah"
      :amendment="amendmentDetails"
      :receiptShow="receipt"
      v-if="isKoperate && hibah"
    />
    <!-- <part-h-normal
      :trust="hibah"
      :amendment="amendmentDetails"
      :paymethod="paymethod"
      v-if="!isKoperate"
    /> -->
  </div>
</template>
