classdef SNote < SimpleNote
    properties
        fingering
        pitch
        id
        sheet_id
    end
    
    methods
        function obj=SNote(pitch,id,sheet_id)
            obj.pitch=pitch;
            obj.id=id;
            obj.fingering=-10;
            ojb.sheet_id=sheet_id;
        end
    end
end