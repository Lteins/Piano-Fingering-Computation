var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer=require('xmldom').XMLSerializer;
var id=0;
var file_id=0;
//读取文件

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.get('/', function (req, res) {
    id=id+1;
    //console.log(id);    
    res.sendFile( __dirname + "/" + "index.html" );

})

app.get('/file_download',function(req,res){
    res.download( __dirname + "/" + "sheet2.xml",'sheet2' );
})

app.post('/file_upload', function (req, res) {
    file_id=file_id+1;
    var current_file_id=file_id;

   //console.log(req.files[0]);  // 上传的文件信息

   var des_file = __dirname + "/" + parseFloat(id)+".xml";
   fs.readFile( req.files[0].path,'utf-8',function (err, data) {
        if (err) throw err;

        var StandardNoteList=SheetParser(data);

        var Simple=Stardard2Simple(StandardNoteList[0]);
        Simple=Fingering_Allocate(Simple);
        //console.log('-----------------');
        Simple=Chord_Finger_Fix(Simple);
        var out=output(Simple,data);

        var filename="o_"+parseFloat(current_file_id)+".xml"

        fs.writeFile(__dirname+"/"+filename, out, function (err) {
            if (err) throw err;
            console.log('It\'s saved!'); //文件被保存
            res.sendFile( __dirname + "/" + filename,req.files[0].originalname+"(RF)",function(){
                fs.unlink(__dirname+"/"+filename);
            });
        });
    });
});

var server = app.listen(18080, function () {

  var host = server.address().address
  var port = server.address().port

})


//----------------------------------------------------------------


function interpretation(file_id){
var filename=file_id+".xml";
fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    var StandardNoteList=SheetParser(data);

    var Simple=Stardard2Simple(StandardNoteList[0]);
    Simple=Fingering_Allocate(Simple);
    //console.log('-----------------');
    //console.log(Simple[Simple.length-1].pitch);
    //console.log(Simple[Simple.length-4].fingering);

    Simple=Chord_Finger_Fix(Simple);
    var out=output(Simple,data);

    var filename="o_"+parseFloat(file_id)+".xml"

    fs.writeFile(filename, out, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!'); //文件被保存
    });
});
}

function StepToNum(step){
    var result;
    if (step=="A")
        result=6;
    if (step=="B")
        result=7;
    if (step=="C")
        result=1;
    if (step=="D")
        result=2;
    if (step=="E")
        result=3;
    if (step=="F")
        result=4;
    if (step=="G")
        result=5;

    return result;
}


