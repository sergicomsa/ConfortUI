<template>
  <v-responsive class="align-center text-center fill-height pa-10">
    <p class="text-h2 mb-10">Formulari de Confort</p>
    <v-form class="mb-15" @submit.prevent="validateInfo()">
      <v-select
        rounded="lg"
        v-model="sex"
        :rules="sexRule"
        ref="sex"
        name="sex"
        label="SEXE"
        :items="['Home', 'Dona', 'Altre']"
      ></v-select>
      <v-text-field
        rounded="lg"
        v-model="age"
        :rules="ageRule"
        label="EDAT"
        type="number"
      ></v-text-field>
      
      <v-card elevation="2" class="pt-6 mb-4">
        <div class="text-center text-h4 mb-14">
          Confort Tèrmic <span class="text-h5">{{ satisfactionEmojis[this.temperature - 1] }}</span>
        </div>
        <v-slider
          v-model="temperature"
          :thumb-size="36"
          :step="1"
          :min="1"
          :max="10"
          thumb-label="always"
          show-ticks="always"
          tick-size="4"
        ></v-slider>
      </v-card>
      <v-card elevation="2" class="pt-6 mb-4">
        <div class="text-center text-h4 mb-14">
          Qualitat Aire <span class="text-h5">{{ satisfactionEmojis[this.air - 1] }}</span>
        </div>
        <v-slider
          v-model="air"
          :thumb-size="36"
          :step="1"
          :min="1"
          :max="10"
          thumb-label="always"
          show-ticks="always"
          tick-size="4"
        ></v-slider>
      </v-card>
     <v-btn type="submit" block color="black">Enviar</v-btn>
     <div style=" transform: translate(0%, 50%);" class="g-recaptcha" data-sitekey="6LdDtj8pAAAAAOHDq6b1jHzSZX8NBFfFfM4EUDSd" data-callback="onGrecaptchaVerified"></div>
    </v-form>
    <v-footer>
      <v-container>
        <v-row justify="space-around">
          <v-col>
            <v-img
              max-width=500
              src="../assets/gene_h.jpg"
            ></v-img>
          </v-col>
          <v-col class="">
            <v-img
              max-width=500
              src="../assets/ue_h.jpg"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>      
    </v-footer>
  </v-responsive>
</template>

<script>
  import axios from '../../node_modules/axios';
  export default {


    data () {
      return {
        icons: ['../assets/gene_h', '../assets/ue_h'],
        age: undefined,
        sex: undefined,
        temperature : 5,
        air: 5,
        satisfactionEmojis: ['😭', '😢', '☹️', '🙁', '😐', '🙂', '😊', '😄', '😁', '😍'],
        tbToken: undefined,
        sexRule: [v => !!v || 'Seleccioneu el vostre sexe'],
        ageRule: [
        v => {
          if (Number.isInteger(Number(v)) && Number(v) >= 0  && Number(v) <= 100 && v != '') {
            return true;
          }
          return 'Edat invàlida';
        },
      ],
      }
    },
    mounted() {
      var scriptCallback = document.createElement("script");
      scriptCallback.type="text/javascript";
      scriptCallback.innerHTML = 'function onGrecaptchaVerified(){\n'
        +'  window.recaptchaVerified = true;\n'
        +'}';
      document.getElementsByTagName('head')[0].appendChild(scriptCallback);

      if (document.getElementById('recaptcha-scrpit')) return; // was already loaded
      var scriptTag = document.createElement("script");
      scriptTag.src = "https://www.google.com/recaptcha/api.js";
      scriptTag.id = "recaptcha-scrpit";
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    },
    methods: {
      validateInfo () {
        if (!!this.age === false || this.sex === undefined || this.age < 0 || this.age > 100) {
          return
        }
        if (!window.recaptchaVerified) {
          alert('Completa el Captcha!')
          return
        }
        this.send();
      },
      send () {
        const params = new URLSearchParams(window.location.search);
        var assetId = params.get('spaceId')
        const data = { 
          data: {
            ts: Date.now(),
            values: {
              edat: this.age,
              sexe: this.sex,
              confort_termic: this.temperature,
              qualitat_aire: this.air
            }
          },
          spaceId: assetId
        };
        axios.post("/api/postTelemetry", data).then(response => {
          console.log('Response:', response.data);
        }).catch(error => {
          console.error('Error:', error.response.data);
        });
        window.recaptchaVerified = false;
        location.reload();
      }
    }
  }
</script>
