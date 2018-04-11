import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LojaModel } from '../../model/loja.model'
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-lojas',
  templateUrl: 'lojas.html',
})
export class LojasPage {

  lojas$: Observable<LojaModel[]>

  constructor(private db: DatabaseProvider<LojaModel[]>,
    private alert: AlertController,
    public navCtrl: NavController, public navParams: NavParams) {

      this.lojas$ = this.db
      .get('lojas')
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LojasPage');
  }

  addLoja(obj: any){
    var novo = false
    if(obj === undefined){
      obj = new LojaModel();
      novo = true;
    }
    let prompt = this.alert.create({
      title: 'Adicionar loja',
      inputs: [
        {
          name: 'nome',
          placeholder: 'Nome',
          value: obj.nome
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Salvar',
          handler: data =>{
            var loja = <LojaModel>data;

            if(novo){
              this.db.add(loja)
            }
            else{
              loja.key = obj.key;
              this.db.edit(loja);
            }
          }
        }
      ]
    })
    prompt.present();
  }

  removeLoja(obj: any){
    this.db.remove(obj);
  }

  editLoja(obj: any){
    this.addLoja(obj)
  }

  hidden(obj: any){
    console.log(obj.show)
    obj.show = !obj.show;
    console.log(obj.show)
  }
}
