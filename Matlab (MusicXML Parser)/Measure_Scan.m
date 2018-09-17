function measure_range=Measure_Scan(Standard)
	i=1
	measure=1;
	starting=i;
	ending=i;

	for i=1:length(Standard)
		if Standard(i).measure_id==measure
			ending=i;
		else
			measure_range(measure,1)=starting;
			measure_range(measure,2)=ending;
			measure=Standard(i).measure_id;
			starting=i;
			ending=i;
		end
	end

	measure_range(measure,1)=starting;
	measure_range(measure,2)=ending;
end
			

