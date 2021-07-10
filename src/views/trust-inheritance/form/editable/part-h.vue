<script>
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import { UPDATE_HIBAH } from "@/services/store/amanah-pusaka.module";
import { required, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      form: {},
      submit: false,
    };
  },
  validations: {},
  mounted() {
    this.form = this.$store.getters.hibah;
  },
  methods: {
    async submitForm() {
      this.form._method = "PATCH";
      await this.$store.dispatch(UPDATE_HIBAH, {
        hibahId: this.hibah.id,
        payload: this.form,
      });
      return;
    },
  },
  computed: {
    ...mapGetters(["hibah"]),
    locale() {
      return this.$i18n.locale;
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
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
        <h5 class="text-center mb-4">
          Pengagihan dan Pembahagian Semasa Hayat Pemberi
        </h5>
        <div class="row">
          <div class="form-group col-md-12">
            <label for=""
              >Hak dan Cara Pengagihan Harta Amanah Kepada Waris</label
            >
            <div>
              <span>Arahan Pengagihan:</span>
              <textarea
                name=""
                cols="30"
                rows="10"
                class="form-control"
                v-model="form.distribution_lifetime_instruction"
              ></textarea>
            </div>
          </div>
        </div>
        <hr class="primary" />
        <h5 class="text-center mb-4">
          Pengagihan dan Pembahagian Selepas Kematian Pemberi
        </h5>
        <div class="row">
          <div class="form-group col-md-12">
            <label for=""
              >Hak dan Cara Pengagihan Harta Amanah Kepada Waris</label
            >
            <div>
              <span>Arahan Pengagihan:</span>
              <textarea
                name=""
                cols="30"
                rows="10"
                class="form-control"
                v-model="form.distribution_after_death_instruction"
              ></textarea>
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
            Simpan & Hantar
            <span class="spinner-border spinner-border-sm" v-if="submit"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
