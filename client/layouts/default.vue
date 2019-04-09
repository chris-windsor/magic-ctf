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
      require("particles.js");
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
              value: "#6f4793"
            },
            shape: {
              type: "polygon",
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
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 43,
              random: false,
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
              color: "#582c76",
              opacity: 0.7,
              width: 2.5
            },
            move: {
              enable: true,
              speed: 5,
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
            detect_on: "canvas",
            events: {
              onhover: {
                enable: false,
                mode: "repulse"
              },
              onclick: {
                enable: false,
                mode: "push"
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
                distance: 200,
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
  }

  #login-form {
    background-color: rgba(255, 255, 255, 0.9);
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
