classdef MNote < SimpleNote
    properties
        fingering
        id
        pitch
        sheet_id
    end
    
    methods
        function obj=MNote(pitch,id,sheet_id)
            obj.id=id;
            obj.pitch=pitch;
            obj.fingering=(-10)*ones(1,length(pitch));
        end
    end
end