import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async createAlert(error: string, message?: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: message ? message : 'Something went wrong...',
      message: error,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async createLoading(loadingText: string) {
    const loading = await this.loadingCtrl.create({
      message: loadingText,
    });
    return loading;
  }
}
