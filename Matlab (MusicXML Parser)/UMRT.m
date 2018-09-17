function i=UMRT(note,start,ed)
	%Failure Returing value: -10
    i=[];

    if ed==length(note)
        ed=ed-1;
    end
	result=ones(1,ed-start+1);

	%filt the turning point in the middle of a chord
	for x=1:length(result)
		if isa(note(x-1+start),'MNote')&&isa(note(x-1+start+1),'MNote')&&note(x-1+start).id==note(x-1+start+1).id
			result(x)=0;
		end
    end
    

	load D;

	%Difficulty Level Exceeds the limit (Turning Finger Difficulty)
	for x=1:length(result)
		gap=note(x+start-1+1).pitch-note(x+start-1).pitch;
		lim1=D1(note(x+start-1).fingering,1);
		lim2=D2(note(x+start-1).fingering,1);
		if gap<lim1||gap>lim2
			result(x)=0;
		end
    end
    

	%Player cannot use the fifth finger as the Turning Finger
	for x=1:length(result)
		if note(x+start-1).fingering==5
			result(x)=0;
		end
    end


	 %result now is the filting result of the first three must-be-done rules

	if countone(result)<=0
		i=-10
		return
	end

	if countone(result)==1
		for x=1:length(result)
            if result(x)==1
                i=x+start-1;
                return
            end
        end	
	end

	

	% After turning, player has better not use finger one to touch the black key
	opt=result;
    
	for x=1:length(result)
		if mod(note(x+start-1).pitch,1)==0&&note(x+1+start-1).pitch==note(x+start-1).pitch+0.5
			result(x)=0;
		end
    end

	if countone(result)<=0
		result=opt;
		for x=1:length(result)
            if result(x)==1
                i=[i x+start-1];
            end
        end	
        return
    end

    if countone(result)==1
        for x=1:length(result)
            if result(x)==1
                i=x+start-1;
                return
            end
        end
    end
   
     %The idealfinger of the pitch after the turning should be the thumb
     opt=result;

     for x=1:length(result)
     	 ideal=idealfinger(note,x+start-1+1);
     	 if ismember(1,ideal)==0
     	 	result(x)=0;
     	 end
     end
     
 	if countone(result)<=0
		result=opt;
		for x=1:length(result)
            if result(x)==1
                i=[i x+start-1];
            end
        end	
        return
    end

    if countone(result)==1
        for x=1:length(result)
            if result(x)==1
                i=x+start-1;
                return
            end
        end
    end
    
    for x=1:length(result)
		if result(x)==1
			i=x+start-1;
		end
	end

end