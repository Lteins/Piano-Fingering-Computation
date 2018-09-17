function result=Diff(note,x,y)
    load D;
	pitch1=note(x).pitch;
	pitch2=note(y).pitch;

	finger1=note(x).fingering;
	finger2=note(y).fingering;

	if pitch1>pitch2
		temp=pitch1;
		pitch1=pitch2;;
		pitch2=temp;

		temp=finger1;
		finger1=finger2;
		finger2=temp;
    end

	lim1=D1(finger1,finger2);
	lim2=D2(finger1,finger2);

	gap=pitch2-pitch1;

	if gap<=lim2&&gap>=lim1
		result=0;
	else
		result=1;
	end

	if mod(pitch1,1)==0&&pitch2==pitch1+0.5&&finger2==1
		result=1
	end
end