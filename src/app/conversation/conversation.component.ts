import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/datamodel/user.model';
import {ChannelService} from '../core/services/channel.service';
import {ChannelModel} from '../core/datamodel/channel.model';
import {NodeModel} from '../core/datamodel/node.model';
import {NgxSmartModalService} from 'ngx-smart-modal';
import { NodeService } from '../core/services/node.service';

import * as vis from 'vis';


@Component({
  selector: 'page-user',
  templateUrl: 'conversation.component.html',
  styleUrls: ['conversation.scss']
})
export class ConversationComponent implements OnInit, AfterViewInit {
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  rootNode : NodeModel;
  NgNodes : NodeModel[] =[];
  channels: ChannelModel[] = [];
  editNode:NodeModel = new NodeModel();
  editNodeType: string;
  answerTemplate: any;
  vizNetwork: any;
  questionTemplate: any;
  e: any;
  obj: any;
  dialogFlag = 'create';
  params: any;
  node :any ={id: 1, label: 'Question', shape: 'circle', size:35, level:1};
  edges = new vis.DataSet([]);
  nodes = new vis.DataSet([]);
  
 // create a network
  data = {
	nodes: this.nodes,
	edges: this.edges
};
 options = {
	height: '85%',
	width: '100%',
	locale: 'en',
	configure: {
		enabled: false,
		filter: true,
		showButton: true
	},
	interaction: {
		navigationButtons: true,
		keyboard:true,
		zoomView: true,
		dragView: true,
		dragNodes: false
	},
	layout: {
		hierarchical: {
			direction: 'UD'
        }
	},
	physics:false	 
};
constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private channelAPI: ChannelService,
    public modalService: NgxSmartModalService,
    private nodeAPI: NodeService
  ) {
    this.channelAPI.getChannelList().subscribe(
      res => {
        this.channels = [];
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

  ngOnInit(): void {
	this.editNode = new NodeModel();

  }
  ngAfterViewInit(): void {
	const canvas : any=  document.getElementById('myDiagramDiv');	
	this.rootNode= new NodeModel();
	this.rootNode.type='Question';
	this.rootNode.node= {id: 1, label: 'How may I help you', color: '#ef6c00', shape: 'square', x:10, level:1};
	this.rootNode.parentNodeId=1;
	this.rootNode.nodeId=1;
	this.NgNodes.push(this.rootNode);
	this.nodes.add(this.rootNode.node);

	this.vizNetwork = new vis.Network(canvas, this.data, this.options);
	this.vizNetwork.angularObject= this;
    this.vizNetwork.on("click", 
	function (params) {
		if ( this.getNodeAt(params.pointer.DOM) !== undefined ) {
			
			this.angularObject.params= params.pointer.DOM;
			this.angularObject.onCreateNode.call(this.angularObject);
		}
	}); 
  }

  
 logout() {
    this.authService.doLogout()
      .then((res) => {
        this.location.back();
      }, (error) => {
        console.log("Logout error", error);
      });
  }

closeModal(modalName){
	this.modalService.getModal(modalName).close();
}
 onCreateNode(){
	const parentNodeId= this.vizNetwork.getNodeAt(this.params);
	if ( parentNodeId === undefined )
		console.log( 'parent NodeId is undefined '+ this.params);
	this.dialogFlag = 'create';
	const parentNodeModel= this.NgNodes[parentNodeId-1];
	var newid= 1+this.nodes.length;
	this.editNode = new NodeModel();
	this.editNode.parentNodeId= parentNodeId;
	this.editNode.nodeId= newid;
	this.editNode.node={ id: newid ,label: 'Node ',shape: 'circle', color: '#ef6c00', level:( 1+ (parentNodeModel.node.level)) };

	if ( parentNodeModel.type=='Question') { 
		console.log('Answer');
		this.editNode.type='Answer';
		this.editNode.node.shape='circle';
		this.editNode.node.color='#007799';		
	}
	if ( parentNodeModel.type=='Answer') {
		console.log('Question');
		this.editNode.type='Question';
		this.editNode.node.shape='square';
		this.editNode.node.color='#ef6c00';		
	}
	
	this.NgNodes[parentNodeId-1].children.push(newid);
	this.modalService.getModal('editNodeModal').open(false);
}

 createNode() {
	console.log( 'createNode '+ this.editNode); 
    this.modalService.getModal('editNodeModal').close();
	this.editNode.node.label= this.editNode.name;
	this.editNode.node.name= this.editNode.name;
	var newid= 1+this.nodes.length;
	var e={
		from: this.editNode.parentNodeId,
		to: newid
	};	
	
	console.log(e);
	this.NgNodes.push(this.editNode);	
	this.nodes.add(this.editNode.node);
	this.edges.add(e);
	
	this.nodeAPI.createNode( this.editNode).subscribe(
		res => {
		  console.log(res);
		},
		error => {
		  console.log(error);
		  alert('Unable to fetch object data');
		}
	);
	;
	
	
}
	 
	 
 onEditNode() {
    this.dialogFlag = 'edit';
    if (this.obj.data.category == 'question') {
      this.modalService.getModal('detailModal').open(false);
    } else if (this.obj.data.category == 'answer') {
      this.modalService.getModal('detailModal').open(false);
    }
  }


  

}