function SheetParser(data){
    var StandardNoteList1=[];
    var StandardNoteList2=[];
    var  doc= new DOMParser().parseFromString(data);
    var root=doc.documentElement;
    var part=root.getElementsByTagName('part');
    part=part[0];
    var MeasureList=part.getElementsByTagName('measure');
    var id=0;
    for(var i=0;i<MeasureList.length;i++){

        var CurrentMeasure=MeasureList[i];


        //  NoteList=getChildByName(CurrentMeasure,'note','forward','backup');
        var NodeList=[];
        var list=CurrentMeasure.childNodes;
        for (var m=0;m<list.length;m++){
            var temp=list[m];
            if (temp.tagName=="note"||temp.tagName=="backup"||temp.tagName=="forward"){
                NodeList.push(temp);
            }
        }
        //------------------------------

        var Count=0;
        for (var m=0;m<NodeList.length;m++){

            var CurrentNote=NodeList[m];
            if (CurrentNote.tagName=='note'){

                var x=CurrentNote.getElementsByTagName("rest");
                x=x[0];
                if(x==undefined){
            //                     if (i==0&&m==1){
            //     console.log('first note');
            // }
                    var pitch=CurrentNote.getElementsByTagName('pitch')[0];
                    var octave=pitch.getElementsByTagName('octave')[0].textContent;
                    var temp=pitch.getElementsByTagName('alter')[0];
                    if (temp==undefined)
                        var alter=0;
                    else
                        alter=parseFloat(temp.textContent);
                    temp=pitch.getElementsByTagName('step')[0];
                    var f=StepToNum(temp.textContent);
                    var DigiPitch=octave*7+alter*0.5+f;

                    temp=CurrentNote.getElementsByTagName('duration')[0];
                    var duration;
                    if (temp==undefined)
                        duration=0.1;
                    else
                       duration=parseFloat(temp.textContent);

                    if (CurrentNote.getElementsByTagName('chord')[0]==undefined){
                        var starter=Count;
                        Count=Count+duration;                   
                    }else{
                        var staff=CurrentNote.getElementsByTagName('staff')[0].textContent;
                        staff=parseFloat(staff);
                        if (staff==1){
                            if (StandardNoteList1.length-1>=0)
                            var starter=StandardNoteList1[StandardNoteList1.length-1].starter;

                        }
                        else{
                            if (StandardNoteList2.length-1>=0)
                            var starter=StandardNoteList2[StandardNoteList2.length-1].starter;
                        }
                    }
                    var sheet_id=m;
                    var measure_id=i;
                    var staff=CurrentNote.getElementsByTagName('staff')[0];

                    if (parseFloat(staff.textContent)==1){
                        StandardNoteList1.push({'measure_id':measure_id,'pitch':DigiPitch,'duration':duration,'starter':starter,'fingering':-10,'sheet_id':sheet_id,'starter':starter});
                    }else{
                        StandardNoteList2.push({'measure_id':measure_id,'pitch':DigiPitch,'duration':duration,'starter':starter,'fingering':-10,'sheet_id':sheet_id,'starter':starter});
                    }

                }else{

                    if (CurrentNote.tagName=='backup'){
                        var temp=CurrentNote.getElementsByTagName('duration');
                        var duration=parseFloat(temp.textContent);
                        Count=Count-duration;
                    }
                    if (CurrentNote.tagName=="forward"){
                        var temp=CurrentNote.getElementsByTagName('duration');
                        var duration=parseFloat(temp.textContent);
                        Count=Count+duration;
                    }
                }
            }
    
    
        }
    }
    var StandardNoteList=[StandardNoteList1,StandardNoteList2];
    return StandardNoteList;
}
 


 function Measure_Scan(Standard){
    var i=0;
    var measure=0;
    var starting=i;
    var ending=i;

    var measure_range_1=new Array();
    var measure_range_2=new Array();

    for (i=0;i<Standard.length;i++){
        if (Standard[i].measure_id==measure){
            ending=i;
        }else{
            measure_range_1[measure]=starting;
            measure_range_2[measure]=ending;
            measure=Standard[i].measure_id;
            starting=i;
            ending=i;
        }
    }

    measure_range_1[measure]=starting;
    measure_range_2[measure]=ending;

    measure_range=[measure_range_1,measure_range_2];
    return measure_range;
}



function Stardard2Simple(Standard){
    var id=0;
    var Simple=[];
    var measure=Measure_Scan(Standard);
    for (var m=0;m<measure[0].length;m++){
        var Notes=[];
        for (var j=measure[0][m];j<=measure[1][m];j++){
            Notes.push(Standard[j]);
        }
        Notes=Rank(Notes);
        for (var i=0;i<Notes.length;i++){
            var ischord=0;
            if (i>0){
                if (Notes[i-1].starter==Notes[i].starter)
                    ischord=1;
            }

            if (i<Notes.legnth-1){
                if (Notes[i+1].starter==Notes[i].starter)
                    ischord=1;
            }

            if (ischord==0){
                id=id+1;
                Simple.push({'type':'SNote','pitch':Notes[i].pitch,'id':id,'sheet_id':Notes[i].sheet_id,'measure_id':Notes[i].measure_id});
            }

            if (ischord==1){
                if (i>0&&(Notes[i-1].starter==Notes[i].starter)){
                    Simple.push({'type':'MNote','pitch':Notes[i].pitch,'id':id,'sheet_id':Notes[i].sheet_id,'measure_id':Notes[i].measure_id});
                    Simple[Simple.length-2].type='MNote';
                }else{
                    id=id+1;
                    Simple.push({'type':'MNote','pitch':Notes[i].pitch,'id':id,'sheet_id':Notes[i].sheet_id,'measure_id':Notes[i].measure_id});
                }
            }
        }
    }
    return Simple;
}

function Rank(Note){
    for(var x=0;x<Note.length;x++){
        for (var y=x+1;y<Note.length;y++){
            if (Note[x].starter>Note[y].starter){
                var temp=Note[x];
                Note[x]=Note[y];
                Note[y]=temp;
            }
        }
    }

    for(var x=0;x<Note.length;x++){
        for (var y=x+1;y<Note.length;y++){
            if (Note[x].starter>Note[y].starter&&Note[x].pitch>Note[y].pitch){
                var temp=Note[x];
                Note[x]=Note[y];
                Note[y]=temp;
            }
        }
    }

    return Note;
}



