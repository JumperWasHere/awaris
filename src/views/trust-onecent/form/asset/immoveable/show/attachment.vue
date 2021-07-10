<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      propertyReceives: null,
      form: {
        document: null,
      },
      documents: null,
      document: null,
    };
  },
  computed: {
    ...mapGetters(["trust", "preference"]),

    trustId() {
      return this.$route.query.trust_id;
    },
    propertyId() {
      return this.$route.query.property_id;
    },
    documentUrl() {
      if (this.document) {
        return URL.createObjectURL(this.document);
      }
      return null;
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
  },
  mounted() {
    this.getDocuments();
  },
  methods: {
    getDocuments() {
      ApiService.get(`immoveable-property/${this.propertyId}/document`).then(
        (response) => {
          this.documents = response.data.documents ?? [];
        }
      );
    },
    filesChange(files) {
      this.document = files[0];
    },
    storeDocument() {
      const formData = new FormData();
      formData.append("document", this.document, this.document.name);
      formData.append("description", this.form.description);
      ApiService.post(
        `immoveable-property/${this.propertyId}/document`,
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
    <div class="text-right mt-3">
      <button
        v-b-modal.modal
        class="btn btn-primary btn-sm"
        v-if="[0, 1, 2].includes(trust.status) || amendmentId"
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
            <th>Dokumen/Lampuran</th>
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
                v-if="[0, 1, 2].includes(trust.status) || amendmentId"
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
    >
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-md-12">
            <label for="receiver_id"> Huraian </label>
            <input
              type="text"
              class="form-control"
              v-model="form.description"
            />
          </div>
          <div class="col-md-12 form-group">
            <label for="upload-photo-2"> Lampiran </label>
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
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>