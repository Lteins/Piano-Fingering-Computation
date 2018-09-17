function TP=isTP(pitch1,pitch2,pitch3)
	if (pitch2-pitch1)*(pitch3-pitch2)>=0
		TP=0
	else
		TP=1
	end
end