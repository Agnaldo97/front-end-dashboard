<template>
  <div>
    <sweet-modal icon="success" ref="successAlert">Checkin realizado com sucesso!</sweet-modal>
    <canvas id="canvas" hidden></canvas>
    <h3>Ferramentas</h3>
    <div class="toolbox">
      <b-btn id="qrCode-btn" @click="openVideo()" v-b-modal.modals-default>
      <span>
        <i class="ion ion-md-camera"></i>
      </span>
      <span>
        Ler QR Code
      </span>
      </b-btn>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3>Atendimentos</h3>
      <div class="register-refresh">
        <i style="animation-name: spin; animation-duration: 2000ms; animation-iteration-count: infinite; animation-timing-function: linear;" class="ion ion-md-refresh"></i> Atualizando...</div>
    </div>

    <table class="table">
      <tbody>
        <tr v-for="attendance in attendaces" :key="attendance.id">
          <div :class="'accordion accordion-' + attendance.id">
            <div @click="collapse(attendance)" class="accordion-header">
              <div class="triage-box">
                <span v-if="attendance.priority === 'Emergência'" class="triage status-0"></span>
                <span v-if="attendance.priority === 'Muito Urgente'" class="triage status-1"></span>
                <span v-if="attendance.priority === 'Urgente'" class="triage status-2"></span>
                <span v-if="attendance.priority === 'Pouco Urgente'" class="triage status-3"></span>
                <span v-if="attendance.priority === 'Não Urgente'" class="triage status-4"></span>
                <span v-if="attendance.priority === null" class="triage status-5"></span>
              </div>
              <span class="name"><b>{{attendance.name}}</b> - {{cpfFormat(attendance.cpf)}}</span>
              <div></div>
              <span class="attendance-status">
                <b-badge v-if="attendance.status === 'Em processamento'" style="height: 1.6em;" href="javascript:void(0)" pill variant="warning">{{attendance.status}}</b-badge>
                <b-badge v-if="attendance.status === 'Em execução'" style="height: 1.6em;" href="javascript:void(0)" pill variant="success">Check-in Realizado</b-badge>
              </span>
              <div>{{attendance.dateRegister| moment('DD/MM/YYYY HH:mm:ss')}}</div>
            </div>
            <div class="accordion-body">
              <div><b v-if="attendance.description">Descrição:</b> {{attendance.description}}</div>
              <div class="body-wrapper">
                <b-select @change="changePriority(attendance)" value="Selecione a urgência" v-model="attendance.priority" :options="priorityOptions" />
              </div>
              <div class="body-wrapper">
                <b-button @click="deleteAtt(attendance.cpf)" > Deletar </b-button>
              </div>
            </div>
          </div>
        </tr>
        <tr v-if="attendaces.length == 0">
          <div class="emptyAttendance">
            Nenhum atendimento no momento
          </div>
        </tr>
      </tbody>
    </table>
    <b-modal id="modals-default" ref="myModal" size="'small'">
      <div slot="modal-title">
        Lendo QRCode...
      </div>
      <b-form-row>
        <video id="qrCodeVideo"></video>
      </b-form-row>
    </b-modal>
  </div>
</template>

<style lang="scss">
.toolbox {
  margin-bottom: 20px;

  #qrCode-btn {
    width: 120px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #003f89;

    i {
      font-size: 30px;
      margin-bottom: 10px;
    }
  }
}
.card-header {
  height: 40px;
  padding: 9px 15px 0px 15px;
}
.accordion {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;

  .accordion-header {
    width: 100%;
    background-color: #d2d2d2;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    display: grid;
    grid-template-columns: 5% 32% 24% 17% 17% 5%;
  }

  .accordion-body {
    width: 95%;
    padding: 0px;
    height: 0px;
    display: none;
    grid-template-columns: 70% 30%;
    background-color: #fff;
    border-radius: 0px 0px 10px 10px;
    transition: height .5s, padding .5s;
  }
}
.attendance-status {
  justify-content: flex-end;
  display: flex;
  align-items: right;
  margin-right: 10px;
  height: 100%;
  width: 95%;
}
video {
  width: 100%;
  border: solid 3px #0c2e55;
  border-radius: 5px;
}
canvas {
  display: none;
}
.emptyAttendance {
  background-color: white;
  height: 170px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}
