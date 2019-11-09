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
              value: 150,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#ffffff"
            },
            shape: {
              type: "circle",
              stroke: {
                width: 0,
                color: "#000"
              },
              polygon: {
                nb_sides: 5
              },
              image: {
                src: "img/github.svg",
                width: 100,
                height: 100
              }
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 10,
                size_min: 40,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 189.39543399174545,
              color: "#ffffff",
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 1,
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
          interactivity: {
            detect_on: "window",
            events: {
              onhover: {
                enable: false,
                mode: "repulse"
              },
              onclick: {
                enable: true,
                mode: "repulse"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
              },
              repulse: {
                distance: 150,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
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
    background-color: #582C77;
  }

  #login-form {
    background-color: #ffffff;
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