function idealfinger(note,start){
    var pitch=[];
    var fingering=[];
    var Mgap=8;

    for (var x=start;x<note.length;x++){
        pitch.push(note[x].pitch);
    }

    if (pitch.length==1){
        fingering=[1,2,3,4,5]; 
        return fingering;
    }

    var i;
    var up;
    var down;
    if (pitch.length>1){
        i=0;
        up=pitch[i];
        down=up;
        while ((up-down)<=Mgap){
            
            i=i+1;
            if (i>pitch.length-1)
                break;

            if (pitch[i]>up)
                up=pitch[i];

            if (pitch[i]<down)
                down=pitch[i];
        }

        i=i-1;

        var min=1000000;
        var diff=0;
        for (x=1;x<=5;x++){
            diff=0;
            for (y=1;y<=i;y++){

                if (pitch[y]<(pitch[0]-(x-1)))
                    diff=diff+pitch[0]-(x-1)-pitch[y];

                if (pitch[y]>pitch[0]+(5-x))
                    diff=diff+pitch[y]-(pitch[0]+(5-x));
            }

            if (diff==min)
                fingering.push(x);

            if (diff<min){
                min=diff;
                fingering=[];
                fingering.push(x);
            }
        }

    }

    return fingering;

}


function Compare(pitch,finger1,finger2){
    var finger;
    var iszero=1;
    for (var i=0;i<finger1.length;i++){
        if (finger1[i]!=0)
            iszero=0;
    }

    if (iszero==1){
        finger=finger2;
        return finger;
    }

    iszero=1;
    for (var i=0;i<finger2.length;i++){
        if (finger2[i]!=0)
            iszero=0;
    }

    if (iszero==1){
        finger=finger1;
        return finger;
    }

    var Turn_num1=0;
    var Turn_num2=0;

    for (i=1;i<pitch.length;i++){
        if ((pitch[i]-pitch[i-1])*(finger1[i]-finger1[i-1])<0)
            Turn_num1=Turn_num1+1;

        if ((pitch[i]-pitch[i-1])*(finger2[i]-finger2[i-1])<0)
            Turn_num2=Turn_num2+1;
    }

    if (Turn_num1<Turn_num2){
        finger=finger1;
        return finger;
    }

    if (Turn_num2<Turn_num1){
        finger=finger2;
        return finger;
    }

    var Ex1=0;
    var Ex2=0;
    var Dis_Ex1=[];
    var Dis_Ex2=[];
    var Cut1=0;
    var Cut2=0;
    var Dis_Cut1=[];
    var Dis_Cut2=[];
    for (i=0;i<=5;i++){
        Dis_Ex1.push(0);
        Dis_Ex2.push(0);
        Dis_Cut1.push(0);
        Dis_Cut2.push(0);
    }
    var temp1;
    var temp2;

    for (i=1;i<pitch.length;i++){
        temp1=(pitch[i]-pitch[i-1])-(finger1[i]-finger1[i-1]);
        temp2=(pitch[i]-pitch[i-1])-(finger2[i]-finger2[i-1]);

        if (temp1>0){
            Ex1=Ex1+temp1;
            Dis_Ex1[Math.min(finger1[i],finger1[i-1])]=Dis_Ex1[Math.min(finger1[i],finger1[i-1])]+temp1;
        }

        if (temp1<0){
            Cut1=Cut1-temp1;
            Dis_Cut1[Math.min(finger1[i],finger1[i-1])]=Dis_Cut1[Math.min(finger1[i],finger1[i-1])]-temp1;
        }

        if (temp2>0){
            Ex2=Ex2+temp2;
            Dis_Ex2[Math.min(finger2[i],finger2[i-1])]=Dis_Ex2[Math.min(finger2[i],finger2[i-1])]+temp2;
        }


        if (temp2<0){
            Cut2=Cut2-temp2;
            Dis_Cut2[Math.min(finger2[i],finger2[i-1])]=Dis_Cut2[Math.min(finger2[i],finger2[i-1])]-temp2;
        }
            
    }
    if (Cut1<Cut2){
        finger=finger1;
        return finger;
    }

    if (Cut1>Cut2){
        finger=finger2;
        return finger;
    }

    if (Ex1<Ex2){
        finger=finger1;
        return finger;
    }

    if (Ex1>Ex2){
        finger=finger2;
        return finger;
    }

    var x1;
    var x2;
    if (Ex1!=0&&Ex2!=0){
        x1=(Dis_Ex1[1]+Dis_Ex1[2]*2+Dis_Ex1[3]*3+Dis_Ex1[4]*4)/Ex1;
        x2=(Dis_Ex2[1]+Dis_Ex2[2]*2+Dis_Ex2[3]*3+Dis_Ex2[4]*4)/Ex2;
    }

    if (x1<x2){
        finger=finger1;
        return finger;
    }

    if (x1>x2){
        finger=finger2;
        return finger;
    }
    var y1;
    var y2;
    if (Cut1!=0&&Cut2!=0){
        y1=(Dis_Cut1[1]+Dis_Cut1[2]*2+Dis_Cut1[3]*3+Dis_Cut1[4]*4)/Cut1;
        y2=(Dis_Cut2[1]+Dis_Cut2[2]*2+Dis_Cut2[3]*3+Dis_Cut2[4]*4)/Cut2;
    }

    if (y1<y2){
        finger=finger1;
        return finger;
    }

    if (y1>y2){
        finger=finger2;
        return finger;
    }

    // console.log('the two group are supposed to be the same');
    finger=finger1;
    return finger;
}

