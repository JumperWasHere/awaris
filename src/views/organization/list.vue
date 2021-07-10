<script>
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ApiService from "@/services/api.service";

export default {
  mounted() {
    this.organizationType = this.$route.params.type;
    this.getOrganizations();
  },
  data() {
    return {
      organizationType: null,
      organizations: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    getOrganizations() {
      var query = `organization?type=${this.organizationType}&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;

      ApiService.get(query)
        .then((response) => {
          var temp_array = response.data.organizations.data;
          this.pagination.totalRows = response.data.organizations.total;

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
          this.organizations = newobj;
        })
        .catch((error) => {
          console.log("error fetch data from organization");
        });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getOrganizations();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getOrganizations();
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
                {{ organizationType }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div
        class="container card bg-light job-box rounded shadow border-0 overflow-hidden"
      >
        <div class="card-body">
          <div v-if="organizations == null" class="text-center">
            <h5 class="p-5">{{ $t("org.no-organizations") }}</h5>
          </div>
          <div class="table-responsive" v-if="organizations">
            <table class="table">
              <thead>
                <tr>
                  <th>{{ $t("index") }}</th>
                  <th>{{ $t("org.partner-code") }}</th>
                  <th>{{ $t("name") }}</th>
                  <th>{{ $t("shortname") }}</th>
                  <th>{{ $t("org.partner-type") }}</th>
                  <th>{{ $t("status") }}</th>
                  <th class="text-right">&nbsp;{{ $t("action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="organizations.length == 0">
                  <td colspan="6" class="text-center">
                    <h5 class="p-5">{{ $t("no-records") }}</h5>
                  </td>
                </tr>
                <tr v-for="(organization, index) in organizations" :key="index">
                  <td>{{ index }}</td>
                  <td>{{ organization.code }}</td>
                  <td>{{ organization.name }}</td>
                  <td>{{ organization.short_name }}</td>
                  <td>{{ organization.type }}</td>
                  <td>
                    <span
                      class="badge badge-success"
                      v-if="organization.status == 1"
                      >{{ $t("active") }}</span
                    >
                    <span
                      class="badge badge-warning"
                      v-if="organization.status == 0"
                      >{{ $t("inactive") }}</span
                    >
                  </td>
                  <td class="text-right">
                    <div v-if="organizationType == 'Individu'">
                      <router-link
                        :to="{
                          name: 'organization.info-individual',
                          params: { organization_id: organization.id },
                        }"
                        class="btn btn-primary btn-xs"
                        tag="button"
                      >
                        <img src="/images/icon/view.svg" height="22px" alt />
                      </router-link>
                    </div>
                    <div v-if="organizationType != 'Individu'">
                      <router-link
                        :to="{
                          name: 'organization.info',
                          params: { organization_id: organization.id },
                        }"
                        class="btn btn-primary btn-xs"
                        tag="button"
                      >
                        <img src="/images/icon/view.svg" height="22px" alt />
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-12">
              <div class="card-body">
                <div
                  class="text-center mb-5"
                  v-if="organizationType != 'awaris'"
                >
                  <router-link
                    :to="{
                      name: 'organization.create',
                      query: { type: organizationType },
                    }"
                    class="btn btn-primary"
                    style="text-transform: capitalize"
                    >{{ $t("add") }} {{ organizationType }}</router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row">
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
