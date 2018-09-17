function Simple=Standard2Simple(Standard)
	id=0;
	Simple=[];
	measure=Measure_Scan(Standard);
	for m=1:length(measure)
		Notes=Standard(measure(m,1):measure(m,2));
		Notes=Rank(Notes);
		for i=1:length(Notes)
			ischord=0;
			if i>1
				if Notes(i-1).starter==Notes(i).starter
					ischord=1;
				end
			end

			if i<length(Notes)
				if Notes(i+1).starter==Notes(i).starter
					ischord=1;
				end
			end

			if ischord==0
				id=id+1;
				Simple=[Simple SNote(Notes(i).pitch,id,Notes(i).sheet_id)];
			end

			if ischord==1
				if i>1&&(Notes(i-1).starter==Notes(i).starter)
					Simple=[Simple MNote(Notes(i).pitch,id,Notes(i).sheet_id)];
				else
					id=id+1;
					Simple=[Simple MNote(Notes(i).pitch,id,Notes(i).sheet_id)];
				end
			end
		end
	end
end

				