function  DExamine(note,i){
    var bound1;
    var bodun2;
    var x;
    if (i>0){
        if (note[i].type=='SNote'){
            bound1=i-1;
            bound2=i;
        }else{

            x=i-1;
            while(x>=0&&(note[x].type=='MNote')&&note[x].id==note[i].id){
                x=x-1;
            }
            x=x+1;
            bound1=x;
            bound2=i;
        }
        result=0;
        for (x=bound1;x<=bound2-1;x++){
            result=result+Diff(note,x,i);
        }

    }else{result=0;}

    return result;
}

function Diff(note,x,y){
    if (note[x].id==note[y].id&&note[x].fingering==note[y].fingering)
        return 1;
    var D1=[[],[ 0,0,0.5000,0.5000,1.5000,3.0000],[ 0,0 , 0, 0.5000,1.5000,2.0000],[ 0,0,1.0000,0,0.5000,1.5000],[0,0,1.0000,1.0000,0,0.5000],[0,1,1,1,1,0]];
    var D2=[[],[0,0,5,6,8,9],[0,3.5000,0,3.0000,3.0000,6.0000],[0,3,-1,0,2,3],[0, 2,-1,-1,0,2],[0,-1,-1,-1,-1,0]];
    var pitch1=note[x].pitch;
    var pitch2=note[y].pitch;
    var finger1=note[x].fingering;
    var finger2=note[y].fingering;
    var temp;

    if (pitch1>pitch2){
        temp=pitch1;
        pitch1=pitch2;
        pitch2=temp;

        temp=finger1;
        finger1=finger2;
        finger2=temp;

    }
    var lim1=D1[finger1][finger2];
    var lim2=D2[finger1][finger2];

    var gap=pitch2-pitch1;
    var result;
    if (gap<=lim2&&gap>=lim1){
        result=0;
    }else{
        result=1;
    }

    if ((pitch1%1==0)&&(pitch2==pitch1+0.5)&&finger2==1)
        result=1;

    return result;
}

function Search(node,i,ote,start,nargin){
    var x=node+1;
    if (nargin=='null'){
        var opt_finger=[];
        for (var z=1;z<=i-start+1;z++){
            opt_finger.push(0);
        }
    }

    if (nargin!='null'){
        opt_finger=nargin;
    }

    if (x<i){
        for (var y=1;y<=5;y++){
            ote[x].fingering=y;
            if (DExamine(ote,x)==0){
                opt_finger=Search(x,i,ote,start,opt_finger);
            }
        }
    }

    if (x==i){
        if (DExamine(ote,x)==0){
            var current_finger=[];
            var pitch=[];
            for (var w=start;w<=i;w++){
                current_finger.push(ote[w].fingering);
                pitch.push(ote[w].pitch);
            }

            opt_finger=Compare(pitch,opt_finger,current_finger);

        }
    }

    return opt_finger;
}

