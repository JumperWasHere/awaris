<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        product: "Wasiat",
        // product: null,
        price: null,
        description: null,
        amendment_price: null,
        awaris_share: null,
        prooffice_share: null,
        organization_share: null,
        others_share: null,
        others_description: null,
        amendment_awaris_share: null,
        amendment_prooffice_share: null,
        amendment_organization_share: null,
        status: 1,
      },
    };
  },
  props: {
    organization: {
      type: Object,
    },
  },
  methods: {
    savePricing() {
      this.form.organization_id = this.organizationId;
      this.form.awaris_percentage =
        (this.form.awaris_share * 100) / this.form.price;
      this.form.organization_percentage =
        (this.form.organization_share * 100) / this.form.price;
      this.form.prooffice_percentage =
        (this.form.prooffice_share * 100) / this.form.price;
      this.form.others_percentage =
        (this.form.others_share * 100) / this.form.price;

      ApiService.post(`pricing`, this.form).then((response) => {
        this.$router.push({
          name: "organization.pricing",
          params: { organization_id: this.organizationId },
        });
      });
    },
    back() {
      this.$router.push({
        name: "organization.pricing",
        params: { organization_id: this.organizationId },
      });
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userRole"]),
    organizationId() {
      return this.$route.params.organization_id;
    },
    organizationType() {
      return this.organization.type;
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("product") }}</label>
        <select
          name="product_pricing"
          id="product_pricing"
          class="form-control"
          v-model="form.product"
        >
          <option value="Wasiat">Wasiat</option>
          <option value="Hibah">Hibah</option>
        </select>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Wasiat'">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("org.nav3") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.price" />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Deskripsi</label>
        <div class="input-group">
          <input type="text" class="form-control" v-model="form.description" />
        </div>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Wasiat'">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("pricing.awaris-share") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.awaris_share" />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state" v-if="organizationType == 'Awaris'">{{
          $t("pricing.partner-share")
        }}</label>
        <label for="state" v-if="organizationType != 'Awaris'">{{
          $t("business-partner")
        }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.organization_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4" v-if="userRole == 'Staff'">
        <label for="state">{{ $t("pricing.possb-share") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.prooffice_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Lain-lain</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.others_share" />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Lain-lain (Deskripsi)</label>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model="form.others_description"
        />
      </div>
    </div>
    <div class="row" v-if="form.product == 'Wasiat'">
      <div class="form-group col-md-4">
        <label for="state">Harga Pindaan</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_price"
          />
        </div>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Wasiat'">
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Pindaan AWARIS</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_awaris_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Pindaan Rakan Niaga</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_organization_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4" v-if="userRole == 'Staff'">
        <label for="state">Perkongsian Pindaan POSSB</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_prooffice_share"
          />
        </div>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Wasiat'">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("status") }}</label>
        <select name id class="form-control" v-model="form.status">
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
      </div>
    </div>
    <hr />
    <div class="row" v-if="form.product == 'Hibah'">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("org.nav3") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.price" />
        </div>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Hibah'">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("pricing.awaris-share") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.awaris_share" />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">{{ $t("pricing.partner-share") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.organization_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4" v-if="userRole == 'Staff'">
        <label for="state">{{ $t("pricing.possb-share") }}</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.prooffice_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Lain-lain</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input type="text" class="form-control" v-model="form.others_share" />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Lain-lain (Deskripsi)</label>
        <input
          v-uppercase
          type="text"
          class="form-control"
          v-model="form.others_description"
        />
      </div>
    </div>
    <div class="row" v-if="form.product == 'Hibah'">
      <div class="form-group col-md-4">
        <label for="state">Harga Pindaan</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_price"
          />
        </div>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Hibah'">
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Pindaan AWARIS</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_awaris_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4">
        <label for="state">Perkongsian Pindaan Rakan Niaga</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_organization_share"
          />
        </div>
      </div>
      <div class="form-group col-md-4" v-if="userRole == 'Staff'">
        <label for="state">Perkongsian Pindaan POSSB</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">RM</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="form.amendment_prooffice_share"
          />
        </div>
      </div>
    </div>
    <div class="row" v-if="form.product == 'Hibah'">
      <div class="form-group col-md-4">
        <label for="state">{{ $t("status") }}</label>
        <select name id class="form-control" v-model="form.status">
          <option value="1">{{ $t("active") }}</option>
          <option value="0">{{ $t("inactive") }}</option>
        </select>
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        {{ $t("cancel") }}
      </button>
      <button type="button" @click="savePricing" class="btn btn-primary">
        <i class="mdi mdi-file-document"></i>{{ $t("save") }}
      </button>
    </div>
  </div>
</template>
