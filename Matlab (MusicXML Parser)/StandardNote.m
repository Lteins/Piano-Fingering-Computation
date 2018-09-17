classdef StandardNote < matlab.mixin.Heterogeneous
	properties
		measure_id
		pitch
		duration
		starter
		fingering
		sheet_id
    end
	methods
		function obj=StandardNote(pitch,duration,starter,measure_id,sheet_id)
			obj.fingering=-10;
			obj.pitch=pitch;
			obj.duration=duration;
			obj.starter=starter;
			obj.measure_id=measure_id;
			obj.sheet_id=sheet_id;

		end
	end
end