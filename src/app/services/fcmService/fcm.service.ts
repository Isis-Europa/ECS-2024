import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { GeolocationService } from '../geolocationService/geolocation.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private http: HttpClient, public geolocation: GeolocationService, public platform: Platform) {
    this.addListeners()
  }
  
  addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      alert('Registration token: '+ token.value);
      console.log('Registration token: ' + token.value);

      let topic: string;
      if (Capacitor.getPlatform() === "android") {
        topic = 'google'
      } else {
        topic = "not-registered"
      }

      FCM.subscribeTo({ topic })
        .then(res => console.log(`Utente registrato al topic: ${topic}`))
        .catch(err => console.log(`C'è stato un errore nell'iscrizione al topic: ${topic}`))
    });

    await PushNotifications.addListener('registrationError', err => {
      alert('Registration error: '+ err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      if (this.geolocation.getDistanceFromLatLonInKm(Number(localStorage.getItem("latitude")), Number(localStorage.getItem("longitude")), Number(notification.data.latitude), Number(notification.data.longitude)) >= 1) {
        alert('Push notification received data: ' + JSON.stringify(notification.data));
      }
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      alert('Push notification performed data: '+ JSON.stringify(notification.notification.data));
    });
  }

  async registerPushNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    alert(JSON.stringify(permStatus))

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    if (permStatus.receive === "granted") {
      try {
        await PushNotifications.register();
      } catch (error) {
        alert(JSON.stringify(error))
      }
    }

  }

  async unregisterPushNotification() {
    await PushNotifications.unregister().then((token) => alert("Unregistered Token: "+token))
  }

  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    alert('delivered notifications '+ JSON.stringify(notificationList));
  }

  async sendNotification() {

    // Header per l'access token
    let headers_token: HttpHeaders = new HttpHeaders(
      { 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'GET' 
    })

    // Richiesta per l'access token su un nostro hosting attraverso php
    await this.http.get("https://sitomattiachat.altervista.org/ecs/", { headers: headers_token }).subscribe(
      (data: any) => {

        // Headers per l'invio della notifica
        let headers_firebase: HttpHeaders = new HttpHeaders(
          {
          'Content-Type': 'application\json', 
          'Authorization': 'Bearer ' + data
        })


        // let json = {
        //   "message": {
        //     "topic": "google",
        //     "android": {
        //       "content_available": true,
        //       "notification": {
        //         "title": "SOS - Geolocation",
        //         "body": "Qualcuno ha richiesto il tuo intervento clicca e visualizza la sua posizione!"
        //       },
        //       "data": {
        //         "latitude": localStorage.getItem("latitude"),
        //         "longitude": localStorage.getItem("longitude")
        //       }
        //     }
        //   }
        // }

        let json = {
          "message": {
            "topic": "google",
            "data": {
              "latitude": localStorage.getItem("latitude"),
              "longitude": localStorage.getItem("longitude")
            }
          }
        }

        // Richiesta per la notifica
        this.http.post("https://fcm.googleapis.com/v1/projects/stable-device-335608/messages:send", json, { headers: headers_firebase }).subscribe({
          next: (data) => {
            console.log(JSON.stringify(data))
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => { console.log("Richiesta Completata") }
        });
      });

  }
}