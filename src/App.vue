<template>
  <div id="app" class="d-flex flex-column flex-root">
    <notifications group="foo" class="mt-5 mr-4" />

    <notifications
      :singleton="true"
      group="full-noti"
      position="bottom center"
      width="100%"
      fullWidth="true"
      :speed="550"
      :duration="5000"
      :max="1"
    >
      <template slot="body" slot-scope="props">
        <div
          class="vuenotiz text-center"
          :class="props.item.type"
          style="
            width: 100%;
            padding: 30px;
            color: white !important;
            background-color: #ff392e;
          "
        >
          <a class="title" style="font-size: 14pt">
            <strong style="color: #ccc">{{ props.item.title }}</strong>
          </a>
          <img
            src="/images/icon/x-mark.png"
            alt="Close"
            @click="props.close"
            style="
              position: absolute;
              right: 0;
              top: 0;
              height: 55px;
              padding: 15px;
            "
          />
          <div
            style="color: #fff; font-size: 16pt"
            class="first-letter"
            v-html="props.item.text"
          ></div>
        </div>
      </template>
    </notifications>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<style lang="scss">
</style>
