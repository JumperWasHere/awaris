
<script>
import { TheMask } from "vue-the-mask";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      file: null,
      newRelationship: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      ic_number: {
        required,
      },
      relationship: {
        required,
      },
    },
  },
  components: { TheMask },
  props: {
    form: {
      type: Object,
    },
    doc: {
      type: Object,
    },
  },
  methods: {
    formAddPostcode() {
      //   this.$refs["formAddPostcode"].show();
      this.$emit("formAddPostcode");
    },
    filesChange(value) {
      // const formData = new FormData();
      // formData.append("document", value[0], "nama file");
      this.doc.document = value[0];
      this.file = value[0].name;
    },
    async changeRelationship(event) {
      if (["Others", "Lain-lain"].includes(event.target.value)) {
        const { value: newRelationship } = await this.$swal.fire({
          html:
            "<span class='form-group'><label style='margin-bottom:0px'>Hubungan</label></span>",
          input: "text",
        });
        if (newRelationship) {
          console.log(newRelationship);
          this.newRelationship = newRelationship;
          this.form.relationship = newRelationship;
        } else {
          this.form.relationship = this.relationship[0];
        }
      }
    },
  },
  computed: {
    relationships() {
      var relationships = this.$t("relationships").split(",");
      if (this.newRelationship) {
        relationships.push(this.newRelationship);
      } else if (!relationships.includes(this.form.relationship)) {
        relationships.push(this.form.relationship);
      }
      return relationships;
    },
  },
  watch: {
    locale: function () {
      if (!this.newRelationship) this.form.relationship = this.relationship[0];
    },
  },
};
</script>
<template>
  <div class="card-body" id="divCard">
    <div class="form-group" :class="{ 'has-error': $v.form.name.$error }">
      <label>{{ $t("fullname") }}<span class="text-danger">*</span></label>
      <input
        type="text"
        v-uppercase
        class="form-control"
        v-model.trim="$v.form.name.$model"
      />
      <div
        class="form-error"
        v-if="$v.form.name.$error && !$v.form.name.required"
      >
        Nama tidak boleh dibiarkan kosong.
      </div>
    </div>
    <div class="form-group" :class="{ 'has-error': $v.form.ic_number.$error }">
      <label>{{ $t("mykad") }}<span class="text-danger">*</span></label>
      <the-mask
        id="ic_number"
        :mask="['######-##-####']"
        class="form-control"
        v-model.trim="$v.form.ic_number.$model"
      />
      <div
        class="form-error"
        v-if="$v.form.ic_number.$error && !$v.form.ic_number.required"
      >
        No. MyKad tidak boleh dibiarkan kosong.
      </div>
    </div>
    <div
      class="form-group"
      :class="{ 'has-error': $v.form.relationship.$error }"
    >
      <label>{{ $t("relationship") }}<span class="text-danger">*</span></label>
      <select
        name="relationship"
        id="relationship"
        v-model.trim="$v.form.relationship.$model"
        class="form-control"
        @change="changeRelationship($event)"
      >
        <option value>-- {{ $t("choose.relationship") }} --</option>
        <option
          v-for="relationship in relationships"
          :key="relationship"
          :value="relationship"
        >
          {{ relationship }}
        </option>
      </select>
      <div
        class="form-error"
        v-if="$v.form.relationship.$error && !$v.form.relationship.required"
      >
        Hubungan tidak boleh dibiarkan kosong.
      </div>
    </div>
  </div>
</template>
