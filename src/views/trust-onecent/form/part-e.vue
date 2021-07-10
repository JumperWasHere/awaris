<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "HibahPartA",
  data() {
    return {
      wasiat: null,
      newRelationship: null,
      form: {
        name: null,
        relationship: null,
        ic_number: null,
        email: null,
        mobile_number: null,
        home_phone_number: null,
        address: null,
        postcode: null,
        city: null,
        state: null,
      },
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
      receivers: null,
      formPostcode: {},
      postcode: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      relationship: {
        required,
      },
      ic_number: {
        required,
      },
      email: {
        required,
        email,
      },
      mobile_number: {
        required,
      },
      address: {
        required,
      },
    },
    mykad: {
      frontUrl: {
        required,
      },
      backUrl: {
        required,
      },
    },
  },
  mounted() {
    if (!this.trustId) {
      this.$router.push({
        name: "trust-onecent.part-a",
      });
    }
    this.getReceivers();
  },
  methods: {
    openModalReceiver() {
      this.$v.$reset();
      this.form.name = null;
      this.form.relationship = null;
      this.form.ic_number = null;
      this.form.email = null;
      this.form.mobile_number = null;
      this.form.home_phone_number = null;
      this.form.address = null;
      this.form.postcode = null;
      this.form.city = null;
      this.form.state = null;
      this.form.sameAddress = null;
      this.mykad.frontUrl = null;
      this.mykad.backUrl = null;

      this.$refs["modalAddReceiver"].show();
    },
    hideModal() {
      this.$refs["modalAddReceiver"].hide();
    },
    openpostcode() {
      this.$refs["modalPostcode"].show();
      // modalPostcde;
    },
    hideModalPostcode() {
      this.$refs["modalPostcode"].hide();
    },
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`).then((response) => {
          var postcode = response.data.postcode;
          if (postcode != null) {
            this.form.city = postcode.city;
            this.form.state = postcode.state;
          }
        });
      }
    },
    async storePostcode() {
      await ApiService.post(`postcode`, this.formPostcode).then((response) => {
        this.postcode = this.formPostcode.postcode;
      });
      await this.getPostcode();
      this.formPostcode = {};
      this.$swal.fire({
        icon: "success",
        html: "Poskod baharu telah didaftarkan.",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
    },
    async submitForm(val) {
      val.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi ruangan yang bertanda (*)",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }
      var receiverId = await this.createReceiver();
      if (receiverId) {
        await this.storeDocument(receiverId, this.mykad.front, "mykad-front");
        await this.storeDocument(receiverId, this.mykad.back, "mykad-back");
        this.$refs["modalAddReceiver"].hide();
      }
    },
    filesChange(files, type) {
      if (type == "mykad-front") {
        this.mykad.front = files[0];
        this.mykad.frontUrl = URL.createObjectURL(files[0]);
      } else {
        this.mykad.back = files[0];
        this.mykad.backUrl = URL.createObjectURL(files[0]);
      }
    },
    copyAddress() {
      if (this.form.sameAddress == 1) {
        this.form.address = this.trust.user_detail.correspondence_address;
        this.form.city = this.trust.user_detail.correspondence_city;
        this.form.state = this.trust.user_detail.correspondence_state;
        this.form.postcode = this.trust.user_detail.correspondence_postcode;
      } else {
        this.form.address = "";
        this.form.city = "";
        this.form.state = "";
        this.form.postcode = "";
      }
    },
    async storeDocument(userId, document, type) {
      const formData = new FormData();
      formData.append("document", document, document.name);
      formData.append("type", type);
      return await ApiService.post(`/receiver/${userId}/document`, formData)
        .then((response) => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    copyHeirInformation() {},
    getReceivers() {
      ApiService.get(`hibah/${this.trustId}/receiver`).then((response) => {
        this.receivers = response.data.receivers.data ?? [];
      });
    },
    async createReceiver() {
      this.form.receivable_id = this.trustId;
      this.form.receivable_type = "Hibah";
      return await ApiService.post(`receiver`, this.form)
        .then((response) => {
          this.receivers.splice(0, 0, response.data.receiver);
          return response.data.receiver.id;
        })
        .catch(() => {
          return false;
        });
    },
    removeReceiver(receiverId) {
      ApiService.post(`receiver/${receiverId}`, {
        _method: "DELETE",
      }).then((response) => {
        this.getReceivers();
      });
    },
    async changeRelationship() {
      if (["Others", "Lain-lain"].includes(event.target.value)) {
        const { value: newRelationship } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Hubungan</label></span>",
          input: "text",
        });
        if (newRelationship) {
          console.log(newRelationship);
          this.newRelationship = newRelationship;
          this.form.relationship = newRelationship;
        } else {
          this.form.relationship = this.relationship[0];
        }
      }
    },
    locale() {
      return this.$i18n.locale;
    },
  },
  computed: {
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    ...mapGetters(["preference", "trust", "amendment"]),
    allowAddReceiver() {
      if (this.preference && this.preference.hibah_single_receiver == 1) {
        if (this.receivers && this.receivers.length >= 1) {
          return false;
        }
      }
      return true;
    },
    addReceiver() {
      if (
        this.trust &&
        [3, 4, 5].includes(this.trust.status) &&
        !this.amendmentId
      ) {
        return false;
      } else if (
        this.amendmentId &&
        this.amendment &&
        ![0, 1].includes(this.amendment.status)
      ) {
        return false;
      } else {
        return true;
      }
    },
    routeMessage() {
      return this.$route.query.message;
    },
    relationships() {
      var relationships = this.$t("relationships").split(",");
      if (this.newRelationship) {
        relationships.push(this.newRelationship);
      } else if (!relationships.includes(this.form.relationship)) {
        relationships.push(this.form.relationship);
      }
      return relationships;
    },
  },
  watch: {
    locale: function () {
      if (!this.newRelationship) this.form.relationship = this.relationship[0];
    },
    trust: {
      handler: function (val) {
        if (val && val.status == -1) {
          this.$router.push({
            name: "trust-onecent.part-c",
            query: {
              trust_id: this.trustId,
              amendment_id: this.amendmentId,
            },
          });
        }
      },
    },
  },
  components: { TheMask },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-md-12" v-if="routeMessage == 'receiver-updated'">
        <div class="alert alert-success">
          {{ $t("trust.beneficiary-updated") }}
        </div>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-bodyz">
            <h5 class="text-center mb-5 mt-4">
              {{ $t("amendment.receiver-info") }}
              <img
                content="Senarai penerima yang akan diagihkan dalam harta"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>

            <div class="text-right mr-2" v-if="addReceiver">
              <button @click="openModalReceiver" class="btn btn-primary btn-sm">
                {{ $t("add") }}
              </button>
            </div>
            <div class="row mb-2">
              <div class="col-lg-12">
                <div class="table-responsive p-2 mt-3 mb-4">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>{{ $t("name") }}</th>
                        <th>{{ $t("mykad") }}</th>
                        <th>{{ $t("relationship") }}</th>
                        <th>{{ $t("email") }}</th>
                        <th>{{ $t("mobile-no") }}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(receiver, index) in receivers" :key="index">
                        <td>{{ receiver.name }}</td>
                        <td>{{ receiver.ic_number }}</td>
                        <td>{{ receiver.relationship }}</td>
                        <td>{{ receiver.email }}</td>
                        <td>{{ receiver.mobile_number }}</td>
                        <td class="text-right">
                          <div
                            class="btn-group-vertical"
                            role="group"
                            aria-label="Vertical button group"
                            v-if="addReceiver"
                          >
                            <router-link
                              class="btn btn-secondary btn-sm"
                              :to="{
                                name: 'trust-onecent.receiver.update',
                                query: {
                                  trust_id: trustId,
                                  receiver_id: receiver.id,
                                },
                              }"
                              >{{ $t("update") }}</router-link
                            >
                            <button
                              @click="removeReceiver(receiver.id)"
                              class="btn btn-danger btn-sm"
                            >
                              {{ $t("remove") }}
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="receivers && receivers.length == 0">
                        <td colspan="6" class="text-center">
                          <h5 class="mt-5 mb-5">{{ $t("no-data") }}</h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <router-link
                :to="{
                  name: 'trust-onecent.part-f.moveable',
                  query: { trust_id: this.trustId, amendment_id: amendmentId },
                }"
                type="button"
                class="btn btn-primary"
              >
                {{ $t("next") }}
                <span
                  class="spinner-border spinner-border-sm"
                  v-if="submit"
                ></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      :no-enforce-focus="true"
      v-bind:title="$t('amendment.add-receiver')"
      ref="modalAddReceiver"
      class="modal fade"
      v-bind:ok-title="$t('add')"
      v-bind:cancel-title="$t('cancel')"
      @ok="submitForm"
    >
      <div class="modal-body">
        <div class="form-group" :class="{ 'has-error': $v.form.name.$error }">
          <label>
            {{ $t("name") }}
            <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            v-uppercase
            v-model.trim="$v.form.name.$model"
            class="form-control"
          />
          <div
            class="form-error"
            v-if="$v.form.name.$error && !$v.form.name.required"
          >
            Nama tidak boleh dibiarkan kosong.
          </div>
        </div>
        <div
          class="form-group"
          :class="{ 'has-error': $v.form.relationship.$error }"
        >
          <label>
            {{ $t("relationship") }}
            <span class="text-danger">*</span>
          </label>
          <select
            name="relationship"
            id="relationship"
            v-model.trim="$v.form.relationship.$model"
            class="form-control"
            @change="changeRelationship"
          >
            <option value>-- {{ $t("choose.relationship") }} --</option>
            <option
              v-for="relationship in relationships"
              :key="relationship"
              :value="relationship"
            >
              {{ relationship }}
            </option>
          </select>
          <div
            class="form-error"
            v-if="$v.form.relationship.$error && !$v.form.relationship.required"
          >
            Hubungan tidak boleh dibiarkan kosong.
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.ic_number.$error }"
            >
              <label>
                {{ $t("mykad") }}
                <span class="text-danger">*</span>
              </label>
              <the-mask
                id="ic_number"
                :mask="['######-##-####']"
                class="form-control"
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
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.email.$error }"
            >
              <label>
                {{ $t("email") }}
                <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                name="email"
                v-model.trim="$v.form.email.$model"
              />
              <div class="form-error" v-if="!$v.form.email.email">
                Anda telah memasukkan alamat emel yang tidak sah!
              </div>
              <div
                class="form-error"
                v-if="$v.form.email.$error && !$v.form.email.required"
              >
                Emel tidak boleh dibiarkan kosong.
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.mobile_number.$error }"
            >
              <label>
                {{ $t("mobile-no") }}
                <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                name="mobile_number"
                v-model.trim="$v.form.mobile_number.$model"
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
          <div class="col-md-6">
            <div class="form-group">
              <label>{{ $t("home-telno") }}</label>
              <input
                type="text"
                class="form-control"
                name="home_phone_number"
                v-model="form.home_phone_number"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div
              class="form-group"
              :class="{ 'has-error': $v.form.address.$error }"
            >
              <label
                >{{ $t("mailing-address")
                }}<span class="text-danger">*</span></label
              >
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customCheck1"
                  v-model="form.sameAddress"
                  @change="copyAddress"
                  value="1"
                />
                <label class="custom-control-label" for="customCheck1">
                  {{ $t("trust.same-address") }}
                </label>
              </div>
              <textarea
                v-uppercase
                class="form-control"
                :readonly="form.sameAddress == 1"
                id="address"
                rows="2"
                v-model.trim="$v.form.address.$model"
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
            <div class="form-group">
              <label for="postcode" class="d-block">
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
                id="postcode"
                class="form-control"
                @blur="getPostcode"
                :readonly="form.sameAddress == 1"
                v-model.lazy="form.postcode"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="city">{{ $t("city") }}</label>
              <input
                type="text"
                v-uppercase
                id="city"
                v-model="form.city"
                class="form-control"
                readonly
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="state">{{ $t("state") }}</label>
              <input
                type="text"
                v-uppercase
                class="form-control"
                id="state"
                v-model="form.state"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-6 form-group"
            :class="{ 'has-error': $v.mykad.frontUrl.$error }"
          >
            <label for="upload-photo-2">
              {{ $t("mykadcopy-front")
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
                <label
                  class="upload-photo-dark text-center"
                  for="upload-photo-2"
                  v-if="!mykad.frontUrl"
                >
                  <span>{{ $t("choose.mykadfront") }}</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  id="upload-photo-2"
                  class="upload-photo-input"
                  accept="image/*"
                  @change="filesChange($event.target.files, 'mykad-front')"
                />
              </div>
            </div>
            <div
              class="form-error"
              v-if="$v.mykad.frontUrl.$error && !$v.mykad.frontUrl.required"
            >
              Dokumen tidak boleh dibiarkan kosong.
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
                <label
                  class="upload-photo-dark text-center"
                  for="upload-photo-1"
                  v-if="!mykad.backUrl"
                >
                  <span>{{ $t("choose.mykadback") }}</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  id="upload-photo-1"
                  class="upload-photo-input"
                  accept="image/*"
                  @change="filesChange($event.target.files, 'mykad-back')"
                />
                <!-- <div class="p-2 bd-highlight">
                      <p href="#" class="text-white text-center m-0">Pilih</p>
                      <input
                        type="file"
                        class="form-control-file"
                        required
                        id="fileupload"
                      />
                    </div> -->
              </div>
            </div>
            <div
              class="form-error"
              v-if="$v.mykad.backUrl.$error && !$v.mykad.backUrl.required"
            >
              Dokumen tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      ref="modalPostcode"
      class="modal fade"
      v-bind:title="$t('add-newpostcode')"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
      @ok="storePostcode"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("postcode") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              class="form-control"
              v-model="formPostcode.postcode"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label>
              {{ $t("city") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.city"
            />
          </div>
          <div class="col-md-6 form-group">
            <label>
              {{ $t("state") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="formPostcode.state"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
