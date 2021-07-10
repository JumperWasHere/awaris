<script>
import { ArrowUpIcon } from "vue-feather-icons";
import ApiService from "@/services/api.service";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      file: null,
    };
  },
  mounted() {
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },

  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    filesChange(files) {
      this.file = files[0];
    },
    async registerDoc(files, other) {
      console.log("registerDoc", files, "|", type);
      var temp;
      if (other) {
        temp = other;
      } else {
        const formData = new FormData();
        formData.append("document", files, "nama file");
        formData.append("type", type);
        formData.append("description", type);
        temp = formData;
      }
      return await ApiService.post(
        `/wasiat/bmmb-loan-status/document?action=replace`,
        temp
      )
        .then((response) => {
          console.log("register doc");
          return true;
        })
        .catch((error) => {
          console.log("error doc");
          return false;
        });
    },
    async submitFile() {
      const formData = new FormData();
      formData.append("document", this.file, "nama file.xlsx");
      return await ApiService.post(
        `/wasiat/bmmb-loan-status`, formData
      )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            html:
              "Data pembiayaan telahpun dikemaskini. Sila rujuk senarai wasiat dalam proses untuk langkah selanjutnya.",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "Tutup",
          });
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<template>
  <div>
    <Navbar :nav-light="true" />
    <section class="bg-half bg-primary d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title text-white" style="text-transform: capitalize">
                Laporan Pembiayaan BMMB
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div
        class="container card public-profile border-0 rounded shadow overflow-hidden"
      >
        <div class="card-body">
          <h5 class="text-center">BMMB LOAN REPORT</h5>
          <div class="row text-center mt-4">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12 text-center">
                  <div class="row d-flex justify-content-center">
                    <div class="form-group">
                      <label for="upload-photo-2">
                        Muat Naik Dokumen
                        <span class="text-danger">*</span>
                      </label>
                      <div>
                        <input type="file" class="form-control" id="customFile" name="document" @change="filesChange($event.target.files)"/>
                        <b-button
                      class="btn btn-primary m-1"
                      @click="submitFile"
                    >
                      Hantar
                    </b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    <a
      href="javascript: void(0);"
      class="btn btn-icon btn-soft-primary back-to-top"
      id="back-to-top"
      v-scroll-to="'#topnav'"
    >
      <arrow-up-icon class="icons"></arrow-up-icon>
    </a>
  </div>
</template>
