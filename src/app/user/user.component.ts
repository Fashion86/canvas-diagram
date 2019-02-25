import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/datamodel/user.model';
import * as go from 'gojs'
import {ChannelService} from '../core/services/channel.service';
import {ChannelModel} from '../core/datamodel/channel.model';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit {
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  channels: ChannelModel[] = [];
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private channelAPI: ChannelService
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

    // myDiagram.model = new go.GraphLinksModel(
    //   [
    //     {key: 1, choices: this.channels, loc: new go.Point(250,150) },
    //     {key: 2, choices: this.channels, loc: new go.Point(50,50) }
    //   ],
    //   [
    //     { from: 1, to: 2 }
    //   ]);

    // define a function named "addChild" that is invoked by a button click
    const addChild = function (e, obj) {

      //obj.part.node.select;
      var selnode = myDiagram.selection.first();

      if (selnode) selnode.isSelected = false;

      obj.part.isSelected = true;
      selnode = obj.part;
      selnode.isHighlighted = false;
      if (!(selnode instanceof go.Node)) return;

      console.log(selnode);
      myDiagram.commit(function (d: any) {

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

}