function DMRT(note,start,ed){

    var i=-10;
    var finger;
    var value;
    if (ed==note.length-1){
        ed=ed-1;
    }

    var result=[];
    for (var j=1;j<=ed-start;j++){
        result.push(1);
    }

    for (var x=0;x<result.length;x++){
        if (note[start+x].type=='MNote'&&note[start+x+1].type=='MNote'&&note[start+x].id==note[start+x+1].id)
            result[x]=0;
    }

    var D1=[[],[ 0,0,0.5000,0.5000,1.5000,3.0000],[ 0,0 , 0, 0.5000,1.5000,2.0000],[ 0,0,1.0000,0,0.5000,1.5000],[0,0,1.0000,1.0000,0,0.5000],[0,1,1,1,1,0]];
    var D2=[[],[0,0,5,6,8,9],[0,3.5000,0,3.0000,3.0000,6.0000],[0,3,-1,0,2,3],[0, 2,-1,-1,0,2],[0,-1,-1,-1,-1,0]];
    var gap;
    for (x=0;x<result.length;x++){
        gap=Math.abs(note[x+start+1].pitch-note[x+start].pitch);
        var max=-1000;
        for (j=2;j<=4;j++){
            max=Math.max(D2[j][1],max);
        }
        if (gap<0||gap>max){
            result[x]=0;
        }
    }
    var temp_note;
    var temp;
    for (x=0;x<result.length;x++){
        if (result[x]==1){
            temp_note=note;
            temp_note[x+start].fingering=1;
          
            temp=Search(start,x+start,temp_note,start,'null');
          
            if (temp[0]==0){
                result[x]=0;
            }
        }
    }

    if (countone(result)<=0){
        i=-10;
        finger=-10;
       // console.log('Piece-Wise Process is needed');
        value=[finger,i];
        return value;
    }

    var temp_ideal;
    if (countone(result)==1){
        for (x=0;x<result.length;x++){
            if (result[x]==1){
                i=x+start;
                temp_ideal=idealfinger(note,i+1);
                var min=10000;
                for (j=0;j<temp_ideal.length;j++)
                    min=Math.min(min,temp_ideal[j]);
                finger=min;
                gap=Math.abs(note[i+1].pitch-note[i].pitch);
                while (gap<0||gap>D2[finger][1])
                    finger=finger-1;
                value=[finger,i];
                return value;
            }
        }
    }

    var opt=result;
    for (x=0;x<result.length;x++){
        if (result[x]==1){
            if (note[x+start].pitch%1==0.5&&note[x+start+1].pitch==note[x+start].pitch-0.5)
                result[x]=0;
        }
    }

    if (countone(result)<=0){
        result=opt;
        for (x=0;x<result.length;x++){
            if (result[x]==1){
                i=x+start;
                temp_ideal=idealfinger(note,i+1);
                var min=10000;
                for (j=0;j<temp_ideal.length;j++)
                    min=Math.min(min,temp_ideal[j]);
                finger=min;
                gap=Math.abs(note[i+1].pitch-note[i].pitch);
                while (gap<0||gap>D2[finger][1])
                    finger=finger-1;
                value=[finger,i];
                return value;
            }
        }
    }

    if (countone(result)==1){
        for (x=0;x<result.length;x++){
            if (result[x]==1){
                i=x+start;
                temp_ideal=idealfinger(note,i+1);
                var min=10000;
                for (j=0;j<temp_ideal.length;j++)
                    min=Math.min(min,temp_ideal[j]);
                finger=min;
                gap=Math.abs(note[i+1].pitch-note[i].pitch);
                while (gap<0||gap>D2[finger][1]){
                    finger=finger-1;
                }
                value=[finger,i];
                return value;
            }
        }
    }
    if (countone(result)<=0){
        i=-10;
        finger=-10;
       console.log('Piece-Wise Process is needed');
        value=[finger,i];
        return value;
    }

    for (x=0;x<result.length;x++){
        if(result[x]==1){
            i=x+start;
        }
    }
    temp_ideal=idealfinger(note,i+1);
    var min=10000;
    for (j=0;j<temp_ideal.length;j++)
        min=Math.min(min,temp_ideal[j]);
    finger=min;
    gap=Math.abs(note[i+1].pitch-note[i].pitch);
    while (gap<0||gap>D2[finger][1]){
        finger=finger-1;
    }

    value=[finger,i];
    return value;
}

function countone(a){
    var num=0;
    for(var i=0;i<a.length;i++){
        if (a[i]==1)
            num=num+1;
    }
    return num;
}

