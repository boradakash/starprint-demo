import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PrinterService } from '../../services/printer.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  printerStatus: any;
  portName: string;
  emulation: string;

  constructor(
    public navCtrl: NavController,
    private printerService: PrinterService,
    private alertService: AlertService,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.portName = this.router.getCurrentNavigation().extras.state.portName;
      this.emulation =
        this.router.getCurrentNavigation().extras.state.emulation;
    }
  }

  async checkStatus() {
    if (this.portName != null && this.emulation != null) {
      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();
      this.printerService
        .checkStatus(this.portName, this.emulation)
        .then(async (PrinterStatus) => {
          await loading.dismiss();
          this.printerStatus = PrinterStatus;
          console.log(PrinterStatus);
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    } else {
      this.alertService.createAlert('No printer selected');
    }
  }

  ngOnInit() {
    this.checkStatus();
  }
}