@-moz-keyframes spin {
    from { -moz-transform: rotate(0deg); }
    to { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
.triage {
    border-radius: 50%;
    height: 15px;
    display: flex;
    width: 15px;

    &.status-0 {
      background-color: #c61620;
    }
    &.status-1 {
      background-color: #f78222;
    }
    &.status-2 {
      background-color: #f3c800;
    }
    &.status-3 {
      background-color: #027e3f;
    }
    &.status-4 {
      background-color: #00acee;
    }
    &.status-5 {
      background-color: white;
    }
}
.triage-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import axios from 'axios'
import moment from 'moment'
import jsQR from 'jsqr'
import { SweetModal } from 'sweet-modal-vue'

export default {
  name: 'home',
  metaInfo: {
    title: 'Home'
  },
  components: {
    SweetModal
  },
  data: function () {
    return {
      attendaces: [],
      priorityOptions: [
        { text: 'Emergência' },
        { text: 'Muito Urgente' },
        { text: 'Urgente' },
        { text: 'Pouco Urgente' },
        { text: 'Não Urgente' }
      ]
    }
  },
  async created () {
    const { data } = await axios.get('private/attendance')
    setInterval(async () => {
      const { data } = await axios.get('private/attendance')
      if (data !== this.attendaces) {
        this.attendaces = data
        // this.attendance.dateRegister = moment(this.attendance.dateRegister).add(3, 'hours')
      }
    }, 10000 * 2)
    this.attendaces = data
  },
  methods: {
    collapse (attendance) {
      const element = document.querySelectorAll(`.accordion.accordion-${attendance.id} > .accordion-body`)[0]
      const contentBodyElement = document.querySelectorAll(`.accordion.accordion-${attendance.id} > .accordion-body > div`)[0]
      if (element.style.height === '145px') {
        element.style.padding = '0px'
        element.style.display = 'none'
        element.style.height = '0px'
        contentBodyElement.style.display = 'none'
      } else {
        element.style.padding = '20px 20px 20px 20px'
        element.style.height = '145px'
        element.style.display = 'grid'
        contentBodyElement.style.display = 'block'
      }
    },
    changePriority (attendance) {
      axios.put(`/private/attendance/infos/${attendance.cpf}`,{
        priority: attendance.priority
      })
    },
    async deleteAtt (cpf) {
      axios.delete(`/private/attendance/${cpf}`)
      const { data } = await axios.get('private/attendance')
      if (data !== this.attendaces) {
        this.attendaces = data
        // this.attendance.dateRegister = moment(this.attendance.dateRegister).add(3, 'hours')
      }
    },
    async tick () {
      const video = document.getElementById('qrCodeVideo')
      const canvasElement = document.getElementById('canvas')
      const canvas = canvasElement.getContext('2d')
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false
        canvasElement.height = video.videoHeight
        canvasElement.width = video.videoWidth
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height)
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        })
        if (code) {
          this.$refs.successAlert.open()
          this.$refs['myModal'].hide()
          await axios.put('private/attendance/'+code.data)
          const { data } = await axios.get('private/attendance')
          this.attendaces = []
          this.attendaces = data
          video.srcObject.getTracks().forEach((track) => {
            track.stop()
          })
        }
      }
      requestAnimationFrame(this.tick)
    },
    openVideo () {
      const video = document.getElementById('qrCodeVideo')
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
        video.srcObject = stream
        video.setAttribute('playsinline', true)
        video.play()
        requestAnimationFrame(this.tick)
      })
    },
    cpfFormat (cpf) {
      cpf = cpf.replace(/[^\d]/g, '')
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
  }
}
</script>
