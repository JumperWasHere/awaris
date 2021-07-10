<script>
import { TheMask } from "vue-the-mask";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        ic_number: "",
      },
      userId: null,
      // trustId: null,
    };
  },
  validations: {
    form: {
      ic_number: {
        required,
      },
    },
  },
  components: { TheMask },

  computed: {
    ...mapGetters(["trust", "userRole", "currentUser"]),
    createdTrust() {
      return this.trust;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    hibahType() {
      if (this.trust) {
        return this.trust.hibah_type;
      }
      return this.$route.query.type;
    },
    hibahTypeString() {
      if (this.hibahType == 1) {
        return "Deklarasi Hibah Amanah Korporat";
      } else if (this.hibahType == 2) {
        return "Deklarasi Amanah Korporat";
      } else if (this.hibahType == 3) {
        return "Deklarasi Hibah Amanah Tunai";
      } else if (this.hibahType == 4) {
        return "Deklarasi Amanah Tunai";
      } else if (this.hibahType == 5) {
        return "Deklarasi Hibah Amanah Hartanah";
      } else if (this.hibahType == 6) {
        return "Deklarasi Amanah Hartanah";
      } else if (this.hibahType == 7) {
        return "Hibah Amanah Tunai";
      } else if (this.hibahType == 8) {
        return "Amanah Tunai";
      } else if (this.hibahType == 9) {
        return "Hibah Amanah Hartanah";
      } else if (this.hibahType == 10) {
        return "Amanah Hartanah";
      } else if (this.hibahType == 11) {
        return "Amanah Perniagaan";
      }
    },
  },
  mounted() {
    if (this.type && this.userRole == "Client") {
      // this.form.ic_number = this.
    }
  },
  methods: {
    async submitForm() {
      var trustId;
      if (this.trustId && this.trust.status != 0) {
        this.$router.push({
          name: "trust.part-b",
          query: { trust_id: this.trustId, amendment_id: this.amendmentId },
        });
        return;
      }

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (this.userRole == "Client") {
        if (this.currentUser.ic_number == this.form.ic_number) {
          this.userId = await this.getUser();
          console.log("true - same - ic_number");
        } else {
          this.$swal.fire({
            icon: "error",
            html: "No Mykad anda tidak benar",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          console.log("false - different - ic_number");
          return;
        }
      } else {
        this.userId = await this.getUser();
      }
      if (!this.userId) {
        this.userId = await this.createUser();
      }

      if (this.userId) {
        trustId = await this.getHibah();
        if (!trustId) {
          trustId = await this.createHibah();
        }
      }
      console.log("ASD", trustId);
      if (trustId) {
        await this.updateUserDetail(trustId);
        this.$router.push({
          name: "trust.part-b",
          query: { trust_id: trustId, amendment_id: this.amendmentId },
        });
      }
    },
    async getUser() {
      return await ApiService.get(
        `user?ic_number=${this.form.ic_number}&return_first=true`
      )
        .then((response) => {
          if (response.data.users) {
            return response.data.users.id;
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

    async getHibah() {
      return await ApiService.get(
        `hibah?hibah_type=${this.hibahType}&user_id=${this.userId}&return_first=true`
      )
        .then((response) => {
          return response.data.hibahs ? response.data.hibahs.id : null;
        })
        .catch(() => {
          return null;
        });
    },
    async createHibah(userId) {
      return await ApiService.post(`hibah`, {
        agent_id: this.userRole != "Client" ? this.currentUser.id : null,
        user_id: this.userId,
        hibah_type: this.hibahType,
        status: -1,
      }).then((response) => {
        console.log("ASDASD", response.data.hibah.id);
        return response.data.hibah.id;
      });
    },
    async updateUserDetail(trustId) {
      return await ApiService.post(`hibah/${trustId}/user-detail`, {
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
  },
  watch: {
    trust: {
      handler: function (val) {
        this.form.ic_number = this.trust.user.ic_number;
      },
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center">{{ $t("awaris-account") }}</h5>

        <div
          class="form-group"
          :class="{ 'has-error': $v.form.ic_number.$error }"
        >
          <label for="ic_number"> {{ $t("mykad") }}</label>
          <span class="text-danger">*</span>
          <p class="form-control-static" v-if="trust">
            {{ trust.user.ic_number }}
          </p>
          <the-mask
            id="ic_number"
            :readonly="trust"
            v-if="!trust"
            :mask="['######-##-####']"
            class="form-control"
            v-model.trim="$v.form.ic_number.$model"
          />
          <div
            class="form-error"
            v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
          >
            No. MyKad tidak boleh dibiarkan kosong.
          </div>
        </div>
        <div class="form-group">
          <label for="hibah_type"> {{ $t("trust.type") }}</label>
          <p class="form-control-static">{{ hibahTypeString }}</p>
        </div>
      </div>
    </div>
    <div class="text-right mt-3">
      <button @click="submitForm" class="btn btn-primary">
        {{ $t("save-next") }}
      </button>
    </div>
  </div>
</template>