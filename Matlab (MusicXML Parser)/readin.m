function note=readin(sheet)
	i=0;
	id=0;
	ischord=-1;
	note=[];
	for x=1:length(sheet)
		if sheet(x)==0.1
			ischord=ischord*(-1);
		else
			i=i+1;
			if ischord==1
				if sheet(x-1)==0.1
					if i-1>0
						id=note(i-1).id+1;
					else
						id=1
					end
				else
					if  i-1>0
						id=note(i-1).id;
					else
						id=1;
					end
				end
				note=[note MNote(sheet(x),id)];
			else
				if i-1>0
					id=note(i-1).id+1;
				else
					id=1;
				end
				note=[note SNote(sheet(x),id)];
			end
		end
	end
end
  