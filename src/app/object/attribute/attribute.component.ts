import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModelService} from '../../core/services/model.service';
import {ObjectModel} from '../../core/datamodel/object.model';
import {AttributeModel} from '../../core/datamodel/attribute.model';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  object: ObjectModel;
  attributes: AttributeModel[] = [];
  editAttribute: AttributeModel;
  deleteAttribute: AttributeModel;
  constructor(private objectAPI: ModelService,
              private activatedRoute: ActivatedRoute,
              public modalService: NgxSmartModalService) {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
            // this.objectAPI.getObjectByID(params['id']).subscribe(
            //   res => {
            //     this.object = res['object'];
            //   },
            //   error => {
            //     console.log(error);
            //     alert('Unable to fetch object data');
            //   }
            // );
            // this.getAttributeList(params['id']);
      }
    });
  }

  ngOnInit() {
    this.editAttribute = new AttributeModel();
    this.deleteAttribute = null;
  }

  getAttributeList(modelID) {
    this.objectAPI.getAttributeListByModel(modelID).subscribe(
      res => {
        // if (res['success']) {
        //   this.attributes = res['data'];
        // } else {
        //   alert('Error to get attributes data');
        // }
      },
      error => {
        console.log(error);
        alert('Unable to fetch attributes data');
      }
    );
  }

  searchObject(event) {

  }

  onCreate() {
    this.editAttribute = new AttributeModel();
    this.modalService.getModal('editModal').open(false);
  }

  editData(attribute) {
    this.editAttribute = Object.assign({}, attribute);
    this.modalService.getModal('editModal').open(false);
  }

  deleteData(attribute, index) {
    this.deleteAttribute = attribute;
    this.modalService.getModal('deleteModal').open(false);
  }

  onDelete() {
    this.modalService.getModal('deleteModal').close();
    this.attributes = this.attributes.filter(c => c.id != this.deleteAttribute.id);
    // this.objectAPI.deleteObject(this.deleteAttribute.id).subscribe(
    //   res => {
    //     // this.channels = JSON.parse(res)['channels'];
    //   },
    //   error => {
    //     console.log(error);
    //     alert('Unable to delete attribute data');
    //   }
    // );
  }

  onSubmit() {
    this.modalService.getModal('editModal').close();
    if (!this.editAttribute.id) {
      let maxID = Math.max.apply(Math, this.attributes.map(function(o) { return o.id; }));
      if (this.attributes.length < 1) {
        maxID = 1;
      }
      this.editAttribute.id = maxID + 1;
      this.attributes.push(this.editAttribute);
    } else {
      const edited = this.attributes.find( p => p.id === this.editAttribute.id);
      Object.assign(edited, this.editAttribute);
    }
  }
}
