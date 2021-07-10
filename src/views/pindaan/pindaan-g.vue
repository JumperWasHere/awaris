<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      amendment_id: null,
      amendment_status: null,
      doc_array: [],
      file: null,

      doc: {
        description: null,
        document: null,
        type: null,
      },
      btnMycardFront: false,
      btnMycardBack: false,
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
    addDocument() {
      this.$v.$reset();
      this.doc.description = null;
      this.doc.type = null;
      this.file = null;
      this.$refs["addDocument"].show();
    },
    saveDocument(bvModalEvt) {
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
    Batal() {},
    displayDoc(item) {
      window.open(item.public_path, "_blank");
    },
    registerDoc() {
      const formData = new FormData();
      formData.append("description", this.doc.description);
      formData.append("document", this.doc.document, "nama file");
      if (this.doc.type) {
        formData.append("type", this.doc.type);
      } else {
        formData.append("type", "Extra");
      }
      ApiService.post(`/amendment/${this.amendment_id}/document`, formData)
        .then((response) => {
          this.doc_array.push(response.data.attachment);
          console.log(response.data.attachment);
          this.$refs["addDocument"].hide();
          // var tempType = response.data.attachment.type == "MAIN";
          // console.log(tempType);
          if (response.data.attachment.type == "mykad-front") {
            // console.log("tempType != 0");
            this.btnMycardFront = true;
            this.doc.description = null;
            this.doc.type = null;
          }
          if (response.data.attachment.type == "mykad-back") {
            // console.log("tempType != 0");
            this.btnMycardBack = true;
            this.doc.description = null;
            this.doc.type = null;
          }
          console.log(response.data);
        })
        .catch((error) => {});
    },
    getdoc(amendment_id) {
      ApiService.get(
        `/amendment/${amendment_id}/document?except_type=mykad-front,mykad-back`
      )
        .then((response) => {
          this.doc_array = response.data.attachments.data ?? [];
          console.log("array list", this.doc_array);
          var tempType = this.doc_array.filter(
            (item) => item.type == "mykad-front"
          );
          if (tempType.length != 0) {
            // console.log(tempType);
            this.btnMycardFront = true;
          }
          console.log(this.doc_array);
        })
        .catch((error) => {});
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_id = data_amendment[0].id;
            this.amendment_status = data_amendment[0].status;

            this.getdoc(data_amendment[0].id);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
    filesChange(value) {
      this.doc.document = value[0];
      this.file = value[0].name;
    },
    deleteDoc(id, index, type) {
      ApiService.post(`/attachment/${id}`, { _method: "DELETE" })
        .then((response) => {
          console.log(response.data);
          this.doc_array.splice(index, 1);
          if (type == "mykad-front") {
            // console.log("tempType != 0");
            this.btnMycardFront = false;
          }
          if (type == "mykad-back") {
            // console.log("tempType != 0");
            this.btnMycardBack = false;
          }
        })
        .catch((error) => {
          console.log("error");
        });
    },
    // icUploadFront() {
    //   this.doc.description = "Salinan kad pengenalan pewasiat depan";
    //   this.doc.type = "mykad-front";
    //   this.$refs["addDocument"].show();
    // },
    // icUploadBack() {
    //   this.doc.description = "Salinan kad pengenalan pewasiat belakang";
    //   this.doc.type = "mykad-back";
    //   this.$refs["addDocument"].show();
    // },
  },
  mounted() {
    this.wasiatGetAmendment();
  },
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
    ...mapGetters(["isAuthenticated", "currentUser", "userAccess", "userRole"]),
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("document") }}
            </h5>
            <form class="login-form">
              <div class="row d-flex justify-content-start">
                <div class="col-md-10">
                  <div class="form-group">
                    <h6>{{ $t("upload-doc") }}:</h6>
                  </div>
                </div>
              </div>

              <div class="row d-flex justify-content-start">
                <div class="col-md-12">
                  <ul>
                    <li>
                      {{ $t("other-doc") }}
                      <img
                        content="
                        <b> Contoh:</b><br />
                          <a> Salinan MyKad / Sijil Kematian Waris Faraid, </a>

                          <a>Salinan MyKad Penerima,</a>
                          <a> Sijil Nikah,</a>
                          <a> Sijil Pengangkatan Anak,</a>
                          <a> Kad OKU,</a>
                          <a> Perjanjian Pinjaman,</a>
                          <a> Sijil Penceraian Perkahwinan</a>"
                        v-tippy
                        height="20"
                        class="mb-1"
                        src="/images/icon/info-button.png"
                      />
                      <b-button
                        class="btn-sm btn-info d-block"
                        @click="addDocument"
                        v-if="[0, 1].includes(amendment_status)"
                        >{{ $t("add-doc") }}</b-button
                      >
                    </li>
                  </ul>
                </div>
              </div>
              <div class="row d-flex justify-content-end mb-4"></div>
              <div class="row mt-2">
                <div class="table-responsive">
                  <table class="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col">{{ $t("index") }}</th>
                        <th scope="col">{{ $t("doc-name") }}</th>
                        <th class="text-center" scope="col">
                          {{ $t("action") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="doc_array.length == 0">
                      <tr>
                        <td colspan="4" class="text-center">
                          <h6 class="mt-5 mb-3">Tiada Dokumen</h6>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-if="doc_array.length > 0">
                      <tr v-for="(item, index) in doc_array" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.description }}</td>
                        <td class="text-center">
                          <div
                            class="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <b-button
                              class="btn-sm btn-secondary"
                              @click="displayDoc(item)"
                            >
                              <img
                                src="/images/icon/view.svg"
                                alt=""
                                height="13"
                              />
                            </b-button>
                            <b-button
                              v-if="[0, 1, 4].includes(amendment_status)"
                              class="btn-sm btn-danger"
                              @click="deleteDoc(item.id, index, item.type)"
                            >
                              <img
                                src="/images/icon/trash.png"
                                alt=""
                                height="13"
                              />
                            </b-button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <router-link
                v-if="[0, 1].includes(amendment_status)"
                :to="{
                  name: 'pindaan.part_h',
                  params: {
                    wasiat_id: this.wasiat_id,
                  },
                  query: {
                    pengesahan: this.pengesahan,
                  },
                }"
                class="btn btn-primary"
                >{{ $t("save-next") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-bind:title="$t('add-doc')"
      ref="addDocument"
      @ok="saveDocument"
      @cancel="Batal"
      v-bind:ok-title="$t('save')"
      v-bind:cancel-title="$t('cancel')"
    >
      <div class="card-body">
        <div
          class="form-group"
          :class="{ 'has-error': $v.doc.description.$error }"
        >
          <label for="description"
            >{{ $t("doc-name") }}<span class="text-danger">*</span></label
          >
          <input
            v-uppercase
            :disabled="doc.type"
            type="text"
            id="description"
            class="form-control"
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