function UMRT(note,start,ed){
    var i=-10;

    if (ed==note.length-1){
        ed=ed-1;
    }

    var result=[];
    for (var j=1;j<=ed-start+1;j++){
        result.push(1);
    }

    for (var x=0;x<result.length;x++){
        if (note[start+x].type=='MNote'&&note[start+x+1].type=='MNote'&&note[start+x].id==note[start+x+1].id)
            result[x]=0;
    }

    var D1=[[],[ 0,0,0.5000,0.5000,1.5000,3.0000],[ 0,0 , 0, 0.5000,1.5000,2.0000],[ 0,0,1.0000,0,0.5000,1.5000],[0,0,1.0000,1.0000,0,0.5000],[0,1,1,1,1,0]];
    var D2=[[],[0,0,5,6,8,9],[0,3.5000,0,3.0000,3.0000,6.0000],[0,3,-1,0,2,3],[0, 2,-1,-1,0,2],[0,-1,-1,-1,-1,0]];

    var gap;
    var lim1;
    var lim2;
    for (x=0;x<result.length;x++){
        gap=Math.abs(note[x+start+1].pitch-note[x+start].pitch);
        // console.log("x:"+x);
        // console.log("start:"+start);
        // console.log("fingering:"+note[x+start].fingering);
        lim1=D1[note[x+start].fingering][1];
        lim2=D2[note[x+start].fingering][1];
        if (gap<lim1||gap>lim2)
            result[x]=0;
    }

    for (x=0;x<result.length;x++){
        if (note[x+start].fingering==5||note[x+start].fignering==1)
            result[x]=0;
    }

    if (countone(result)<=0){
        i=-10;
        // console.log('Piece-Wise Process is needed');
        return i;
    }

    if (countone(result)==1){
        for (x=0;x<result.length;x++){
            if (result[x]==1){
                i=x+start;
                return i;
            }
        }
    }

    var opt=result;
    for (var x=0;x<result.length;x++){
        if (note[x+start].pitch%1==0&&note[x+start+1].pitch==note[x+start].pitch+0.5)
            result[x]=0;
    }

    if (countone(result)<=0){
        result=opt;
        for (x=0;x<result.length;x++){
            if (result[x]==1)
                i=x+start;
        }
        return i;
    }

    if (countone(result)==1){
        for(x=0;x<result.length;x++){
            if (result[x]==1){
                i=x+start;
                return i;
            }
        }
    }

    opt=result;
    var ideal;
    for (x=0;x<result.length;x++){
        ideal=idealfinger(note,x+start+1);
        if (ismember(1,ideal)==0)
            result[x]=0;
    }

    if (countone(result)<=0){
        result=opt;
        for(var x=0;x<result.length;x++){
            if (result[x]=1)
                i=x+start;
        }
        return i;
    }

    if(countone(result)==1){
        for (x=0;x<result.length;x++){
            if (result[x]==1){
                i=x+start;
                return i;
            }
        }
    }

    for (x=0;x<result.length;x++){
        if (result[x]==1)
            i=x+start;
    }

    return i;
}

function ismember(a,b){
    var result=0;
    for (var i=0;i<b.length;i++){
        if(b[i]==a)
            result=1;
    }
    return result;
}

function isTP(pitch1,pitch2,pitch3){
    var TP;
    if((pitch2-pitch1)*(pitch3-pitch2)>=0){
        TP=0
    }else{
        TP=1;
    }
    return TP;
}

