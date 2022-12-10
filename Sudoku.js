class Sudoku{
 constructor (initString='000000000000000000000000000000000000000000000000000000000000000000000000000000000'){
 const startValues=initString.split('').filter(x=>"0123456789".includes(x))
 .map(x=>Number(x))
	this.body = []
	let idCounter = 1

  for(let y=0;y<9;y++){
    for(let x=0; x<9; x++){
       this.body.push({
         id: idCounter,
         x,
         y,
         number: startValues[idCounter-1],
         selected: false,
         supported: false,
         important:false,
          started:startValues[idCounter-1] === 0 ? false : true,
         s: parseInt(y/3)*3+parseInt(x/3)
        })
        idCounter++
	}
   }
  }
  getRow (n){
  const row=[]
  for(let i=0;i<9;i++){
  row.push(this.body[9*n+i])
  }
  return row
  }

  getColumn(n){
  const column=[]
  for(let i=0;i<9;i++){
  column.push(this.body[i*9+n])
  }
  return column
  }

  getSegment(n){
  const segment=[]
  const x=n%3
  const y=parseInt(n/3)

   for(let dy=0;dy<3;dy++){
    for(let dx=0;dx<3;dx++){
      segment.push(this.body[
     y*27+dy*9+x*3+dx
     ])
    }
  }
  return segment
  }

keydownHandler(event, cell){
if(!cell.started){
	 if("123456789".includes(event.key)){
    cell.number = parseInt(event.key)
	}

    else if(["Backspace"].includes(event.key)){
	 cell.number = 0
	}
	for(const item of this.body){
	item.important = false
	}

	if(cell.number){
	 for(const item of this.body){
	 if(item.number === cell.number){
      item.important = true
	 }
	
	 }
	}
}
	event.preventDefault()
    
	this.viewUpdate()
}

focusHandler(event, cell){
	cell.selected = true
	for(const item of this.getRow(cell.y)){
	item.supported = true
	}
	for(const item of this.getColumn(cell.x)){
	item.supported = true
	}

	if (cell.number) {
		for (const item of this.body){
			if (item.number === cell.number){
				item.important = true;
			}
		}
	}
	this.viewUpdate()
}

blurHandler(event, item){
	item.selected = false

	
	for (const item of this.body){
		item.supported = false
		item.important = false

	}
	this.viewUpdate()
}

getHTML(size){
for(const item of this.body){
	const inputElement= document.createElement('input')
	inputElement.classList.add("sudoku-cell")
	inputElement.setAttribute("type", "text")

	inputElement.addEventListener('keydown', event => this.keydownHandler(event, item))
    inputElement.addEventListener('focus', event => this.focusHandler(event, item))
    inputElement.addEventListener('blur', event => this.blurHandler(event, item))

if(item.started){
	inputElement.classList.add("start-cell")

}
	item.element= inputElement
 }

 const rootElement = document.createElement('div')
 rootElement.classList.add("sudoku-game")
 rootElement.style.width = `${size}px`
 rootElement.style.height = `${size}px`
 rootElement.style["font-size"] = `${size/20}px`

for(let s=0;s<9;s++){
	const segmentElement= document.createElement('div')
	segmentElement.classList.add('sudoku-segment')
for (const cell of this.getSegment(s)){
	segmentElement.append(cell.element)
}

	rootElement.append(segmentElement)
}

this.viewUpdate()

 return rootElement
 }

   viewUpdate(){
    for(const cell of this.body){
		cell.element.classList.remove("error","important-cell", "supported-cell","selected-cell")
		cell.element.value = cell.number ? cell.number : ''
	if (cell.supported){
		cell.element.classList.add("supported-cell")
 	}
    if (cell.selected){
		cell.element.classList.add("selected-cell")
		}

    if(cell.important){
    cell.element.classList.add("important-cell")
    }
    }  
   }
}
