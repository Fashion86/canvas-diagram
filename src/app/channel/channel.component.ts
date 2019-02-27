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
      console.log(this.searchstr)
  }
  onCreate() {
    this.editChannel = new ChannelModel();
    this.modalService.getModal('editModal').open(false);
  }

  editData(channel) {
    this.editChannel = Object.assign({}, channel);
    this.modalService.getModal('editModal').open(false);
  }

  deleteData(channel) {
    this.deleteChannel = channel;
    this.modalService.getModal('deleteModal').open(false);
  }

  onDelete() {
    this.modalService.getModal('deleteModal').close();
    this.channels = this.channels.filter(c => c.id != this.deleteChannel.id);
    // this.channelAPI.deleteChannel(this.deleteChannel.id).subscribe(
    //   res => {
    //     // this.channels = JSON.parse(res)['channels'];
    //   },
    //   error => {
    //     console.log(error);
    //     alert('Unable to delete channel data');
    //   }
    // );
  }

  onSubmit() {
    this.modalService.getModal('editModal').close();
    if (!this.editChannel.id) {
      const maxID = Math.max.apply(Math, this.channels.map(function(o) { return o.id; }));
      this.editChannel.id = maxID + 1;
      this.channels.push(this.editChannel);
      // this.channelAPI.createChannel(this.editChannel).subscribe(
      //   res => {
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // );
    } else {
      const edited = this.channels.find( p => p.id === this.editChannel.id);
      Object.assign(edited, this.editChannel);
      // this.channelAPI.updateChannel(this.editChannel).subscribe(
      //   res => {
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // );
    }
  }
}
