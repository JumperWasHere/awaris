<script>
import { TheMask } from "vue-the-mask";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        ic_number: "",
      },
      userId: null,
      trustId: null,
      wasiatId: null,
    };
  },
  validations: {
    form: {
      ic_number: {
        required,
        minLength: minLength(12),
        maxLength: maxLength(12),
      },
    },
  },
  components: { TheMask },
  computed: {
    ...mapGetters(["userRole", "currentUser", "wasiat"]),
    wasiat_details() {
      return this.wasiat;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    wasiat_id() {
      return this.$route.query.wasiat_id;
    },
  },
  watch: {
    wasiat: {
      handler: function (val) {
        if (this.wasiat) {
          this.form.ic_number = this.wasiat.user.ic_number;
        }
      },
    },
  },
  mounted() {},
  methods: {
    async nextPart() {
      if (this.wasiat_id) {
        this.$router.push({
          name: "wasiat.part_c",
          query: { wasiat_id: this.wasiat_id, pengesahan: this.pengesahan },
        });
        return;
      }
      this.userId = await this.getUser();
      if (!this.userId) {
        this.userId = await this.createUser();
      }

      if (this.userId) {
        this.wasiatId = await this.getWasiat();
      }
      if (this.wasiatId) {
        this.$router.push({
          name: "wasiat.part_c",
          query: { wasiat_id: this.wasiatId, pengesahan: this.pengesahan },
        });
      }
    },
    async submitForm() {
      if (this.wasiat_id) {
        this.$router.push({
          name: "wasiat.part_c",
          query: { wasiat_id: this.wasiat_id },
        });
        return;
      }
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
      this.userId = await this.getUser();
      if (!this.userId) {
        this.userId = await this.createUser();
      }

      if (this.userId) {
        this.wasiatId = await this.getWasiat();

        if (!this.wasiatId) {
          this.wasiatId = await this.createWasiat();
        }
      }
      console.log("ASD", this.wasiatId);
      if (this.wasiatId) {
        await this.updateUserDetail();
        this.$router.push({
          name: "wasiat.part_c",
          query: { wasiat_id: this.wasiatId },
        });
      }
    },
    async getUser() {
      return await ApiService.get(
        `user?ic_number=${this.form.ic_number}&username=${this.form.ic_number}&return_first=true`
      )
        .then((response) => {
          if (response.data.users) {
            console.log("user", response.data.users.id);
            // console.log("username", response.data.users.username);
            // console.log("ic_number", response.data.users.ic_number.id);
            // var user_details = response.data.users;
            // if (user_details.username == user_details.ic_number) {
            //   console.log("SAME IC AND USERNMAME");
            return response.data.users.id;
            // } else {
            //   return null;
            // }
          }
          return null;
        })
        .catch(() => {
          return null;
        });
    },
    async createUser() {
      return await ApiService.post("user", {
        ic_number: this.form.ic_number,
        username: this.form.ic_number,
      })
        .then((response) => {
          return response.data.user.id;
        })
        .catch(() => {
          return null;
        });
    },

    async getWasiat() {
      return await ApiService.get(`/wasiat?user_id=${this.userId}`)
        .then((response) => {
          console.log("getwasiat", response.data.wasiats.data[0].id);
          console.log("getwasiat no id", response.data.wasiats.data);
          return response.data.wasiats.data[0]
            ? response.data.wasiats.data[0].id
            : null;
        })
        .catch(() => {
          console.log("error -- get wasiat");
          return null;
        });
    },
    async createWasiat() {
      return await ApiService.post(`wasiat`, {
        agent_id: this.userRole != "Client" ? this.currentUser.id : null,
        user_id: this.userId,
        status: -1,
      }).then((response) => {
        console.log("ASDASD", response.data.wasiat.id);
        return response.data.wasiat.id;
      });
    },
    async updateUserDetail() {
      return await ApiService.post(`wasiat/${this.wasiatId}/user-detail`, {
        _method: "PATCH",
        ic_number: this.form.ic_number,
        designation: "Encik",
      })
        .then((response) => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center">{{ $t("account") }} AWARIS</h5>
        <div
          class="form-group"
          :class="{ 'has-error': $v.form.ic_number.$error }"
        >
          <label for="ic_number">{{ $t("mykad") }}</label>
          <span class="text-danger">*</span>
          <p class="form-control-static" v-if="wasiat">
            {{ wasiat.user.ic_number }}
          </p>
          <the-mask
            id="ic_number"
            :readonly="wasiat"
            v-if="!wasiat"
            :mask="['######-##-####']"
            class="form-control"
            v-model.trim="$v.form.ic_number.$model"
          />
          <div class="form-error" v-if="!$v.form.ic_number.minLength">
            No. MyKad hendaklah
            {{ $v.form.ic_number.$params.minLength.min }}
            karakter.
          </div>
          <div class="form-error" v-if="!$v.form.ic_number.maxLength">
            No. MyKad hendaklah
            {{ $v.form.ic_number.$params.maxLength.max }}
            karakter.
          </div>
          <div
            class="form-error"
            v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
          >
            No. MyKad tidak boleh dibiarkan kosong.
          </div>
        </div>
        <div class="form-group">
          <label for="hibah_type">{{ $t("product") }} </label>
          <p class="form-control-static">{{ $t("wasiat") }}</p>
        </div>
      </div>
    </div>
    <div
      class="text-right mt-3"
      v-if="[0].includes(wasiat ? wasiat.status : 0)"
    >
      <button @click="submitForm" class="btn btn-primary">
        {{ $t("save-next") }}
      </button>
    </div>
    <div
      class="text-right mt-3"
      v-if="wasiat && [1, 2].includes(wasiat.status)"
    >
      <button @click="nextPart" class="btn btn-primary">
        {{ $t("next") }}
      </button>
    </div>
  </div>
</template>