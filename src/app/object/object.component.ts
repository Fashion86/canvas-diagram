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
    this.editObject = object;
    this.modalService.getModal('editModal').open(false);
  }

  deleteData(object, index) {
    this.deleteObject = object;
    this.modalService.getModal('deleteModal').open(false);
  }

  onDelete() {
    this.modalService.getModal('deleteModal').close();
    this.objectAPI.deleteObject(this.deleteObject.id).subscribe(
      res => {
        // this.channels = JSON.parse(res)['channels'];
      },
      error => {
        console.log(error);
        alert('Unable to delete object data');
      }
    );
  }

  onSubmit() {

  }

  goAttributes(object) {
    this.router.navigate(['/model', object.id, 'attributes']);
  }
}
