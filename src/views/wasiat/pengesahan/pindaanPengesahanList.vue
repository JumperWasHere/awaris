<script>
import { ArrowUpIcon } from "vue-feather-icons";
import ApiService from "@/services/api.service";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default {
  mounted() {
    this.getpindaanList();
  },
  watch: {
    // organizationId() {
    //   return this.$route.query.organization_id;
    // },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  data() {
    return {
      organizationId: null,
      wasiats: null,
      pindaanList: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  methods: {
    getpindaanList() {
      ApiService.get(
        `/amendment?status=1&amendmentable_type=Wasiat&load_with=amendmentable.user&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
      )
        .then((response) => {
          var temp_array = response.data.amendments.data ?? [];
          console.log(response.data.amendments.data);
          this.pagination.totalRows = response.data.amendments.total;

          var newobj = {};
          var count;
          if (this.pagination.currentPage == 1) {
            count = this.pagination.currentPage;
          } else {
            count =
              this.pagination.currentPage * this.pagination.perPage -
              this.pagination.perPage +
              1;
          }
          console.log("count", count);
          for (const index in temp_array) {
            newobj[count] = Object.assign({}, temp_array[index]);
            count++;
          }
          this.pindaanList = newobj;
        })
        .catch((error) => {
          console.log("error");
        });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getpindaanList();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getpindaanList();
    },
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
};
</script>

<template>
  <div>
    <div v-if="pindaanList == []" class="p-5 text-center">
      <h5>Tiada rekod ditemui</h5>
    </div>
    <div class="table-responsive">
      <table class="table mb-0 table-center table-sm">
        <thead>
          <tr>
            <th>Bil.</th>
            <th style="width: 500px">Nama Penuh</th>
            <th>MyKad</th>
            <th style="width: 100px">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pindaan, index) in pindaanList" :key="index">
            <td>{{ index }}</td>
            <td>
              {{
                pindaan.amendmentable.user
                  ? pindaan.amendmentable.user.name
                  : "-"
              }}
            </td>
            <td>
              {{
                pindaan.amendmentable.user
                  ? pindaan.amendmentable.user.ic_number
                  : "-"
              }}
            </td>
            <td>
              <router-link
                tag="button"
                block
                class="btn btn-primary btn-sm"
                :to="{
                  name: 'pindaan.part_a',
                  params: { wasiat_id: pindaan.amendmentable_id },
                  query: { pengesahan: true },
                }"
                >Pengesahan</router-link
              >
            </td>
          </tr>
          <tr v-if="pindaanList.length == 0">
            <td class="p-5 text-center" colspan="4">
              <h5>Tiada rekod ditemui</h5>
            </td>
          </tr>
        </tbody>
      </table>
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
