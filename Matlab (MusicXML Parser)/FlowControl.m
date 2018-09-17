function note=FlowControl(note,lastnote)
    i=1;
    note(i).fingering=idealfinger(note,1);
    node=1;
    
    i=i+1;
    
    while i<=length(note)
        i
    	if i<length(note)&&isTP(note(i-1).pitch,note(i).pitch,note(i+1).pitch)==1 %If this is a turning point


    	else 																	  %If this is not a turning point
	    	%Normal Extension the fingering based on the last note
	        if note(i).pitch>note(i-1).pitch
	            note(i).fingering=note(i-1).fingering+1;
	        end

	        if note(i).pitch==note(i-1).pitch
	        	note(i).fingering=note(i-1).fingering+1;
	        end

	        if note(i).pitch<note(i-1).pitch
	        	note(i).fingering=note(i-1).fingering-1;
	        end

	        %Difficulty Examine
             
	  		while  (note(i).fingering>=1) && (note(i).fingering<=5) && (DExamine(note,i)~=0)
	  			if note(i).pitch>note(i-1).pitch
	            	note(i).fingering=note(i).fingering+1;
		        end

		        if note(i).pitch==note(i-1).pitch
		        	loop=1001
		        	break
		        end

		        if note(i).pitch<note(i-1).pitch
		        	note(i).fingering=note(i).fingering-1;
		        end
            end

	        warning=0;
	        if note(i).fingering>5 || note(i).fingering<1
	        	warning=1;
	        end


	        if warning==1
	        	if note(i).pitch>=note(i-1).pitch
		        	i=UMRT(note,node,i-1)+1;
		        	note(i).fingering=1;
		        	node=i;
		        	i=i+1;
	        	else

	        	end
	        else
	        	i=i+1;
	        end	
	   end
   end
end