<script>
import ApiService from "@/services/api.service";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      propertyReceives: null,
      form: {
        description: null,
      },
      documents: null,
      document: null,
    };
  },
  validations: {
    form: {
      description: {
        required,
      },
    },
    document: {
      required,
    },
  },
  computed: {
    ...mapGetters(["trust", "preference", "amendment"]),

    trustId() {
      return this.$route.query.trust_id;
    },
    propertyId() {
      return this.$route.query.property_id;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    documentUrl() {
      if (this.document) {
        return URL.createObjectURL(this.document);
      }
      return null;
    },
    addnewAddDoc() {
      if (this.trust && [0, 1, 2].includes(this.trust.status)) {
        return true;
      } else if (
        this.amendmentId &&
        this.amendment &&
        [0, 1].includes(this.amendment.status)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.getDocuments();
  },
  methods: {
    getDocuments() {
      ApiService.get(`moveable-property/${this.propertyId}/document`).then(
        (response) => {
          this.documents = response.data.documents ?? [];
        }
      );
    },
    filesChange(files) {
      this.document = files[0];
    },
    storeDocument() {
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
      const formData = new FormData();
      formData.append("document", this.document, this.document.name);
      formData.append("description", this.form.description);
      ApiService.post(
        `moveable-property/${this.propertyId}/document`,
        formData
      ).then((response) => {
        this.getDocuments();
        this.document = null;
        this.form.description = null;
      });
    },
    removeAttachment(doc) {
      ApiService.post(`/attachment/${doc.id}`, {
        _method: "DELETE",
      }).then(() => {
        this.getDocuments();
      });
    },
  },
};
</script>


<template>
  <div>
    <div class="text-right mt-3 mr-2">
      <button
        v-b-modal.modal
        class="btn btn-primary btn-sm"
        v-if="addnewAddDoc"
      >
        Tambah Baru
      </button>
    </div>
    <div class="table-responsive mt-3 mb-5">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Bil.</th>
            <th>Butiran</th>
            <th>Dokumen/Lampiran</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(doc, index) in documents" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ doc.description }}</td>
            <td>
              <a target="_blank" :href="doc.public_path">{{
                doc.original_filename
              }}</a>
            </td>
            <td class="text-right">
              <button
                @click="removeAttachment(doc)"
                class="btn btn-danger btn-sm"
                v-if="addnewAddDoc"
              >
                Buang
              </button>
            </td>
          </tr>
          <tr v-if="documents && documents.length == 0">
            <td colspan="4" class="text-center">
              <h5 class="pt-5 pb-5">Tiada Data</h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal
      id="modal"
      title="Tambah Dokumen/Lampiran"
      ok-title="Simpan"
      cancel-title="Batal"
      @ok="storeDocument"
      :no-enforce-focus="true"
    >
      <div class="modal-body">
        <div class="row">
          <div
            class="form-group col-md-12"
            :class="{ 'has-error': $v.form.description.$error }"
          >
            <label for="receiver_id"> Huraian </label>
            <span class="text-danger">*</span>
            <input
              type="text"
              v-uppercase
              class="form-control"
              v-model.trim="$v.form.description.$model"
            />
            <div
              class="form-error"
              v-if="$v.form.description.$error && !$v.form.description.required"
            >
              Huraian tidak boleh dibiarkan kosong.
            </div>
          </div>
          <div
            class="col-md-12 form-group"
            :class="{ 'has-error': $v.document.$error }"
          >
            <!-- <div class="col-md-12 form-group"> -->
            <label for="upload-photo-2"> Lampiran </label>
            <span class="text-danger">*</span>
            <div class="card rounded shadow bg-dark">
              <div
                class="d-flex align-items-center justify-content-center bd-highlight"
                style="height: 150px"
              >
                <label
                  v-if="documentUrl"
                  :style="'background-image: url(' + documentUrl + ');'"
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
                  v-if="!documentUrl"
                >
                  <span>Pilih Salinan</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  id="upload-photo-2"
                  class="upload-photo-input"
                  accept="image/*"
                  @change="filesChange($event.target.files)"
                />
              </div>
            </div>
            <div
              class="form-error"
              v-if="$v.document.$error && !$v.document.required"
            >
              Dokumen tidak boleh dibiarkan kosong.
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>