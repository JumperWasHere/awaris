<script>
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
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
      organizations: [],
    };
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
  },
  methods: {
    getOrganizations() {
      ApiService.get(`/organization?type=${this.organizationType}`)
        .then((response) => {
          this.organizations = response.data.organizations.data;
        })
        .catch((error) => {});
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
                Pendaftaran Organisasi {{ organizationType }} Baru
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
          <div class="row align-items-center">
            <div class="col-lg-12 col-md-3 text-md-left">
              <h4 class="title text-center">
                MAKLUMAT ORGANISASI {{ organizationType }} BARU
              </h4>
              <div class="row">
                <div class="col-md-12">
                  <div class="row align-items-end">
                    <div class="col-md-12 text-center mt-4 mt-sm-0">
                      <img
                        src="images/client/05.jpg"
                        class="avatar avatar-large rounded-circle shadow d-block mx-auto"
                        alt
                      />
                      <div class="mt-md-4 mt-3 mt-sm-0">
                        <a
                          href="javascript:void(0)"
                          class="btn btn-primary mt-2"
                          >Change Picture</a
                        >
                        <a
                          href="javascript:void(0)"
                          class="btn btn-outline-primary mt-2 ml-2"
                          >Delete</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-md-2">
                  <div class="form-group position-relative">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id />
                      <label class="custom-control-label" for>Wasiat</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group position-relative">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id />
                      <label class="custom-control-label" for>Hibah</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group position-relative">
                    <label>
                      Nama Organisasi
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nama Penuh"
                      name
                      required
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group position-relative">
                    <label>
                      Nama Pendek
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nama Penuh"
                      name
                      required
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group position-relative">
                    <label>
                      Kod
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nama Penuh"
                      name
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group position-relative">
                    <label>
                      Alamat
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Alamat"
                      name
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group position-relative">
                    <label>
                      Poskod
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Poskod"
                      name
                      required
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group position-relative">
                    <label>Bandar</label>
                    <span class="text-danger">*</span>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Bandar"
                      name
                      required
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group position-relative">
                    <label>
                      Negeri
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Negeri"
                      name
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group position-relative">
                    <label>No. Telefon</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="No. Telefon"
                      name
                      required
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group position-relative">
                    <label>
                      Status Pengguna
                      <span class="text-danger">*</span>
                    </label>
                    <select name id class="form-control">
                      <option value>Aktif</option>
                      <option value>Tidak Aktif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col-lg-12 col-md-3 text-md-left">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group position-relative text-right">
                    <router-link to="/page-blog-grid" class="btn btn-primary"
                      >Simpan</router-link
                    >
                  </div>
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
