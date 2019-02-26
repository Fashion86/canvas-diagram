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
    var myDiagram = $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
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
    const addChild = (e, obj) => {
      this.onCreateAnswer();
      //obj.part.node.select;
      var selnode = myDiagram.selection.first();

      if (selnode) selnode.isSelected = false;

      obj.part.isSelected = true;
      selnode = obj.part;
      selnode.isHighlighted = false;
      if (!(selnode instanceof go.Node)) return;

      myDiagram.commit((d: any) => {
        // have the Model add a new node data
        var newnode;
        if (selnode.data.type == "question")
          newnode = { key: "N", condition: "Condition", expression: "expression", feedback: "feedback", type: "answer", category: "answer" };
        else
          newnode = { key: "N", name: "Name", channel: "Channel", expression: "Expression", type: "question", category: "question" };

        d.model.addNodeData(newnode);  // this makes sure the key is unique
        // and then add a link data connecting the original node with the new one
        var newlink = { from: selnode.data.key, to: newnode.key };
        // add the new link to the model
        d.model.addLinkData(newlink);
      }, "add node and link");
      //console.log(selnode.data.type);
      myDiagram.clearHighlighteds();
    };
    myDiagram.animationManager.isEnabled = false;
    //myDiagram.focus("null");

    myDiagram.model.set(myDiagram.model.modelData, "choices", ["one", "two", "three"]);

    var answerTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Circle", { fill: "whitesmoke", strokeWidth: 1 }),
        $(go.Panel, "Vertical", { padding: 0, margin: 0 },
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "condition")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "expression")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "feedback")),
          // $(go.TextBlock,
          //   { text: "Channels",
          //     editable: true,
          //     font: "10pt Georgia, serif",
          //     // areaBackground: "orangered",
          //     // textEditor: selectbox,
          //     scale: 1 },
          //   new go.Binding("choices")),
          $("Button", { margin: 2, click: addChild },
            $(go.TextBlock, " + Add a question"))))

    var questionTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: "whitesmoke" }),
        $(go.Panel, "Vertical", { margin: 20 },
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "name")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "channel")),
          $(go.TextBlock, { margin: 2, editable: true },
            new go.Binding("text", "expression")),
          $("Button", { margin: 2, click: addChild },
            $(go.TextBlock, " + Add an answer")))

      );

    // create the nodeTemplateMap, holding three node templates:
    var templmap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
    // for each of the node categories, specify which template to use
    templmap.add("answer", answerTemplate);
    templmap.add("question", questionTemplate);

    //templmap.add("", myDiagram.nodeTemplate);
    myDiagram.nodeTemplateMap = templmap;
    myDiagram.layout = $(go.TreeLayout);

    var nodeDataArray = [
      { key: "Alpha", name: "Name", channel: "Channel", expression: "Expression", type: "question", category: "question" },
    ];
    var linkDataArray = [
      { from: "Alpha", to: "Beta" }
    ];
    // create the Overview and initialize it to show the main Diagram
    var myOverview =
      $(go.Overview, "myOverviewDiv",
        { observed: myDiagram,contentAlignment: go.Spot.Center });
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    myDiagram.model.undoManager.isEnabled = true;

    document.getElementById('zoom-fit').addEventListener('click', function () {
      myDiagram.zoomToFit();
    });
    document.getElementById('zoom-in').addEventListener('click', function () {
      myDiagram.commandHandler.increaseZoom();
    });
    document.getElementById('zoom-out').addEventListener('click', function () {
      myDiagram.commandHandler.decreaseZoom();
    });
    document.getElementById('zoom-origin').addEventListener('click', function () {
      myDiagram.commandHandler.resetZoom();
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
    this.editAnswer = new AnswerModel();
    this.modalService.getModal('editModal_A').open(false);
  }

  onCreateQuestion() {
    this.editQuestion = new QuestionModel();
    this.modalService.getModal('editModal_Q').open(false);
  }

  onSubmit() {

  }
}
