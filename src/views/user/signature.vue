<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      signatureUrl: null,
    };
  },
  mounted() {
    this.getSignature();
  },
  computed: {
    ...mapGetters(["currentUser", "userRole", "userAccess"]),

    userId() {
      if (this.currentUser) {
        return this.currentUser.id;
      }
      return this.$route.params.user_id;
    },
  },
  methods: {
    clearSignaturePad() {
      this.$refs.signaturePad.clearSignature();
    },
    getSignature() {
      ApiService.get(`user/${this.currentUser.id}/signature?stream=false`).then(
        (response) => {
          console.log(response.data);
          this.signatureUrl = response.data.signature
            ? response.data.signature.public_path
            : null;
        }
      );
    },
    async saveSignature(bvModalEvt) {
      bvModalEvt.preventDefault();
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (isEmpty) {
        this.$notify({
          group: "full-noti",
          text: "Sila tandatangan terlebih dahulu",
          duration: 5000,
          type: "success",
        });
        return;
      }
      await ApiService.post(`/user/${this.userId}/signature`, {
        is_base64: true,
        document: data,
      }).then((response) => {
        console.log(response.data);
        this.signatureUrl = response.data.attachment.public_path;
        this.$nextTick(() => {
          this.$bvModal.hide("modalSignature");
        });
      });
    },
  },
};
</script>


<template>
  <div>
    <div class="text-center">
      <p>
        {{ $t("profile.sign-details") }}
      </p>
      <div
        v-if="signatureUrl"
        :style="'background-image: url(' + signatureUrl + ')'"
        class="signature-pad"
        style="
          width: 100%;
          max-width: 300px;
          height: 200px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
        "
      ></div>
      <div class="text-center">
        <button v-b-modal.modalSignature class="btn-secondary btn btn-sm">
          {{ $t("profile.set-sign") }}
        </button>
      </div>
    </div>

    <b-modal
      id="modalSignature"
      title="Ketetapan Tandatangan"
      ok-title="Simpan"
      cancel-title="Batal"
      @cancel="clearSignaturePad"
      @ok="saveSignature"
      ref="modalSignature"
    >
      <div class="form-group">
        <label for="">Tandatangan</label>
        <div class="shadow signature-pad">
          <VueSignaturePad
            style="position: absolute; z-index: 1"
            height="300px"
            width="100%"
            ref="signaturePad"
            :options="{
              onBegin: () => {
                $refs.signaturePad.resizeCanvas();
              },
            }"
          />
          <label
            style="
              z-index: 0;
              position: absolute;
              right: 0%;
              left: 0%;
              top: 45%;
              color: #b6b6b4;
              text-align: center;
            "
          >
            Tandatangan disini
          </label>
        </div>
      </div>
    </b-modal>
  </div>
</template>