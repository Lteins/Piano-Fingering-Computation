classdef Mono < StandardNote
    properties
        id
        duration
        pitch
        fingering
    end
    
    methods
        function obj=Mono(id,duration,pitch)
            obj.id=id;
            obj.duration=duration;
            obj.pitch=pitch;
            obj.fingering=-10;
        end
    end
end