import { Component, NgZone, OnInit } from '@angular/core';
import {
  NavController,
  NavParams,
  Platform,
  AlertController,
} from '@ionic/angular';
import { PrinterService } from '../../services/printer.service';
import { ReceiptService } from '../../services/receipt.service';
import { AlertService } from '../../services/alert.service';
import {
  PrintObj,
  ImageObj,
  RasterObj,
  CommandsArray,
  CutPaperAction,
} from '@ionic-native/star-prnt';

@Component({
  selector: 'app-star-io-ext-manager',
  templateUrl: './star-io-ext-manager.page.html',
  styleUrls: ['./star-io-ext-manager.page.scss'],
})
export class StarIoExtManagerPage implements OnInit {
  defaultPrinter: any;
  printerStatusSuscription: any;
  status = '';
  paperStatus = '';
  coverStatus = '';
  drawerStatus = '';

  constructor(
    public navCtrl: NavController,
    private printerService: PrinterService,
    private alertService: AlertService,
    private zone: NgZone,
    private platform: Platform,
    public alertCtrl: AlertController,
    private receiptService: ReceiptService
  ) {
    this.printerStatusSuscription = this.printerService
      .getStatus()
      .subscribe((printerStatus) => {
        this.zone.run(() => {
          this.updateStatus(printerStatus.dataType);
        });
      });

    this.platform.pause.subscribe(async () => {
      console.log('[INFO] App paused, closing the connection');
      await this.disconnect();
    });

    this.platform.resume.subscribe(async () => {
      console.log('[INFO] App resumed, re-connecting to the printer');
      await this.connect();
    });
  }

  updateStatus(printerStatus: string) {
    switch (printerStatus) {
      case 'printerOnline':
        this.status = 'Online';
        break;

      case 'printerOffline':
        this.status = 'Offline';
        break;

      case 'printerImpossible':
        this.status = 'Impossible';
        break;

      case 'printerPaperEmpty':
        this.paperStatus = 'Empty';
        break;

      case 'printerPaperNearEmpty':
        this.paperStatus = 'Near Empty';
        break;

      case 'printerPaperReady':
        this.paperStatus = 'Ready';
        break;

      case 'printerCoverOpen':
        this.coverStatus = 'Open';
        break;

      case 'printerCoverClose':
        this.coverStatus = 'Closed';
        break;

      case 'cashDrawerOpen':
        this.drawerStatus = 'Open';
        break;

      case 'cashDrawerClose':
        this.drawerStatus = 'Closed';
        break;

      default:
        break;
    }
  }

  async connect() {
    console.log('Connect');
    let loading = await this.alertService.createLoading('Communicating...');
    await loading.present();
    let hasBarcodeReader = false;
    this.printerService
      .connect(
        this.defaultPrinter.portName,
        this.defaultPrinter.emulation,
        hasBarcodeReader
      )
      .subscribe(
        async (result) => {
          await loading.dismiss();
          console.log(result);
        },
        async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error, 'Communication Error: ');
        }
      );
  }

  async disconnect() {
    console.log('Disconnect');
    let loading = await this.alertService.createLoading('Communicating...');
    await loading.present();
    this.printerService
      .disconnect()
      .then(async (result) => {
        await loading.dismiss();
        if (this.printerStatusSuscription) {
          this.printerStatusSuscription.unsuscribe();
        }
        console.log(result);
      })
      .catch(async (error) => {
        await loading.dismiss();
        if (this.printerStatusSuscription) {
          this.printerStatusSuscription.unsuscribe();
        }
        this.alertService.createAlert(error, 'Communication Error: ');
      });
  }

  async printRawText() {
    let loading = await this.alertService.createLoading('Communicating...');
    loading.present();

    let printObj: PrintObj = {
      text: 'Star Clothing Boutique\n123 Star Road\nCity, State 12345\n\n',
      cutReceipt: true,
      openCashDrawer: false,
    };
    /*Send portName null here to use the connected printer through StarIOExtManager instead of creating a new SMPort instance*/
    this.printerService
      .printRawText(null, this.defaultPrinter.emulation, printObj)
      .then(async (result) => {
        await loading.dismiss();
        this.alertService.createAlert('Success!', 'Communication Result: ');
      })
      .catch(async (error) => {
        await loading.dismiss();
        this.alertService.createAlert(error);
      });
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

    const alert = await this.alertCtrl.create({
      header: 'Select Paper Size',
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
    this.selectPaperSize().then(async (paperSize) => {
      let rasterObj: RasterObj =
        this.receiptService.rasterReceiptExample(paperSize);

      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      /*Send portName null here to use the connected printer through StarIOExtManager instead of creating a new SMPort instance*/
      this.printerService
        .printRasterReceipt(null, this.defaultPrinter.emulation, rasterObj)
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    });
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
        .printImage(null, this.defaultPrinter.emulation, imageObj)
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
    this.selectPaperSize().then(async (paperSize) => {
      let commands: CommandsArray =
        this.receiptService.getExampleReceipt(paperSize);

      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      /*Send portName null here to use the connected printer through StarIOExtManager instead of creating a new SMPort instance*/
      this.printerService
        .print(null, this.defaultPrinter.emulation, commands)
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    });
  }

  async printHorizontalTab() {
    //generate Commands for a 3 inches receipt using horizontal tabs
    let commands: CommandsArray = this.receiptService.getExampleReceipt(
      '3',
      true
    );

    let loading = await this.alertService.createLoading('Communicating...');
    await loading.present();

    /*Send portName null here to use the connected printer through StarIOExtManager instead of creating a new SMPort instance*/
    this.printerService
      .print(null, this.defaultPrinter.emulation, commands)
      .then(async (result) => {
        await loading.dismiss();
        this.alertService.createAlert('Success!', 'Communication Result: ');
      })
      .catch(async (error) => {
        await loading.dismiss();
        this.alertService.createAlert(error);
      });
  }

  printQRCode() {
    this.selectPaperSize().then(async (paperSize) => {
      //generate Commands receipts using QrCodes
      let commands: CommandsArray = this.receiptService.getExampleReceipt(
        paperSize,
        false,
        true
      );

      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      /*Send portName null here to use the connected printer through StarIOExtManager instead of creating a new SMPort instance*/
      this.printerService
        .print(null, this.defaultPrinter.emulation, commands)
        .then(async (result) => {
          await loading.dismiss();
          this.alertService.createAlert('Success!', 'Communication Result: ');
        })
        .catch(async (error) => {
          await loading.dismiss();
          this.alertService.createAlert(error);
        });
    });
  }

  async openCashDrawer() {
    if (this.defaultPrinter) {
      let loading = await this.alertService.createLoading('Communicating...');
      await loading.present();

      this.printerService
        .openCashDrawer(null, this.defaultPrinter.emulation)
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

  ngOnInit() {
    this.printerService.getDefaultPrinter().then(async (printer) => {
      if (printer) {
        this.defaultPrinter = printer;
        await this.connect();
      } else {
        this.alertService.createAlert('Please select a printer');
      }
    });
  }

  async ngOnDestroy() {
    await this.disconnect();
  }
}
