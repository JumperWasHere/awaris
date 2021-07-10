<script>
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import {
  CHECK_USER,
  CREATE_USER,
  GET_HIBAH,
  CREATE_HIBAH,
  UPDATE_USER_DETAIL,
} from "@/services/store/amanah-pusaka.module";

export default {
  data() {
    return {
      ic_number: null,
    };
  },
  validations: {},
  components: { TheMask },
  computed: {
    ...mapGetters(["user", "hibah", "userDetail"]),
  },
  mounted() {},
  methods: {
    async submitForm() {
      if (this.hibah) {
        this.$router.push({
          name: "trust-inheritance.giver",
          query: {
            hibah_id: this.hibah.id,
          },
        });
        return;
      }

      var vm = this;
      // check user existance
      await vm.$store.dispatch(CHECK_USER, this.ic_number);
      if (!vm.$store.getters.user) {
        // create user since not exists
        await vm.$store.dispatch(CREATE_USER, {
          ic_number: this.ic_number,
          username: this.ic_number,
        });
      }

      var user = vm.$store.getters.user;

      // check hibah with type=14 existance
      await vm.$store.dispatch(GET_HIBAH, user.id);

      if (!vm.$store.getters.hibah) {
        // create hibah since not exists
        await vm.$store.dispatch(CREATE_HIBAH, {
          user_id: user.id,
          hibah_type: 14,
          organization_id: 1,
        });
      }
      var hibah = vm.$store.getters.hibah;

      await vm.$store.dispatch(UPDATE_USER_DETAIL, {
        hibahId: hibah.id,
        payload: {
          _method: "PATCH",
          ic_number: this.ic_number,
        },
      });
      this.$router.push({
        name: "trust-inheritance.giver",
        query: {
          hibah_id: hibah.id,
        },
      });
    },
  },
  watch: {
    trust: {},
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="card bg-light job-box rounded shadow border-0 overflow-hidden">
      <div class="card-body">
        <h5 class="text-center">{{ $t("awaris-account") }}</h5>
        <div class="form-group" v-if="hibah">
          <label for="hibah_type"> {{ $t("mykad") }}</label>
          <p class="form-control-static" v-if="hibah.user_detail">
            {{ hibah.user_detail.ic_number_dash }}
          </p>
        </div>
        <div class="form-group" v-else>
          <label for="ic_number"> {{ $t("mykad") }}</label>
          <span class="text-danger">*</span>
          <p class="form-control-static"></p>
          <the-mask
            v-model="ic_number"
            id="ic_number"
            :mask="['######-##-####']"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="hibah_type"> {{ $t("trust.type") }}</label>
          <p class="form-control-static">Amanah Harta Pusaka</p>
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