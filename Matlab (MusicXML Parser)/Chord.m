classdef Chord < StandardNote
    properties
        id
        duration
        pitch
        fingering
    end
    
    methods
        function obj=Chord(id,duration,pitch)
            obj.id=id;
            obj.duration=duration;
            obj.pitch=pitch;
            obj.fingering=(-10)*ones(1,length(pitch));
        end
    end
end