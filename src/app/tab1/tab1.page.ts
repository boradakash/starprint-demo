import { Component } from '@angular/core';
import { StarPRNT } from '@ionic-native/star-prnt/ngx';
import { Platform, AlertController, NavController,ModalController } from '@ionic/angular';
import { PrinterService } from '../../services/printer.service';
import { ReceiptService } from '../../services/receipt.service';
import { AlertService } from '../../services/alert.service';

import {
  PrintObj,
  ImageObj,
  CommandsArray,
  RasterObj,
  CutPaperAction,
} from '@ionic-native/star-prnt';
import { PrinterListPage } from '../printer-list/printer-list.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  defaultPrinter: any;
  constructor(
    public platform: Platform,
    public alertController: AlertController,
    public navContoller: NavController,
    private receiptService: ReceiptService,
    private printerService: PrinterService,
    private alertService: AlertService,
    public modalController: ModalController
  ) {}

  async printerTypePopup() {
    let inputArray = [];

    inputArray.push({
      type: 'radio',
      label: 'LAN',
      value: 'LAN',
      checked: true,
    });
    inputArray.push({
      type: 'radio',
      label: 'Bluetooth',
      value: 'Bluetooth',
    });
    inputArray.push({
      type: 'radio',
      label: 'USB',
      value: 'USB',
    });
    inputArray.push({
      type: 'radio',
      label: 'All',
      value: 'All',
    });

    const alert = await this.alertController.create({
      header: 'Select Interface',
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
          handler: async (portType) => {
            const modal = await this.modalController.create({
              component: PrinterListPage,
              componentProps: {
                portType: portType,
              },
            });
            await modal.present();

            // this.navContoller.navigateForward('printer-list', {
            //   state: {
            //     portType: portType,
            //   },
            // });
          },
        },
      ],
    });

    await alert.present();
  }

  async printRawText() {
    if (this.defaultPrinter) {
      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      let printObj: PrintObj = {
        text: 'Star Clothing Boutique\n123 Star Road\nCity, State 12345\n\n',
        cutReceipt: true,
        openCashDrawer: false,
      };

      this.printerService
        .printRawText(
          this.defaultPrinter.portName,
          this.defaultPrinter.emulation,
          printObj
        )
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  async selectPaperSize(): Promise<any> {
    let inputArray = [];

    inputArray.push({
      type: 'radio',
      label: '2" (384dots)',
      value: '2',
      checked: true,
    });
    inputArray.push({ type: 'radio', label: '3" (576dots)', value: '3' });
    inputArray.push({ type: 'radio', label: '4" (832dots)', value: '4' });

    const alert = await this.alertController.create({
      header: 'Select Paper Siz',
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
          handler: (paperSize) => {
            return paperSize;
          },
        },
      ],
    });

    await alert.present();
  }

  printRasterReceipt() {
    if (this.defaultPrinter) {
      this.selectPaperSize().then(async (paperSize) => {
        let rasterObj: RasterObj =
          this.receiptService.rasterReceiptExample(paperSize);

        let loading = await this.alertService.createLoading('Communicating...');
        await loading.present();

        this.printerService
          .printRasterReceipt(
            this.defaultPrinter.portName,
            this.defaultPrinter.emulation,
            rasterObj
          )
          .then(async (result) => {
            await loading.dismiss();
            this.alertService.createAlert('Success!', 'Communication Result: ');
          })
          .catch(async (error) => {
            await loading.dismiss();
            this.alertService.createAlert(error);
          });
      });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  async printImage(uri: string) {
    if (this.defaultPrinter) {
      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      let imageObj: ImageObj = {
        uri: uri,
        paperWidth: 576,
        cutReceipt: true,
        openCashDrawer: false,
      };

      this.printerService
        .printImage(
          this.defaultPrinter.portName,
          this.defaultPrinter.emulation,
          imageObj
        )
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  print() {
    if (this.defaultPrinter) {
      this.selectPaperSize().then(async (paperSize) => {
        let commands: CommandsArray =
          this.receiptService.getExampleReceipt(paperSize);

        let loading = await this.alertService.createLoading('Communicating...');
        await loading.present();

        this.printerService
          .print(
            this.defaultPrinter.portName,
            this.defaultPrinter.emulation,
            commands
          )
          .then(async (result) => {
            await loading.dismiss();
            this.alertService.createAlert('Success!', 'Communication Result: ');
          })
          .catch(async (error) => {
            await loading.dismiss();
            this.alertService.createAlert(error);
          });
      });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  async printHorizontalTab() {
    if (this.defaultPrinter) {
      //generate Commands for a 3 inches receipt using horizontal tabs
      let commands: CommandsArray = this.receiptService.getExampleReceipt(
        '3',
        true
      );

      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      this.printerService
        .print(
          this.defaultPrinter.portName,
          this.defaultPrinter.emulation,
          commands
        )
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  printQRCode() {
    if (this.defaultPrinter) {
      this.selectPaperSize().then(async (paperSize) => {
        //generate Commands receipts using QrCodes
        let commands: CommandsArray = this.receiptService.getExampleReceipt(
          paperSize,
          false,
          true
        );

        let loading = await this.alertService.createLoading('Communicating...');
        await loading.present();

        this.printerService
          .print(
            this.defaultPrinter.portName,
            this.defaultPrinter.emulation,
            commands
          )
          .then(async (result) => {
            await loading.dismiss();
            this.alertService.createAlert('Success!', 'Communication Result: ');
          })
          .catch(async (error) => {
            await loading.dismiss();
            this.alertService.createAlert(error);
          });
      });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  showStarIOExtManagerPage() {
    this.navContoller.navigateForward('ext-manager');
  }

  async openCashDrawer() {
    if (this.defaultPrinter) {
      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      this.printerService
        .openCashDrawer(
          this.defaultPrinter.portName,
          this.defaultPrinter.emulation
        )
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  showPrinterStatus() {
    if (this.defaultPrinter) {
      this.navContoller.navigateForward('status', {
        state: {
          portName: this.defaultPrinter.portName,
          emulation: this.defaultPrinter.emulation,
        },
      });
    } else {
      this.alertService.createAlert('Please select a printer!');
    }
  }

  ngOnInit() {
    this.printerService.getDefaultPrinter().then((printer) => {
      console.log(printer);
      this.defaultPrinter = printer;
    });
  }
}
