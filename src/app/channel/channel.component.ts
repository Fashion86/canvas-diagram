import { Component, OnInit } from '@angular/core';
import {FirebaseUserModel} from '../core/datamodel/user.model';
import {ChannelService} from '../core/services/channel.service';
import {ChannelModel} from '../core/datamodel/channel.model';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  searchstr = '';
  channels: ChannelModel[] = [];
  editChannel: ChannelModel;
  deleteChannel: ChannelModel;
  constructor(private channelAPI: ChannelService,
              public modalService: NgxSmartModalService) { }

  ngOnInit() {
    this.editChannel = new ChannelModel();
    this.deleteChannel = null;
    this.getChannelList();
  }

  getChannelList() {

    this.channelAPI.getChannelList().subscribe(
      res => {
        this.channels = JSON.parse(res)['channels'];
        // if (res['success']) {
        //   this.channels = res['data'];
        // } else {
        //   alert('Error to get channel data');
        // }
      },
      error => {
        console.log(error);
        alert('Unable to fetch channel data');
      }
      );

  }

  searchChannel(event) {

  }
  onCreate() {
    this.editChannel = new ChannelModel();
    this.modalService.getModal('editModal').open(false);
  }

  editData(channel) {
    this.editChannel = channel;
    this.modalService.getModal('editModal').open(false);
  }

  deleteData(channel) {
    this.deleteChannel = channel;
    this.modalService.getModal('deleteModal').open(false);
  }

  onDelete() {
    this.modalService.getModal('deleteModal').close();
    this.channelAPI.deleteChannel(this.deleteChannel.id).subscribe(
      res => {
        // this.channels = JSON.parse(res)['channels'];
      },
      error => {
        console.log(error);
        alert('Unable to delete channel data');
      }
    );
  }

  onSubmit() {

  }
}
