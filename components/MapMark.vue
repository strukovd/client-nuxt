<template>
  <div>
    <div :class="$vuetify.theme.dark ? 'pin-dark' : 'pin-light'">
      <v-img :src="$vuetify.theme.dark ? '/images/logo.svg' : '/images/logo2.svg'" width="26px" height="26px"/>
    </div>
    <div :class="$vuetify.theme.dark ? 'pulse-dark' : 'pulse-light'"></div>
  </div>
</template>

<style lang="sass">

.pin-dark
  width: 30px
  height: 30px
  border-radius: 50% 50% 50% 0
  background: white
  position: absolute
  transform: rotate(-45deg)
  left: 50%
  top: 50%
  margin: -20px 0 0 -20px
  animation-name: bounce
  animation-fill-mode: both
  animation-duration: 1s
  padding: 2px

.pulse-dark
  background: rgba(0, 0, 0, 0.2)
  border-radius: 50%
  height: 14px
  width: 14px
  position: absolute
  left: 50%
  top: 50%
  margin: 11px 0 0 -12px
  transform: rotateX(55deg)
  z-index: -2
  &:after
    content: ""
    border-radius: 50%
    height: 40px
    width: 40px
    position: absolute
    margin: -13px 0 0 -13px
    animation: pulsate 1s ease-out infinite
    opacity: 0.0
    box-shadow: 0 0 1px 2px #89849b
    animation-delay: 1.1s

@keyframes pulsate
  0%
    transform: scale(0.1, 0.1)
    opacity: 0.0
  50%
    opacity: 1.0
  100%
    transform: scale(1.2, 1.2)
    opacity: 0

@keyframes bounce
  0%
    opacity: 0
    transform: translateY(-2000px) rotate(-45deg)
  60%
    opacity: 1
    transform: translateY(30px) rotate(-45deg)
  80%
    transform: translateY(-10px) rotate(-45deg)
  100%
    transform: translateY(0) rotate(-45deg)
</style>
<style lang="sass">

.pin-light
  width: 30px
  height: 30px
  border-radius: 50% 50% 50% 0
  background: black
  position: absolute
  transform: rotate(-45deg)
  left: 50%
  top: 50%
  margin: -20px 0 0 -20px
  animation-name: bounce
  animation-fill-mode: both
  animation-duration: 1s
  padding: 2px

.pulse-light
  background: rgba(0, 0, 0, 0.2)
  border-radius: 50%
  height: 14px
  width: 14px
  position: absolute
  left: 50%
  top: 50%
  margin: 11px 0 0 -12px
  transform: rotateX(55deg)
  z-index: -2
  &:after
    content: ""
    border-radius: 50%
    height: 40px
    width: 40px
    position: absolute
    margin: -13px 0 0 -13px
    animation: pulsate 1s ease-out infinite
    opacity: 0.0
    box-shadow: 0 0 1px 2px #89849b
    animation-delay: 1.1s

@keyframes pulsate
  0%
    transform: scale(0.1, 0.1)
    opacity: 0.0
  50%
    opacity: 1.0
  100%
    transform: scale(1.2, 1.2)
    opacity: 0

@keyframes bounce
  0%
    opacity: 0
    transform: translateY(-2000px) rotate(-45deg)
  60%
    opacity: 1
    transform: translateY(30px) rotate(-45deg)
  80%
    transform: translateY(-10px) rotate(-45deg)
  100%
    transform: translateY(0) rotate(-45deg)
</style>
<script setup lang="ts">
</script>
