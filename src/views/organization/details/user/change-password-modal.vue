<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      password: null,
      password_confirmation: null,
    };
  },
  methods: {
    showModal() {
      this.$root.$emit("bv::show::modal", "modal-1", "#btnShow");
    },
    hideModal() {
      this.$root.$emit("bv::hide::modal", "modal-1", "#btnShow");
    },
    toggleModal() {
      this.$root.$emit("bv::toggle::modal", "modal-1", "#btnToggle");
    },
    changePassword() {
      console.log(this.password);
      console.log(this.userId);
      ApiService.post(`user/${this.userId}/change-password`, {
        password: this.password,
      }).then((response) => {
        this.$swal.fire({
          icon: "success",
          html: "Kata laluan telah dikemaskini.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      });
    },
  },
  computed: {
    userId() {
      return this.$route.params.user_id;
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      id="modal-1"
      centered
      title="Tukar Kata Laluan"
      ok-title="Tukar"
      cancel-title="Batal"
      @ok="changePassword"
    >
      <div class="form-group">
        <label for="password">Kata Laluan Baru</label>
        <input
          type="text"
          name="new_password"
          v-model="password"
          id="new_password"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">Sahkan Kata Laluan</label>
        <input
          type="text"
          name="new_password"
          v-model="password_confirmation"
          id="new_password"
          class="form-control"
        />
      </div>
      <small>
        <i
          >Notifikasi e-mel dan SMS akan dihantar kepada pengguna, namun tiada
          kata laluan baru akan dihantar ke e-mel dan SMS bertujuan sekuriti.</i
        >
      </small>
    </b-modal>
  </div>
</template>