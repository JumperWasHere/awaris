<script>
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      preference: {},
      isSubmit: false,
      form: {
        allow_hibah: null,
        allow_wasiat: null,
        hibah_allow_moveable_property: null,
        hibah_allow_immoveable_property: null,
        hibah_single_moveable_property: null,
        hibah_single_immoveable_property: null,
        hibah_single_caretaker: null,
        hibah_single_heir: null,
        hibah_single_receiver: null,
        hibah_fixed_property_type: null,
        hibah_fixed_saham_type: null,
        corporate_saham_account_type: null,
      },
    };
  },
  components: {},
  mounted() {
    console.log(this.organizationId);
    this.getPreference();
    console.log(this.preference.id);
  },
  methods: {
    getPreference() {
      ApiService.get(`organization/${this.organizationId}/preference`).then(
        (response) => {
          this.preference = response.data.preference ?? {};
          this.form = this.preference;
        }
      );
    },
    updatePreference() {
      this.isSubmit = true;
      this.form._method = "PATCH";
      ApiService.post(`preference/${this.preference.id}`, this.form)
        .then((response) => {
          this.$swal
            .fire({
              icon: "success",
              html: "Kemaskini berjaya!",
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "Tutup",
            })
            .then((response) => {
              this.$router.push({
                name: "organization.preference.info",
                params: {
                  organization_id: this.organizationId,
                },
              });
            });
        })
        .catch((error) => {
          this.isSubmit = false;
        });
    },
    back() {
      this.$router.push({
        name: "organization.preference.info",
        params: { organization_id: this.organizationId },
      });
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
      <div class="col-lg-4">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.wasiat")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios2"
                    value="1"
                    v-model="form.allow_wasiat"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios2"
                    value="2"
                    v-model="form.allow_wasiat"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="form-group position-relative">
          <label for style="text-transform: capitalize">{{
            $t("preference.hibah")
          }}</label>
          <div class="radio-inline">
            <div>
              <label class="radio">
                <!-- <input
                  type="radio"
                  name="radios1"
                  value="1"
                  v-model="form.allow_hibah"
                /> -->
                Ya
              </label>
            </div>
            <div>
              <label class="radio">
                <!-- <input
                  type="radio"
                  name="radios1"
                  value="2"
                  v-model="form.allow_hibah"
                /> -->
                Tidak
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="form-group position-relative">
          <label for style="text-transform: capitalize">{{
            $t("preference.hibah-corporate")
          }}</label>
          <div class="radio-inline">
            <div>
              <label class="radio">
                <input
                  type="radio"
                  name="radios1"
                  value="1"
                  v-model="form.allow_hibah"
                />
                Ya
              </label>
            </div>
            <div>
              <label class="radio">
                <input
                  type="radio"
                  name="radios1"
                  value="2"
                  v-model="form.allow_hibah"
                />
                Tidak
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="preference.allow_hibah == 1">
      <div class="col-md-12 mb-3">
        <hr />
        <h6>{{ $t("preference.corporate-trust") }}</h6>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.add-movprop")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios3"
                    value="1"
                    v-model="form.hibah_allow_moveable_property"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios3"
                    value="2"
                    v-model="form.hibah_allow_moveable_property"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6" v-if="organizationType == 'Awaris'">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.add-immovprop")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios4"
                    value="1"
                    v-model="form.hibah_allow_immoveable_property"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios4"
                    value="2"
                    v-model="form.hibah_allow_immoveable_property"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.movprop")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios5"
                    value="1"
                    v-model="form.hibah_single_moveable_property"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios5"
                    value="2"
                    v-model="form.hibah_single_moveable_property"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6" v-if="organizationType == 'Awaris'">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.immovprop")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios6"
                    value="1"
                    v-model="form.hibah_single_immoveable_property"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios6"
                    value="2"
                    v-model="form.hibah_single_immoveable_property"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.guardian")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios7"
                    value="1"
                    v-model="form.hibah_single_caretaker"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios7"
                    value="2"
                    v-model="form.hibah_single_caretaker"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.beneficiary")
          }}</label>
          <div class="form-group">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios9"
                    value="1"
                    v-model="form.hibah_single_receiver"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios9"
                    value="2"
                    v-model="form.hibah_single_receiver"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6" v-if="organizationType == 'Awaris'">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.heir")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios8"
                    value="1"
                    v-model="form.hibah_single_heir"
                  />
                  Ya
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios8"
                    value="2"
                    v-model="form.hibah_single_heir"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.fixedprop")
          }}</label>
          <!-- <input
            type="text"
            class="form-control"
            name="harta tetap"
            v-model="form.hibah_fixed_property_type"
          /> -->
          <select
            name=""
            id=""
            class="form-control"
            v-model="form.hibah_fixed_property_type"
          >
            <option value="">-- {{ $t("choose.property-type") }} --</option>
            <option value="Saham">Saham</option>
            <option value="Bank">Bank</option>
            <option value="Kenderaan">Kenderaan</option>
            <option value="Simpanan">Simpanan</option>
            <option value="Insurance">Insurance</option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.fixedstocks")
          }}</label>
          <input
            type="text"
            class="form-control"
            name="harta tetap"
            v-model="form.hibah_fixed_saham_type"
          />
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <label for style="text-transform: capitalize">{{
            $t("preference.saham-type")
          }}</label>
          <div class="form-group position-relative">
            <div class="radio-inline">
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios8"
                    value="No. Akaun"
                    v-model="form.corporate_saham_account_type"
                  />
                  {{ $t("acc-no") }}
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios8"
                    value="No. Perjanjian"
                    v-model="form.corporate_saham_account_type"
                  />
                  {{ $t("agreement-no") }}
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios8"
                    value="No. Polisi"
                    v-model="form.corporate_saham_account_type"
                  />
                  {{ $t("policy-no") }}
                </label>
              </div>
              <div>
                <label class="radio">
                  <input
                    type="radio"
                    name="radios8"
                    value="No. Pendaftaran Syarikat"
                    v-model="form.corporate_saham_account_type"
                  />
                  {{ $t("co-regno") }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <button type="button" @click="back" class="btn btn-primary">
        {{ $t("cancel") }}
      </button>
      <button type="button" @click="updatePreference" class="btn btn-primary">
        <i class="mdi mdi-file-document"></i>
        {{ $t("save") }}
        <span class="spinner-border spinner-border-sm" v-if="isSubmit"></span>
      </button>
    </div>
  </div>
</template>
