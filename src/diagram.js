/**
 * Taken from
 * https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
 */
/*
 * Node data stores a value. parent points to a node's parent. children points
 * to the next node in the list. Tree _root points to the root node of a tree.
 * traverseDF(callback) traverses nodes of a tree with DFS. traverseBF(callback)
 * traverses nodes of a tree with BFS. contains(data, traversal) searches for a
 * node in a tree. add(data, toData, traverse) adds a node to a tree.
 * remove(child, parent) removes a node in a tree.
 */

function Node(name, x=0, y=0) {
	console.log( 'Node is created');
	this.name = name;
	this.type= 'question';
	this.x=x;
	this.y=y;
	this.parent = null;
	this.children = [];

}

const nodeWidth= 70;
const nodeLength= 160;

const DISTANCE_BETWEEN_COLUMNS= 210;
const DISTANCE_BETWEEN_ROWS= 25;


function Tree(treeName, root_node, fabricCanvas) {
	this.treeName= treeName;
	this._root = root_node;
	root_node.tree=this;
	this.fabricCanvas= fabricCanvas;

}

const mainMap = new Map();

Node.prototype.display= function(canvas) {

	var rect = new fabric.Rect({
		left: this.x,
		top: this.y,
		fill: 'red',
		width: nodeLength,
		height: nodeWidth
	});
	mainMap.set(rect, this);

	rect.on('selected', function() {
		console.log( 'selected');
		node= mainMap.get( this) ;
		node.tree.add( Math.random(), node.name);
		node.tree.display();
	});
	// "add" rectangle onto canvas
	canvas.add(rect);
	canvas.renderAll();
	/*	const ctx = canvas.getContext('2d');
	console.log('canvas '+ canvas);

	// ctx.fillStyle = 'yellow';

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "red";
	ctx.rect(this.x,this.y, nodeLength, nodeWidth);
	ctx.stroke();	
// ctx.fillRect(x,y, questionLength, questionWidth);

	ctx.fillStyle='black';
	ctx.font = '14px bold serif';
	ctx.fillText('Question', this.x+20, this.y+18);

	ctx.font = '12px italic serif';
	ctx.fillText('Add Answer', this.x+20, this.y+38);
	 */
};

Tree.prototype.traverseDF = function(callback) {

	// this is a recurse and immediately-invoking function
	(function recurse(currentNode) {
		// step 2
		for (var i = 0, length = currentNode.children.length; i < length; i++) {
			// step 3
			recurse(currentNode.children[i]);
		}

		// step 4
		callback(currentNode);

		// step 1
	})(this._root);

};

Tree.prototype.traverseBF = function(callback) {
	var queue = new Queue();

	queue.enqueue(this._root);

	currentTree = queue.dequeue();

	while(currentTree){
		for (var i = 0, length = currentTree.children.length; i < length; i++) {
			queue.enqueue(currentTree.children[i]);
		}

		callback(currentTree);
		currentTree = queue.dequeue();
	}
};


Tree.prototype.display= function() {
	callback = function(node) {
		node.display(this.fabricCanvas);
	};
	this.traverseBF.call(this, callback);
};

Tree.prototype.contains = function(callback, traversal) {
	traversal.call(this, callback);
};

Tree.prototype.add = function(name, parentName) {
	//this.canvas.clear();
	traversal= this.traverseBF;
	var child = new Node(name);
	parent = null;
	callback = function(node) {
		if (node.name=== parentName) {
			parent = node;
		}
	};

	 this.contains(callback, traversal);

	if (parent) {
		parent.children.push(child);
		child.parent = parent;
		parent.tree=this;
		child.tree=this;
		traversal.call( this, calculateChildrenCoordinates);        

	} else {
		throw new Error('Cannot add node to a non-existent parent.');
	}
};


function calculateChildrenCoordinates( parent){

	var startY;
	console.log( parent.x + ' '+ parent.y);
	if ( isEven( parent.children.length  ) ){
		startY=  (parent.children.length/ 2 -1/2 ) * (nodeWidth +  DISTANCE_BETWEEN_ROWS) ;
		console.log('even '+ startY);
	}else{
		startY= ( (parent.children.length/ 2) -1/2 ) * ( nodeWidth+  DISTANCE_BETWEEN_ROWS );    	
		console.log('odd '+ startY);
	}
	for (var i = 0; i <  parent.children.length; i++) {
		parent.children[i].y= parent.y + startY- ( i* (nodeWidth+ DISTANCE_BETWEEN_ROWS));
		parent.children[i].x= parent.x+ DISTANCE_BETWEEN_COLUMNS;
		console.log( 'i: '+ i+ ' -->' + parent.children[i].x+' '+ parent.children[i].y)
	}

}
function isEven(n) {
	return n % 2 == 0;
}

Tree.prototype.remove = function(name, parentName, traversal) {
	var tree = this,
	parent = null,
	childToRemove = null,
	index;

	var callback = function(node) {
		if (node.name=== parentName) {
			parent = node;
		}
	};

	this.contains(callback, traversal);

	if (parent) {
		index = findIndex(parent.children, name);

		if (index === undefined) {
			throw new Error('Node to remove does not exist.');
		} else {
			childToRemove = parent.children.splice(index, 1);
		}
	} else {
		throw new Error('Parent does not exist.');
	}

	return childToRemove;
};

function findIndex(arr, name) {
	var index;

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].name === name) {
			index = i;
		}
	}

	return index;
}



function Queue() {
	this._oldestIndex = 1;
	this._newestIndex = 1;
	this._storage = {};
}

Queue.prototype.size = function() {
	return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
	this._storage[this._newestIndex] = data;
	this._newestIndex++;
};

Queue.prototype.dequeue = function() {
	var oldestIndex = this._oldestIndex,
	newestIndex = this._newestIndex,
	deletedData;

	if (oldestIndex !== newestIndex) {
		deletedData = this._storage[oldestIndex];
		delete this._storage[oldestIndex];
		this._oldestIndex++;

		return deletedData;
	}
};

