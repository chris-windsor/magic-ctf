<template>
  <section class="hero is-fullheight is-unselectable" id="particles-js">
    <div class="hero-body">
      <nuxt/>
    </div>
  </section>
</template>

<script>
  import "moment-timezone";

  export default {
    mounted() {
      require("../../node_modules/particles.js/particles");
      this.$nextTick(() => {
        this.initParticlesJS();
      });

      this.$store.commit("auth/SET_USER_TIMEZONE", this.$moment.tz.guess());
    },
    methods: {
      initParticlesJS() {
        particlesJS("particles-js", {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 2604.1872173865
              }
            },
            color: {
              value: "#ffffff"
            },
            shape: {
              type: "polygon",
              stroke: {
                width: 0,
                color: "#000"
              },
              polygon: {
                nb_sides: 5
              }
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 20,
              random: true,
              anim: {
                enable: true,
                speed: 10,
                size_min: 40,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 189.39543399174545,
              color: "#fff",
              opacity: 0.7,
              width: 2.5
            },
            move: {
              enable: true,
              speed: 3,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          retina_detect: true
        });
      }
    }
  };
</script>

<style>
  #particles-js canvas {
    position: absolute;
    height: 100vh;
    z-index: -1;
    /* #582C77 */
    background: rgb(88, 44, 119);
    background: radial-gradient(circle, rgba(88, 44, 119, 1) 0%, rgba(153, 87, 199, 1) 100%);
  }

  #login-form {
    background-color: #fff;
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
