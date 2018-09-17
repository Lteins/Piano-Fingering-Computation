function fingering=idealfinger(note,start)
%parameter Maximum Gap between the upper pitch and the lower pitch:8
for x=start:length(note)
    pitch(x-start+1)=note(x).pitch;
end

pitch
Mgap=8;

if length(pitch)==1
	fingering=[1 2 3 4 5];
	return
end

if length(pitch)>1
	i=1;
    up=pitch(i);
    down=up;
	while up-down<=Mgap
		i=i+1;
		if i>length(pitch)
			break;
		end

		if pitch(i)>up
			up=pitch(i);
		end

		if pitch(i)<down
			down=pitch(i);
		end
	end	
	i=i-1;

	min=inf;
	
	for x=1:5
		diff=0;
        
		for y=2:length(pitch)
			if (pitch(y)<(pitch(1)-(x-1)))
		        diff=diff+(pitch(1)-(x-1))-pitch(y);
            end
	        if (pitch(y))>(pitch(1)+(5-x))
	        	diff=diff+(pitch(y))-(not(1)+(5-x));
            end
        end
        if diff==min
	   		fingering=[fingering x];
	   	end
        
        
	    if diff<min
	    	min=diff;
	    	fingering=[];
	    	fingering=[fingering x];
	   	end

	   	
	end
end

end