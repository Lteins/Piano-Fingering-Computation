function [StandardNoteList1,StandardNoteList2]=SheetParser(path)
	StandardNoteList1=[];
	StandardNoteList2=[];
	xdoc=xmlread(path);
	root=xdoc.getDocumentElement();
	part=getChildByName(root,'part');
	part=part(1);
	MeasureList=getChildByName(part,'measure');
	id=0;
	length(MeasureList) 
	for i=1:length(MeasureList)
		i
		CurrentMeasure=MeasureList(i);
		NoteList=getChildByName(CurrentMeasure,'note','forward','backup');
		Count=0;
		for m=1:length(NoteList)
			CurrentNote=NoteList(m);
			if CurrentNote.getNodeName()=='note'

				if isempty(getChildByName(CurrentNote,'rest'))==1 %This is a real note
					%Getting the pitch of the note
					pitch=getChildByName(NoteList(m),'pitch');
					temp=getChildByName(pitch,'octave');
					octave=str2double(temp.getTextContent());
					temp=getChildByName(pitch,'alter');
					if isempty(temp)==0
						alter=str2double(temp.getTextContent());
					else
						alter=0;
					end
					temp=getChildByName(pitch,'step');
					f=StepToNum(temp.getTextContent());
					DigiPitch=octave*7+alter*0.5+f;

					%Getting the duration of the note
					temp=getChildByName(CurrentNote,'duration');
					if isempty(temp)==1 % This note is a grace
						duration=0.1;
					else
						duration=str2double(temp.getTextContent());
					end

					%Getting the starter of the note
					if isempty(getChildByName(CurrentNote,'chord'))==1
						starter=Count;
						Count=Count+duration;
					else
						staff=getChildByName(CurrentNote,'staff');
						staff=str2double(staff.getTextContent());
						if staff==1
							starter=StandardNoteList1(length(StandardNoteList1)).starter;
						else
							starter=StandardNoteList2(length(StandardNoteList2)).starter;
						end
					end

					%Getting the sheet_id and measure_id of the note
					sheet_id=m;
					measure_id=i;

					%Writing the note into the StandarNote List
					staff=getChildByName(CurrentNote,'staff');
					if staff.getTextContent=='1'
						StandardNoteList1=[StandardNoteList1 StandardNote(DigiPitch,duration,starter,measure_id,sheet_id)];
					else
						StandardNoteList2=[StandardNoteList2 StandardNote(DigiPitch,duration,starter,measure_id,sheet_id)];
					end
				else
					%the note is a rest note
					%Getting the duration of the note
					temp=getChildByName(CurrentNote,'duration');
					if isempty(temp)==0
						duration=str2double(temp.getTextContent());
					else
						duration=0.1;
					end

					Count=Count+duration;
				end
			else
				if CurrentNote.getNodeName()=='backup'
					temp=getChildByName(CurrentNote,'duration');
					duration=str2double(temp.getTextContent());
					Count=Count-duration;
				end

				if CurrentNote.getNodeName()=='forward'
					temp=getChildByName(CurrentNote,'duration');
					duration=str2double(temp.getTextContent());
					Count=Count+duration;
				end
			end
		end
	end
end
