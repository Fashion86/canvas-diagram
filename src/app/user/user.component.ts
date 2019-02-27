import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/datamodel/user.model';
import * as go from 'gojs'
import {ChannelService} from '../core/services/channel.service';
import {AnswerService} from '../core/services/answer.service';
import {QuestionService} from '../core/services/question.service';
import {ChannelModel} from '../core/datamodel/channel.model';
import {AnswerModel} from '../core/datamodel/answer.model';
import {QuestionModel} from '../core/datamodel/question.model';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit, AfterViewInit {
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  channels: ChannelModel[] = [];
  answers: AnswerModel[] = [];
  questions: QuestionModel[] = [];
  editQuestion: QuestionModel;
  editAnswer: AnswerModel;
  myDiagram: any;
  answerTemplate: any;
  questionTemplate: any;
  nodeDataArray: any[] = [];
  linkDataArray: any[] = [];
  e: any;
  obj: any;
  dialogFlag = 'create';
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private channelAPI: ChannelService,
    public modalService: NgxSmartModalService,
    private answerAPI: AnswerService,
    private questionAPI: QuestionService
  ) {
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

  ngOnInit(): void {
    this.editAnswer = new AnswerModel();
    this.editQuestion = new QuestionModel();

  }
  ngAfterViewInit(): void {
    var $ = go.GraphObject.make;
    this.myDiagram = $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
      {
        initialContentAlignment: go.Spot.Left,
        allowSelect: true,
        initialDocumentSpot: go.Spot.TopCenter,
        initialViewportSpot: go.Spot.TopCenter,
        layout:
          $(go.TreeLayout,  // use a TreeLayout to position all of the nodes
            {
              treeStyle: go.TreeLayout.StyleLastParents,
              // properties for most of the tree:
              angle: 90,
              layerSpacing: 80,
              // properties for the "last parents":
              alternateAngle: 0,
              alternateAlignment: go.TreeLayout.AlignmentStart,
              alternateNodeIndent: 20,
              alternateNodeIndentPastParent: 1,
              alternateNodeSpacing: 20,
              alternateLayerSpacing: 40,
              alternateLayerSpacingParentOverlap: 1,
              alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
              alternateChildPortSpot: go.Spot.Left
            }),
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,  // the user cannot select any part,
      });


    // define a function named "addChild" that is invoked by a button click
    const showAnswerDialog = (e, obj) => {
      this.e = e;
      this.obj = obj;
      this.onCreateAnswer();
    };
    const showQuestionDialog = (e, obj) => {
      this.e = e;
      this.obj = obj;
      this.onCreateQuestion();
    };

    const editNode = (e, obj) => {
      this.e = e;
      this.obj = obj;
      this.onEditNode();
    };

    this.myDiagram.animationManager.isEnabled = false;

    this.myDiagram.model.set(this.myDiagram.model.modelData, "choices", ["one", "two", "three"]);

    this.answerTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Circle", { fill: "whitesmoke", strokeWidth: 1 }),
        $(go.Panel, "Vertical", { padding: 0, margin: 0 },
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "condition")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "expression")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "feedback")),
          $("Button", { margin: 2, click: showQuestionDialog },
            $(go.TextBlock, " + Add a question"))),
        {
          doubleClick: editNode,
          // selectionChanged: function(part) {
          //   var shape = part.elt(0);
          //   shape.fill = part.isSelected ? "gray" : "white";
          // }
        });

    this.questionTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: "whitesmoke" }),
        $(go.Panel, "Vertical", { margin: 20 },
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "name")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "channel")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "expression")),
          $("Button", { margin: 2, click: showAnswerDialog },
            $(go.TextBlock, " + Add an answer"))),
          {
            doubleClick: editNode
          }

      );

    // create the nodeTemplateMap, holding three node templates:
    var templmap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
    // for each of the node categories, specify which template to use
    templmap.add("answer", this.answerTemplate);
    templmap.add("question", this.questionTemplate);

    //templmap.add("", myDiagram.nodeTemplate);
    this.myDiagram.nodeTemplateMap = templmap;
    this.myDiagram.layout = $(go.TreeLayout);

    this.nodeDataArray = [
      { key: "N", name: "Name", channel: "Channel", expression: "Expression", type: "question", category: "question" },
    ];
    this.linkDataArray = [
      { from: "Alpha", to: "Beta" }
    ];
    // create the Overview and initialize it to show the main Diagram
    var myOverview =
      $(go.Overview, "myOverviewDiv",
        { observed: this.myDiagram,contentAlignment: go.Spot.Center });
    this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);

    this.myDiagram.model.undoManager.isEnabled = true;

    document.getElementById('zoom-fit').addEventListener('click',  () => {
      this.myDiagram.zoomToFit();
    });
    document.getElementById('zoom-in').addEventListener('click', () =>  {
      this.myDiagram.commandHandler.increaseZoom();
    });
    document.getElementById('zoom-out').addEventListener('click', () =>  {
      this.myDiagram.commandHandler.decreaseZoom();
    });
    document.getElementById('zoom-origin').addEventListener('click', () =>  {
      this.myDiagram.commandHandler.resetZoom();
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

  onCreateAnswer() {
    this.dialogFlag = 'create';
    this.editAnswer = new AnswerModel();
    this.modalService.getModal('editModal_A').open(false);
  }

  onEditNode() {
    this.dialogFlag = 'edit';
    if (this.obj.data.category == 'question') {
      this.modalService.getModal('editModal_Q').open(false);
    } else if (this.obj.data.category == 'answer') {
      this.modalService.getModal('editModal_A').open(false);
    }
//     this.myDiagram.startTransaction("vacate");
//     // update the key, name, and comments
//     this.myDiagram.model.setDataProperty(this.obj.data, "name", "(Vacant)");
//     this.myDiagram.commitTransaction("vacate");
// console.log(this.nodeDataArray, this.obj.data)
  }

  onCreateQuestion() {
    this.dialogFlag = 'create';
    this.editQuestion = new QuestionModel();
    this.modalService.getModal('editModal_Q').open(false);
  }

  addAnswer() {
    this.modalService.getModal('editModal_A').close();
    this.addChildNode();
  }
  addQuestion() {
    this.modalService.getModal('editModal_Q').close();
    this.addChildNode();
  }
  addChildNode() {
    var selnode = this.myDiagram.selection.first();

    if (selnode) selnode.isSelected = false;

    this.obj.part.isSelected = true;
    selnode = this.obj.part;
    selnode.isHighlighted = false;
    if (!(selnode instanceof go.Node)) return;

    this.myDiagram.commit((d: any) => {
      // have the Model add a new node data
      var newnode;
      if (selnode.data.type == "question")
        newnode = { key: "N", condition: this.editAnswer.condition, expression: "expression", feedback: "feedback", type: "answer", category: "answer" };
      else
        newnode = { key: "N", name: "Name", channel: "Channel", expression: "Expression", type: "question", category: "question" };

      d.model.addNodeData(newnode);  // this makes sure the key is unique
      // and then add a link data connecting the original node with the new one
      var newlink = { from: selnode.data.key, to: newnode.key };
      // add the new link to the model
      d.model.addLinkData(newlink);
    }, "add node and link");
    //console.log(selnode.data.type);
    this.myDiagram.clearHighlighteds();
  }

}
