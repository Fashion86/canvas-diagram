import { Component, OnInit } from '@angular/core';
import {ModelService} from '../core/services/model.service';
import {ObjectModel} from '../core/datamodel/object.model';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {Router} from '@angular/router';
import {AttributeModel} from '../core/datamodel/attribute.model';
import {FunctionModel} from '../core/datamodel/function.model';
import {ComparatorModel} from '../core/datamodel/comparator.model';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {

  objects: any[] = [];
  pageobjects: any[] = [];
  searchstr = '';
  editObject: ObjectModel;
  deleteObject: ObjectModel;
  editAttribute: AttributeModel;
  deleteAttribute: AttributeModel;
  editFunction: FunctionModel;
  deleteFunction: FunctionModel;
  editComparator: ComparatorModel;
  deleteComparator: ComparatorModel;
  totalRecords: number;
  constructor(private objectAPI: ModelService,
              private router: Router,
              public modalService: NgxSmartModalService) { }

  ngOnInit() {
    this.editObject = new ObjectModel();
    this.editAttribute = new AttributeModel();
    this.editFunction = new FunctionModel();
    this.editComparator = new ComparatorModel();
    this.deleteObject = null;
    this.getObjectList();
  }
  paginate(event) {
    this.pageobjects = [];
    this.pageobjects = this.objects.slice(event.first, event.first + event.rows);
  }
  getObjectList() {
    this.objectAPI.getObjectList().subscribe(
      res => {
        this.objects = res['Items'];
        this.totalRecords = this.objects.length;
        this.pageobjects = [];
        this.pageobjects = this.objects.slice(0,15);
        // if (res['success']) {
        //   this.channels = res['data'];
        // } else {
        //   alert('Error to get channel data');
        // }
      },
      error => {
        console.log(error);
        alert('Unable to fetch object data');
      }
    );

  }

  searchObject(event) {

  }

  onCreate(param, object) {
    if (param === 'object') {
      this.editObject = new ObjectModel();
    } else {
      this.editAttribute = new AttributeModel();
      this.editAttribute.typeName = object.typeName;
      this.editFunction = new FunctionModel();
      this.editFunction.typeName = object.typeName;
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
    this.objects = this.objects.filter(c => c.id != this.deleteObject.id);
    // this.objectAPI.deleteObject(this.deleteObject.id).subscribe(
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
    this.modalService.getModal(param).close();
    if (param == 'object') {
      this.objectAPI.createObject(this.editObject).subscribe(
        res => {
          this.getObjectList();
        },
        error => {
          console.log(error);
          alert('Unable to fetch object data');
        }
      );
    } else if (param == 'attribute') {
      this.objectAPI.createAttribute(this.editAttribute).subscribe(
        res => {
          // this.getObjectList();
        },
        error => {
          console.log(error);
          alert('Unable to fetch object data');
        }
      );
    } else if (param == 'function') {
      this.objectAPI.createFunction(this.editFunction).subscribe(
        res => {
          // this.getObjectList();
        },
        error => {
          console.log(error);
          alert('Unable to fetch object data');
        }
      );
    } else if (param == 'comparator') {
      this.objectAPI.createComparator(this.editComparator).subscribe(
        res => {
          // this.getObjectList();
        },
        error => {
          console.log(error);
          alert('Unable to fetch object data');
        }
      );
    }
  }

  goAttributes(object) {
    this.router.navigate(['/model', object.id, 'attributes']);
  }

  onTabOpen(event) {
    this.objectAPI.getAttributesByObject(this.objects[event.index].typeName).subscribe(
      res => {
        this.objects[event.index]['attributes'] = res['Items'];
      },
      error => {
        console.log(error);
        alert('Unable to fetch attributes data');
      }
    );

    this.objectAPI.getFunctionsByObject(this.objects[event.index].typeName).subscribe(
      res => {
        this.objects[event.index]['functions'] = res['Items'];
      },
      error => {
        console.log(error);
        alert('Unable to fetch functions data');
      }
    );

    this.objectAPI.getComparatorsByObject(this.objects[event.index].typeName).subscribe(
      res => {
        this.objects[event.index]['comparators'] = res['Items'];
      },
      error => {
        console.log(error);
        alert('Unable to fetch comparators data');
      }
    );
  }
}
