<script>
import ApiService from "@/services/api.service";
export default {
  props: ["userRole"],
  data() {
    return {
      logo: null,
      organization_type: null,
      organization: {
        name: "",
        short_name: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
        phone_number: "",
        email: "",
        account_type: "",
        code: "",
        status: "",
        website: "",
        company_registration_number: "",
        founder_name: "",
        pic_phone_number: "",
        mykad_number: "",
        bank_account_number: "",
        bank_account_holder: "",
        bank_name: "",
        is_bmmb: null
      },
    };
  },

  mounted() {
    console.log("Organization", this.organizationId);
    if (this.organizationId) {
      this.getOrganization();
      this.getOrganizationLogo();
    }
  },
  computed: {
    organizationId() {
      return this.$route.params.organization_id;
    },
    fullAddress() {
      if (!this.organization) {
        return "-";
      }
      return String(
        this.organization.address ? this.organization.address.concat(", ") : ""
      )
        .concat(
          String(
            this.organization.postcode
              ? this.organization.postcode.concat(", ")
              : ""
          )
        )
        .concat(
          String(
            this.organization.city ? this.organization.city.concat(", ") : ""
          )
        )
        .concat(
          String(
            this.organization.state ? this.organization.state.concat(". ") : ""
          )
        );
    },
    changeLocale(locale) {
      window.localStorage.setItem("LOCALIZATION", locale);
      this.$i18n.locale = locale;
    },
  },
  methods: {
    getOrganization() {
      ApiService.get(`organization/${this.organizationId}`).then((response) => {
        this.organization = response.data.organization ?? {};
        this.organization_type = response.data.organization.type;
        console.log(this.organization_type);
      });
    },
    getOrganizationLogo() {
      ApiService.get(
        `organization/${this.organizationId}/logo?stream=false`
      ).then((response) => {
        if (response.data.logo) {
          this.logo = response.data.logo.public_path;
        }
      });
    },
  },
};
</script>

<template>
  <div>
    <div class="row mb-4">
      <div class="col-md-12 text-center">
        <div class="page-next-level">
          <div v-if="logo">
            <img :src="logo" alt width="300" style="background: white" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 form-group">
        <label for>{{ $t("name") }}</label>
        <p class="form-control-static">
          {{ organization.name ? organization.name : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("shortname") }}</label>
        <p class="form-control-static">
          {{ organization.short_name ? organization.short_name : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organization_type != 'Awaris'">
        <label for>{{ $t("code") }}</label>
        <p class="form-control-static">
          {{ organization.code ? organization.code : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organization_type != 'Individu'">
        <label for>{{ $t("account-type") }}</label>
        <p class="form-control-static">
          {{ organization.account_type ? organization.account_type : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("address") }}</label>
        <p class="form-control-static">
          {{ fullAddress ? fullAddress : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for v-if="organization_type == 'Individu'">{{
          $t("mobile-no")
        }}</label>
        <label for v-if="organization_type != 'Individu'">{{
          $t("office-no")
        }}</label>
        <p class="form-control-static">
          {{ organization.phone_number ? organization.phone_number : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for v-if="organization_type == 'Individu'">{{
          $t("email")
        }}</label>
        <label for v-if="organization_type != 'Individu'">{{
          $t("office-email")
        }}</label>
        <p class="form-control-static">
          {{ organization.email ? organization.email : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organization_type != 'Individu'">
        <label for>{{ $t("website") }}</label>
        <p class="form-control-static">
          {{ organization.website ? organization.website : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("status") }}</label>
        <p class="form-control-static">
          <span class="badge badge-success" v-if="organization.status == 1">{{
            $t("active")
          }}</span>
          <span class="badge badge-warning" v-if="organization.status != 1">{{
            $t("inactive")
          }}</span>
        </p>
      </div>
    </div>
    <div class="row" v-if="organization_type != 'Awaris'">
      <div class="col-md-6 form-group" v-if="organization_type != 'Individu'">
        <label for>{{ $t("org.reg-no") }}</label>
        <p class="form-control-static">
          {{
            organization.company_registration_number
              ? organization.company_registration_number
              : "-"
          }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organization_type == 'Individu'">
        <label for>{{ $t("mykad") }}</label>
        <p class="form-control-static">
          {{ organization.mykad_number ? organization.mykad_number : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organization_type != 'Individu'">
        <label for>{{ $t("org.founder") }}</label>
        <p class="form-control-static">
          {{ organization.founder_name ? organization.founder_name : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group" v-if="organization_type != 'Individu'">
        <label for>{{ $t("pic-telno") }}</label>
        <p class="form-control-static">
          {{
            organization.pic_phone_number ? organization.pic_phone_number : "-"
          }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("bank-account") }}</label>
        <p class="form-control-static">
          {{
            organization.bank_account_number
              ? organization.bank_account_number
              : "-"
          }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("acc-holder") }}</label>
        <p class="form-control-static">
          {{
            organization.bank_account_holder
              ? organization.bank_account_holder
              : "-"
          }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("bankname") }}</label>
        <p class="form-control-static">
          {{ organization.bank_name ? organization.bank_name : "-" }}
        </p>
      </div>
    </div>
    <hr />
    <div class="row" v-if="userRole == 'Staff'">
      <div class="col-md-6 form-group">
        <label for>{{ $t("org.online") }}</label>
        <p class="form-control-static">
          <span
            class="badge badge-success"
            v-if="organization.allow_payment_gateway == 1"
            >{{ $t("active") }}</span
          >
          <span
            class="badge badge-warning"
            v-if="organization.allow_payment_gateway != 1"
            >{{ $t("inactive") }}</span
          >
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>{{ $t("org.cash") }}</label>
        <p class="form-control-static">
          <span
            class="badge badge-success"
            v-if="organization.allow_cash_payment == 1"
            >{{ $t("active") }}</span
          >
          <span
            class="badge badge-warning"
            v-if="organization.allow_cash_payment != 1"
            >{{ $t("inactive") }}</span
          >
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label for>Menerima Pembayaran Langsung</label>
        <p class="form-control-static">
          <span
            class="badge badge-success"
            v-if="organization.allow_direct_payment == 1"
            >{{ $t("active") }}</span
          >
          <span
            class="badge badge-warning"
            v-if="organization.allow_direct_payment != 1"
            >{{ $t("inactive") }}</span
          >
        </p>
      </div>
        <div class="col-md-6 form-group" v-if="organization.is_bmmb">
        <label for>Menerima Pembiayaan</label>
        <p class="form-control-static">
          <span
            class="badge badge-success"
            v-if="organization.allow_loan_payment == 1"
            >{{ $t("active") }}</span
          >
          <span
            class="badge badge-warning"
            v-if="organization.allow_loan_payment != 1"
            >{{ $t("inactive") }}</span
          >
        </p>
      </div>
      <div class="col-md-12 text-right">
        <router-link
          v-if="['Staff', 'IT'].includes(userRole)"
          :to="{
            name: 'organization.edit',
            params: { organization_id: organizationId },
          }"
          class="btn btn-primary"
          >{{ $t("update") }}</router-link
        >
      </div>
    </div>
  </div>
</template>
