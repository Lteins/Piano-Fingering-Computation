function result=isfollow(note)
	chord=getChildByName(note,'chord');
	if chord~=[]
		result=1;
	else
		result=0;
	end
end