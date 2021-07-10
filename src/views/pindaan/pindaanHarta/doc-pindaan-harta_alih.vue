<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      doc: {
        document: null,
        description: null,
      },
      file: null,
      doc_array: [],
      amendment_status: null,
      amendment_id: null,
    };
  },
  validations: {
    doc: {
      description: {
        required,
      },
    },
    file: {
      required,
    },
  },
  components: {},
  methods: {
    btnmuatnaikdoc() {
      this.$v.$reset();
      this.doc.description = null;
      this.doc.type = null;
      this.file = null;
      this.$refs["modalMuatNaik"].show();
    },
    hideModal(bvModalEvt) {
      bvModalEvt.preventDefault();
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
      this.registerDoc();
    },
    filesChange(value) {
      this.doc.document = value[0];
      this.file = value[0].name;
    },
    registerDoc() {
      // console.log(this.doc.document);
      const formData = new FormData();
      formData.append("document", this.doc.document, "nama file");
      formData.append("description", this.doc.description);
      console.log(formData);
      ApiService.post(
        `/moveable-property/${this.property_id}/document`,
        formData
      )
        .then((response) => {
          this.doc_array.push(response.data.attachment);
          this.$refs["modalMuatNaik"].hide();
        })
        .catch((error) => {});
    },
    hideModalDoc() {},
    getdoclist() {
      ApiService.get(`/moveable-property/${this.property_id}/document`)
        .then((response) => {
          this.doc_array = response.data.documents ?? [];
          console.log(this.doc_array);
        })
        .catch((error) => {});
    },
    deleteDoc(index, id) {
      // let obj = ;
      ApiService.post(`/attachment/${id}`, { _method: "DELETE" })
        .then((response) => {
          // console.log(response.data);
          this.doc_array.splice(index, 1);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    displayDoc(public_path) {
      window.open(public_path, "_blank");
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            console.log("amendmentid", this.amendment_id);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
  },
  mounted() {
    if (!this.property_id) {
      this.$router.push({
        name: "pindaan.form-pindaan-harta-alih",
        params: { wasiat_id: this.wasiat_id },
        query: {
          pengesahan: pengesahan,
        },
      });
    } else {
      this.getdoclist();
      this.wasiatGetAmendment();
    }
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    property_id() {
      return this.$route.query.property_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    ...mapGetters(["isAuthenticated", "userAccess", "userRole", "currentUser"]),
  },
};
</script>

<template>
  <div class="row">
    <div class="col-lg-12 col-12 mb-4 mt-4 pb-2">
      <h5 class="text-center">MUAT NAIK DOKUMEN</h5>
      <form class="login-form">
        <div class="row d-flex justify-content-end">
          <div class="col-lg-12 d-flex justify-content-end">
            <b-btn
              class="btn-sm btn-primary"
              @click="btnmuatnaikdoc"
              v-if="[0, 1, 4].includes(amendment_status)"
              >Muat Naik Dokumen</b-btn
            >
          </div>
        </div>
        <div class="row mt-2">
          <!-- {{ doc_array }} -->
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">{{ $t("index") }}</th>
                    <th scope="col" class="text-left">
                      Nama Dokumen / Lampiran
                    </th>
                    <th scope="col" class="text-center">
                      {{ $t("action") }}
                    </th>
                  </tr>
                </thead>
                <tbody v-if="doc_array.length == 0">
                  <tr>
                    <td colspan="3" class="text-center">
                      <h5 class="mt-5">Tiada Dokumen</h5>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="doc_array.length > 0">
                  <tr v-for="(item, index) in doc_array" :key="index">
                    <td scope="col" class="text-center">{{ index + 1 }}</td>
                    <td scope="col" class="text-left">
                      {{ item.description }}
                    </td>
                    <td class="text-center">
                      <div
                        class="btn-group-vertical"
                        role="group"
                        aria-label="Vertical button group"
                      >
                        <b-button
                          tag="button"
                          class="btn btn-secondary btn-sm"
                          @click="displayDoc(item.public_path)"
                        >
                          {{ $t("view") }}
                        </b-button>
                        <b-button
                          tag="button"
                          v-if="[0, 1, 4].includes(amendment_status)"
                          class="btn btn-danger btn-sm"
                          @click="deleteDoc(index, item.id)"
                        >
                          {{ $t("remove") }}
                        </b-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <router-link
                v-if="[0, 1, 4].includes(amendment_status)"
                :to="{
                  name: 'pindaan.part_d-alih',
                  params: {
                    wasiat_id: this.wasiat_id,
                  },
                  query: {
                    pengesahan: pengesahan,
                  },
                }"
                class="btn btn-primary"
                >Simpan & Seterusnya</router-link
              >
            </div>
          </div>
        </div>
      </form>
    </div>
    <b-modal
      ref="modalMuatNaik"
      title="Muat Naik Dokumen"
      @ok="hideModal"
      @cancel="hideModalDoc"
    >
      <div class="card-body">
        <div
          class="form-group"
          :class="{ 'has-error': $v.doc.description.$error }"
        >
          <label for="description"
            >Nama Dokumen <span class="text-danger">*</span></label
          >
          <input
            type="text"
            v-uppercase
            name="description"
            id="description"
            class="form-control"
            placeholder="Nama Dokumen"
            v-model.trim="$v.doc.description.$model"
          />
          <div
            class="form-error"
            v-if="$v.doc.description.$error && !$v.doc.description.required"
          >
            Nama Dokumen tidak boleh dibiarkan kosong.
          </div>
        </div>
        <label
          class="upload-photo-dark-text btn-sm btn-info btn-upload"
          for="upload-photo"
          >+ {{ $t("add-doc") }}<span class="text-danger">*</span></label
        >
        <input
          type="file"
          name="photo"
          id="upload-photo"
          accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
          @change="filesChange($event.target.files)"
        />
        <div class="mt-3">Selected file: {{ file ? file : "-" }}</div>
      </div>
    </b-modal>
  </div>
</template>
