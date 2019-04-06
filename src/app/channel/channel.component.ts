import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FirebaseUserModel} from '../core/datamodel/user.model';
import {ChannelService} from '../core/services/channel.service';
import {ChannelModel} from '../core/datamodel/channel.model';
import { NgxSmartModalService } from 'ngx-smart-modal';
import {ModelService} from '../core/services/model.service';
import {Router} from '@angular/router';
import {SchemaService} from '../core/services/schema.service';
import {ComparatorModel} from '../core/datamodel/comparator.model';
import {ObjectModel} from '../core/datamodel/object.model';
import {FunctionModel} from '../core/datamodel/function.model';
import {AttributeModel} from '../core/datamodel/attribute.model';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  channels: any[] = [];
  pagechannels: any[] = [];
  objectpageSize = 20;
  searchstr = '';
  editObject: ChannelModel;
  deleteObject: ChannelModel;
  editAttribute: AttributeModel;
  deleteAttribute: AttributeModel;
  editFunction: FunctionModel;
  deleteFunction: FunctionModel;
  editComparator: ComparatorModel;
  deleteComparator: ComparatorModel;
  totalRecords: number;
  constructor(private channelAPI: ChannelService,
              private router: Router,
              public modalService: NgxSmartModalService) { }


  ngOnInit() {
    this.editObject = new ChannelModel();
    this.editAttribute = new AttributeModel();
    this.editFunction = new FunctionModel();
    this.editComparator = new ComparatorModel();
    this.deleteObject = null;
    this.getChannelList();
  }

  objectpaginate(event) {
    this.pagechannels = [];
    this.pagechannels = this.channels.slice(event.first, event.first + event.rows);
  }

  getChannelList() {
    this.channelAPI.getChannelList().subscribe(
      res => {console.log(res)
        // this.channels = res['Items'];
        // this.totalRecords = this.channels.length;
        // this.pagechannels = [];
        // this.pagechannels = this.channels.slice(0, this.objectpageSize);
      },
      error => {
        console.log(error);
        alert('Unable to fetch object data');
      }
    );

  }

  onCreate(param, object) {
    if ( param === 'object' ) {
      this.editObject = new ChannelModel();
    } else if ( param == 'attribute') {
      this.editAttribute = new AttributeModel();
      this.editAttribute.typeName = object.typeName;
      this.editAttribute.attributeName ='test';
    } else if ( param == 'function') {
      this.editFunction = new FunctionModel();
      this.editFunction.typeName = object.typeName;
    } else if ( param == 'comparator') {
      this.editComparator = new ComparatorModel();
      this.editComparator.typeName = object.typeName;
    }
    this.modalService.getModal(param).open(false);
  }

  editData(object) {
    this.editObject = Object.assign({}, object);
    this.modalService.getModal('editModal').open(false);
  }

  deleteData(object, index) {
    this.deleteObject = object;
    this.modalService.getModal('deleteModal').open(false);
  }

  onDelete() {
    this.modalService.getModal('deleteModal').close();
    this.channels = this.channels.filter(c => c.id != this.deleteObject.id);
    // this.channelAPI.deleteObject(this.deleteObject.id).subscribe(
    //   res => {
    //     // this.channels = JSON.parse(res)['channels'];
    //   },
    //   error => {
    //     console.log(error);
    //     alert('Unable to delete object data');
    //   }
    // );
  }

  onSubmit(param) {
    console.log('param: ', param);
    this.modalService.getModal(param).close();
    if (param == 'object') {
      // this.channelAPI.createObject(this.editObject).subscribe(
      //   res => {
      //     this.getObjectList();
      //   },
      //   error => {
      //     console.log(error);
      //     alert('Unable to fetch object data');
      //   }
      // );
    } else if (param == 'attribute') {

      // this.channelAPI.createAttribute(this.editAttribute).subscribe(
      //   res => {
      //     // this.getObjectList();
      //   },
      //   error => {
      //     console.log(error);
      //     alert('Unable to fetch object data');
      //   }
      // );
    } else if (param == 'function') {
      // this.channelAPI.createFunction(this.editFunction).subscribe(
      //   res => {
      //     // this.getObjectList();
      //   },
      //   error => {
      //     console.log(error);
      //     alert('Unable to fetch object data');
      //   }
      // );
    } else if (param == 'comparator') {
      // this.channelAPI.createComparator(this.editComparator).subscribe(
      //   res => {
      //     // this.getObjectList();
      //   },
      //   error => {
      //     console.log(error);
      //     alert('Unable to fetch object data');
      //   }
      // );
    }
  }

  goAttributes(object) {
    this.router.navigate(['/model', object.id, 'attributes']);
  }

  onTabOpen(event) {
    // this.channelAPI.getAttributesByObject(this.channels[event.index].typeName).subscribe(
    //   res => {
    //     this.channels[event.index]['attributes'] = res['Items'];
    //   },
    //   error => {
    //     console.log(error);
    //     alert('Unable to fetch attributes data');
    //   }
    // );
    //
    // this.channelAPI.getFunctionsByObject(this.channels[event.index].typeName).subscribe(
    //   res => {
    //     this.channels[event.index]['functions'] = res['Items'];
    //   },
    //   error => {
    //     console.log(error);
    //     alert('Unable to fetch functions data');
    //   }
    // );
    //
    // this.channelAPI.getComparatorsByObject(this.channels[event.index].typeName).subscribe(
    //   res => {
    //     this.channels[event.index]['comparators'] = res['Items'];
    //   },
    //   error => {
    //     console.log(error);
    //     alert('Unable to fetch comparators data');
    //   }
    // );
  }
}
