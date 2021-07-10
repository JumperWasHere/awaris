<script>
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      preference: {},
    };
  },
  mounted() {
    console.log(this.organizationId);
    this.getPreference();
  },
  methods: {
    getPreference() {
      ApiService.get(`organization/${this.organizationId}/preference`).then(
        (response) => {
          this.preference = response.data.preference ?? {};
        }
      );
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organization_id;
    },
    organizationType() {
      return this.organization.type;
    },
  },
  props: {
    organization: {
      type: Object,
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize"
          >1. {{ $t("preference.wasiat") }}</label
        >
        <p class="form-control-static" v-if="preference.allow_wasiat == 1">
          {{ $t("yes") }}
        </p>
        <p class="form-control-static" v-if="preference.allow_wasiat != 1">
          {{ $t("no") }}
        </p>
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize"
          >2. {{ $t("preference.hibah") }}</label
        >
      </div>
      <div class="form-group col-md-4">
        <label for style="text-transform: capitalize"
          >3. {{ $t("preference.hibah-corporate") }}</label
        >
        <p class="form-control-static" v-if="preference.allow_hibah == 1">
          {{ $t("yes") }}
        </p>
        <p class="form-control-static" v-if="preference.allow_hibah != 1">
          {{ $t("no") }}
        </p>
      </div>
    </div>
    <div class="row" v-if="preference.allow_hibah == 1">
      <div class="col-md-12 mb-3">
        <hr />
        <h6>{{ $t("preference.corporate-trust") }}</h6>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.add-movprop")
        }}</label>
        <p
          class="form-control-static"
          v-if="preference.hibah_allow_moveable_property == 1"
        >
          {{ $t("yes") }}
        </p>
        <p
          class="form-control-static"
          v-if="preference.hibah_allow_moveable_property != 1"
        >
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType == 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("preference.add-immovprop")
        }}</label>
        <p
          class="form-control-static"
          v-if="preference.hibah_allow_immoveable_property == 1"
        >
          {{ $t("yes") }}
        </p>
        <p
          class="form-control-static"
          v-if="preference.hibah_allow_immoveable_property != 1"
        >
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.movprop")
        }}</label>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_moveable_property == 1"
        >
          {{ $t("yes") }}
        </p>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_moveable_property != 1"
        >
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType == 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("preference.immovprop")
        }}</label>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_immoveable_property == 1"
        >
          {{ $t("yes") }}
        </p>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_immoveable_property != 1"
        >
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.guardian")
        }}</label>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_caretaker == 1"
        >
          {{ $t("yes") }}
        </p>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_caretaker != 1"
        >
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organizationType == 'Awaris'">
        <label for style="text-transform: capitalize">{{
          $t("preference.heir")
        }}</label>
        <p class="form-control-static" v-if="preference.hibah_single_heir == 1">
          {{ $t("yes") }}
        </p>
        <p class="form-control-static" v-if="preference.hibah_single_heir != 1">
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.beneficiary")
        }}</label>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_receiver == 1"
        >
          {{ $t("yes") }}
        </p>
        <p
          class="form-control-static"
          v-if="preference.hibah_single_receiver != 1"
        >
          {{ $t("no") }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.fixedprop")
        }}</label>
        <p class="form-control-static">
          {{ preference.hibah_fixed_property_type }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.fixedstocks")
        }}</label>
        <p class="form-control-static">
          {{ preference.hibah_fixed_saham_type }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for style="text-transform: capitalize">{{
          $t("preference.saham-type")
        }}</label>
        <p class="form-control-static">
          {{ preference.corporate_saham_account_type }}
        </p>
      </div>
    </div>
    <hr />
    <div class="text-right">
      <router-link
        :to="{
          name: 'organization.preference.edit',
          params: {
            organization_id: organizationId,
          },
        }"
        class="btn btn-primary"
        >{{ $t("update") }}</router-link
      >
    </div>
  </div>
</template>
