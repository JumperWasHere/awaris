<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      witness: null,
    };
  },
  components: { TheMask },
  props: {
    isDeletable: {
      type: Boolean,
    },
    isEditable: {
      type: Boolean,
    },
    getWitnessesMethodName: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  validations: {
    witness: {
      name: {
        required,
      },
      ic_number: {
        required,
      },
      email: {
        required,
      },
      address: {
        required,
      },
      postcode: {
        required,
      },
    },
  },
  methods: {
    getPostcode() {
      if (this.witness.postcode) {
        ApiService.get(`postcode/${this.witness.postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              this.witness.city = postcode.city;
              this.witness.state = postcode.state;
            }
          })
          .catch(() => {
            this.witness.city = "";
            this.witness.state = "";
          });
      }
    },
    openModal(witness) {
      this.witness = witness;
      this.$refs["modalViewWitness"].show();
    },
    removeWitness() {
      ApiService.post(`/witness/${this.witness.id}`, { _method: "DELETE" })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya memadam Saksi.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$refs["modalViewWitness"].hide();
          this.refreshWitnessesList();
        })
        .catch((error) => {});
    },
    updateWitness() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.witness._method = "PATCH";
      ApiService.post(`/witness/${this.witness.id}`, this.witness).then(
        (response) => {
          this.$swal.fire({
            icon: "success",
            html: "Anda telah berjaya kemaskini Saksi.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$refs["modalViewWitness"].hide();
          this.refreshWitnessesList();
        }
      );
    },
    refreshWitnessesList() {
      if (this.getWitnessesMethodName) {
        this.$parent[this.getWitnessesMethodName]();
      }
    },
  },
  computed: {
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
    fullAddress() {
      return this.witness
        ? String(this.witness.address ? this.witness.address.concat(", ") : "")
            .concat(
              String(
                this.witness.postcode ? this.witness.postcode.concat(", ") : ""
              )
            )
            .concat(
              String(this.witness.city ? this.witness.city.concat(", ") : "")
            )
            .concat(
              String(this.witness.state ? this.witness.state.concat(". ") : "")
            )
        : "-";
    },
  },
  watch: {
    postcode: {
      handler: function (val) {
        this.witness.postcode = val;
        this.getPostcode();
      },
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      centered
      ref="modalViewWitness"
      v-bind:title="$t('witnessmodal.desc')"
      v-bind:ok-title="$t('close')"
      ok-only
      :no-enforce-focus="true"
    >
      <div v-if="witness">
        <div
          class="form-group row"
          :class="{ 'has-error': $v.witness.name.$error }"
        >
          <label class="col-sm-3 col-form-label">{{ $t("name") }}</label>
          <div class="col-sm-9">
            <input
              type="text"
              :class="isEditable ? 'form-control' : 'form-control-plaintext'"
              :readonly="!isEditable"
              v-model.trim="$v.witness.name.$model"
            />
            <div
              class="form-error"
              v-if="$v.witness.name.$error && !$v.witness.name.required"
            >
              Nama tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <div
          class="form-group row"
          :class="{ 'has-error': $v.witness.ic_number.$error }"
        >
          <label for="ic_number" class="col-sm-3 col-form-label">{{
            $t("mykad")
          }}</label>
          <div class="col-sm-9">
            <the-mask
              :mask="['######-##-####']"
              :class="isEditable ? 'form-control' : 'form-control-plaintext'"
              :readonly="!isEditable"
              id="ic_number"
              v-model.trim="$v.witness.ic_number.$model"
            />
            <div
              class="form-error"
              v-if="
                $v.witness.ic_number.$error && !$v.witness.ic_number.required
              "
            >
              No. MyKad tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <div
          class="form-group row"
          :class="{ 'has-error': $v.witness.email.$error }"
        >
          <label for="email" class="col-sm-3 col-form-label">{{
            $t("email")
          }}</label>
          <div class="col-sm-9">
            <input
              :class="isEditable ? 'form-control' : 'form-control-plaintext'"
              :readonly="!isEditable"
              id="email"
              v-model.trim="$v.witness.email.$model"
            />
            <div
              class="form-error"
              v-if="$v.witness.email.$error && !$v.witness.email.required"
            >
              E-mel tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
        <div v-if="isEditable">
          <div
            class="form-group row"
            :class="{ 'has-error': $v.witness.address.$error }"
          >
            <label for="address" class="col-sm-3 col-form-label">{{
              $t("address")
            }}</label>
            <div class="col-sm-9">
              <textarea
                type="text"
                v-uppercase
                id="address"
                :class="isEditable ? 'form-control' : 'form-control-plaintext'"
                :readonly="!isEditable"
                v-model.trim="$v.witness.address.$model"
              >
              </textarea>
              <div
                class="form-error"
                v-if="$v.witness.address.$error && !$v.witness.address.required"
              >
                Alamat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div
            class="form-group row"
            :class="{ 'has-error': $v.witness.postcode.$error }"
          >
            <label for="postcode" class="col-sm-3 col-form-label">{{
              $t("postcode")
            }}</label>
            <div class="col-sm-4">
              <input
                type="number"
                id="postcode"
                :class="isEditable ? 'form-control' : 'form-control-plaintext'"
                :readonly="!isEditable"
                @blur="getPostcode"
                v-model.lazy.trim="$v.witness.postcode.$model"
              />
              <div
                class="form-error"
                v-if="
                  $v.witness.postcode.$error && !$v.witness.postcode.required
                "
              >
                Poskod tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="city" class="col-sm-3 col-form-label">{{
              $t("city")
            }}</label>
            <div class="col-sm-4">
              <input
                type="text"
                v-uppercase
                :class="isEditable ? 'form-control' : 'form-control-plaintext'"
                readonly
                id="city"
                v-model="witness.city"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="state" class="col-sm-3 col-form-label">{{
              $t("state")
            }}</label>
            <div class="col-sm-4">
              <input
                type="text"
                v-uppercase
                :class="isEditable ? 'form-control' : 'form-control-plaintext'"
                readonly
                id="state"
                v-model="witness.state"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="form-group row">
            <label for="state" class="col-sm-3 col-form-label">{{
              $t("address")
            }}</label>
            <div class="col-sm-9">
              <p class="form-control-plaintext">{{ fullAddress }}</p>
            </div>
          </div>
        </div>
        <div class="form-group row" v-if="signature">
          <label for="signature" class="col-sm-3 col-form-label">{{
            $t("profile.signature")
          }}</label>
          <div class="col-sm-4">
            <img
              :src="signature"
              alt=""
              style="width: 100%; border: 1px solid #ddd; border-radius: 15px"
            />
          </div>
        </div>
      </div>
      <template #modal-footer v-if="isDeletable || isEditable">
        <div class="w-100">
          <button
            class="btn btn-danger float-left"
            v-if="isDeletable"
            @click="removeWitness"
          >
            {{ $t("remove") }}
          </button>
          <button
            class="btn btn-primary float-right"
            v-if="isEditable"
            @click="updateWitness"
          >
            {{ $t("save") }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>