function FlowControl(note,lastnote){
    var i=0;
    var temp=idealfinger(note,0);
    var min_value=10000;
    var max_value=-10000;
    var warn;
    var gap;
    var result;
    var finger;
    var temp_pitch;
    var x;
    var finger_;
    var struct;
    var turn_finger;
    var value;
    if(lastnote.pitch==-10){
        result=temp[0];
    }else{
        for (x=0;x<temp.length;x++){
            gap=(lastnote.pitch-note[0].pitch)-(lastnote.fingering-temp[x]);
            if (gap<min_value){
                min_value=gap;
                result=temp[x];
            }
        }
    }
    note[i].fingering=result;
    node=0;

    i=i+1;


    while(i<note.length){
        // console.log(i);

        if (i<note.length-1&&isTP(note[i-1].pitch,note[i].pitch,note[i+1].pitch)==1){

            
            temp=idealfinger(note,i);
            finger=[];
            for(var x=1;x<=i-node+1;x++){
                finger.push(0);
            }

            temp_pitch=[];


            for (x=node;x<=i;x++){
                temp_pitch.push(note[x].pitch);
            }
            for (var j=0;j<temp.length;j++){


                x=temp[j];

                note[i].fingering=x;

                finger_=Search(node,i,note,node,'null');
                
                finger=Compare(temp_pitch,finger_,finger);
            }



            if (finger[0]==0){


                min_value=1000;
                for (j=0;j<temp.length;j++){
                    min_value=Math.min(min_value,temp[j]);
                }
                x=min_value-1;
                while(x>=1){
                    note[i].fingering=x;
                    finger=Search(node,i,note,node,'null');
                    if (finger[0]!=0){
                        break;
                    }
                    x=x-1;
                }
            }

            if (finger[0]==0){
                max_value=-1000;
                for(j=0;j<temp.length;j++){
                    max_value=Math.max(max_value,temp[j]);
                }
                x=max_value+1;
                while(x<=5){
                    note[i].fingering=x;
                    finger=Search(node,i,note,node,'null');
                    if (finger[0]!=0)
                        break
                    x=x+1;
                }

            }


            if (finger[0]==0){
                // console.log('piece-wise process');
                ending=i-1;

                while (note[ending].id==note[ending+1].id&&note[ending].type=='MNote'&&note[ending+1].type=="MNote"&&ending>1){
                ending=ending-1;}

                value=[note,ending];

                return value;
            }

            for (x=node;x<=i;x++){
                note[x].fingering=finger[x-node];
            }
            node=i;
            i=i+1;

        }else{
            note[i].fingering=note[i].pitch-note[i-1].pitch+note[i-1].fingering;
            if (note[i].fingering%1==0.5){
                note[i].fingering=note[i].fingering+0.5;
            }
            if (note[i].fingering>5){
                note[i].fingering=5;
            }

            if(note[i].fingering<1){
                note[i].fingering=1;
            }
        //             if (note[i].measure_id==68&&note[i].sheet_id==2){
        //     console.log('sheet_id: '+note[i-1].fingering);
        // }
            while (note[i].fingering>=1&&(note[i].fingering<=5)&&(DExamine(note,i)!=0)){

                if (note[i].pitch>note[i-1].pitch){
                    note[i].fingering=note[i].fingering+1;
                }

                if (note[i].pitch==note[i-1].pitch){
                    console.log('loop!');
                    break;
                }
                if (note[i].pitch<note[i-1].pitch){
                    note[i].fingering=note[i].fingering-1;
                }
            }

            warn=0;
            if (note[i].fingering>5||note[i].fingering<1){
                warn=1;
            }

            if (warn==1){
                if (note[i].pitch>=note[i-1].pitch){
                    temp=UMRT(note,node,i-1);
                    if (temp==-10){

                        ending=i-1;
                        while (note[ending].id==note[ending+1].id&&note[ending].type=='MNote'&&note[ending+1].type=="MNote"&&ending>1){
                        ending=ending-1;}
                        value=[note,ending];
                        return value;
                    }else{
                        i=temp+1;
                        note[i].fingering=1;
                        node=i;
                        i=i+1;
                    }
                }else{
                    struct=DMRT(note,node,i);
                    turn_finger=struct[0];
                    temp=struct[1];
                    if (temp==-10){
                        ending=i-1;
                        // console.log('piece wise ');
                        while (note[ending].id==note[ending+1].id&&note[ending].type=='MNote'&&note[ending+1].type=="MNote"&&ending>1){
                ending=ending-1;}
                        value=[note,ending];
                        return value;
                    }else{
                        i=temp;
                        note[i].fingering=1;
                        finger=Search(node,i,note,node,'null');
                        for (x=node;x<=i;x++){
                            note[x].fingering=finger[x+node];
                        }
                        i=i+1;
                        note[i].fingering=turn_finger;
                        node=i;
                        i=i+1;
                    }
                }
            }else{
                i=i+1;
            }
        }
    }
    ending=i-1;
    value=[note,ending];
    return value;
}

