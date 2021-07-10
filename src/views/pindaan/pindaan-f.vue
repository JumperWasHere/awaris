<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center mb-4" style="text-transform: uppercase">
              {{ $t("amendment.will-order") }}
            </h5>
            <form class="login-form">
              <div class="row d-flex justify-content-center">
                <div class="col-lg-12">
                  <div class="form-group">
                    <!-- <client-only> -->
                    <quill-editor
                      ref="editor"
                      v-model="content"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                      @change="onEditorChange($event)"
                    />
                    <!-- <div class="output code">
      <code class="hljs" v-html="contentCode"></code>
    </div>
    <div class="output ql-snow">
      <div class="ql-editor" v-html="content"></div>
    </div> -->
                    <!-- </client-only> -->
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <b-button
                class="btn btn-primary"
                @click="simpanMessage"
                v-if="[0, 1].includes(amendment_status)"
              >
                {{ $t("save-next") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dedent from "dedent";
import hljs from "highlight.js";
import debounce from "lodash/debounce";
import { quillEditor } from "vue-quill-editor";
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

// highlight.js style
import "highlight.js/styles/tomorrow.css";

// import theme style
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
export default {
  name: "quill-example-nuxt",
  components: {
    quillEditor,
  },
  data() {
    return {
      content: "<p>Sila Tinggalkan Pesanan.... </p>",
      editorOption: {
        // Some Quill options...
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
      },
      amendment_id: null,
      amendment_status: null,
    };
  },
  mounted() {
    console.log(
      "App inited, the Quill instance object is:",
      this.$refs.editor.quill
    );
    this.wasiatGetAmendment();
  },
  methods: {
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },
    nextPage() {
      this.$router.push({
        name: "pindaan.part_g",
        params: {
          wasiat_id: this.wasiat_id,
        },
        query: {
          pengesahan: this.pengesahan,
        },
      });
    },
    async updateStatusAmendment(obj) {
      return await ApiService.post(`/amendment/${this.amendment_id}`, obj)
        .then((response) => {
          console.log(response);
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async simpanMessage() {
      let obj = {};
      obj._method = "PATCH";
      obj.notes = this.content;
      if (this.amendment_status == 0) {
        obj.status = 0;
      } else if (this.amendment_status == 1 && this.userRole == "Staff") {
        obj.status = 1;
      }
      var resultUpdate = await this.updateStatusAmendment(obj);
      if (resultUpdate || ![0, 1].includes(this.amendment_status)) {
        this.$router.push({
          name: "pindaan.part_g",
          params: {
            wasiat_id: this.wasiat_id,
          },
          query: {
            pengesahan: this.pengesahan,
          },
        });
      }
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          // if(Array.isArray(response.data.amendments.data) && )
          var data_amendment = response.data.amendments.data;
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            this.content = data_amendment[0].notes;
            console.log("amendmentid", this.content);
          }

          // console.log(response.data.amendments.data);
        })
        .catch((error) => {});
    },
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    contentCode() {
      return hljs.highlightAuto(this.content).value;
    },
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

<style lang="scss" scoped>
.container {
  width: 60%;
  margin: 0 auto;
  padding: 50px 0;
  .quill-editor {
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>