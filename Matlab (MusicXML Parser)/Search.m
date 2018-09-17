function opt_finger=Search(node,i,note,start,varargin)
	x=node+1;
	if nargin==4
		opt_finger=ones(1,i-start+1);
	end

	if nargin==5
		opt_finger=varargin{1};
	end


	if x<i
		for y=1:5
			note(x).fingering=y;
			if DExamine(note,x)==0
				opt_finger=Search(x,i,note,start,opt_finger);
			end
		end
	end

	if x==i
		num=0;
		for w=start:i
			num=num+1;
			current_finger(num)=note(w).fingering;
			pitch(num)=note(w).pitch;
		end

		opt_finger=Compare(pitch,opt_finger,current_finger);
	end

end