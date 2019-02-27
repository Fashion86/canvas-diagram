import { Component, OnInit } from '@angular/core';
import {ModelService} from '../core/services/model.service';
import {ObjectModel} from '../core/datamodel/object.model';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {Router} from '@angular/router';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {

  objects: ObjectModel[] = [];
  searchstr = '';
  editObject: ObjectModel;
  deleteObject: ObjectModel;
  constructor(private objectAPI: ModelService,
              private router: Router,
              public modalService: NgxSmartModalService) { }

  ngOnInit() {
    this.editObject = new ObjectModel();
    this.deleteObject = null;
    this.getObjectList();
  }

  getObjectList() {
    this.objectAPI.getObjectList().subscribe(
      res => {
        this.objects = JSON.parse(res)['objects'];
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

  onCreate() {
    this.editObject = new ObjectModel();
    this.modalService.getModal('editModal').open(false);
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

  onSubmit() {
    this.modalService.getModal('editModal').close();
    if (!this.editObject.id) {
      const maxID = Math.max.apply(Math, this.objects.map(function(o) { return o.id; }));
      this.editObject.id = maxID + 1;
      this.objects.push(this.editObject);
    } else {
      const edited = this.objects.find( p => p.id === this.editObject.id);
      Object.assign(edited, this.editObject);
    }
  }

  goAttributes(object) {
    this.router.navigate(['/model', object.id, 'attributes']);
  }
}
