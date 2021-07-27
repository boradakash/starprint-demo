import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavController, AlertController } from '@ionic/angular';
import { PrinterService } from '../../services/printer.service';
import { AlertService } from '../../services/alert.service';
import { Printers } from '@ionic-native/star-prnt';
@Component({
  selector: 'app-printer-list',
  templateUrl: './printer-list.page.html',
  styleUrls: ['./printer-list.page.scss'],
})
export class PrinterListPage implements OnInit {
  @Input() portType: string;
  printerList: Printers = [];
  selectedPrinter: any = {};
  ngOnInit() {
    console.log('ngOnInit');
  }
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private printerService: PrinterService,
    private alertService: AlertService,
    private router: Router
  ) {
    // if (this.router.getCurrentNavigation().extras.state) {
    //   this.portType = this.router.getCurrentNavigation().extras.state.portType;
    // }

    if (this.portType != null) {
      this.portDiscovery(this.portType);
    } else {
      this.portDiscovery('All');
    }
  }

  async portDiscovery(portType: string) {
    let loading = await this.alertService.createLoading('Communicating');
    await loading.present();
    this.printerService
      .portDiscovery(portType)
      .then(async (Printers) => {
        await loading.dismiss();
        this.printerList = [];
        this.printerList = Printers;
        console.log(this.printerList);
      })
      .catch((error) => {
        loading.dismiss();
        alert('Error finding printers ' + error);
      });
  }

  /**
   * Get the emulation type for a particular printer model.
   */
  async selected() {
    let inputArray = [];

    inputArray.push({ type: 'radio', label: 'mPOP', value: 'StarPRNT' });
    inputArray.push({ type: 'radio', label: 'FVP10', value: 'StarLine' });
    inputArray.push({ type: 'radio', label: 'TSP100', value: 'StarGraphic' });
    inputArray.push({ type: 'radio', label: 'TSP650II', value: 'StarLine' });
    inputArray.push({ type: 'radio', label: 'TSP650II', value: 'StarLine' });
    inputArray.push({ type: 'radio', label: 'TSP700II', value: 'StarLine' });
    inputArray.push({ type: 'radio', label: 'TSP800II', value: 'StarLine' });
    inputArray.push({ type: 'radio', label: 'SP700', value: 'StarDotImpact' });
    inputArray.push({
      type: 'radio',
      label: 'SM-S210i',
      value: 'EscPosMobile',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-S220i',
      value: 'EscPosMobile',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-S230i',
      value: 'EscPosMobile',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-T300i/T300',
      value: 'EscPosMobile',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-T400i',
      value: 'EscPosMobile',
    });
    inputArray.push({ type: 'radio', label: 'SM-L200', value: 'StarPRNT' });
    inputArray.push({ type: 'radio', label: 'SM-L300', value: 'StarPRNT' });
    inputArray.push({ type: 'radio', label: 'BSC10', value: 'EscPos' });
    inputArray.push({
      type: 'radio',
      label: 'SM-S210i StarPRNT',
      value: 'StarPRNT',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-S220i StarPRNT',
      value: 'StarPRNT',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-S230i StarPRNT',
      value: 'StarPRNT',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-T300i/T300 StarPRNT',
      value: 'StarPRNT',
    });
    inputArray.push({
      type: 'radio',
      label: 'SM-T400i StarPRNT',
      value: 'StarPRNT',
    });

    const alert = await this.alertCtrl.create({
      header: 'Confirm. What is your printer?',
      inputs: inputArray,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (emulation) => {
            this.savePrinter(emulation);
          },
        },
      ],
    });

    await alert.present();
  }

  savePrinter(emulation) {
    if (this.selectedPrinter.printer) {
      this.printerService.saveDefaultPrinter(
        this.selectedPrinter.printer,
        emulation
      );
      this.navCtrl.pop();
    } else {
      alert('Please select the printer ');
    }
  }
}
