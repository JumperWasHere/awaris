<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      wasiat: null,
      users: [],
      postcode: null,
      signature: {
        public_path: null,
      },
      signaturePath: null,
      signatureCheck: null,
      witness_id: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      email: {
        required,
      },
      ic_number: {
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
    checkValidation() {
      this.$v.$touch();
      return !this.$v.$invalid;
    },
    formAddPostcode() {
      this.$emit("formAddPostcode");
    },
    getUsers() {
      ApiService.get(`/organization/${this.wasiat.organization_id}/user?witness_listing=1&limit=500`)
        .then((response) => {
          this.users = response.data.user_accesses.data;
          this.signature.public_path = response.data.signature.public_path;
        })
        .catch((error) => {});
    },
    getAwarisOrg() {
      ApiService.get(`/organization?type=Awaris`)
        .then((response) => {
          this.staffOrgID = response.data.organizations.data[0].id;
          this.getStaff();
          console.log("get awaris", response.data);
        })
        .catch((error) => {});
    },
    async getStaff() {
      ApiService.get(`/organization/${this.staffOrgID}/user`)
        .then((response) => {
          this.users = response.data.user_accesses.data;
        })
        .catch((error) => {});
    },
    getWasiat() {
      ApiService.get(`/wasiat/${this.wasiatId}`).then((response) => {
        var wasiat = response.data.wasiat;
        if (wasiat && wasiat.status != 1) {
          this.wasiat = wasiat;
          this.getUsers();
        } else if (wasiat && wasiat.status == 1) {
          this.wasiat = wasiat;
          this.getAwarisOrg();
        }
      });
    },
    fillSaksiForm() {
      var accessible = this.users[this.form.currentIndex];
      this.signature.public_path = null;
      if (this.form.currentIndex >= 0) {
        if (accessible.user.signature) {
          this.form.signature_id = accessible.user.signature.id;
          console.log("Signature url: ", accessible.user.signature.public_path);
          this.signature.public_path = accessible.user.signature.public_path;
        } else {
          this.$swal.fire({
            icon: "error",
            html: "Pengguna yang dipilih tiada tandatangan digital.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          this.$notify({
            group: "full-noti",
            title: "Pengguna yang dipilih tiada tandatangan digital.",
            duration: 5000,
            type: "success",
          });
        }
        this.form.name = accessible.user.name;
        this.form.ic_number = accessible.user.ic_number;
        this.form.email = accessible.user.email;
        this.form.address = accessible.user.address;
        this.form.postcode = accessible.user.postcode;
        this.postcode = accessible.postcode;
        this.postcode = accessible.user.postcode;
        this.form.city = accessible.user.city;
        this.form.state = accessible.user.state;
        this.form.newWitness = false;
      }
      if (this.form.currentIndex == -1) {
        this.form.name = null;
        this.form.ic_number = null;
        this.form.email = null;
        this.form.address = null;
        this.form.postcode = null;
        this.postcode = null;
        this.postcode = null;
        this.form.city = null;
        this.form.state = null;
        this.form.newWitness = true;
      }
    },
    getPostcode() {
      if (this.form.postcode) {
        ApiService.get(`postcode/${this.form.postcode}`)
          .then((response) => {
            var postcode = response.data.postcode;
            if (postcode != null) {
              this.form.city = postcode.city;
              this.form.state = postcode.state;
            }
          })
          .catch(() => {
            this.form.city = "";
            this.form.state = "";
          });
      }
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  computed: {
    wasiatId() {
      return this.$route.query.wasiat_id;
    },
  },
  components: { TheMask },
  props: {
    form: {
      type: Object,
    },
  },
  mounted() {
    if (this.wasiatId) {
      this.getWasiat();
    }
  },
  watch: {
    postcode: {
      handler: function (val) {
        this.form.postcode = val;
        this.getPostcode();
      },
    },
  },
};
</script>
<template>
  <div class="pl-3 pr-3" id="divCard">
    <div class="form-group">
      <label for="current_user">{{ $t("witnessmodal.title") }}</label>
      <select
        name
        id="current_user"
        class="form-control"
        v-model="form.currentIndex"
        @change="fillSaksiForm"
      >
        <option value="-2"></option>
        <option value="-1">-- {{ $t("witnessmodal.add-witness") }} --</option>
        <option
          :value="index"
          v-for="(accessible, index) in users"
          :key="index"
        >
          {{ accessible.user.name }} ({{ accessible.role }})
        </option>
      </select>
    </div>
    <div v-if="form.currentIndex >= -1">
      <div class="form-group" :class="{ 'has-error': $v.form.name.$error }">
        <label>{{ $t("fullname") }}</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          v-uppercase
          class="form-control"
          v-model.trim="$v.form.name.$model"
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
        :class="{ 'has-error': $v.form.ic_number.$error }"
      >
        <label>{{ $t("mykad") }}</label>
        <span class="text-danger">*</span>
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
      <div class="form-group" :class="{ 'has-error': $v.form.email.$error }">
        <label>E-mel</label>
        <span class="text-danger">*</span>
        <input
          type="text"
          class="form-control"
          v-model.trim="$v.form.email.$model"
        />
        <div
          class="form-error"
          v-if="$v.form.email.$error && !$v.form.email.required"
        >
          E-mel tidak boleh dibiarkan kosong.
        </div>
      </div>
      <div
        class="form-group mb-1"
        :class="{ 'has-error': $v.form.address.$error }"
      >
        <label for="exampleTextarea">
          {{ $t("address") }}
          <span class="text-danger">*</span>
        </label>
        <textarea
          v-uppercase
          class="form-control"
          v-model.trim="$v.form.address.$model"
          rows="2"
          value
        ></textarea>
        <div
          class="form-error"
          v-if="$v.form.address.$error && !$v.form.address.required"
        >
          Alamat tidak boleh dibiarkan kosong.
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-4">
          <div
            class="form-group"
            :class="{ 'has-error': $v.form.postcode.$error }"
          >
            <label for="postcode" class="d-block">
              <div class="d-flex align-items-center">
                <span>{{ $t("postcode") }}</span>
                <span class="text-danger">*</span>
              </div>
            </label>
            <input
              type="number"
              id="postcode"
              class="form-control"
              @blur="getPostcode"
              v-model.lazy.trim="$v.form.postcode.$model"
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
            <label for="exampleSelect1"> {{ $t("city") }} </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="form.city"
              readonly
            />
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="exampleSelect1"> {{ $t("state") }} </label>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model="form.state"
              readonly
            />
          </div>
        </div>
      </div>
      <div class="row mt-3" v-if="signature.public_path">
        <div class="col-md-12">
          <div class="form-group">
            <label for="signature" class="d-block">{{
              $t("profile.signature")
            }}</label>
            <div class="d-flex align-items-center">
              <img
                :src="signature.public_path"
                alt=""
                style="
                  width: 70%;
                  border: 1px solid #ddd;
                  border-radius: 15px;
                  margin-left: auto;
                  margin-right: auto;
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
