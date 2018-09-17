function Note=Rank(Note)
	for x=1:length(Note)
		for y=x+1:length(Note)
			if Note(x).starter>Note(y).starter
				temp=Note(x);
				Note(x)=Note(y);
				Note(y)=temp;
			end
		end
	end
end