function Fingering_Allocate(Simple){
    var Piece=0;
    var starting=0;
    var note=[];
    for (var j=starting;j<Simple.length;j++){
        note.push(Simple[j]);
    }
    var struct=FlowControl(note,{'type':'SNote','pitch':-10,'id':-10,'sheet_id':-10,'measure_id':-10});
    note=struct[0];
    var ending=struct[1];
    var lastnote=note[ending];

    for (var i=0;i<=ending;i++){
        Simple[i].fingering=note[i].fingering;
    }

    starting=starting+ending+1;
    Piece=Piece+1;
    while (starting<Simple.length){
        // console.log('piece is: '+Piece);
        note=[];
        for (var j=starting;j<Simple.length;j++){
            note.push(Simple[j]);
        }
        var struct=FlowControl(note,lastnote);
        note=struct[0];
        ending=struct[1];
        lastnote=note[ending];
        for (i=0;i<=ending;i++){
            Simple[starting+i].fingering=note[i].fingering;
        }
        starting=starting+ending+1;
        Piece=Piece+1;
    }

    return Simple;
}

function Chord_Finger_Fix(notes){
    
    for (var i=0;i<notes.length;i++){
        notes[i].fingering=parseFloat(notes[i].fingering);
    }

    for (i=notes.length-1;i>=2;i--){
        if (notes[i].id==notes[i-1].id){
            notes[i-1].fingering=notes[i-1].fingering+' '+notes[i].fingering;
            notes[i].fingering="";
        }
    }
    return notes;
}

function output(note,data){
    var  doc= new DOMParser().parseFromString(data);
    var root=doc.documentElement;
    var part=root.getElementsByTagName('part');
    part=part[0];
    var MeasureList=part.getElementsByTagName('measure');
    var list;
    var temp;
    var i;
    var NodeList;
    var current_Measure;
    var current_note;
    var sheet_id;
    var current_node;
    var fingering;
    var j;
    var direction
    var direction_type;
    var word;
    var value;
    var counter;
    var height;
    var staff;
    var voice;
    measure_range=Measure_Scan(note);
    for (var x=0;x<measure_range[0].length;x++){
        current_measure=MeasureList[x];
        list=current_measure.childNodes;
        NodeList=[];
        for (var m=0;m<list.length;m++){
            temp=list[m];
            if (temp.tagName=="note"||temp.tagName=="backup"||temp.tagName=="forward"){
                NodeList.push(temp);
            }
        }

        for (i=measure_range[0][x];i<=measure_range[1][x];i++){
            current_note=note[i];
            sheet_id=current_note.sheet_id;

            current_node=NodeList[sheet_id];
            fingering=current_note.fingering;
            counter=0;
            if (fingering.length==undefined){
                direction = doc.createElement("direction");
                direction_type=doc.createElement('direction-type');
                staff=doc.createElement('staff');
                voice=doc.createElement('voice');
                word=doc.createElement('words');
                height=40;
                word.setAttribute('default-y',parseFloat(height));
                word.setAttribute('font-weight','bold');
                word.setAttribute('font-family','Plantin MT Std');
                word.setAttribute('font-size','10.2331');
                value=doc.createTextNode(fingering);
                word.appendChild(value);
                value=doc.createTextNode('1');
                staff.appendChild(value);
                voice.appendChild(value);
                direction_type.appendChild(word);
                direction.appendChild(direction_type);
                direction.appendChild(staff);
                direction.appendChild(voice);
                current_measure.insertBefore(direction,current_node);
            }else{
                for (j=0;j<fingering.length;j++){
                    if (fingering[j]!=' '){
                        direction = doc.createElement("direction");
                        direction_type=doc.createElement('direction-type');
                        staff=doc.createElement('staff');
                        voice=doc.createElement('voice');
                        word=doc.createElement('words');
                        height=40+counter*20;
                        word.setAttribute('default-y',parseFloat(height));
                        counter=counter+1;
                        word.setAttribute('font-weight','bold');
                        word.setAttribute('font-family','Plantin MT Std');
                        word.setAttribute('font-size','10.2331');
                        value=doc.createTextNode(fingering[j]);
                        word.appendChild(value);
                        value=doc.createTextNode('1');
                        staff.appendChild(value);
                        voice.appendChild(value);
                        direction_type.appendChild(word);
                        direction.appendChild(direction_type);
                        direction.appendChild(staff);
                        direction.appendChild(voice);
                        current_measure.insertBefore(direction,current_node);
                    }
                }
            }
        }
    }
    var s = new XMLSerializer();
    var str=s.serializeToString(doc);
    return str;
}





