let container = document.getElementById('container');
let count = 0;
let size = 10;
function createGrid(size) {
    let square = 640/size;
    let k = 0
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let div = document.createElement('div');
            div.style.width = (square).toString()+"px";
            div.style.height = (square).toString()+"px";
            div.className = 'grid';
            div.style.position='absolute';
            div.id = k + j + 1;
            div.style.color = "black"
            div.style.fontSize = "medium"
            div.innerHTML =  Math.floor(Math.random()*100);
            //let node = document.createTextNode(Math.floor(Math.random()*1000));
            //div.appendChild(node);
            //div.innerHTML +=  Math.floor(Math.random()*1000).toString();
            //console.log(div.style.color.toString())
            div.addEventListener("click", () => {
                //console.log(parseInt(div.innerHTML))
                //div.removeChild(div.firstChild)
                if (count===0){
                    div.style.backgroundColor = "#F65B0D",
                    div.className = "source"
                } else if (count === 1){
                    div.style.backgroundColor = "#EB0DF6",
                    div.className = "destination"
                }else{
                    div.style.backgroundColor = "black",
                    div.className = "barrier"
                }
                count+=1;
            }, false);
            div.style.left = (j*square).toString()+"px"
            div.style.top =(i*square).toString()+"px"
            container.append(div);
        }
        k+=size
    }
}

window.onload = function init(){
    createGrid(size);
    
}

class Graph{
    constructor(){
        this.adjacencyList = {};
    }

    addVertex(vertex, weight){
        //console.log(weight, 'weight')
        if (!this.adjacencyList[vertex.toString()]){
            this.adjacencyList[vertex.toString()] = {'visited' : false, 'nodes': [], 'weight': weight}
        }
    }
    addEdge(source, destination) {
        if (this.adjacencyList[source.toString()] && this.adjacencyList[destination.toString()]) {
            if (!this.adjacencyList[source.toString()]['nodes'].includes(destination.toString())){
                this.adjacencyList[source.toString()]['nodes'].push(destination.toString());
            }
        }
      }
}

class Queue {
    constructor() {
        this.dataStore = Array.prototype.slice.call(arguments, 0);
    }
    enqueue(element) {
        this.dataStore.push(element);
    }

     dequeue() {
        return this.dataStore.shift();
    }

     empty() {
        return this.dataStore.length == 0;
    }

    print(element) {
        this.dataStore.forEach(function (item) {
            element.appendChild(item.node);
        });
    }
    
}

class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor()
    {
        this.items = [];
    }
    enqueue(element, priority){
        var qElement = new QElement(element, priority);
        var contain = false;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(qElement);
        }
    } 
    dequeue(){
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }  
    front(){
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }    
    rear(){
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }
    isEmpty(){
        return this.items.length == 0;
    }
}

