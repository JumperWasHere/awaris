<script>
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      pricings: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  props: {
    organization: {
      type: Object,
    },
    userRole: {
      type: String,
    },
  },
  mounted() {
    this.getPricings();
  },
  methods: {
    getPricings() {
      ApiService.get(
        `organization/${this.organizationId}/pricing?&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
      ).then((response) => {
        console.log(response.data.pricings);
        this.pricings = response.data.pricings.data;
        this.pagination.totalRows = response.data.pricings.total;
      });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getPricings();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getPricings();
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organization_id;
    },
    pricingId() {
      return this.$route.params.pricing_id;
    },
    organizationType() {
      return this.organization.type;
    },
  },
};
</script>

<template>
  <div>
    <div class="text-center p-5" v-if="pricings == null">
      <h5>Loading...</h5>
    </div>
    <div class="table-responsive" v-if="pricings">
      <table class="table">
        <thead>
          <tr>
            <th rowspan="2">{{ $t("index") }}</th>
            <th rowspan="2">{{ $t("product") }}</th>
            <th rowspan="2">Deskripsi</th>
            <th rowspan="2" class="text-center">{{ $t("org.nav3") }} (RM)</th>
            <th colspan="3" class="text-center">{{ $t("share") }} (RM)</th>
            <th
              rowspan="2"
              class="text-center"
              v-if="['Staff', 'Super Admin'].includes(userRole)"
            >
              Harga Pindaan (RM)
            </th>
            <th
              colspan="3"
              class="text-center"
              v-if="['Staff', 'Super Admin'].includes(userRole)"
            >
              Perkongsian Pindaan (RM)
            </th>
            <th rowspan="2" class="text-center">{{ $t("date") }}</th>
            <th rowspan="2" class="text-center">{{ $t("status") }}</th>
            <th
              rowspan="2"
              v-if="['Staff'].includes(userRole)"
              class="text-center"
            >
              {{ $t("action") }}
            </th>
          </tr>
          <tr>
            <th class="text-center">AWARIS</th>
            <th v-if="['Staff', 'Super Admin'].includes(userRole)">
              {{ $t("business-partner") }}
            </th>
            <th v-if="userRole == 'Staff'" class="text-center">POSSB</th>
            <th
              v-if="['Staff', 'Super Admin'].includes(userRole)"
              class="text-center"
            >
              AWARIS
            </th>
            <th
              v-if="['Staff', 'Super Admin'].includes(userRole)"
              class="text-center"
            >
              {{ $t("business-partner") }}
            </th>
            <th v-if="['Staff'].includes(userRole)" class="text-center">
              POSSB
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pricings.length == 0">
            <td class="text-center" colspan="9">
              <h5 class="m-5">{{ $t("pricing.no-info") }}</h5>
            </td>
          </tr>
          <tr v-for="(pricing, index) in pricings" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pricing.product }}</td>
            <td>{{ pricing.description }}</td>
            <td class="text-center">{{ pricing.price }}</td>
            <td class="text-center" v-if="userRole == 'Staff'">
              {{ pricing.awaris_share }}
            </td>
            <td
              class="text-center"
              v-if="organizationType != 'Awaris' && userRole != 'Staff'"
            >
              {{ pricing.awaris_share + pricing.prooffice_share }}
            </td>
            <td
              class="text-center"
              v-if="['Staff', 'Super Admin'].includes(userRole)"
            >
              {{ pricing.organization_share }}
            </td>
            <td class="text-center" v-if="userRole == 'Staff'">
              {{ pricing.prooffice_share }}
            </td>
            <td
              class="text-center"
              v-if="['Staff', 'Super Admin'].includes(userRole)"
            >
              {{ pricing.amendment_price }}
            </td>
            <td class="text-center" v-if="userRole == 'Staff'">
              {{ pricing.amendment_awaris_share }}
            </td>
            <td
              class="text-center"
              v-if="organizationType != 'Awaris' && userRole != 'Staff'"
            >
              {{
                pricing.amendment_awaris_share +
                pricing.amendment_prooffice_share
              }}
            </td>
            <td
              class="text-center"
              v-if="['Staff', 'Super Admin'].includes(userRole)"
            >
              {{ pricing.amendment_organization_share }}
            </td>
            <td class="text-center" v-if="userRole == 'Staff'">
              {{ pricing.amendment_prooffice_share }}
            </td>
            <td class="text-center">
              {{ pricing.created_at | formatDateTime }}
            </td>
            <td class="text-center">
              <span class="badge badge-success" v-if="pricing.status == 1">{{
                $t("active")
              }}</span>
              <span class="badge badge-warning" v-if="pricing.status != 1">{{
                $t("inactive")
              }}</span>
            </td>
            <td class="text-center">
              <router-link
                v-if="['Staff'].includes(userRole)"
                :to="{
                  name: 'organization.pricing.info',
                  params: {
                    organization_id: organizationId,
                    pricing_id: pricing.id,
                  },
                }"
                class="btn btn-primary btn-sm"
              >
                <img src="/images/icon/view.svg" height="22px" alt />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr />
    <div class="text-center">
      <router-link
        v-if="['Staff'].includes(userRole)"
        :to="{ name: 'organization.pricing.create' }"
        class="btn btn-primary"
        >{{ $t("pricing.add-price") }}</router-link
      >
    </div>
    <div class="row mt-4">
      <div class="col-md-8">
        <b-pagination
          v-model="pagination.currentPage"
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
          @change="pageClicks"
          aria-controls="my-table"
        ></b-pagination>
      </div>
      <div class="col-md-4">
        <div class="form custom-form">
          <div class="form-group mb-0">
            <select
              v-model="pagination.perPage"
              class="form-control custom-select"
              id="Sortbylist-job"
              @change="changePerPage()"
            >
              <option value="10">10 {{ $t("per-page") }}</option>
              <option value="25">25 {{ $t("per-page") }}</option>
              <option value="50">50 {{ $t("per-page") }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>