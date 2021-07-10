<script>
import {
  ArrowUpIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  MonitorIcon,
  HeartIcon,
  EyeIcon,
  BoldIcon,
  FeatherIcon,
  CodeIcon,
  UserCheckIcon,
  GitMergeIcon,
  SettingsIcon,
} from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {};
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    Carousel,
    Slide,
    ArrowUpIcon,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    MonitorIcon,
    HeartIcon,
    EyeIcon,
    BoldIcon,
    FeatherIcon,
    CodeIcon,
    UserCheckIcon,
    GitMergeIcon,
    SettingsIcon,
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
              <h4 class="title text-white">
                Pendaftaran Kakitangan Baru - AMANAH WARISAN BERHAD
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div
              class="card bg-light border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-body">
                <div class="row align-items-center border-bottom">
                  <div class="col-lg-12 col-md-3 text-md-left">
                    <h4 class="title text-center">
                      KAKITANGAN AMANAH WARISAN BERHAD
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
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group position-relative">
                          <label>
                            Nama Penuh
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
                      <div class="col-md-4">
                        <div class="form-group position-relative">
                          <label>
                            No Kad Pengenalan
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="No kad pengenalan"
                            name
                            required
                          />
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="form-group position-relative">
                          <label>
                            No. Kad Pengenalan Lama / Polis / Tentera / Passport
                          </label>
                          <span class="text-danger">*</span>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="No kad pengenalan"
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
                            Jantina
                            <span class="text-danger">*</span>
                          </label>
                          <select name id class="form-control">
                            <option value>Lelaki</option>
                            <option value>Perempuan</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group position-relative">
                          <label>Kod Kakitangan</label>
                          <span class="text-danger">*</span>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Kod Kakitangan"
                            name
                            required
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group position-relative">
                          <label>No. Pekerja</label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="No. Pekerja"
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
                          <label>Negeri</label>
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
                  </div>
                  <div class="col-lg-12 col-md-3 text-md-left">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group position-relative">
                          <label>
                            No. Telefon Bimbit
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="No. Telefon Bimbit"
                            name
                            required
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group position-relative">
                          <label>
                            No. Telefon Pejabat
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="No. Telefon Pejabat"
                            name
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row align-items-center mt-4">
                  <div class="col-lg-12 col-md-3 text-md-left">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="row">
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
                          <div class="col-md-4">
                            <div class="form-group position-relative">
                              <label>
                                Peranan Pengguna
                                <span class="text-danger"
                                  >* (Tidak boleh kosong)</span
                                >
                              </label>
                              <select name id class="form-control">
                                <option value>Super Admin</option>
                                <option value>Staf</option>
                                <option value>Akauntan</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group position-relative">
                              <label>
                                Email
                                <span class="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Email"
                                name
                                required
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group position-relative">
                              <label>Username</label>
                              <span class="text-danger">*</span>
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Username"
                                name
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group position-relative">
                              <label>Kata Laluan</label>
                              <span class="text-danger">*</span>
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Kata Laluan"
                                name
                                required
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group position-relative">
                              <label>Sahkan Kata Laluan</label>
                              <span class="text-danger">*</span>
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Sahkan Kata Laluan"
                                name
                                required
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div
                              class="form-group position-relative"
                              style="background: #eee; padding: 10px"
                            >
                              <div class="inner">
                                <span class="text-danger">*</span>
                                <label>Syarat minimum kata laluan:</label>
                                <p class="small">
                                  1. Minimum sekurang-kurangnya 8 karakter.
                                  <br />2. Mesti ada huruf besar dan huruf
                                  kecil. <br />3. Mesti ada nombor. <br />4.
                                  Karakter khas (simbol) dibenarkan.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-12">
                            <div
                              class="form-group position-relative text-right"
                            >
                              <router-link
                                to="/page-blog-grid"
                                class="btn btn-primary"
                              >
                                Simpan
                                <i class="mdi mdi-chevron-right"></i>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