function all(barriers){
    let number = size
    let check = [[-1,0, -3 + (3-number)],[0,-1, -1],[0,1, 1],[1,0, 3+ number-3],[1,-1, 2 + number-3],[1,1, 4+ number-3],[-1,-1, -4 + (3-number)],[-1,1, -2 + (3-number)]]
    let myGraph = new Graph()
    let last = 0
    let matrix = []
    console.log(number)
    for (let i = 0; i < number; i++) {
        
        matrix.push([])
        for (let j = 1; j <= number; j++){
            
            if (!barriers.includes(last+j)){
                matrix[i].push(last + j)
                let id = document.getElementById((last+j).toString()).innerHTML;
                //console.log(id)
                myGraph.addVertex(last + j, id)
            }
        }
        last +=number
    }
    last = 0
    for (let i = 0; i < number; i++) {
        for (let j = 0; j < number; j++) {         
            if (!barriers.includes(last + j)){
                check.forEach((item)=>{
                    if (i+item[0]>=0 && j+item[1]>=0 && i+item[0]<last+number && j+item[1]<last+number){
                        if (j===(number-1) && (item[2]!==-2 + (3-number) && item[2]!==1 && item[2]!==4+ number-3)){
                            myGraph.addEdge(last + j+1, last + j+1 + item[2])
                        }
                        else if (j!==(number-1)){
                            myGraph.addEdge(last + j+1, last + j+1 + item[2])
                        }
                        //console.log(last + j+1, last + j+1 + item[2] )
                    }
                })    
            }
        }
        last +=number
    }
    return myGraph;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function BFS(barriers, start, destination){
    let barriers_id = []
    for (let div in barriers){
        if (barriers[div].id !== undefined){
            let a = parseInt(barriers[div].id.split('.'))
            barriers_id.push(a)
        }
    }
    let myGraph  = all(barriers_id)
    let frontier = new Queue();
    frontier.enqueue([ start[0].id , myGraph.adjacencyList[start[0].id]['nodes'] ])
    let came_from  = {}
    //console.log(typeof(start[0].id))
    came_from[start[0].id] = undefined;
    br = false
    while (!frontier.empty()){
        let current = frontier.dequeue();
        if (current[0] === destination[0].id ){
            break
        }
        for (let next = 0; next < current[1].length; next++) {
            if (!came_from[current[1][next]]){
                frontier.enqueue([current[1][next], myGraph.adjacencyList[current[1][next]]['nodes']])
                came_from[current[1][next]] = current[0]
                let newdiv = document.getElementById(current[1][next])
                if (current[1][next] !== start[0].id && current[1][next] !== destination[0].id){
                    newdiv.style.backgroundColor = "#CFF60D"
                    await sleep(15)
                }                
            }
        }
    }
    return came_from
}

async function Dijsktra(barriers, start, destination){
    let barriers_id = []
    for (let div in barriers){
        if (barriers[div].id !== undefined){
            let a = parseInt(barriers[div].id.split('.'))
            barriers_id.push(a)
        }
    }
    let myGraph  = all(barriers_id)
    let frontier = new PriorityQueue();
    frontier.enqueue([ start[0].id , myGraph.adjacencyList[start[0].id]['nodes']], 0)
    let came_from  = {};
    let cost_so_far = {};
    //console.log(typeof(start[0].id))
    came_from[start[0].id] = undefined;
    cost_so_far[start[0].id] = 0;
    br = false
    while (!frontier.isEmpty()){
        let current = frontier.dequeue()['element'];
        if (current[0] === destination[0].id ){
            break
        }
        for (let next = 0; next < current[1].length; next++) {
            //console.log(current, myGraph.adjacencyList[current[1][next]], next)
            let newCost = parseInt(cost_so_far[current[0]] + myGraph.adjacencyList[current[1][next]]['weight'])

            if (!cost_so_far[current[1][next]]  || newCost< cost_so_far[current[1][next]]){
                cost_so_far[current[1][next]] = newCost;
                priority = newCost;
                frontier.enqueue([current[1][next], myGraph.adjacencyList[current[1][next]]['nodes']], priority)
                came_from[current[1][next]] = current[0]
                if (current[0] == current[1][next]){
                    console.log('error')
                    br = true
                    break 
                }
                let newdiv = document.getElementById(current[1][next])
                if (current[1][next] !== start[0].id && current[1][next] !== destination[0].id){
                    newdiv.style.backgroundColor = "#CFF60D"
                    await sleep(15)
                }                
            }
        }
        if (br){
            break
        }
    }
    return came_from
}   

function heuristic(aLeft, aTop,bLeft, bTop){
    return Math.abs(aLeft-bLeft)+ Math.abs(aTop-bTop)
}

async function aStar(barriers, start, destination){
    let barriers_id = []
    for (let div in barriers){
        if (barriers[div].id !== undefined){
            let a = parseInt(barriers[div].id.split('.'))
            barriers_id.push(a)
        }
    }
    let myGraph  = all(barriers_id)
    let frontier = new PriorityQueue();
    frontier.enqueue([ start[0].id , myGraph.adjacencyList[start[0].id]['nodes']], 0)
    let came_from  = {};
    let cost_so_far = {};
    //console.log(typeof(start[0].id))
    came_from[start[0].id] = undefined;
    cost_so_far[start[0].id] = 0;
    br = false
    while (!frontier.isEmpty()){
        let current = frontier.dequeue()['element'];
        if (current[0] === destination[0].id ){
            break
        }
        for (let next = 0; next < current[1].length; next++) {
            //console.log(current, myGraph.adjacencyList[current[1][next]], next)
            let newCost = parseInt(cost_so_far[current[0]] + myGraph.adjacencyList[current[1][next]]['weight'])

            if (!cost_so_far[current[1][next]]  || newCost< cost_so_far[current[1][next]]){
                let newdiv = document.getElementById(current[1][next])                
                cost_so_far[current[1][next]] = newCost;
                priority = newCost + heuristic(parseInt(destination[0].style.left),parseInt(destination[0].style.top), parseInt(newdiv.style.left),parseInt(newdiv.style.top));
                frontier.enqueue([current[1][next], myGraph.adjacencyList[current[1][next]]['nodes']], priority)
                came_from[current[1][next]] = current[0]
                if (current[0] == current[1][next]){
                    console.log('error')
                    br = true
                    break 
                }
                if (current[1][next] !== start[0].id && current[1][next] !== destination[0].id){
                    newdiv.style.backgroundColor = "#CFF60D"
                    await sleep(15)
                }                
            }
        }
        if (br){
            break
        }
    }
    return came_from
}   

async function greedyBFS(barriers, start, destination){
    let barriers_id = []
    for (let div in barriers){
        if (barriers[div].id !== undefined){
            let a = parseInt(barriers[div].id.split('.'))
            barriers_id.push(a)
        }
    }
    let myGraph  = all(barriers_id)
    let frontier = new PriorityQueue();
    frontier.enqueue([ start[0].id , myGraph.adjacencyList[start[0].id]['nodes']], 0)
    let came_from  = {}
    //console.log(typeof(start[0].id))
    came_from[start[0].id] = undefined;
    br = false
    while (!frontier.isEmpty()){
        let current = frontier.dequeue()['element'];
        if (current[0] === destination[0].id ){
            break
        }
        console.log(current)
        console.log(current[1].length)
        for (let next = 0; next < current[1].length; next++) {
            if (!came_from[current[1][next]]){
                let newdiv = document.getElementById(current[1][next])
                let priority = heuristic(parseInt(destination[0].style.left),parseInt(destination[0].style.top), parseInt(newdiv.style.left),parseInt(newdiv.style.top)) 
                frontier.enqueue([current[1][next], myGraph.adjacencyList[current[1][next]]['nodes']], priority)
                came_from[current[1][next]] = current[0]
                
                if (current[1][next] !== start[0].id && current[1][next] !== destination[0].id){
                    newdiv.style.backgroundColor = "#CFF60D"
                    await sleep(15)
                }                
            }
        }
    }
    return came_from
}

document.addEventListener('keyup', async (event) => {
    var barriers = document.getElementsByClassName('barrier')
    var start = document.getElementsByClassName('source');
    var destination = document.getElementsByClassName('destination');
    let came_from = undefined;
    if (event.code === 'Numpad1' ){
        came_from =  await BFS(barriers, start, destination)
    }
    else if (event.code === 'Numpad2'){
        //console.log(parseInt(destination[0].style.left),parseInt(destination[0].style.top))
        came_from = await Dijsktra(barriers, start, destination);
    }
    else if (event.code === 'Numpad3'){
        came_from = await greedyBFS(barriers, start, destination);
    }
    else if (event.code === 'Numpad4'){
        came_from = await aStar(barriers, start, destination);
    }
    let current = destination[0].id
    let path =[]
    let max = 98
    while (max>=0 && current !== start[0].id ){
        console.log(current, came_from[current])
        let div = document.getElementById(parseInt(current))
        if (current!== destination[0].id)
            div.style.backgroundColor = "#0DCEF6"
        await sleep(25);
        path.push(current)
        current = came_from[current]
        max-=1
    }
    console.log('done')
  }, false);