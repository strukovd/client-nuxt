<template>
  <div id="top" class="feedback-desktop">
    <v-dialog class="calendar-dialog" overlay-color="#1e1e1e" v-model="modal.show" max-width="600">
      <div elevation="0" color="transparent" style="background:#fff !important; padding:1.4em 1em; font-size:1.6em;">
        <p>
          <!-- <v-icon size="40" @click="modal.show=false" class="close-icon" style="color:#333; padding:0 .2em .6em;">mdi-check</v-icon> -->
          <span style="color:#333;">{{ modal.message }}</span>
        </p>

        <v-btn depressed @click="modal.show=false; $router.push({path: '/'});" style="border-radius: 16px !important;width: 100%" color="#272727" class="py-8 px-15 hover-red mt-4">
          <span class="text-20 white--text opacity-70">Закрыть</span>
        </v-btn>
      </div>
    </v-dialog>

    <v-row class="ma-0 pa-0 wrapper">
      <v-col class="pa-0" cols="12">
        <tool-bar/>
      </v-col>
      <v-col style="min-height: 70vh" class="pa-0 px-4 mb-100" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/feedback', title: 'Обратная связь'}]"/>
          <!-- CONTENT -->
          <loader v-if="loading"/>
          <div class="feedback-content" v-else>
            <v-form class="form" @submit.prevent="sendForm">
              <v-text-field class="fb-textfield" v-model="model.name" label="Ваше имя" :error-messages="errors.name" outlined required></v-text-field>
              <v-text-field class="fb-textfield" v-model="model.contacts" label="Контакты" :error-messages="errors.contacts" outlined required></v-text-field>
              <v-textarea class="fb-textarea" v-model="model.message" label="Опишите предстоящее событие, предполагаему дату, время, а также ваши пожелания и прочие детали" :error-messages="errors.message" outlined required></v-textarea>
              <v-btn class="fb-button py-8 px-15" color="primary" type="submit">Отправить</v-btn>
            </v-form>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ToolBar from "@/components/AppToolbar.vue";
import TimeRoulette from "@/components/TimeRouletteNew.vue";
import Loader from "@/components/Loader.vue";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs.vue";

export default {
  name: "FeedbackMobile",
  components: { Loader, TimeRoulette, ToolBar, BaseBreadcrumbs },
  data: () => {
    return {
      loading: false,
      errors: {
        name: '',
        contacts: '',
        message: ''
      },
      model: {
        name: '',
        contacts: '',
        message: ''
      },
      modal: {
        show: false,
        message: '',
      }
    }
  },
  methods: {
    sendForm() {
      this.errors.name = '';
      this.errors.contacts = '';

      if(this.model.name === '' ) {
        this.errors.name = 'Поле не должно быть пустым!';
        return;
      }

      if(!this.model.contacts) {
        this.errors.contacts = 'Поле не должно быть пустым!';
        return;
      }

      this.loading = true;
      this.$http.post('/feedback', this.model)
        .then(r => {
          this.modal.message = `Спасибо за вашу заявку. Мы свяжемся с вами в ближайшее время`;
          this.modal.show = true;
        })
        .finally(() => {
          this.loading = false;
        })
    }
  },
}
</script>


<style lang="scss">
.feedback-desktop {
  .feedback-content {
    .form {
      max-width: 1200px;
      margin: 3em auto 0;

      .fb-textfield {

      }
      .fb-textarea {

      }
      .fb-button {
        color:#fff;
        border-radius:16px;
        width:100%;
      }
    }
  }
}

.dark-theme {
  .feedback-desktop {
    .feedback-content {
      .form {
        .fb-textfield, .fb-textarea {
          .v-input__slot {
            background:#222 !important;

            &:hover fieldset {
              // border: none !important;
              // outline: none !important;
            }
          }
          .v-label {
            color:#ffffff9c !important;
          }
          input, textarea {
            color:#dddddd !important;
          }
        }
        .fb-button {
          background-color:#e73030 !important;
        }
      }
    }
  }
}
</style>
