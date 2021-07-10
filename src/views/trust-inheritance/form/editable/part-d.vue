<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { mapGetters } from "vuex";
import { UPDATE_HIBAH } from "@/services/store/amanah-pusaka.module";
import { required, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      submit: false,
    };
  },
  validations: {},
  mounted() {},
  methods: {
    async submitForm() {
      this.hibah._method = "PATCH";
      await this.$store.dispatch(UPDATE_HIBAH, {
        hibahId: this.hibah.id,
        payload: this.hibah,
      });

      this.$router.push({
        name: "trust-inheritance.heirs",
        query: {
          hibah_id: this.hibah.id,
        },
      });
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
        <h5 class="text-center">Tempoh Amanah</h5>
        <div class="row">
          <div class="form-group col-md-12">
            <label for="">Amanah akan berakhir apabila:</label>
            <div>
              <ol>
                <li class="mb-2">
                  Tempoh selama
                  <input
                    type="text"
                    v-uppercase
                    v-model="hibah.period"
                    class="form-control"
                    style="
                      width: 70px;
                      display: inline-block;
                      text-align: center;
                    "
                  />
                  tahun tapi tertakluk kepada kebenaran AMANAH WARISAN BERHAD.
                </li>
                <li>
                  Lain-lain (sila bagi keterangan) contoh terjadinya sesuatu
                  peristiwa/keadaan.

                  <br />
                  <div class="mt-2">
                    Lain-lain arahan:
                    <textarea
                      v-uppercase
                      name=""
                      cols="30"
                      rows="10"
                      class="form-control"
                      v-model="hibah.other_period_instructions"
                    ></textarea>
                  </div>
                </li>
              </ol>
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
  </div>
</template>
