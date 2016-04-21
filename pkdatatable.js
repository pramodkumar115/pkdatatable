var sortSequence ={colDataIndex: '', sortOrder:''};
var selectedPage = 1, dataTableStartPoint = 0, rowHeight = 0, selectedRecord, noOfRowsPossible = 0;
var DataTable = function(){
    
}
DataTable.prototype.dataGrid = function(jsonData){
    try{
        var renderTo = jsonData.renderTo;
        var sequenceColumnHeaders = [];
        var tableCreatableTag = document.getElementsByTagName('body')[0];
        
        var height = jsonData.height != undefined ? jsonData.height : 'auto';
        var tHeadHeight = '40px';
        var tBodyHeight = height == 'auto' ? 'auto': (height.replace('px', '') - tHeadHeight.replace('px', '') - 20);
    
        
        if(renderTo != undefined && renderTo!=null){
            tableCreatableTag = document.getElementById(renderTo); 
        }
        
        var table = document.createElement('table');
        if(jsonData.tableId != undefined && jsonData.tableId != null){
            table.id = jsonData.tableId;
        }else{
            var d = new Date();
            var datestring = d.getDate()  + '' + (d.getMonth()+1)  + '' + d.getFullYear()  + '' +
            d.getHours()  + '' + d.getMinutes() + '' + d.getSeconds();
            table.id = "pkDataTable_"+datestring;
            table.className = 'pkDataTable';
        }
        
        if(rowHeight == 0){
        rowHeight = 40;//
            //rowHeight = rows[0].clientHeight;
        }
        noOfRowsPossible = tBodyHeight / rowHeight;
        if (noOfRowsPossible === parseInt(noOfRowsPossible, 10)){
            // Do nothing
        }else{
            noOfRowsPossible = Math.floor(noOfRowsPossible);
        }
        
        
        var tBody = table.createTBody();
        var headerTds = [];
        var colWidths = [];
        if(jsonData.columns != undefined && Array.isArray(jsonData.columns)){
            
            var columns = jsonData.columns;
            var tHead = table.createTHead();
            var headerRow = tHead.insertRow(0);
            var colSequence = 0;
            
            // Create the header row
            for(var i = 0; i < columns.length; i++){
                var col = columns[i];
                
                var headerCol = headerRow.insertCell(i);
                var headerDiv = document.createElement("DIV");
                headerDiv.className = 'colDiv';
                var headerColText = document.createElement("SPAN");//document.createTextNode(col.header);
                headerColText.innerHTML = col.header;
                
                headerColText.setAttribute('class', 'headerText');
                headerDiv.appendChild(headerColText);
                headerCol.appendChild(headerDiv);
                headerCol.setAttribute('title', col.header);
                headerTds.push(headerCol);
                if(col.sequence == undefined || col.sequence == ''){
                    var arrowImage1 = document.createElement("SPAN");
                    arrowImage1.innerHTML = '&#9650;';
                    arrowImage1.setAttribute('class', 'imgArrowUp');
                    headerDiv.appendChild(arrowImage1);

                    var arrowImage2 = document.createElement("SPAN");
                    arrowImage2.innerHTML = '&#9660;';
                    arrowImage2.setAttribute('class', 'imgArrowDown');
                    headerDiv.appendChild(arrowImage2);
                }else{
                    sequenceColumnHeaders.push(col.header);
                }
                if (col.lblAlign != undefined) {
                    headerColText.style.textAlign = col.lblAlign;
                }
                else if (col.textAlign != undefined) {
                    headerColText.style.textAlign = col.textAlign;
                }
                if(col.width!=undefined){
                    headerCol.width = col.width;
                }
                else{
                    headerCol.width = 'auto';
                }
            }
            //Create the table body
            if(jsonData.data != undefined && Array.isArray(jsonData.data)){
                var cntr = 0;
                var loopCnt = jsonData.data.length;
                if (jsonData.paging != undefined && jsonData.paging){
                    loopCnt = noOfRowsPossible != 0 ? parseInt(dataTableStartPoint, 10) + parseInt(noOfRowsPossible, 10) : jsonData.data.length;
                }
                
                for(var i = dataTableStartPoint; i < loopCnt; i++){
                    var row = tBody.insertRow(cntr);
                    row.setAttribute('edited', false);
                    row.onfocus = function(){
                        
                    }
                    row.onclick = function(){
                        var tableData = document.getElementById(table.id);
                        var tbodyData = tableData.getElementsByTagName('tbody')[0];
                        for(var j = 0; j < tbodyData.getElementsByTagName('tr').length; j++){
                            var rowElement = tbodyData.getElementsByTagName('tr')[j];
                            
                            if(rowElement == this){
                                continue;
                            }
                            
                            if(rowElement.getAttribute('edited') != undefined && rowElement.getAttribute('edited') == 'true'){
                                for(var k = 0; k < rowElement.childNodes.length; k++){
                                    var colDiv = rowElement.childNodes[k].getElementsByClassName('colDiv')[0];
                                    if(colDiv.childNodes[0].value != undefined){
                                        var textNode = document.createTextNode(colDiv.childNodes[0].value);
                                        colDiv.removeChild(colDiv.childNodes[0]);
                                        colDiv.appendChild(textNode);
                                    }
                                    //var textNode = colDiv.createTextNode(colDiv.childNodes[0].value);
                                }
                            }
                            if(rowElement.classList.contains('active')){
                                rowElement.classList.remove('active');
                            }
                        }
                        this.className = 'active';
                        selectedRecord = this;
                    }
                    row.ondblclick = function(){
                        this.onclick();
                        this.setAttribute('edited',true);
                        handleEdit(selectedRecord, jsonData, table);
                    }
                    cntr++;
                    var rowData = jsonData.data[i];
                    for(var j=0; j<columns.length; j++){
                        var cell = row.insertCell(j);
                        var col = columns[j];
                        var colText = null;
                        var colDiv = document.createElement("DIV");
                        colDiv.className = 'colDiv';
                        if (col.sequence != undefined){
                            var sequenceId = col.sequence;
                            if(jsonData.sequenceModel != undefined && Array.isArray(jsonData.sequenceModel)){
                                for(var k = 0; k < jsonData.sequenceModel.length; k++){
                                    var seqModel = jsonData.sequenceModel[k];
                                    if(seqModel.id == col.sequence){
                                        if(i == 0){
                                            colSequence = seqModel.startNum;
                                        }
                                        else{
                                            colSequence = colSequence + seqModel.increment;
                                        }
                                    }
                                }
                                
                            }
                            
                            colText = document.createTextNode(colSequence); 
                            cell.setAttribute('title', colSequence);
                        }else{
                            colText = document.createTextNode(rowData[col.dataIndex]);
                            cell.setAttribute('title', rowData[col.dataIndex]);
                        }
                        colDiv.appendChild(colText);
                        cell.appendChild(colDiv);
                        
                        if (col.textAlign != undefined) {
                            cell.style.textAlign = col.textAlign;
                        }
                        if(col.width!=undefined){
                            cell.width = col.width;
                        }
                        else{
                            if(jsonData.width!=undefined){
                                cell.width = jsonData.width/jsonData.columns.length;
                            }
                            else{
                                cell.width = 'auto';
                            }
                        }
                    }
                }
            }
        }
        this.styleTheTable(jsonData, table.id);
        if (document.getElementsByClassName('pkDataTable') != undefined){
            for (var i = 0; i < document.getElementsByClassName('pkDataTable').length; i++){
                tableCreatableTag.removeChild(document.getElementsByClassName('pkDataTable')[i]);   
            }
        }
        if(document.getElementById('btnGroupDiv') != undefined){
            tableCreatableTag.removeChild(document.getElementById('btnGroupDiv'));
        }
        if(jsonData.editable != undefined && jsonData.editable){
            var btnGroup = document.createElement('DIV');
            btnGroup.id = 'btnGroupDiv';
            btnGroup.className = 'editableBtns';
            var removeBtn = document.createElement('BUTTON');
            removeBtn.innerText = "Remove";
            //removeBtn.innerHTML = 'x';
            btnGroup.appendChild(removeBtn);
            
            var addBtn = document.createElement('BUTTON');
            addBtn.innerText = "Add";
            //addBtn.innerHTML = '+';
            btnGroup.appendChild(addBtn);
            tableCreatableTag.appendChild(btnGroup);
            removeBtn.onclick = function(){
                handleRemove(table, jsonData);
            }
            addBtn.onclick = function(){
                handleAdd(table, jsonData);
            }
        }
        
        tableCreatableTag.appendChild(table);
        
        
    }
    catch(e){
        
    }
    for (var i=0;i<headerTds.length;i++){
        var isSeq = false;
        for(var j = 0; j < sequenceColumnHeaders.length; j++){
            if(headerTds[i].innerHTML.indexOf(sequenceColumnHeaders[j])!= -1){
                isSeq = true;
                break;
            }
        }
        if(!isSeq){
            headerTds[i].onclick = function(){
                sortHandler(jsonData, this, sortSequence);
            };
        }
    }
    if(jsonData.paging != undefined && jsonData.paging == true){
        this.createPagination(jsonData, table);
    }
    return table.id;
}
DataTable.prototype.styleTheTable = function(jsonData, tableId){
    var style = document.createElement('style');
    style.id = 'pkDataTableStyle';
    style.type = 'text/css';
    var width = jsonData.width != undefined ? jsonData.width : 'auto';
    var height = jsonData.height != undefined ? jsonData.height : 'auto';
    var tHeadHeight = '40px';
    var tBodyHeight = height == 'auto' ? 'auto': (height.replace('px', '') - tHeadHeight.replace('px', '') - 20)+'px';
    if (jsonData.zebraRows != undefined && jsonData.zebraRows == true){
        style.innerHTML = '#'+tableId +' tbody tr:nth-child(even){'+
            'background: #ECE9E9;'+
        '}';
    }else{
        style.innerHTML = '#'+tableId +' tbody tr{'+
            'border-bottom: 1px solid lightgray;' +
        '}';
    }
    style.innerHTML = style.innerHTML +
        '.pkDataTable { '+ 
            'color: black; '+
            'background-color:white;' +
            'border-collapse: collapse;'+
            'margin: 5px;' +
            'border: 1px solid lightgray;'+
            'width:'+width+';'+
            'display: block;'+
            'overflow-x: auto;'+
        '}'+
        '.pkDataTable thead{'+
            'background-color: #BDBDBD;'+
           // 'background: linear-gradient(to top, #757272, #D9D9DC);'+
            'color: black;'+
            'display: block;'+
            'padding-right: 17px;'+
            'border-bottom: 1px solid lightgray;'+
            //'height: '+tHeadHeight+';'+
        '}'+
        '.pkDataTable tbody{'+
            'max-height:'+ tBodyHeight+';'+
            'display: block;'+
            'overflow-y:scroll;'+
        '}'+
        
        'thead td div{'+
            //'border-left: 1px solid lightgray;' +
            'text-overflow: ellipsis;'+
            'overflow: hidden;'+
            'white-space: nowrap;'+
        '}'+
        '.pkDataTable tbody tr:hover, table tbody tr.active{'+
            'background-color: rgba(21, 146, 20, 0.35)!important;'+
            'border: 1px dotted gray;'+
        '}'+
        '.pkDataTable tbody tr:hover td, table tbody tr:visited td{'+
            'font-style: italic'+
        '}'+
        '.pkDataTable thead tr, .pkDataTable tbody tr {'+
            'display: block'+
        '}'+
        '.pkDataTable thead td, .pkDataTable tbody td{'+
            'padding: 0;'+
            'display: inline-block;'+
            'border-left: none;'+
        
        '}'+
        '.pkDataTable thead td .colDiv:hover, table thead td.active .colDiv{'+
            'background:gray;'+
        '}'+
        '.pkDataTable thead td .colDiv:hover .imgArrowUp, table thead td.active .colDiv .imgArrowUp{'+
            'display:block;'+
        '}'+
        '.pkDataTable thead td .colDiv:hover .imgArrowDown, table thead td.active .colDiv .imgArrowDown{'+
            'display:block;'+
        '}'+
        '.imgArrowUp{'+
            'float: right;'+
            'width: 4%;'+
            'position: relative;'+
            'top: -5px;'+
            'display: none;'+
        '}'+
        '.imgArrowDown{'+
            'float: right;'+
            'width: 1%;'+
            'top: 5px;'+
            'left: 1%;'+
            'position: relative;'+
            'text-align: right;'+
            'display: none;'+
        '}'+
         '.colDiv{'+
            'border-left: 1px solid lightgray;'+
            'display: block;'+
            'padding: 10px;'+
         '}'+/*
        '#'+tableId +' td:last-child .colDiv{'+
            'border-right: 1px solid lightgray;'+
         '}'+*/
        '.pkDataTable td:first-child .colDiv{'+
            'border-left: none'+
         '}'+
        '.headerText{'+
            'width: 94%;'+
            'display: inline-block;'+
            'text-overflow: ellipsis;'+
            'overflow: hidden;'+
            'white-space: nowrap;'+
        '}'+
        '.paginator{'+
            'width: '+width+';'+
            'display: block;'+
        '}'+
        '.paginator ul{'+
            'padding: 0;'+
            'float: right;'+
            'margin: 0;'+
        '}'+
        '.paginator li{'+
            //'margin:0.5%;'+
            'background-color: rgba(121, 85, 72, 0.33);'+
            //'border-radius: 5px;'+
            'float: left;'+
            'list-style: none;'+
            'padding: 5px 10px;'+
            'border: 1px solid gray;'+
            'border-collapse: collapse;'+
            'margin:1px;' +
        '}'+
        '.paginator li{'+
            'border-top-left-radius: 3px;'+
            'border-bottom-left-radius: 3px;'+
        '}'+
        '.paginator li{'+
            'border-top-right-radius: 3px;'+
            'border-bottom-right-radius: 3px;'+
        '}'+
        '.paginator li:hover, .paginator li.active{'+
            'font-weight: bold;'+
            'background: lightgray;'+
            'cursor: pointer;'+
        '}'+
        '.editableBtns{'+
            'width:' + width +';'+ 
        '}'+
        '.editableBtns button {'+
            'float: right;'+
            'margin: 5px 1px;'+
            'border-radius: 5px;'+
            'box-shadow: 0 0;'+
            'padding: 5px;'+
            'background-color: #BDBDBD;'+
            'border-color: #EEEEEE;'+
            'cursor: pointer'+
        '}'+
        '.editableBtns button:hover{'+
            'background-color: gray;'+
        '}'
    ;
    if(document.getElementsByTagName('head')[0] != undefined){
        var styles = document.getElementsByTagName('head')[0].getElementsByTagName('style');
        if(document.getElementById(style.id) != undefined){
            document.getElementById(style.id).parentElement.removeChild(document.getElementById(style.id));
        }
            
        
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    
}

sortHandler = function(jsonData, headerClicked, sortSequence){
    var sortCol = headerClicked.innerText;
    var sortVal = "";
    var data = jsonData.data;
    var cols = jsonData.columns;
    var sortColIndex = -1;
    for(var i = 0; i < cols.length; i++){
        var col = cols[i];
        if (sortCol.indexOf(col.header) != -1){
            sortVal = col.dataIndex;
            sortColIndex = i;
            break;
        }
    }
    if(sortSequence.colDataIndex == sortVal){
        sortSequence.sortOrder == 'ASC' ? sortSequence.sortOrder = 'DESC' : sortSequence.sortOrder = 'ASC';
    }else{
        sortSequence.sortOrder = 'ASC'
    }
    sortSequence.colDataIndex = sortVal;
    data.sort(function(a, b){
         if (typeof a[sortVal] == "string"){
            if(sortSequence.sortOrder == 'ASC'){
                return (a[sortVal] > b[sortVal]) ? 1 : ((a[sortVal] < b[sortVal]) ? -1 : 0);
            }else{
                return (b[sortVal] > a[sortVal]) ? 1 : ((b[sortVal] < a[sortVal]) ? -1 : 0);
            }
         }else{
             if(sortSequence.sortOrder == 'ASC'){
                return a[sortVal] - b[sortVal];
            }else{
                return b[sortVal] - a[sortVal];
            }
         }
    });
    var sortedTableId = new DataTable().dataGrid(jsonData);
    var table= document.getElementById(sortedTableId);
    var clickedColumn = table.tHead.rows[0].cells[sortColIndex];
    var clickedCol = clickedColumn.childNodes[0];
    if(sortSequence.sortOrder == 'ASC'){
        for(var i = 0; i < clickedCol.childNodes.length; i++){
            if(clickedCol.childNodes[i].className == 'imgArrowDown'){
                clickedCol.childNodes[i].style.visibility = 'hidden';
            }
            if(clickedCol.childNodes[i].className == 'imgArrowUp'){
                clickedCol.childNodes[i].style.visibility = 'visible';
            }
        }
    }else{
        for(var i = 0; i < clickedCol.childNodes.length; i++){
            if(clickedCol.childNodes[i].className == 'imgArrowUp'){
                clickedCol.childNodes[i].style.visibility = 'hidden';
            }
            if(clickedCol.childNodes[i].className == 'imgArrowDown'){
                clickedCol.childNodes[i].style.visibility = 'visible';
            }
        }
    }
    clickedColumn.className = "active";
}

DataTable.prototype.createPagination = function(jsonData, table){
    var height = jsonData.height != undefined ? jsonData.height : 'auto';
    var tHeadHeight = '40px';
    var tBodyHeight = height == 'auto' ? 'auto': (height.replace('px', '') - tHeadHeight.replace('px', '') - 20);
    
    var tHead = table.tHead;
    tHead.style.paddingRight = '0';
    
    var tBody = table.tBodies[0];
    tBody.style.overflowY = 'hidden';
   
    var rows = tBody.getElementsByTagName("tr");
    var totalRows = jsonData.data.length;
    
    
    var pagesNeeded = totalRows / noOfRowsPossible;
    
    if (pagesNeeded === parseInt(pagesNeeded, 10)){
        // Do nothing
    }else{
        pagesNeeded = Math.floor(pagesNeeded) + 1;
    }
    var buttonsDiv = document.createElement('DIV');
    var parentTag = document.getElementsByTagName('body')[0];
        if(jsonData.renderTo != undefined && jsonData.renderTo!=null){
            parentTag = document.getElementById(jsonData.renderTo); 
        }
    var paginatorTags = parentTag.getElementsByClassName('paginator');
    for(var i = 0; i < paginatorTags.length; i++){
        parentTag.removeChild(paginatorTags[0]);
    }
    parentTag.appendChild(buttonsDiv);
    buttonsDiv.className = 'paginator';
    var ul = document.createElement('UL');
    buttonsDiv.appendChild(ul);
    
    if(pagesNeeded > 2){
        var btnFirst = document.createElement('LI');
        ul.appendChild(btnFirst);
        btnFirst.appendChild(document.createTextNode("<<"));
        btnFirst.title = 'First';
        var btnPrevious = document.createElement('LI');
        ul.appendChild(btnPrevious);
        btnPrevious.appendChild(document.createTextNode("<"));
        btnPrevious.title = 'Previous';
    }
    
    for(var i = 0; i < pagesNeeded; i++){
        var btn = document.createElement('LI');
        ul.appendChild(btn);
        btn.appendChild(document.createTextNode(i + 1));
        btn.title = i + 1;
        if(selectedPage == i+1){
            btn.className = 'active';
        }
        if (i >= 4){
            btn.style.display = 'none';
        }
    }
    if(pagesNeeded > 2){
        var btnNext = document.createElement('LI');
        ul.appendChild(btnNext);
        btnNext.appendChild(document.createTextNode(">"));
        btnNext.title = 'Next';
        var btnLast = document.createElement('LI');
        ul.appendChild(btnLast);
        btnLast.appendChild(document.createTextNode(">>"));
        btnLast.title = 'Last';
    }
    for(var i = 0; i < ul.childElementCount; i++){
        var child = ul.childNodes[i];
        child.onclick = function(){
            handlePagination(this, table, jsonData, noOfRowsPossible, pagesNeeded);
        }
    }
}

handlePagination = function(child, table, jsonData, noOfRowsPossible, pagesNeeded){
    if(child.innerText == '<'){
        if(selectedPage > 1){
            selectedPage = selectedPage - 1;
        }
        else{
            selectedPage = 1;
        }
        
    }
    else if(child.innerText == '<<'){
        selectedPage = 1;
    }
    else if(child.innerText == '>'){
        if(selectedPage != pagesNeeded){
            selectedPage = parseInt(selectedPage, 10) + 1;   
        }
        else{
            selectedPage = pagesNeeded;
        }
    }
    else if(child.innerText == '>>'){
        selectedPage = pagesNeeded;
    }
    else{
        selectedPage = child.innerText;
    }
    
    dataTableStartPoint = (selectedPage - 1) * noOfRowsPossible;
    var sortedTableId = new DataTable().dataGrid(jsonData);
    var paginatorDiv = document.getElementsByClassName("paginator")[0];
    var paginatorUl = paginatorDiv.getElementsByTagName('UL')[0];
    var paginatorList = paginatorUl.childNodes;
    for(var i = 0; i < paginatorList.length; i++){
        if(selectedPage > 4){
            if((i > parseInt(selectedPage, 10) + 1) || i < parseInt(selectedPage, 10) - 2){
                if(paginatorList[i].innerText == '<' || paginatorList[i].innerText == '<<' || paginatorList[i].innerText == '>' || paginatorList[i].innerText == '>>'){
                    continue;
                }
                paginatorList[i].style.display = 'none';
            }else{
                paginatorList[i].style.display = 'block';
            }
        }
    }
}

var handleRemove = function(table, jsonData){
    if(selectedRecord == undefined){
        alert("Please select a record to remove");
    }else{
        var tBody = table.getElementsByTagName('tbody')[0];
        var rows = tBody.childNodes;
        for(var i = 0; i < rows.length; i++){
            if(rows[i] == selectedRecord){
                var splicingRecordIndex = i;
                if(jsonData.paging != undefined && jsonData.paging == true){
                    splicingRecordIndex = i + dataTableStartPoint;
                }
                jsonData.data.splice(splicingRecordIndex, 1);
                break;
            }
            
        }
        var newDataTable = new DataTable().dataGrid(jsonData);
    }
    
}
var handleAdd = function(table, jsonData){
    var record = {};
    var firstRecord = jsonData.data[0];
    for(var key in firstRecord){
        record[key] = "";
    }
    jsonData.data.splice(0,0,record);
    var newDataTableId = new DataTable().dataGrid(jsonData);
    var newTable = document.getElementById(newDataTableId);
    var tBody = newTable.getElementsByTagName("tbody")[0];
    var row = tBody.childNodes[0];
    row.ondblclick();
}

var handleSave = function(table,jsonData){
    edited = false;
    var tBody = table.getElementsByTagName('tbody')[0];
    var rows = tBody.childNodes;
    var jsonCols = jsonData.columns;
    for(var i = 0; i < rows.length; i++){
        var cols = rows[i].getElementsByTagName('td');
        for(var j = 0; j < cols.length; j++){
            var colDiv = cols[j].getElementsByClassName("colDiv");
                if(colDiv != undefined){
                    //console.log(colDiv[0].childNodes[0].value);
                }
        }
    }
    var sortedTableId = new DataTable().dataGrid(jsonData);
}
var handleEdit = function(selectedRecord, jsonData, table){
    var tBody = table.getElementsByTagName('tbody')[0];
    var rows = tBody.childNodes;
    var splicingRecordIndex = -1, tableRowIndex = -1;
        for(var i = 0; i < rows.length; i++){
            if(rows[i] == selectedRecord){
                splicingRecordIndex = i;
                tableRowIndex = i;
                if(jsonData.paging != undefined && jsonData.paging == true){
                    splicingRecordIndex = i + dataTableStartPoint;
                }
                break;
            }
        }
    var data = jsonData.data[splicingRecordIndex];
    var cols = jsonData.columns;
    var dataColumns = selectedRecord.getElementsByTagName('td');
    if(cols != undefined){
        for(var i = 0; i < cols.length; i++){
            var col = cols[i];
            if(col.editor != undefined){
                if(col.editor.type != undefined){
                    var type = col.editor.type;
                    var tdVal = dataColumns[i];
                    var colDiv = tdVal.getElementsByClassName('colDiv');
                    
                    if(colDiv != undefined){
                        if(colDiv[0].hasChildNodes){
                            var colEditValue;
                            if(type == 'textfield'){
                                colEditValue = document.createElement('input');
                                colEditValue.setAttribute('type', 'text');
                                colEditValue.value = data[col.dataIndex];
                                colEditValue.setAttribute('dataIndex', col.dataIndex);
                                colEditValue.onblur = function(){
                                    data[this.getAttribute('dataIndex')] = this.value;
                                }
                            }
                            if(type == 'combo'){
                                colEditValue = document.createElement('select');
                                for(var j = 0; j < col.editor.data.length; j++){
                                    var option = document.createElement('option');
                                    option.value = col.editor.data[j].value;
                                    option.text = col.editor.data[j].displayText;
                                    colEditValue.appendChild(option);
                                }
                                colEditValue.value = data[col.dataIndex];
                                colEditValue.setAttribute('dataIndex', col.dataIndex);
                                colEditValue.onchange = function(){
                                    data[this.getAttribute('dataIndex')] = this.value;
                                }
                            }
                            colEditValue.style.width = "100%";
                            colDiv[0].removeChild(colDiv[0].childNodes[0]);
                            colDiv[0].appendChild(colEditValue);
                            colEditValue.onkeyup = function(e){
                                if (e.keyCode == 13) {
                                    data[this.getAttribute('dataIndex')] = this.value;
                                    new DataTable().dataGrid(jsonData);   
                                }
                            }
                        }
                        
                    }
                }
            }
        }
    }
}