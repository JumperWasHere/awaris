<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import { required, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {};
  },
  validations: {},
  mounted() {},
  methods: {},
  props: {},
  computed: {},
  components: {
    TheMask,
  },
  watch: {},
};
</script>
<template>
  <div class="col-lg-12 col-12 mb-4 pb-2">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center">{{ $t("trust.donor-info") }}</h5>
        <div class="form-group" :class="{ 'has-error': $v.form.name.$error }">
          <label for="exampleInputEmail1">
            {{ $t("name") }} <span class="text-danger">*</span></label
          >

          <div class="input-group">
            <div class="input-group-prepend">
              <select
                class="form-control"
                style="
                  border-bottom-right-radius: 0;
                  border-top-right-radius: 0;
                "
                @change="changeDesignation"
                v-model="form.designation"
                :disabled="true"
              >
                <option
                  v-for="designation in designations"
                  :key="designation"
                  :value="designation"
                >
                  {{ designation }}
                </option>
              </select>
            </div>
            <!-- {{ form.name }} -->
            <input
              type="text"
              v-uppercase
              class="form-control"
              name
              id="full_name"
              required
              v-model.trim="$v.form.name.$model"
              :disabled="true"
            />
          </div>
          <div
            class="form-error"
            v-if="$v.form.name.$error && !$v.form.name.required"
          >
            Nama tidak boleh dibiarkan kosong.
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div
              class="form-group position-relative"
              :class="{ 'has-error': $v.form.ic_number.$error }"
            >
              <label for="ic_number">
                {{ $t("mykad") }}
                <span class="text-danger">*</span>
              </label>
              <the-mask
                id="ic_number"
                :mask="['######-##-####']"
                class="form-control"
                readonly
                v-model.trim="$v.form.ic_number.$model"
              />
              <div
                class="form-error"
                v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
              >
                MyKad tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="form-group position-relative">
              <label for="other_ic_number">
                {{ $t("old-ic") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="other_ic_number"
                v-model="form.other_ic_number"
                required
                readonly
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group position-relative"
              :class="{ 'has-error': $v.form.gender.$error }"
            >
              <label for="gender">
                {{ $t("gender") }}
                <span class="text-danger">*</span>
              </label>
              <select
                name
                id="gender"
                class="form-control"
                v-model.trim="$v.form.gender.$model"
                :disabled="true"
              >
                <option value="">-- {{ $t("choose.gender") }} --</option>
                <option
                  v-for="(gender, index) in genders"
                  :key="index"
                  :value="gender.split(':')[0]"
                >
                  {{ gender.split(":")[1] }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="$v.form.gender.$error && !$v.form.gender.required"
              >
                Jantina tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.religion.$error }"
            >
              <label for="religion"
                >{{ $t("religion") }}<span class="text-danger">*</span></label
              >
              <select
                name=""
                class="form-control"
                v-model.trim="$v.form.religion.$model"
                @change="changeReligion"
                :disabled="true"
              >
                <option value="">-- {{ $t("choose.religion") }} --</option>
                <option
                  v-for="religion in religions"
                  :key="religion"
                  :value="religion"
                >
                  {{ religion }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="$v.form.religion.$error && !$v.form.religion.required"
              >
                Agama tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.race.$error }"
            >
              <label for="race"
                >{{ $t("race") }}<span class="text-danger">*</span></label
              >
              <select
                name
                id="race"
                v-model.trim="$v.form.race.$model"
                class="form-control"
                @change="changeRace"
                :disabled="true"
              >
                <option value>-- {{ $t("choose.race") }} --</option>
                <option v-for="race in races" :key="race" :value="race">
                  {{ race }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="$v.form.race.$error && !$v.form.race.required"
              >
                Bangsa tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.marital_status.$error }"
            >
              <label for="marital_status">{{ $t("marital-status") }}</label>
              <span class="text-danger">*</span>
              <select
                name=""
                class="form-control"
                v-model.trim="$v.form.marital_status.$model"
                :disabled="true"
              >
                <option value="">
                  -- {{ $t("choose.marital-status") }} --
                </option>
                <option value="Bujang">Bujang</option>
                <option value="Berkahwin">Berkahwin</option>
                <option value="Janda/Duda">Janda/Duda</option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.form.marital_status.$error &&
                  !$v.form.marital_status.required
                "
              >
                Status Perkahwinan tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group position-relative"
              :class="{ 'has-error': $v.form.nationality.$error }"
            >
              <label for="nationality">
                {{ $t("nationality") }}
                <span class="text-danger">*</span>
              </label>
              <select
                name
                id="nationality"
                class="form-control"
                v-model.trim="$v.form.nationality.$model"
                :disabled="true"
              >
                <option value="">-- {{ $t("choose.nationality") }} --</option>
                <option
                  v-for="(nationality, index) in nationalities"
                  :key="index"
                  :value="nationality.split(':')[0]"
                >
                  {{ nationality.split(":")[1] }}
                </option>
              </select>
              <div
                class="form-error"
                v-if="
                  $v.form.nationality.$error && !$v.form.nationality.required
                "
              >
                Warganegara tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.email.$error }"
            >
              <label for="email">{{ $t("email") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                v-lowercase
                id="email"
                class="form-control"
                v-model.trim="$v.form.email.$model"
                readonly
              />
              <div class="form-error" v-if="!$v.form.email.email">
                Anda telah memasukkan alamat emel yang tidak sah!
              </div>
              <div
                class="form-error"
                v-if="$v.form.email.$error && !$v.form.email.required"
              >
                E-mel tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="home_phone_number">{{ $t("home-telno") }}</label>
              <input
                type="text"
                id="home_phone_number"
                v-model="form.home_phone_number"
                class="form-control"
                readonly
              />
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.mobile_number.$error }"
            >
              <label for="mobile_number">{{ $t("mobile-no") }}</label>
              <span class="text-danger">*</span>
              <input
                type="text"
                id="mobile_number"
                v-model.trim="$v.form.mobile_number.$model"
                class="form-control"
                readonly
              />
              <div
                class="form-error"
                v-if="
                  $v.form.mobile_number.$error &&
                  !$v.form.mobile_number.required
                "
              >
                No. Telefon Bimbit tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <hr class="primary" />

        <div class="row">
          <div class="col-md-12">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.address.$error }"
            >
              <label for="address">{{ $t("mailing-address") }}</label>
              <span class="text-danger">*</span>
              <textarea
                v-uppercase
                class="form-control"
                id="address"
                rows="2"
                v-model.trim="$v.form.address.$model"
                readonly
              ></textarea>
              <div
                class="form-error"
                v-if="$v.form.address.$error && !$v.form.address.required"
              >
                Alamat Surat Menyurat tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.postcode.$error }"
            >
              <label for="postcode" class="d-block">
                <div class="d-flex justify-content-between align-items-center">
                  <span
                    >{{ $t("postcode")
                    }}<span class="text-danger">*</span></span
                  >

                  <span
                    @click="openpostcode"
                    style="
                      text-decoration: underline;
                      font-size: 11px;
                      color: #333;
                    "
                    >{{ $t("add-new") }}</span
                  >
                </div>
              </label>
              <input
                type="text"
                id="postcode"
                class="form-control"
                @blur="getPostcode(1)"
                v-model.lazy.trim="$v.form.postcode.$model"
                readonly
              />
              <div
                class="form-error"
                v-if="$v.form.postcode.$error && !$v.form.postcode.required"
              >
                Poskod tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-group">
              <label for="city">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="city"
                class="form-control"
                readonly
                v-model="form.city"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="state">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
                id="state"
                class="form-control"
                readonly
                v-model="form.state"
              />
            </div>
          </div>
        </div>

        <hr class="primary" />

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="address">{{ $t("permanent-address") }}</label>
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customCheck1"
                  v-model="form.sameAddress"
                  @change="copyAddress"
                  value="1"
                  disabled
                />
                <label class="custom-control-label" for="customCheck1">
                  {{ $t("same-address") }}
                </label>
              </div>
              <textarea
                class="form-control"
                id="address_2"
                rows="2"
                readonly
                v-model="form.address_2"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="postcode_2" class="d-block">
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ $t("postcode") }}</span>
                  <span
                    @click="openpostcode"
                    style="
                      text-decoration: underline;
                      font-size: 11px;
                      color: #333;
                    "
                    >{{ $t("add-new") }}</span
                  >
                </div>
              </label>
              <input
                type="text"
                id="postcode_2"
                readonly
                class="form-control"
                @blur="getPostcode(2)"
                v-model.lazy="form.postcode_2"
              />
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-group">
              <label for="city_2">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="city_2"
                class="form-control"
                readonly
                v-model="form.city_2"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="state_2">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
                id="state_2"
                class="form-control"
                readonly
                v-model="form.state_2"
              />
            </div>
          </div>
        </div>
        <div v-if="trust && !['1', '2'].includes(trust.hibah_type)">
          <hr class="primary" />
          <div class="form-group position-relative">
            <label for="employer_name">{{ $t("employers-name") }}</label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              id="employer_name"
              v-model="formHibah.employer_name"
              required
              readonly
            />
          </div>

          <div class="form-group position-relative">
            <label for="employer_address">{{ $t("employers-address") }}</label>

            <textarea
              v-uppercase
              name=""
              class="form-control"
              cols="30"
              rows="10"
              v-model="formHibah.employer_address"
              readonly
            ></textarea>
          </div>

          <div class="row">
            <div class="form-group position-relative col-md-6">
              <label for="job_title"> {{ $t("position") }} </label>
              <input
                type="text"
                v-uppercase
                class="form-control"
                id="job_title"
                v-model="formHibah.job_title"
                required
                readonly
              />
            </div>
            <div class="form-group position-relative col-md-6">
              <label for="yearly_income">{{ $t("yearly-income") }}</label>
              <input
                type="text"
                class="form-control"
                id="yearly_income"
                v-model="formHibah.yearly_income"
                required
                readonly
              />
            </div>
          </div>
        </div>
        <hr class="primary" />

        <div class="row">
          <div class="form-group position-relative col-md-6">
            <label for="income_source">{{ $t("source-income") }}</label>
            <!-- {{ income }} -->
            <select
              name=""
              class="form-control"
              v-model="formHibah.income_source"
              @change="dropdownSourceIncome($event)"
              :disabled="true"
            >
              <option
                v-for="incomeVal in income"
                :key="incomeVal"
                :value="incomeVal"
              >
                {{ incomeVal }}
              </option>
            </select>
          </div>
          <div
            class="form-group position-relative col-md-6"
            v-if="otherSourceIncome"
          >
            <label for="income_source">{{ $t("othersource-income") }}</label>
            <input
              type="text"
              v-uppercase
              name="income_source"
              placeholder="Sila nyatakan"
              v-model="form.income_source"
              class="form-control"
              readonly
            />
          </div>
          <div class="form-group position-relative col-md-6">
            <label for="hibah_property_source">{{
              $t("trust.propsources")
            }}</label>
            <select
              name="hibah_property_source"
              class="form-control"
              v-model="formHibah.hibah_property_source"
              @change="changeincomeproperty($event)"
              :disabled="true"
            >
              <option
                v-for="incomeproperty in income_property"
                :key="incomeproperty"
                :value="incomeproperty"
              >
                {{ incomeproperty }}
              </option>
              <!-- <option value="Pendapatan Perniagaan">
                Pendapatan Perniagaan
              </option>
              <option value="Pendapatan Pekerjaan">Pendapatan Pekerjaan</option>
              <option value="Pendapatan Pelaburan">Pendapatan Pelaburan</option>
              <option value="Hadiah Warisan">Hadiah Warisan</option>
              <option value="Lain-lain">Lain-lain</option> -->
            </select>
          </div>
          <div class="col-md-6" v-if="otherHibahPropSource">
            <div class="form-group">
              <label for="hibah_property_source">Sumber Harta Hibah Lain</label>
              <input
                type="text"
                name="hibah_property_source"
                id="hibah_property_source"
                placeholder="Sila nyatakan"
                v-model="form.hibah_property_source"
                class="form-control"
                readonly
              />
            </div>
          </div>
          <!-- <div
            class="form-group position-relative col-md-6"
            :class="{ 'has-error': $v.formHibah.pricing_id.$error }"
          >
            <label for="pricing_id">
              {{ $t("trust.hibah-price") }}<span class="text-danger">*</span>
            </label>
            <select
              name=""
              id="pricing_id"
              class="form-control"
              v-model.trim="$v.formHibah.pricing_id.$model"
              :disabled="true"
            >
              <option
                :value="pricing.id"
                v-for="(pricing, index) in pricings"
                :key="index"
              >
                RM {{ pricing.price }}
              </option>
            </select>
            <div
              class="form-error"
              v-if="
                $v.formHibah.pricing_id.$error &&
                !$v.formHibah.pricing_id.required
              "
            >
              Harga Hibah tidak boleh dibiarkan kosong.
            </div>
          </div> -->
          <div class="form-group col-md-12">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                id="check_revocable"
                v-model="formHibah.is_revocable"
                value="1"
                disabled
              />
              <label class="custom-control-label" for="check_revocable">
                {{ $t("trust.can-revoked") }}
              </label>
            </div>
          </div>
          <div class="form-group col-md-6">
            <label for="">{{ $t("trust.hibah-purpose") }}</label>
            <select
              name=""
              class="form-control"
              v-model="formHibah.trust_purpose_type"
              :disabled="true"
            >
              <option value="Institusi">Institusi</option>
              <option value="Persendirian">Persendirian</option>
            </select>
          </div>
          <div
            class="form-group col-md-12"
            v-if="formHibah.trust_purpose_type == 'Institusi'"
          >
            <textarea
              name=""
              cols="30"
              rows="10"
              class="form-control"
              v-model="formHibah.trust_purpose"
              readonly
            ></textarea>
          </div>
          <div
            class="form-group col-md-12"
            v-if="formHibah.trust_purpose_type == 'Persendirian'"
          >
            <select
              name=""
              class="form-control"
              v-model="formHibah.trust_purpose"
              @change="changeHibahPrivate($event)"
              :disabled="true"
            >
              <option
                :value="hibahPrivate"
                v-for="(hibahPrivate, index) in hibah_private"
                :key="index"
              >
                {{ hibahPrivate }}
              </option>
            </select>
          </div>
        </div>
        <hr class="primary" />
        <div class="row">
          <div
            class="col-md-6 form-group"
            :class="{ 'has-error': $v.mykad.frontUrl.$error }"
          >
            <label for="upload-photo-2"
              >{{ $t("mykadcopy-front")
              }}<span class="text-danger">*</span></label
            >
            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
              >
                <label
                  v-if="mykad.frontUrl"
                  :style="'background-image: url(' + mykad.frontUrl + ');'"
                  style="
                    border-radius: 5px;
                    margin-bottom: 0;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    height: 100%;
                    width: 100%;
                  "
                  for="upload-photo-2"
                ></label>
              </div>
            </div>
            <div
              class="form-error"
              v-if="$v.mykad.frontUrl.$error && !$v.mykad.frontUrl.required"
            >
              Dokumen tidak boleh dibiarkan kosong.
            </div>
            <div
              class="d-flex justify-content-center mt-2"
              v-if="userRole == 'Staff' && trust && trust.status == 2"
            >
              <b-button class="btn-sm btn-primary" @click="showIc('front')">
                {{ $t("view") }}
              </b-button>
            </div>
          </div>
          <div
            class="col-md-6 form-group"
            :class="{ 'has-error': $v.mykad.backUrl.$error }"
          >
            <label for="upload-photo-1">
              {{ $t("mykadcopy-back") }}<span class="text-danger">*</span>
            </label>
            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
              >
                <label
                  v-if="mykad.backUrl"
                  :style="'background-image: url(' + mykad.backUrl + ');'"
                  style="
                    border-radius: 5px;
                    margin-bottom: 0;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    height: 100%;
                    width: 100%;
                  "
                  for="upload-photo-1"
                ></label>
              </div>
            </div>
            <div
              class="form-error"
              v-if="$v.mykad.backUrl.$error && !$v.mykad.backUrl.required"
            >
              Dokumen tidak boleh dibiarkan kosong.
            </div>
            <div
              class="d-flex justify-content-center mt-2"
              v-if="userRole == 'Staff' && trust && trust.status == 2"
            >
              <b-button class="btn-sm btn-primary" @click="showIc('back')">
                {{ $t("view") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-12 text-right">
        <div class="form-group">
          <div class="d-flex justify-content-between"></div>
          <button type="button" @click="submitForm" class="btn btn-primary">
            {{ $t("save-next") }}
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
    <b-modal
      ref="modalPostcode"
      class="modal fade"
      v-bind:title="$t('add-newpostcode')"
      v-bind:ok-title="$t('add')"
      v-bind:cancel-title="$t('cancel')"
    >
      <div class="modal-body">
        <div class="form-group">
          <label>
            {{ $t("postcode") }}
            <span class="text-danger">*</span>
          </label>
          <input type="number" class="form-control" />
        </div>
        <div class="form-group">
          <label>
            {{ $t("city") }}
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label>
            {{ $t("state") }}
            <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control" />
        </div>
      </div>
    </b-modal>
  </div>
</template>
